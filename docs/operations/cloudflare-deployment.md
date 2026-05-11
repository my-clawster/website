---
title: Cloudflare deployment
---

# Cloudflare deployment

My Clawster can be split cleanly between:

- Workers for the API
- Pages for the app shells
- D1 for the database where appropriate

## Common production split

- `api.clawster.my` for the API
- `claws.clawster.my` for the main app

## Key concerns

- CORS
- D1 bindings
- custom domains
- Pages environment variables
- worker secrets