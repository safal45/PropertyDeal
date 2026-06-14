# Architecture Decision Records — PropertyDeal

_Last updated: 2026-06-13_

---

## ADR-001 — SQLite for V1 persistence

**Date:** 2026-06-13 (inferred from project state)  
**Status:** Accepted

**Context:** V1 is a prototype / MVP. Speed of iteration matters more than production-readiness.

**Decision:** Use SQLite via Flask-SQLAlchemy. No migration tooling (Alembic) required for the single-table schema.

**Consequences:**
- No concurrent write support — acceptable for a single-developer prototype.
- Must be replaced before any real multi-user deployment.
- Migration path: swap `SQLALCHEMY_DATABASE_URI` to PostgreSQL; add Alembic; run `db.create_all()` once.

---

## ADR-002 — Flat `User` table (denormalised)

**Date:** 2026-06-13 (inferred)  
**Status:** Accepted for V1 / Planned supersession in V2

**Context:** The multi-step form captures both contact identity and property attributes in one flow. Splitting into multiple tables requires either session state or partial-record handling.

**Decision:** Store everything in a single `User` table. The backend creates a record on `/submit` (Step 1) and updates it via four PUT endpoints as the user progresses through tabs.

**Consequences:**
- Simple backend — five endpoints, one model.
- Prevents a single user from owning multiple properties.
- All boolean fields stored as strings (`"Yes"`/`"No"`) — no DB-level constraints.
- Must be normalised in V2 (see `database.md` proposed schema).

---

## ADR-003 — Create React App (CRA) as frontend bundler

**Date:** 2026-06-13 (inferred)  
**Status:** Accepted for V1

**Context:** Project was bootstrapped quickly. CRA provides zero-config setup.

**Decision:** Use `react-scripts 5` / CRA.

**Consequences:**
- No control over webpack config without ejecting.
- CRA is in maintenance mode upstream; Vite is the recommended migration path for V2.

---

## ADR-004 — Tailwind CSS for styling

**Date:** 2026-06-13 (inferred)  
**Status:** Accepted

**Decision:** Use Tailwind CSS v3 for utility-first styling with custom design tokens (brand colour `#122B49`).

**Consequences:** Component styles are co-located in JSX. No separate CSS files needed per component.

---

## ADR-005 — No authentication in V1

**Date:** 2026-06-13  
**Status:** Accepted for V1 / Must be addressed in V2

**Context:** V1 is a form prototype. User management adds significant scope.

**Decision:** No login, session, or token system. Any client can call any API endpoint.

**Consequences:**
- `/users` returns all records to any caller — a privacy risk.
- Hardcoded `userId = 1` in `About.jsx` means every new session overwrites record #1.
- V2 must implement auth (JWT or session) before any public deployment.

---

## ADR-007 — Agent-based development system

**Date:** 2026-06-13
**Status:** Accepted

**Context:** The project needs a consistent, scalable way to develop across frontend, backend, database, security, and infrastructure concerns without knowledge drift between sessions.

**Decision:** Adopt a 12-agent hierarchy (orchestrator + 11 specialists) under `.claude/agents/`, each with a declared scope, ownership boundaries, and a standard workflow. All agents read `CLAUDE.md` and `docs/*` before acting. A reusable skill library under `.claude/commands/` eliminates repetitive scaffolding work.

**Consequences:**
- Every concern has a single owning agent — no ambiguity about who approves a change.
- `CLAUDE.md` is the authoritative mission and priority contract above all code.
- Skills (`/create-api`, `/create-component`, etc.) keep token usage low and output consistent.
- Onboarding a new concern requires only a `/create-agent` invocation.

---

## ADR-006 — React-Leaflet + Nominatim for maps

**Date:** 2026-06-13 (inferred)  
**Status:** Accepted for V1

**Decision:** Use react-leaflet (OpenStreetMap tiles) and Nominatim geocoding API for the location tab map preview.

**Consequences:**
- Free, no API key required.
- Nominatim has usage limits (1 req/sec); not suitable for production at scale.
- Google Maps / Mapbox should be evaluated for V2.
