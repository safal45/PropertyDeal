# create-feature

Scaffold a complete vertical feature slice: React component + Flask endpoint + SQLAlchemy model changes + tests + doc update.

## Usage

```
/create-feature name="<feature-name>" description="<what it does>" scope="frontend|backend|full"
```

## Behavior

For `scope=full` (default):
1. Read `CLAUDE.md`, `docs/architecture.md`, `docs/database.md`, `docs/decisions.md`.
2. Check `docs/roadmap.md` — confirm feature is in V1 scope. If V2, stop and surface conflict.
3. Check if a schema change is required → if yes, engage database-agent first.
4. Check if a new API endpoint is required → if yes, define contract first (api-contract-agent pattern).
5. Scaffold in this order:
   - Model change (if needed) — follow `create-model` rules
   - Flask endpoint — follow `create-api` rules
   - React component — follow `create-component` rules
   - Tests — follow `create-test` rules
6. Update `docs/architecture.md` API table if a new endpoint was added.
7. Add entry to `docs/progress.md`.

## Rules

- Never implement a feature that is not in the current version's roadmap without explicit user instruction.
- A schema change requires a migration file (Alembic) once Alembic is installed; use `create-migration`.
- All new API fields must be validated server-side before writing to the DB.
- New components must use `process.env.REACT_APP_API_URL`, never a hardcoded URL.
- No new npm or pip packages without documenting the rationale.

## Output

- Analysis
- Plan (ordered subtasks)
- Risks
- Files created / changed
- Summary
