# Security — PropertyDeal

_Last updated: 2026-06-14 (RV3 session)_

---

## Current Security Posture: V2 In Progress

All original Critical and High findings resolved. Remaining open items are Medium/Low and deployment-configuration concerns.

---

## Known Findings

| # | Severity | Finding | File / Location | Remediation |
|---|---|---|---|---|
| S-001 | ~~Critical~~ **FIXED** | `GET /users` removed — endpoint deleted; Preview.jsx migrated to `GET /properties` | `flask_server/app.py` | ✅ Done 2026-06-14 |
| S-002 | ~~Critical~~ **FIXED** | `debug=True` hardcoded removed — now gated on `FLASK_DEBUG` env var, default off | `flask_server/app.py` | ✅ Done 2026-06-14 |
| S-003 | ~~High~~ **FIXED** | CORS wildcard replaced — now reads `CORS_ORIGINS` env var, defaults to `localhost:3000` | `flask_server/app.py` | ✅ Done 2026-06-14 |
| S-004 | ~~High~~ **FIXED** | Input validation added — `_check_lengths` and `_check_numeric` helpers applied to all V2 PATCH routes and POST /auth/register; returns HTTP 400 on violation | `flask_server/app.py` | ✅ Done 2026-06-14 |
| S-005 | ~~High~~ **FIXED** | API URL moved to `REACT_APP_API_URL` env var — `src/config.js` created; all three components updated (Home.jsx, About.jsx, Preview.jsx) | `Propdeal-client/src/config.js` | ✅ Done 2026-06-14 |
| S-006 | ~~Medium~~ **CLEAN** | `instance/data.db` not tracked — `.gitignore` already contains `flask_server/instance/*.db`; file not in git history | — | ✅ Already clean |
| RV3-001 | ~~Critical~~ **FIXED** | V1 unauthenticated write routes removed — `POST /submit` and `PUT /update[1-4]` deleted; replaced by V2 PATCH chain with JWT auth | `flask_server/app.py` | ✅ Done 2026-06-14 |
| RV3-002 | ~~Critical~~ **FIXED** | `handleContinue` else branch removed — no longer navigates to /thanks without a confirmed publish; missing token re-opens auth overlay | `About.jsx` | ✅ Done 2026-06-14 |
| RV3-003 | ~~High~~ **FIXED** | Password minimum length enforced — register returns HTTP 400 if password < 8 characters | `flask_server/app.py` | ✅ Done 2026-06-14 |
| RV3-004 | ~~High~~ **FIXED** | Role allowlist added — register validates role against `{'owner', 'builder', 'agent'}`; returns 400 on unknown value | `flask_server/app.py` | ✅ Done 2026-06-14 |
| RV3-006 | ~~High~~ **FIXED** | Email case-normalized — `.strip().lower()` applied before duplicate check in register and before query in login | `flask_server/app.py` | ✅ Done 2026-06-14 |
| RV3-007 | ~~High~~ **FIXED** | Publish overlay now has Cancel button + backdrop click; `handleCancel` wired to both | `About.jsx` | ✅ Done 2026-06-14 |
| S-007 | Medium | No rate limiting on any endpoint | All routes | Add Flask-Limiter before public deployment |
| S-008 | Low | No HTTPS enforcement | Deployment config | Enforce HTTPS redirect at reverse proxy or hosting layer |
| S-009 | ~~High~~ **FIXED** | Server-side input length + numeric type validation added on all V2 PATCH routes — `_check_lengths` enforces column-size limits; `_check_numeric` validates numeric fields; returns HTTP 400 | `flask_server/app.py` all PATCH routes | ✅ Done 2026-06-14 |
| S-010 | ~~Medium~~ **FIXED** | Publish completeness guard added — `property_for` and `pricing.rent` required; returns 422 if incomplete | `flask_server/app.py` | ✅ Done 2026-06-14 |
| S-011 | ~~Medium~~ **FIXED** | Published listings locked — all 4 PATCH routes call `_get_owned_property(reject_published=True)`; returns 409 when `status='published'` | `flask_server/app.py` | ✅ Done 2026-06-14 |

---

## Deployment Blockers

The following must be resolved before any non-localhost deployment:

- [x] ~~S-001~~ — `GET /users` removed; Preview.jsx migrated to `GET /properties`
- [x] ~~S-002~~ — `debug` gated on `FLASK_DEBUG` env var
- [x] ~~S-003~~ — CORS restricted to `CORS_ORIGINS` env var
- [x] ~~S-010~~ — Publish guard: `property_for` + `pricing.rent` required before publish
- [x] ~~S-004~~ — Input length/type validation on all V2 PATCH routes + POST /auth/register
- [x] ~~S-005~~ — `src/config.js` with `REACT_APP_API_URL`; all three components updated
- [x] ~~S-006~~ — Already clean; `flask_server/instance/*.db` in `.gitignore`, not tracked
- [x] ~~S-009~~ — Server-side length + numeric validation via `_check_lengths` / `_check_numeric`
- [x] ~~S-011~~ — PATCH routes locked when `status='published'`; returns 409
- [x] ~~RV3-001~~ — V1 unauthenticated write routes removed
- [x] ~~RV3-002~~ — handleContinue no longer silently navigates to /thanks without publish
- [x] ~~RV3-003~~ — Password minimum length (8 chars) enforced at register
- [x] ~~RV3-004~~ — Role allowlist validated at register
- [x] ~~RV3-006~~ — Email case-normalized before storage and lookup
- [x] ~~RV3-007~~ — Publish overlay has Cancel button + backdrop dismiss

---

## Owner

Security Agent (`docs/security.md` is primary output of security-agent)
