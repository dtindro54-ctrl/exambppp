# EXAMBPPP: production rollout

The current Next.js demo uses browser `localStorage` and demo credentials. It is **not safe for real student exams** and this migration alone does not turn the current demo UI into a production app. Do not use the demo login or browser-only results for official student data.

## Production database foundation

`supabase/migrations/202611140001_initial_exam_schema.sql` defines PostgreSQL tables for classes, student/admin profiles, subjects, exams, class assignments, questions, attempts, and answers. It enables row-level security, hides answer keys from the student question payload, and provides server-side RPCs to start/submit an exam and record tab-switch reports.

### Set up Supabase

1. Create a Supabase project for the school; use a separate test project first.
2. Apply the migration using Supabase SQL Editor or Supabase CLI.
3. Create the first admin through Supabase Auth, then assign `role='admin'` in `public.profiles` using the SQL editor. Never expose a service-role key in the browser or commit it to Git.
4. Provision student accounts through a trusted server/admin process. Use unique student IDs and temporary passwords, and require password changes as appropriate.
5. Set database backups, access policies, retention rules, and a privacy notice before entering real student data.

## Important gaps before official use

The existing demo pages have not yet been converted to Supabase Auth/database APIs. The schema migration is a production foundation, not a claim that the full end-to-end secure product is already complete. The application still needs server-side authentication, API integration for roster/subjects/exams/results, admin account provisioning, exam UI integration with the RPCs, automated tests, security review, and a successful Vercel deployment configured with public Supabase URL and anon key only (plus server-only secrets where needed).

A website cannot prevent a student from opening another mobile app or browser. For managed devices, use an approved kiosk/lockdown browser and supervised exam procedures. A web page can report focus/tab changes, but those signals are not tamper-proof and must not be treated as proof of cheating.

## Demo

For local demo only, see the demo account instructions above. Never use `admin/admin123` or `peserta/peserta123` as real account credentials.
