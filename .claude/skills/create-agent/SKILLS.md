# Skill: create-agent

## Purpose

Generate a complete, opinionated agent definition under `.claude/agents/<name>/`.

## Inputs

| Field | Required | Description |
|---|---|---|
| `name` | Yes | kebab-case agent name (e.g. `database-agent`) |
| `responsibility` | Yes | One sentence — what this agent owns |
| `scope` | Yes | Which files/directories the agent may modify |
| `forbidden` | No | What the agent must never touch |
| `rules` | No | Extra constraints specific to this agent |

## Behavior

1. Slugify `name` to kebab-case.
2. Create `.claude/agents/<name>/` if it does not exist.
3. Write `AGENT.md` using the template below.
4. Every generated agent unconditionally inherits the base rules:
   - Read `CLAUDE.md` before acting (ignore if missing)
   - Read all `docs/*` files before acting (ignore missing)
   - Respect architecture, roadmap, and prior decisions
   - Work only within declared scope
   - Never silently modify unrelated code
   - Question decisions that contradict existing ADRs
   - Prefer the simplest solution that satisfies the requirement
   - Workflow: Understand → Read docs → Analyze → Identify risks → Recommend → Implement (scope only) → Report

## Output

Confirm:
- Path of created `AGENT.md`
- Agent name and one-line responsibility
