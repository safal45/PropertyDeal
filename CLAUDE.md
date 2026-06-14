# CLAUDE.md

## Mission

Build a production-grade, scalable, maintainable PropertyDeal platform.

## Priorities

User > CLAUDE.md > docs/decisions.md > docs/architecture.md > docs/roadmap.md > Existing code.

## Rules

* Understand before coding.
* Read relevant docs.
* Stay within scope.
* Respect architecture.
* Prefer simple solutions.
* Fix root causes.
* Don't overengineer.
* Don't modify unrelated code.
* Don't introduce new tech without approval.
* Surface assumptions and risks.

## Code

* Single responsibility.
* DRY and reusable.
* Clear naming.
* Remove dead code.
* Keep consistency.

## Database

* Preserve integrity.
* Use migrations.
* Optimize queries.
* Avoid unnecessary schema changes.

## API

* Consistent contracts.
* Validate input.
* Meaningful errors.
* Maintain compatibility.

## Security

* Validate everything.
* Never expose secrets.
* Least privilege.

## Documentation

Update relevant `docs/*` after significant changes. Ignore missing files.

## Workflow

Analyze → Read docs → Plan → Identify risks → Implement (scope only) → Verify → Report.

## Report

* Analysis
* Plan
* Risks
* Files changed
* Summary
