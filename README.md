# openclaw-sq-skill

Give your OpenClaw agent persistent memory via [SQ](https://github.com/wbic16/SQ) — a phext database.

## What it does

Your agent forgets every session. This skill fixes that. Store and retrieve plain text at 11-dimensional coordinates. No schemas, no embeddings — just addressable text your agent can read and write.

## Install

Copy `SKILL.md` into your OpenClaw workspace skills directory:

```bash
mkdir -p ~/.openclaw/workspace/skills/sq-memory
cp SKILL.md ~/.openclaw/workspace/skills/sq-memory/
```

Or install the packaged skill:
```bash
cp sq-memory.skill ~/.openclaw/skills/
```

## Setup

### 1. Get an SQ endpoint

**Self-host (free, open source):**
```bash
cargo install sq
sq host 1337
```

**Docker:**
```bash
docker pull wbic16/sq
docker run -p 1337:1337 wbic16/sq
```

**Or use [SQ Cloud](https://mirrorborn.us/pricing.html)** for managed hosting.

### 2. Configure your agent

Add to your workspace `AGENTS.md` or environment:
```
SQ_HOST=http://localhost:1337
SQ_PHEXT=memory
```

## Quick start

```bash
# Write a scroll
curl -X POST "http://localhost:1337/api/v2/update?p=memory&c=1.1.1/1.1.1/1.1.1" \
  -d "Hello from my agent"

# Read it back
curl "http://localhost:1337/api/v2/select?p=memory&c=1.1.1/1.1.1/1.1.1"

# List all scrolls
curl "http://localhost:1337/api/v2/toc?p=memory"
```

## Coordinates

9 dimensions in 3 groups of 3:
```
library.shelf.series / collection.volume.book / chapter.section.scroll
```

| Use case | Coordinate pattern |
|----------|-------------------|
| Daily memory | `1.1.1/1.1.1/2026.2.11` |
| Project notes | `3.1.1/1.1.1/1.1.1` |
| Multi-agent | Agent 1: `1.x.x/...`, Agent 2: `2.x.x/...` |

## What's phext?

Plain text extended to 11 dimensions using 9 hierarchical delimiters:

```
Library > Shelf > Series > Collection > Volume > Book > Chapter > Section > Scroll
```

No database schemas. No query language. Just text at coordinates. Your agent reads it, writes it, and remembers.

## Links

- [SQ — the database](https://github.com/wbic16/SQ)
- [libphext-rs — core library](https://github.com/wbic16/libphext-rs)
- [hello-phext — canonical API](https://github.com/wbic16/hello-phext)
- [SQ Cloud — managed hosting](https://mirrorborn.us/pricing.html)
- [OpenClaw](https://github.com/openclaw/openclaw)
- [Discord](https://discord.gg/kGCMM5yQ)

## License

MIT
