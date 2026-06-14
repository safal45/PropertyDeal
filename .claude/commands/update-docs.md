# update-docs

Synchronize all `docs/*` files with the current state of the codebase and recent decisions. Never overwrite useful history — update or append only.

## When to invoke

- After any significant implementation session
- After a new ADR is recorded
- After an agent completes a task
- When docs and code have drifted

## Behavior

1. Read `CLAUDE.md` and all existing `docs/*` (ignore missing).
2. Read the current state of `flask_server/app.py` and key frontend files.
3. For each doc file, identify stale entries and missing entries.
4. Update only what has changed — preserve all history.
5. Create missing doc files if referenced by agents but not yet on disk.
6. Add a row to `docs/progress.md` session log.

## Files managed

| File | What to check |
|---|---|
| `docs/architecture.md` | API table matches actual routes; agent/skill tables are current |
| `docs/database.md` | Schema table matches actual SQLAlchemy model |
| `docs/decisions.md` | All recent architectural choices have an ADR |
| `docs/roadmap.md` | Milestone status reflects actual progress |
| `docs/progress.md` | Done/In-Progress/Blocked lists are current; session log has an entry |
| `docs/security.md` | Known findings list is current (create if missing) |
| `docs/performance.md` | Known bottlenecks list is current (create if missing) |

## Rules

- Never delete or overwrite history.
- Superseded ADRs get `[SUPERSEDED — see ADR-NNN]`, not deletion.
- All dates must be absolute (`YYYY-MM-DD`).
- Do not modify application code.

## Output

- Files updated (list)
- Stale entries corrected (list)
- New entries added (list)
