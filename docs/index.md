---
title: Start Here
sidebar_position: 1
---

# Welcome to My Clawster

**My Clawster is a self-hosted, open-source platform for provisioning AI resources — claws — through a stable, provider-independent catalog model.**

Users pick a plan, choose service options, and get a running resource. Operators govern what gets offered, how it maps to providers, and what is healthy. Developers extend everything through packages and plug-ins without touching the deployable apps.

Three products share the platform. Pick the one that matches what you are trying to do today.

---

## Choose your path

### 🟦 My Clawster — provision and manage claws

You want to create a clawster, provision claws, or understand how the service catalog and access model work.

**Start here →** [My Clawster overview](./my-clawster/index.md)

Recommended reading order:
1. [Quickstart](./my-clawster/quickstart.md) — get a claw running in minutes
2. [Create your first clawster](./my-clawster/create-your-first-clawster.md) — configure your environment
3. [Plans, offers, and service options](./my-clawster/plans-offers-and-service-options.md) — understand the catalog model

---

### 🟩 Clawne Me — build your AI assistant

You want to create a personal assistant, shape its role and memory, and get productive without thinking about infrastructure.

**Start here →** [Clawne Me overview](./clawne-me/index.md)

Recommended reading order:
1. [Getting started](./clawne-me/getting-started.md) — build your first Clawne
2. [Create your first Clawne](./clawne-me/create-your-first-clawne.md) — name it, shape it, launch it
3. [Personalities, memory, and tools](./clawne-me/personalities-memory-and-tools.md) — deepen it when you are ready

---

### 🟨 Enterprise — operate the platform

You are an operator or admin who manages offers, provider readiness, product-to-resource mappings, health, and auditability.

**Start here →** [Enterprise overview](./enterprise/index.md)

Recommended reading order:
1. [Admin portal tour](./enterprise/admin-portal-tour.md) — orient yourself in the operator workspace
2. [Product to Resource](./enterprise/product-to-resource.md) — understand the catalog governance model
3. [Provider management](./enterprise/provider-management.md) — move providers from discovery to production

---

## Platform overview

![My Clawster platform overview](/img/my-clawster/my-clawster-platform-overview.svg)

The platform has four layers:

| Layer | What it is |
|---|---|
| **Products** | Clawne Me and any shell app built on the platform — what users interact with directly |
| **OSS core** | The API worker, web shell, catalog model, and provider runtime — open source and self-hostable |
| **Community** | Shared packages, provider plug-ins, UI extensions, and the SDK |
| **Enterprise** | Admin portal, operator workflows, and governance extensions — layered in without forking the OSS core |

---

## Access model

:::info
OSS, Community, and Enterprise tiers
These docs cover three capability tiers.

- **OSS** — the open product surface required to run My Clawster end to end.
- **Community** — packages, UI extensions, and source-available capabilities for La Rebelion Labs community members.
- **Enterprise** — operator workflows, admin surfaces, and enterprise-only extensions.

You do not need Community or Enterprise access to use My Clawster or Clawne Me as a product.
:::

---

## Looking for something specific?

- **Building on the platform?** Use the [Developers](./developers/index.md) section.
- **Deploying or operating?** Use the [Operations](./operations/index.md) section.
- **Troubleshooting a running claw?** Jump to [Troubleshooting](./my-clawster/troubleshooting.md).
