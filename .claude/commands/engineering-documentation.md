# Engineering Documentation Skill

## Purpose

Maintain the long-term engineering memory of PropertyDeal.

Invoke this skill whenever important decisions are made about:
- System architecture or tech stack
- Database schema or data model
- API design or endpoints
- Folder structure or project organisation
- Roadmap priorities or milestone changes
- Progress on features (started / completed / blocked)

## Responsibilities

Read the current state of the codebase, then update the following files — never overwrite useful history, always append or amend:

| File | What it tracks |
|---|---|
| `docs/architecture.md` | System overview, tech stack, component map, data-flow |
| `docs/database.md` | Schema (tables, columns, types, relationships), design rationale, known issues |
| `docs/roadmap.md` | Versioned milestones, feature backlog, priorities |
| `docs/decisions.md` | Architecture Decision Records (ADR) — why a choice was made |
| `docs/progress.md` | Sprint-level status: done / in-progress / blocked |

## Rules

- Never delete or overwrite useful information — update or append only.
- Preserve history: mark superseded decisions as `[SUPERSEDED]` rather than removing them.
- Do not modify application code.
- Keep each file self-contained and readable without context from this conversation.
- Convert relative dates to absolute dates (e.g. "Thursday" → "2026-06-19").
- After updating, summarise: which files changed and what was recorded.

## Output

Return a short summary:
- Files updated (list)
- Decisions recorded (list)
- Progress changes (list)
