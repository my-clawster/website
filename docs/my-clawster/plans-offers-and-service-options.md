---
title: Plans, offers, and service options
---

# Plans, offers, and service options

My Clawster separates the customer-facing service model from the provider-native provisioning model.

## The user-facing language

People choose from things such as:

- an **offer**
- a **product offering**
- a **compute profile**
- an **OS image**
- a **region**

## Why that matters

Those choices are stable and understandable to the user, even when the provider-native IDs change behind the scenes.

That is what makes the catalog useful across providers and across future iterations of the same provider.

![Product to Resource model](/img/my-clawster/my-clawster-product-to-resource.svg)

## The underlying path

```text
Offer
  -> Product Offering
  -> Product Specification
  -> Service Specification
  -> Service Characteristics
  -> Provider Activation Mappings
  -> Provider Lane
  -> Running Claw
```

## What users should care about

- whether the offer is active
- which service options are available
- whether the selection is compatible with the chosen provider path

## What operators care about

Operators manage the underlying activation mappings and compatibility model so end users never need to think in provider-native IDs.

For that side of the system, see [Enterprise Product to Resource](../enterprise/product-to-resource.md).