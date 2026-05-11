---
title: Enterprise
sidebar_position: 1
---

# Enterprise

**Enterprise gives operators control over My Clawster as a managed service — governing what gets offered, who can provision it, and how providers are introduced into the catalog.**

Where My Clawster handles provisioning from the customer side, Enterprise adds the operator layer: the admin portal, catalog governance, and provider readiness workflows that sit above the OSS core.

![Enterprise admin surface](/img/my-clawster/enterprise-admin-surface.svg)

## What operators can configure

- **Product-to-resource mapping** — define the activation path from offer to running claw
- **Offers and business promises** — control what appears in the customer catalog, at what price, and with what service-level expectations
- **Provider readiness** — stage provider discovery and introduction before it reaches the customer surface
- **Audit and health** — monitor provisioning activity and surface integration health across providers

## What "governed service" means

Governance means no offer appears in the customer catalog until an operator explicitly enables it. No provider is available until it passes readiness checks. No service option is priced until the activation map is wired.

This is intentional. My Clawster with Enterprise is not a self-serve platform with guardrails. It is an operator-first platform where operators control the full path from catalog design to running infrastructure.

## Read this section in order

1. [Admin portal tour](./admin-portal-tour.md)
2. [Product to Resource](./product-to-resource.md)
3. [Provider management](./provider-management.md)
4. [Offers and business promises](./offers-and-business-promises.md)
5. [Integrations, audit, and health](./integrations-audit-and-health.md)