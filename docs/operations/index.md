---
title: Operations
sidebar_position: 1
---

# Operations

**This section is for operators deploying and maintaining My Clawster in production.**

My Clawster supports two primary deployment targets: local Bun for development and staging, and Cloudflare Workers and Pages for production. Most operators run a single-node deployment with a D1 database. Enterprise operators may layer additional surfaces on top.

## Deployment paths

| Path | When to use |
|---|---|
| Local Bun + SQLite | Development and testing |
| Cloudflare Workers + D1 | Production (recommended default) |
| Cloudflare + Enterprise | Production with operator admin surface |

## What this section covers

- Choosing and setting up a topology
- Deploying to Cloudflare Workers and Pages
- Environment variable reference
- Bootstrap and disaster recovery
- Production readiness checklist

## Start here

1. [Deployment topologies](./deployment-topologies.md)
2. [Cloudflare deployment](./cloudflare-deployment.md)
3. [Environment reference](./environment-reference.md)
4. [Bootstrap and recovery](./bootstrap-and-recovery.md)
5. [Production checklist](./production-checklist.md)