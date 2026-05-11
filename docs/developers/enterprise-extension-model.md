---
title: Enterprise extension model
---

# Enterprise extension model

Enterprise is an extension layer, not a fork.

## Principle

The OSS API bootstrap mounts enterprise functionality through `enterprisePlugins`.

That keeps dependency flow clean:

- OSS core does not import enterprise
- enterprise consumes OSS packages
- admin-only workflows stay private

## Why this matters

It lets the public platform remain understandable and auditable while still supporting operator-grade features.