# rsdashboard

Admin dashboard for the Job Referral Portal — jobs, companies, users, and analytics.

## Stack

- Next.js 15, React 19, TypeScript, Tailwind CSS
- TanStack Query, Zustand, React Hook Form, Zod

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Dashboard: `http://localhost:3002/dashboard/login`

Requires **rsbackend** running at `http://localhost:3001/api/v1`.

Default admin credentials are set in the backend `.env` (`DEFAULT_ADMIN_EMAIL` / `DEFAULT_ADMIN_PASSWORD`).

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Dashboard URL (`http://localhost:3002`) |
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Start production server |

## Docker

```bash
docker build -t rsdashboard .
docker run -p 3002:3002 --env-file .env.local rsdashboard
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: rsdashboard"
git remote add origin git@github.com:YOUR_USER/rsdashboard.git
git push -u origin main
```

## Related repos

- **rsbackend** — API (port 3001)
- **rsfrontend** — public site (port 3000)
