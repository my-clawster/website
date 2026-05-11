---
title: Manage clusters and claws
---

# Manage clusters and claws

Once a clawster exists, the day-to-day work is mostly operational clarity.

## Clusters

Clusters group related claws and their provider relationships.

Use a cluster to:

- keep one project or team isolated
- understand which provider lane is primary
- track what is active, inactive, or misconfigured

## Claws

A claw is one running unit in the clawster. Depending on your model, that may be a VPS, cloud runtime, or Kubernetes-backed path.

Typical actions:

- review status
- inspect activation context
- confirm region and service selection
- reprovision or retire when needed

## Single vs hybrid

Use single-provider clawsters when you want simplicity. Use hybrid clawsters when different claw roles need different provider paths.

![Hybrid clawster](/wizard-diagrams/clawster-hybrid.svg)

## Signals that matter

- provider binding exists and is active
- integration health is green
- selected characteristics still map to valid provider-native parameters
- the claw is attached to the expected region and lane

## What to read next

- [Authentication and access](./authentication-and-access.md)
- [Troubleshooting](./troubleshooting.md)