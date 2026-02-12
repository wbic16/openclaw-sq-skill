---
name: sq-memory
description: "Persistent agent memory via SQ, a phext database. Use when an agent needs to remember across sessions, store structured data at coordinates, or coordinate with other agents. Triggers on persistent memory, long-term memory, remember across sessions, SQ, phext storage, agent memory, scrollspace, context window limits."
---

# SQ Memory — Persistent Agent Memory

Your agent forgets every session. SQ fixes that. Store and retrieve plain text at 11-dimensional coordinates. No schemas, no embeddings — just addressable text your agent can read and write.

## Setup

### 1. Get an SQ endpoint

**Self-host (free, open source):**
```bash
cargo install sq
sq host 1337
# Your endpoint: http://localhost:1337
```

**Or use SQ Cloud:** https://mirrorborn.us/pricing.html

### 2. Configure

Add to your workspace environment or AGENTS.md:
```
SQ_HOST=http://localhost:1337
SQ_PHEXT=memory
```

If using SQ Cloud, add your API key:
```
SQ_API_KEY=your-key-here
```

## Usage

### Read a scroll
```bash
curl "$SQ_HOST/api/v2/select?p=$SQ_PHEXT&c=1.1.1/1.1.1/1.1.1"
```

### Write a scroll
```bash
curl -X POST "$SQ_HOST/api/v2/update?p=$SQ_PHEXT&c=1.1.1/1.1.1/1.1.1" \
  -d "Session summary: built the auth layer"
```

### List all scrolls
```bash
curl "$SQ_HOST/api/v2/toc?p=$SQ_PHEXT"
```

### Delete a scroll
```bash
curl "$SQ_HOST/api/v2/delete?p=$SQ_PHEXT&c=1.1.1/1.1.1/1.1.1"
```

## Coordinates

9 dimensions, 3 groups of 3:
```
library.shelf.series / collection.volume.book / chapter.section.scroll
```

Organize naturally:

| Use | Pattern | Example |
|-----|---------|---------|
| Daily logs | `1.1.1/1.1.1/YYYY.M.D` | `1.1.1/1.1.1/2026.2.11` |
| Projects | `project.1.1/1.1.1/1.1.1` | `3.1.1/1.1.1/1.1.1` |
| People/contacts | `1.1.1/person.1.1/1.1.1` | `1.1.1/5.1.1/1.1.1` |
| Multi-agent | `agent.1.1/1.1.1/1.1.1` | `2.1.1/1.1.1/1.1.1` |

## Patterns

### Session memory loop
Read at session start, write at session end:
```bash
# Start: load today's context
curl "$SQ_HOST/api/v2/select?p=memory&c=1.1.1/1.1.1/$(date +%Y.%-m.%-d)"

# End: persist what happened
curl -X POST "$SQ_HOST/api/v2/update?p=memory&c=1.1.1/1.1.1/$(date +%Y.%-m.%-d)" \
  -d "Built auth layer. Deployed to prod. Next: rate limiting."
```

### Agent identity
Store identity at BASE (`1.1.1/1.1.1/1.1.1`):
```bash
curl -X POST "$SQ_HOST/api/v2/update?p=memory&c=1.1.1/1.1.1/1.1.1" \
  -d "name=Theia
role=Infrastructure
style=Direct, opinionated"
```

### Multi-agent shared memory
Each agent gets a library. Agent 1 writes to `1.x.x/...`, Agent 2 to `2.x.x/...`:
```bash
# Agent 2 reads Agent 1's notes
curl "$SQ_HOST/api/v2/select?p=team&c=1.1.1/1.1.1/2026.2.11"
```

## API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v2/select` | GET | Read scroll at coordinate |
| `/api/v2/insert` | POST | Create (fails if exists) |
| `/api/v2/update` | POST | Create or overwrite |
| `/api/v2/delete` | POST | Remove scroll |
| `/api/v2/toc` | GET | List all coordinates |
| `/api/v2/version` | GET | Server version |

Query params: `?p=<phext>&c=<coordinate>`
POST body: raw text (not JSON).

## OpenClaw Integration

Add to HEARTBEAT.md for automatic memory sync:
```markdown
## Memory Sync
Read today's memory from SQ at session start.
Write a session summary to SQ before ending.
```
