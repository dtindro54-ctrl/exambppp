# EXAMBPPP

EXAMBPPP is a production-style exam management demo designed for public deployment and rapid product validation. It includes admin management, question bank controls, a timed exam flow, auto-scoring, and result tracking in a clean Next.js interface.

## Features

- Admin and participant role flows
- Exam dashboard with role-aware navigation
- Question bank editor for admin
- Timed exam experience
- Automatic scoring and result history
- Responsive dark UI for deployment-ready presentation
- API health endpoints for operational readiness checks

## Local run

Requires Node.js 18.17+.

```bash
npm install
npm run dev
```

Then open:

- http://localhost:3000

## Demo auth

- Admin: admin / admin123
- Participant: peserta / peserta123

## Production-style notes

This project is a strong demo/pilot implementation, not a full production SaaS with secure authentication or database persistence. It is designed to show the product flow clearly and can be extended with Supabase/PostgreSQL, server-side auth, audit logs, and role permissions.

## Deployment to Vercel

1. Push the repository to GitHub.
2. Import the repo into Vercel.
3. Vercel auto-detects the Next.js app.
4. Keep default build settings.
5. Deploy.

This environment cannot directly connect to your Vercel account, so the final live deployment still requires your own hosting authorization.

## Future upgrade path

Recommended real production next steps:

- Supabase/PostgreSQL
- NextAuth or secure session management
- Server-side protected routes
- User management and audit logging
- CSV/PDF export of results
- Multi-tenant exam configuration
