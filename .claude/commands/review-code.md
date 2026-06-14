# review-code

Review code against CLAUDE.md standards and project conventions. Report findings by severity without modifying files unless explicitly asked.

## Usage

```
/review-code target="<file-or-diff>" [fix=true]
```

If `fix=true`, apply all findings after reporting them.

## Behavior

1. Read `CLAUDE.md`, `docs/architecture.md`, `docs/decisions.md`, `docs/security.md`.
2. Read the target file(s).
3. Evaluate against the checklist below.
4. Report findings grouped by severity.
5. If `fix=true`, apply safe fixes (formatting, naming, dead code). Raise design-level findings without auto-fixing.

## Review Checklist

### Correctness
- [ ] No hardcoded values that should be env vars (URLs, ports, IDs)
- [ ] All required fields validated before DB write
- [ ] HTTP status codes are semantically correct
- [ ] No stack traces exposed to clients
- [ ] No `userId = 1` hardcoding pattern replicated in new code

### Security (cross-reference `docs/security.md`)
- [ ] No secrets in source
- [ ] No SQL injection risk (raw queries bypassing ORM)
- [ ] No XSS risk (unescaped user content rendered in JSX)
- [ ] CORS not widened beyond current wildcard without approval

### Code Quality (CLAUDE.md)
- [ ] Single responsibility — function/component does one thing
- [ ] DRY — no logic duplicated from existing code
- [ ] Clear naming — no ambiguous abbreviations
- [ ] No dead code (unused imports, commented-out blocks, unreachable branches)
- [ ] Consistent with surrounding code style

### Architecture
- [ ] No new dependencies introduced without documentation
- [ ] No V2 features implemented under a V1 task
- [ ] Scope respected — file not touched by an agent outside its declared scope
- [ ] New endpoints documented in `docs/architecture.md`
- [ ] New schema changes documented in `docs/database.md`

### Frontend-specific
- [ ] No hardcoded API URL
- [ ] No inline `style={{}}` without a comment
- [ ] API calls at page level, not in sub-components

### Backend-specific
- [ ] Consistent response shape `{"message": "..."}` or typed object
- [ ] Error responses return correct HTTP status, not 200

## Severity Levels

- **Critical** — blocks merge (security issue, data loss risk, hardcoded secret)
- **High** — should fix before merge (missing validation, wrong status code, scope violation)
- **Medium** — fix soon (dead code, naming, style inconsistency)
- **Low** — optional improvement (minor refactor, comment quality)

## Output

- Findings grouped by severity
- Recommended fixes for Critical and High
- Summary: pass / needs work / blocked
