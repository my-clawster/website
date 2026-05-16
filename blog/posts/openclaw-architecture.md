---
draft: true
---

No duplication—this is actually **one OpenClaw installation** with multiple entry points. Let me clarify the architecture:

## What You're Seeing

1. **CLI binary**: `/home/openclaw/.openclaw/bin/openclaw`
   → Your shell's direct command-line interface to OpenClaw

2. **Gateway service** (backend):
   → The long-running process that hosts the API, agents, and orchestration layer
   → This is what's running "me" (Oryx) and serving the Control UI

3. **Control UI** (web interface):
   → The web dashboard you're in right now
   → Talks to the same gateway

All three are part of **one OpenClaw installation** in `/home/openclaw/.openclaw/`.

## How They Relate

```
┌─ CLI: openclaw status → queries the gateway
├─ Gateway: (daemon) → orchestrates agents, manages workspace, hosts API
└─ Control UI: (web UI) → connected to the same gateway
```

When you run `openclaw status` in the shell, it's asking the same gateway service that's running me.

## Can You Delete One?

**No.** Don't delete either:
- `/home/openclaw/.openclaw/bin/openclaw` is the CLI entry point — you need it
- The gateway is the actual runtime — you definitely need it

There's nothing redundant to remove. This is how OpenClaw is architected: a unified installation with CLI + gateway + web UI.

## Verify It's One Installation

Run in your shell:
```bash
openclaw status
```

You'll see the gateway details, workspace path, active agents, etc. That's the same service running behind this Control UI.

