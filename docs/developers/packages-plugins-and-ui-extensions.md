---
title: Packages, plug-ins, and UI extensions
---

# Packages, plug-ins, and UI extensions

The platform grows through reusable packages and approved extension surfaces.

![Extension boundaries](/img/my-clawster/extension-boundaries.svg)

## Packages

Shared packages live under `my-clawster-packages` and own reusable logic.

## Provider plug-ins

Provider plug-ins add provisioning capability without forcing that logic into the deployable app shells.

## UI extensions

UI extensions let shells opt into additional routes, navigation, or widgets without ambient discovery at render time.

## Access tiers

- OSS surfaces are meant to be broadly usable
- Community surfaces can be source-available or member-scoped
- Enterprise surfaces are admin-facing and separately licensed