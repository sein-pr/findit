# FindIt Namibia - Dockerized Next.js + Postgres

This project is a containerized Next.js web app with a Dockerized PostgreSQL backend.

## Stack

- Next.js 16 (App Router)
- React 19
- PostgreSQL 16
- Docker + Docker Compose
- pnpm

## What was added

- Multi-stage Docker build for the web app (`Dockerfile`)
- Multi-container setup (`docker-compose.yml`)
- Postgres schema + seed data (`docker/postgres/init.sql`)
- Backend API routes:
  - `GET /api/health`
  - `GET /api/providers`
  - `GET /api/providers/:id`
  - `GET /api/providers/:id/reviews`
  - `POST /api/providers/:id/reviews`
- Frontend integration:
  - Home page pulls provider data from backend
  - Search page fetches providers from backend API
  - Profile page fetches provider + reviews from backend API and persists new reviews

## Project Structure (Relevant)

- `Dockerfile`
- `docker-compose.yml`
- `docker/postgres/init.sql`
- `app/api/health/route.ts`
- `app/api/providers/route.ts`
- `app/api/providers/[id]/route.ts`
- `app/api/providers/[id]/reviews/route.ts`
- `lib/server/db.ts`
- `lib/server/providers.ts`
- `lib/server/reviews.ts`
- `.env.example`

## Prerequisites

- Docker Desktop
- Docker Compose v2

## Local Run (Docker)

1. Build and start:

```bash
docker compose up --build -d
```

2. Confirm services:

```bash
docker compose ps
```

3. Follow web logs:

```bash
docker compose logs -f web
```

4. Open app:

- `http://localhost:3000`

## Database is Dockerized Properly

- Uses official `postgres:16-alpine` image
- Uses named persistent volume:
  - `findit_postgres_data`
- Runs startup healthcheck with `pg_isready`
- Initializes schema and seed data automatically from:
  - `docker/postgres/init.sql`
- Service dependency ensures web waits for healthy DB:
  - `depends_on: condition: service_healthy`

## Environment Variables

For local non-Docker runs, copy `.env.example` to `.env` and update if needed:

```bash
DATABASE_URL=postgres://findit:findit123@localhost:5432/findit
```

Inside Docker, `DATABASE_URL` is injected by Compose and points to `db`.

## Useful Commands

- Stop containers:

```bash
docker compose down
```

- Stop and remove volume (fresh DB):

```bash
docker compose down -v
```

- Rebuild after code changes:

```bash
docker compose up --build -d
```

- Health endpoint:

```bash
curl http://localhost:3000/api/health
```

## Notes

- If `DATABASE_URL` is missing, backend utilities fall back to in-memory mock data from `lib/data.ts`.
- New reviews posted from profile pages are persisted in Postgres when DB is connected.
