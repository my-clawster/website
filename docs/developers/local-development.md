---
title: Local development
---

# Local development

The platform uses a sibling-root model rather than one giant workspace.

## Main roots

- `my-clawster`
- `my-clawster-packages`
- `my-clawster-apps`
- `enterprise`
- `workspace`

## Recommended workflow

Use the package-owned local-dev scripts instead of editing dependency ranges by hand.

```bash
cd workspace
bun run install:local-dev
```

That preserves the publish contract while wiring the local Bun links in the right order.