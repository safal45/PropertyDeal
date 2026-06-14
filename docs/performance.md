# Performance — PropertyDeal

_Last updated: 2026-06-13_

---

## Current Performance Posture: V1 Dev-Only

No performance budgets or measurements have been set. The findings below are architectural observations from reading the codebase — not measured benchmarks. Measurements should be taken before V2 work begins.

---

## Known Bottlenecks

| # | Layer | Finding | File / Location | Impact | Priority |
|---|---|---|---|---|---|
| P-001 | Backend | `GET /users` returns all rows — no pagination | `flask_server/app.py:139` | Full-table scan at any scale | High |
| P-002 | Frontend | Nominatim geocoding fires on every `locality`/`city` state change — no debounce | `About.jsx:232–243` | Excessive network requests; Nominatim rate-limits at 1 req/sec | High |
| P-003 | Frontend | `react-map-gl` and `react-leaflet` both in `package.json` — only one is used | `package.json` | ~200KB dead weight in bundle | Medium |
| P-004 | Frontend | No lazy loading on map or image uploader components | `About.jsx` | Leaflet loads on every tab even before the location tab is reached | Medium |
| P-005 | Database | No indexes on any column — full-table scan on every query | `flask_server/app.py` model | Acceptable at V1 scale; will degrade past ~10K rows | Low (V1) |
| P-006 | Frontend | All 5 tab contents rendered in the same component — no code splitting | `About.jsx` | Initial parse cost higher than necessary | Low |

---

## Quick Wins (V1-Safe)

- [ ] P-002 — Debounce Nominatim calls (500ms minimum) — `About.jsx:232`
- [ ] P-003 — Remove `react-map-gl` from `package.json` (unused)

## Deferred to V2

- [ ] P-001 — Paginate `/properties` endpoint
- [ ] P-004 — Lazy-load map component
- [ ] P-005 — Add indexes to high-query columns (city, locality, propertyfor, propertytype)

---

## Owner

Performance Agent (`docs/performance.md` is primary output of performance-agent)
