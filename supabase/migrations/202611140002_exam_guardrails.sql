-- Production guardrails for real school exams.
-- Apply only after 202611140001_initial_exam_schema.sql in a test Supabase project.

create or replace function public.start_exam(p_exam_id uuid)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_attempt public.attempts;
  v_exam public.exams;
  v_questions jsonb;
begin
  if v_user is null then raise exception 'Login dibutuhkan'; end if;
  if public.is_admin() then raise exception 'Akun admin tidak dapat memulai ujian'; end if;

  select e.* into v_exam
  from public.exams e
  join public.exam_classes ec on ec.exam_id = e.id
  join public.profiles p on p.class_id = ec.class_id and p.id = v_user
  where e.id = p_exam_id and e.is_published
    and (e.opens_at is null or e.opens_at <= now())
    and (e.closes_at is null or e.closes_at > now());
  if not found then raise exception 'Ujian tidak tersedia untuk peserta ini'; end if;

  insert into public.attempts (exam_id, student_id)
  values (p_exam_id, v_user)
  on conflict (exam_id, student_id) do nothing;
  select * into v_attempt from public.attempts
  where exam_id = p_exam_id and student_id = v_user for update;
  if v_attempt.submitted_at is not null then raise exception 'Ujian sudah dikumpulkan'; end if;
  if now() >= v_attempt.started_at + make_interval(mins => v_exam.duration_minutes)
     or (v_exam.closes_at is not null and now() >= v_exam.closes_at) then
    raise exception 'Waktu ujian telah berakhir';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'prompt', q.prompt,
    'options', jsonb_build_array(q.option_a, q.option_b, q.option_c, q.option_d),
    'position', q.position
  ) order by q.position), '[]'::jsonb)
  into v_questions from public.questions q where q.exam_id = p_exam_id;
  if jsonb_array_length(v_questions) = 0 then raise exception 'Ujian belum memiliki soal'; end if;

  return jsonb_build_object(
    'attemptId', v_attempt.id,
    'startedAt', v_attempt.started_at,
    'deadline', least(
      v_attempt.started_at + make_interval(mins => v_exam.duration_minutes),
      coalesce(v_exam.closes_at, 'infinity'::timestamptz)
    ),
    'durationMinutes', v_exam.duration_minutes,
    'questions', v_questions
  );
end;
$$;

create or replace function public.save_exam_answers(p_attempt_id uuid, p_answers jsonb)
returns void
language plpgsql security definer
set search_path = ''
as $$
declare
  v_attempt public.attempts;
  v_duration integer;
  v_exam_closes_at timestamptz;
  v_answer record;
begin
  if auth.uid() is null then raise exception 'Login dibutuhkan'; end if;
  select a.* into v_attempt from public.attempts a
  where a.id = p_attempt_id and a.student_id = auth.uid() for update;
  if not found then raise exception 'Percobaan ujian tidak ditemukan'; end if;
  if v_attempt.submitted_at is not null then raise exception 'Ujian sudah dikumpulkan'; end if;
  select e.duration_minutes, e.closes_at into v_duration, v_exam_closes_at
  from public.exams e where e.id = v_attempt.exam_id;
  if now() >= v_attempt.started_at + make_interval(mins => v_duration)
     or (v_exam_closes_at is not null and now() >= v_exam_closes_at) then
    raise exception 'Waktu ujian telah berakhir';
  end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'Format jawaban tidak valid'; end if;

  for v_answer in select * from jsonb_to_recordset(p_answers) as x(question_id uuid, selected_option text)
  loop
    if v_answer.selected_option not in ('A','B','C','D') then raise exception 'Pilihan jawaban tidak valid'; end if;
    if not exists (select 1 from public.questions q where q.id = v_answer.question_id and q.exam_id = v_attempt.exam_id) then
      raise exception 'Jawaban memuat soal yang bukan bagian ujian';
    end if;
    insert into public.answers (attempt_id, question_id, selected_option, updated_at)
    values (v_attempt.id, v_answer.question_id, v_answer.selected_option::public.answer_choice, now())
    on conflict (attempt_id, question_id) do update
      set selected_option = excluded.selected_option, updated_at = now();
  end loop;
end;
$$;

create or replace function public.submit_exam(p_attempt_id uuid, p_answers jsonb)
returns numeric
language plpgsql security definer
set search_path = ''
as $$
declare
  v_attempt public.attempts;
  v_total integer;
  v_correct integer;
  v_score numeric(5,2);
  v_duration integer;
  v_exam_closes_at timestamptz;
  v_answer record;
begin
  if auth.uid() is null then raise exception 'Login dibutuhkan'; end if;
  select * into v_attempt from public.attempts
  where id = p_attempt_id and student_id = auth.uid() for update;
  if not found then raise exception 'Percobaan ujian tidak ditemukan'; end if;
  if v_attempt.submitted_at is not null then raise exception 'Jawaban sudah dikumpulkan'; end if;
  select e.duration_minutes, e.closes_at into v_duration, v_exam_closes_at
  from public.exams e where e.id = v_attempt.exam_id;
  if now() >= v_attempt.started_at + make_interval(mins => v_duration)
     or (v_exam_closes_at is not null and now() >= v_exam_closes_at) then
    raise exception 'Waktu ujian telah berakhir';
  end if;
  if jsonb_typeof(p_answers) <> 'array' then raise exception 'Format jawaban tidak valid'; end if;

  select count(*) into v_total from public.questions where exam_id = v_attempt.exam_id;
  if v_total = 0 then raise exception 'Ujian tidak memiliki soal'; end if;

  for v_answer in select * from jsonb_to_recordset(p_answers) as x(question_id uuid, selected_option text)
  loop
    if v_answer.selected_option not in ('A','B','C','D') then raise exception 'Pilihan jawaban tidak valid'; end if;
    if not exists (select 1 from public.questions q where q.id = v_answer.question_id and q.exam_id = v_attempt.exam_id) then
      raise exception 'Jawaban memuat soal yang bukan bagian ujian';
    end if;
    insert into public.answers (attempt_id, question_id, selected_option, updated_at)
    values (v_attempt.id, v_answer.question_id, v_answer.selected_option::public.answer_choice, now())
    on conflict (attempt_id, question_id) do update
      set selected_option = excluded.selected_option, updated_at = now();
  end loop;

  select count(*) into v_correct
  from public.answers a join public.questions q on q.id = a.question_id
  where a.attempt_id = v_attempt.id and a.selected_option = q.correct_option;
  v_score := round((v_correct::numeric * 100 / v_total)::numeric, 2);
  update public.attempts set submitted_at = now(), score = v_score where id = v_attempt.id;
  return v_score;
end;
$$;

revoke all on function public.start_exam(uuid) from public, anon;
revoke all on function public.save_exam_answers(uuid, jsonb) from public, anon;
revoke all on function public.submit_exam(uuid, jsonb) from public, anon;
revoke all on function public.record_exam_violation(uuid) from public, anon;
grant execute on function public.start_exam(uuid) to authenticated;
grant execute on function public.save_exam_answers(uuid, jsonb) to authenticated;
grant execute on function public.submit_exam(uuid, jsonb) to authenticated;
grant execute on function public.record_exam_violation(uuid) to authenticated;
