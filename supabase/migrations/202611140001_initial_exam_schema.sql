-- EXAMBPPP production database foundation for Supabase/PostgreSQL.
-- Apply with Supabase SQL Editor or `supabase db push` after reviewing in a test project.
create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('admin', 'student');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.answer_choice as enum ('A', 'B', 'C', 'D');
exception when duplicate_object then null;
end $$;

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'student',
  student_id text unique,
  full_name text not null,
  class_id uuid references public.classes(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint student_id_for_students check (role = 'admin' or student_id is not null)
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  class_id uuid references public.classes(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (code, class_id)
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete restrict,
  title text not null,
  instructions text not null default '',
  duration_minutes integer not null check (duration_minutes between 1 and 600),
  passing_score numeric(5,2) not null default 70 check (passing_score between 0 and 100),
  opens_at timestamptz,
  closes_at timestamptz,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  check (closes_at is null or opens_at is null or closes_at > opens_at)
);

create table if not exists public.exam_classes (
  exam_id uuid not null references public.exams(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  primary key (exam_id, class_id)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete cascade,
  prompt text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_option public.answer_choice not null,
  position integer not null default 1 check (position > 0),
  created_at timestamptz not null default now(),
  unique (exam_id, position)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id) on delete restrict,
  student_id uuid not null references public.profiles(id) on delete restrict,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric(5,2),
  violation_count integer not null default 0 check (violation_count >= 0),
  unique (exam_id, student_id),
  check (score is null or score between 0 and 100)
);

create table if not exists public.answers (
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option public.answer_choice,
  updated_at timestamptz not null default now(),
  primary key (attempt_id, question_id)
);

create index if not exists exams_published_idx on public.exams (is_published, opens_at, closes_at);
create index if not exists questions_exam_position_idx on public.questions (exam_id, position);
create index if not exists attempts_student_idx on public.attempts (student_id, submitted_at desc);

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

alter table public.classes enable row level security;
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.exams enable row level security;
alter table public.exam_classes enable row level security;
alter table public.questions enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;

create policy "admins manage classes" on public.classes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "students read own class" on public.classes for select to authenticated using (
  public.is_admin() or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.class_id = classes.id)
);
create policy "users read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_admin());
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage subjects" on public.subjects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read subjects" on public.subjects for select to authenticated using (true);
create policy "admins manage exams" on public.exams for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "students read assigned published exams" on public.exams for select to authenticated using (
  is_published and exists (
    select 1 from public.profiles p
    join public.exam_classes ec on ec.class_id = p.class_id
    where p.id = (select auth.uid()) and ec.exam_id = exams.id
  )
);
create policy "admins manage exam classes" on public.exam_classes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "students read own exam assignment" on public.exam_classes for select to authenticated using (
  public.is_admin() or exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.class_id = exam_classes.class_id)
);
create policy "admins manage questions" on public.questions for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read all attempts" on public.attempts for select to authenticated using (public.is_admin());
create policy "students read own attempts" on public.attempts for select to authenticated using (student_id = (select auth.uid()));
create policy "admins read all answers" on public.answers for select to authenticated using (public.is_admin());
create policy "students read own answers" on public.answers for select to authenticated using (
  exists (select 1 from public.attempts a where a.id = answers.attempt_id and a.student_id = (select auth.uid()))
);

-- Do not grant direct table access to answer keys. Students receive question text/options
-- through this SECURITY DEFINER RPC, which omits correct_option completely.
revoke all on public.questions from anon, authenticated;
grant select, insert, update, delete on public.questions to authenticated;

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
  on conflict (exam_id, student_id) do update set exam_id = excluded.exam_id
  returning * into v_attempt;
  if v_attempt.submitted_at is not null then raise exception 'Ujian sudah dikumpulkan'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id, 'prompt', q.prompt,
    'options', jsonb_build_array(q.option_a, q.option_b, q.option_c, q.option_d),
    'position', q.position
  ) order by q.position), '[]'::jsonb)
  into v_questions from public.questions q where q.exam_id = p_exam_id;

  if jsonb_array_length(v_questions) = 0 then raise exception 'Ujian belum memiliki soal'; end if;
  return jsonb_build_object('attemptId', v_attempt.id, 'durationMinutes', v_exam.duration_minutes, 'questions', v_questions);
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
  v_answer record;
begin
  if auth.uid() is null then raise exception 'Login dibutuhkan'; end if;
  select * into v_attempt from public.attempts
  where id = p_attempt_id and student_id = auth.uid() for update;
  if not found then raise exception 'Percobaan ujian tidak ditemukan'; end if;
  if v_attempt.submitted_at is not null then raise exception 'Jawaban sudah dikumpulkan'; end if;
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

create or replace function public.record_exam_violation(p_attempt_id uuid)
returns integer
language plpgsql security definer
set search_path = ''
as $$
declare v_count integer;
begin
  update public.attempts set violation_count = violation_count + 1
  where id = p_attempt_id and student_id = auth.uid() and submitted_at is null
  returning violation_count into v_count;
  if v_count is null then raise exception 'Percobaan ujian tidak aktif'; end if;
  return v_count;
end;
$$;

revoke all on function public.start_exam(uuid) from public, anon;
revoke all on function public.submit_exam(uuid, jsonb) from public, anon;
revoke all on function public.record_exam_violation(uuid) from public, anon;
grant execute on function public.start_exam(uuid) to authenticated;
grant execute on function public.submit_exam(uuid, jsonb) to authenticated;
grant execute on function public.record_exam_violation(uuid) to authenticated;
