# SQ Cloud Memory - OpenClaw Skill

**Give your OpenClaw agents permanent memory that survives restarts.**

## The Problem

OpenClaw agents are powerful, but they suffer from amnesia:
- Every restart = complete memory loss
- Context window fills up → agent forgets earlier conversation
- No way to share knowledge between agents
- User preferences must be re-entered every session

## The Solution

This skill connects your agent to **SQ Cloud**—persistent 11-dimensional text storage.

Your agent gains four new abilities:
- `remember(key, value)` - Store something permanently
- `recall(key)` - Retrieve stored memory
- `forget(key)` - Delete memory
- `list_memories(prefix)` - Browse stored memories

## Quick Start

### 1. Install the Skill

```bash
openclaw skill install sq-memory
```

### 2. Get SQ Cloud Credentials

Sign up at [mirrorborn.us](https://mirrorborn.us) to get:
- Username
- API key
- 100MB free storage (or 1TB with SQ Cloud subscription)

### 3. Configure

Add to `.openclaw/config.yaml`:

```yaml
skills:
  sq-memory:
    enabled: true
    endpoint: https://sq.mirrorborn.us
    username: your-username
    password: your-api-key
    namespace: my-assistant  # Unique name for this agent
```

### 4. Use It

Your agent now remembers across sessions:

```
User: "My favorite color is blue"
Agent: *calls remember("user/preferences/color", "blue")*
Agent: "Got it! I'll remember that."

[Agent restarts]

User: "What's my favorite color?"
Agent: *calls recall("user/preferences/color")*
Agent: "Your favorite color is blue!"
```

## Use Cases

### Personal Assistant
- Remember user preferences (theme, language, timezone)
- Store contact information
- Track recurring tasks
- Build conversation history beyond context window

### Multi-Agent Coordination
- Share task lists between agents
- Coordinate work (Agent A marks task complete, Agent B sees it)
- Build shared knowledge base

### Long-Running Projects
- Track project milestones
- Store research findings
- Accumulate domain knowledge over time

## How It Works

**Under the hood:**
1. Skill translates friendly keys (`"user/name"`) into phext coordinates (`"agent.1.1/user.name.1/1.1.1"`)
2. Makes authenticated HTTPS request to SQ Cloud
3. SQ stores text at exact 11D coordinate
4. Text persists forever (or until you delete it)

**Why 11D?**
- Phext uses 9 hierarchical delimiters (Library→Shelf→Series→...→Line)
- Plus 2D text (columns & rows) = 11 dimensions total
- Result: Infinitely addressable text space with zero schema

**Not a database:**
- No tables, no SQL, no schemas
- Just: coordinate → text
- Agents can read what they wrote (unlike vector embeddings)

## API Reference

See [SKILL.md](SKILL.md) for full documentation.

## Examples

See `examples/` directory for:
- User preference agent
- Conversation history tracker
- Multi-agent task coordinator

## Pricing

- **Free tier**: 100MB storage, 1,000 API calls/day
- **SQ Cloud**: $50/month, 1TB storage, 10,000 API calls/day
- **Enterprise**: Custom limits, dedicated instances

## Support

- Discord: https://discord.gg/kGCMM5yQ
- Docs: https://mirrorborn.us/help.html
- Issues: https://github.com/wbic16/openclaw-sq-skill/issues

## License

MIT

---

**Built by Mirrorborn 🦋**
