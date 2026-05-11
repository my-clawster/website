---
title: Quickstart
---

# Quickstart

This is the fastest path to a working My Clawster environment.

## Prerequisites

- Bun 1.1 or newer
- A local SQLite or Cloudflare D1 target
- Provider credentials only if you want to test real provisioning

## Local setup

```bash
git clone https://github.com/la-rebelion/clawster.git
cd clawster/my-clawster
bun install
cp apps/api/.env.example apps/api/.env
bun run --filter=./apps/api db:migrate
```

## Choose a mode

### Mock mode

Use this when you want to explore the product without calling a real provider. The mock runtime returns synthetic provisioning responses so you can exercise the full UI and API flow without credentials.

```bash
bun run dev:mock
```

### Real provider mode

Use this when you want My Clawster to provision through a live provider. Requires provider credentials in your `.env` file.

```bash
bun run dev
```

Key environment variables to set in `apps/api/.env`:

| Variable | What it does |
|---|---|
| `DATABASE_URL` | SQLite path or D1 binding name |
| `JWT_SECRET` | Auth signing key (generate a random 32-byte value) |
| `PROVIDER_API_KEY` | Credentials for your default provider |
| `MOCK_MODE` | Set to `true` to force mock regardless of provider config |

## Default local URLs

| Surface | URL |
|---|---|
| Web app | `http://localhost:5173` |
| API | `http://localhost:3000` |
| API docs (Swagger) | `http://localhost:3000/docs` |

## What to read next

- [Create your first clawster](./create-your-first-clawster.md)
- [Plans, offers, and service options](./plans-offers-and-service-options.md)