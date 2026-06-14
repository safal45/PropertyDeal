# create-agent

Generate a complete agent definition under `.claude/agents/<name>/AGENT.md`.

## Usage

```
/create-agent name="<kebab-name>" responsibility="<one sentence>" scope="<paths>" [forbidden="<paths>"] [rules="<extra rules>"]
```

## Behavior

1. Slugify `name` to kebab-case.
2. Create `.claude/agents/<name>/` if it does not exist.
3. Write `AGENT.md` using the standard template.
4. Every agent unconditionally inherits base rules (read CLAUDE.md, read docs/*, respect ADRs, minimal scope, prefer simple solutions).

## Template

```md
# {Name} Agent

## Role
{responsibility}

## Responsibilities
- ...

## Must Read
- CLAUDE.md
- docs/architecture.md
- docs/database.md
- docs/roadmap.md
- docs/decisions.md
- docs/progress.md
(ignore missing)

## Scope
{scope}

## Must NOT
{forbidden items}

## Rules
{rules}

## Workflow
Understand → Read docs → Analyze → Identify risks → Recommend → Implement (scope only) → Report

## Output
- Analysis
- Plan
- Risks
- Recommendation
- Files changed
```
