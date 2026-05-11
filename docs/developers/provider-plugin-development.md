---
title: Provider plug-in development
---

# Provider plug-in development

Provider plug-ins are the cleanest way to add infrastructure support.

## A plug-in should define

- a manifest
- a runtime implementation
- optional discovery behavior
- credential requirements

## Design rule

Keep provider-native details inside the plug-in or activation mapping layer. End-user choices should stay stable and provider-agnostic.