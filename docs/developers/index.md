---
title: Developers
sidebar_position: 1
---

# Developers

**This section is for developers who want to extend the platform — new provider plug-ins, UI extensions, packages, or enterprise-layer additions.**

My Clawster is designed to be extended without forking the OSS core. You work in separate workspace roots and mount extensions over the base through well-defined boundaries.

## What you can build

| Extension type | Where it lives | What it does |
|---|---|---|
| Provider plug-in | `my-clawster-packages` | Adds a new provider lane to the provisioning runtime |
| UI extension | `my-clawster-apps` | Adds or replaces views in the customer-facing app |
| Shared package | `my-clawster-packages` | Adds reusable logic, types, or API clients |
| Enterprise extension | `enterprise` | Adds operator workflows on top of the OSS API |

## Prerequisites

- Bun 1.1 or newer
- A working local My Clawster environment (see [Quickstart](../my-clawster/quickstart.md))
- Familiarity with the catalog model (see [Plans, offers, and service options](../my-clawster/plans-offers-and-service-options.md))

## Architecture orientation

Extensions reference the OSS core but do not modify it. The workspace boundary rules define what each root can import from others. Read [Enterprise extension model](./enterprise-extension-model.md) before writing code that crosses root boundaries.

## Start here

1. [Local development](./local-development.md)
2. [Packages, plug-ins, and UI extensions](./packages-plugins-and-ui-extensions.md)
3. [Provider plug-in development](./provider-plugin-development.md)
4. [Enterprise extension model](./enterprise-extension-model.md)