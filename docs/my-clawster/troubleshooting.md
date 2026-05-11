---
title: Troubleshooting
---

# Troubleshooting

## Provisioning fails before creating a claw

Check for:

- missing provider bindings
- inactive integrations
- invalid or incomplete activation mappings
- a product offering that is inactive or incompatible with the selected lane

## Local development starts but the app looks empty

Check that:

- migrations were applied
- the API is running
- your `.env` values are present
- mock mode is enabled if you are not using real provider credentials

## Cloudflare deploy succeeds but the app cannot call the API

Check:

- the web app API base URL
- API CORS origins
- custom domain DNS and certificate status

## I need more help

Use the [Operations section](../operations/index.md) for deployment issues and the [Enterprise section](../enterprise/index.md) for catalog or provider-admin issues.