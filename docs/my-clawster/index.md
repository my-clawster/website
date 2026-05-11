---
title: My Clawster
sidebar_position: 1
---

# My Clawster

**My Clawster is a self-hostable control plane for provisioning and managing claws — AI agent resources — across any provider you connect.**

You own the deployment, the credentials, and the catalog. My Clawster handles the path from plan selection to running resource, normalized across provider differences.

![My Clawster platform overview](/img/my-clawster/my-clawster-platform-overview.svg)

## What it includes

| Component | What it does |
|---|---|
| API worker | Serves the catalog API, auth, and provisioning endpoints |
| Web shell | Customer-facing React app for managing clawsters and claws |
| Catalog model | Plans, product offerings, service options, and activation maps |
| Provider runtime | Plug-in interface and Generic HTTP fallback for any provider |

## How My Clawster is organized

My Clawster is not a single repo. It splits across workspace roots that you only need to involve as your use case grows:

| Root | What it is |
|---|---|
| `my-clawster` | The deployable OSS API and web shell |
| `my-clawster-packages` | Shared packages, provider plug-ins, SDK, and API client |
| `my-clawster-apps` | Private or extended app shells |
| `enterprise` | Admin portal and operator workflows |

Most users only need the first root. Operators and developers reach into the others.

## Read this section in order

1. [Quickstart](./quickstart.md)
2. [Create your first clawster](./create-your-first-clawster.md)
3. [Manage clusters and claws](./manage-clusters-and-claws.md)
4. [Plans, offers, and service options](./plans-offers-and-service-options.md)
5. [Authentication and access](./authentication-and-access.md)
6. [Troubleshooting](./troubleshooting.md)