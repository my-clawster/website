---
title: Authentication and access
---

# Authentication and access

My Clawster uses JWT-based authentication and role-aware access control.

## Common roles

- **customer** for regular usage
- **customer_admin** for account-level control
- **operator** for administrative or enterprise workflows

## First-run behavior

On first boot, My Clawster creates an operator account if the database has no users.

- Email: `admin@clawster.local`
- Password: `BOOTSTRAP_SECRET` or a generated one-time password

## What belongs where

- End users should spend most of their time in the standard app and API
- Operators should use the enterprise admin surface for platform-wide workflows

## Safety rule

Do not give the `operator` role to ordinary product users. That role is intended for governance, provider management, and platform administration.