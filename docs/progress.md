# Progress — PropertyDeal

_Last updated: 2026-06-14_

---

## Current Status: Production-Ready — Polished, tested, 6 demo listings, deployment-configured

---

## Done

- [x] Project scaffolded (React CRA + Flask)
- [x] Git repository initialised; Propdeal-client converted from submodule to regular directory
- [x] `flask_server/app.py` — Flask API with 5 endpoints, SQLite, Flask-CORS
- [x] `Home.jsx` — Step 1 contact form (role, name, country, phone, email)
- [x] `About.jsx` — 5-tab property detail form
  - [x] Tab 1: Property details (for/type/subtype/age/BHK)
  - [x] Tab 2: Location with Leaflet map + Nominatim geocoding
  - [x] Tab 3: Features & amenities (pets, electricity, water, CCTV, parking)
  - [x] Tab 4: Price details (rent, security, maintenance)
  - [x] Tab 5: Images — UI placeholder only
- [x] `Preview.jsx` — Read-only listing preview from GET /users
- [x] `Thanks.jsx` — Confirmation screen
- [x] Tailwind CSS integrated with custom fonts (Merriweather, Inter, Roboto)
- [x] React Router v6 routing

---

## Engineering System (Done)

- [x] `CLAUDE.md` — mission, priorities, rules, workflow
- [x] `docs/` — architecture, database, decisions, roadmap, progress, security, performance
- [x] Agent hierarchy — 12 agents (orchestrator + 11 specialists)
- [x] Skill library — `create-agent`, `engineering-documentation`, `update-docs`, `create-feature`, `create-api`, `create-model`, `create-component`, `create-test`, `review-code`, `create-migration`

## V2 — In Progress

### 2.1 Normalise DB Schema
- [x] **T1** — Flask-Migrate 4.0.7 installed; `migrations/` directory scaffolded via `flask db init`
- [ ] ~~T2 — Write ADR-008~~ (skipped — schema approved, no ADR required)
- [x] **T3** — 6 V2 SQLAlchemy models defined (`UserAccount`, `Property`, `PropertyLocation`, `PropertyFeatures`, `PropertyPricing`, `PropertyImage`)
- [x] **T4** — Alembic migration generated (`ba945510a25c_add_v2_schema.py`); 3 indexes added manually; downgrade implemented
- [x] **T5 (migration)** — `flask db upgrade` applied; revision `ba945510a25c (head)`; all 6 tables + 3 indexes + 5 FKs confirmed in database
- [x] **T5 (routes)** — `POST /properties` implemented; requires JWT; creates draft `Property` owned by JWT identity
- [x] **T6** — 5 PATCH endpoints implemented: `/details`, `/location`, `/features`, `/pricing`, `/publish`; all JWT-protected with ownership assertion
- [x] **T6a (auth)** — `POST /auth/register` + `POST /auth/login` implemented; Flask-JWT-Extended 4.6.0; bcrypt via werkzeug; `password_hash` column added via migration `fc334fc14bcd`; all ownership checks verified with test client
- [x] **T6b (browse)** — `GET /properties` implemented; public (no auth); returns published listings only; paginated (`?page`, `?limit`, max 100); joinedload on location + pricing prevents N+1; response envelope includes `data[]` + `pagination`; future filter params accepted without error
- [x] **T6c (listing flow)** — `About.jsx` migrated from V1 endpoints to V2 API; auth overlay (login/register); 5-tab PATCH chain wired; lat/lng bubbled from Nominatim; PATCH /publish on confirm; R-008 brand fix; end-to-end list→browse loop closed
- [x] **T7** — `GET /properties/<id>` implemented (public, no auth); returns all fields — property core, location (6 fields incl. lat/lng), features (5 booleans/strings), pricing (5 fields); Numeric fields cast to float; 404 on not-found or unpublished; `PropertyDetail.jsx` created with hero banner, price card, details section, features grid, Leaflet map (if lat/lng present), loading/error/not-found states; `/property/:id` route added to App.js; Enquire button on PropertyCard now navigates to detail page; R-009 resolved
- [x] **T8** — `docs/progress.md` and `docs/roadmap.md` updated

## V1 — Known Bugs

- [x] Bug: hardcoded `userId = 1` in `About.jsx` — resolved by V2 listing flow migration (T6c)
- [ ] Image upload backend not started

---

## Blocked / Not Started

- [x] Authentication — JWT via Flask-JWT-Extended; register + login endpoints live
- [x] CORS restriction — `CORS_ORIGINS` env var, defaults to localhost:3000
- [ ] Real image storage
- [ ] PostgreSQL migration
- [x] Environment config — `src/config.js` with `REACT_APP_API_URL`; all components updated
- [x] Property browse/search page
- [x] Individual property detail page — `GET /properties/<id>` + `PropertyDetail.jsx` + `/property/:id` route

---

## Review

End-to-end integration review of V2 API flow + Home.jsx (2026-06-13). All 9 curl steps passed. Ranked findings:

| ID | Severity | One-liner |
|---|---|---|
| R-001 | CRITICAL | `PropertyCard` crashes entire Home page when any listing has `location: null` or `pricing: null` — JS null does not trigger `= {}` default |
| R-002 | CRITICAL | `PATCH /properties/<id>/publish` has no completeness guard — empty draft (no fields, no location, no pricing) can be published and appears in `GET /properties` |
| R-003 | HIGH | `PATCH /properties/<id>/details` (and all other PATCH routes) mutates a published listing without re-validation or status rollback — listings can be silently corrupted post-publish |
| R-004 | HIGH | `Home.jsx` error catch block reads `err.response?.data?.message` but all V2 error responses use key `error`, not `message` — every server-side error shows only the generic Axios message |
| R-005 | HIGH | "Try again" button (`onClick={() => setPage(1)}`) is a no-op when the error occurs on page 1 because `setPage(1)` does not change state, so `useEffect` never re-runs |
| R-006 | HIGH | No server-side input length validation on any V2 route — 5 000-char `building` field accepted and stored; potential for oversized payloads |
| R-007 | MEDIUM | `GET /properties?page=9999` returns `{data:[], pagination:{has_prev:true, pages:1}}` — an impossible state; Home.jsx "Previous" button would appear active on an empty results page |
| R-008 | MEDIUM | `About.jsx` overlay text reads "POST PROPERTY ON DYLAN ESTATE?" — stale brand name from previous project |
| R-009 | MEDIUM | No `GET /properties/<id>` endpoint exists — PropertyCard cannot link to a detail page; cards are non-interactive dead-ends |
| R-010 | LOW | `PropertyCard` always shows "/mo" rent suffix regardless of `property_for` (Sale) — price label is incorrect for sale listings |
| R-011 | LOW | Unauthenticated 401 error from Flask-JWT-Extended uses `{"msg": "..."}` key, which also does not match Home.jsx's `data?.message` read |

## Session Log

| Date | What happened |
|---|---|
| 2026-06-14 | **Render deployment fix:** Root cause: Render was not given `rootDir: flask_server`, so it scanned the repo root, found no Python files, defaulted to Poetry 2.1.3, which printed "Retrieving…" that bash interpreted as a command → `bash: line 1: Retrieving: command not found`. Secondary: Python 3.14.3 was auto-selected (too new; psycopg2-binary has no wheel). Fixes: (1) `flask_server/runtime.txt` created with `python-3.11.9`; (2) `render.yaml` created at repo root with `rootDir: flask_server`, explicit `buildCommand: pip install -r requirements.txt`, `startCommand`, and `PYTHON_VERSION: 3.11.9` env var; (3) `docs/deployment.md` rewritten with corrected Render settings, Blueprint path, and full troubleshooting table.
| 2026-06-14 | **Production deployment prep:** `vercel.json` (SPA rewrites + `CI=false` build); `flask_server/Procfile` (migrate + gunicorn); `requirements.txt` pinned with `gunicorn==26.0.0` + `psycopg2-binary==2.9.12`; `postgres://`→`postgresql://` URL fix in `app.py`; `.gitignore` corrected (`venv/` added, `.env` paths fixed); `.env.example` files for both frontend and backend; `docs/deployment.md` created with full Vercel + Render step-by-step guide. Build now compiles with zero warnings (logo `alt` prop fixed in `Header.jsx`).
| 2026-06-14 | **Demo polish pass:** 7 bugs fixed, junk test data replaced with 6 realistic Mumbai/Maharashtra demo properties seeded via API. Fixes: (1) page title "Dylan Estate"→"PropertyDeal" in index.html; (2) nested `<form>` inside `<form>` removed from `PropertyForm` in About.jsx (DOM error); (3) About.jsx BHK buttons hidden — added `flex-1 min-h-0` to scroll container + increased card height to 38rem; (4) About.jsx `h-[130vh]` blank space — changed to `min-h-screen`, `mx-auto` centering; (5) Preview.jsx 44 058px-wide overflow caused by AAAA test data — added `truncate` to location text; (6) Thanks.jsx fixed-pixel overflow — rewritten with responsive centering; (7) 404 blank page — catch-all `path="*"` route + `NotFound` component added; (8) PropertyDetail.jsx `pricing.maintenance === "Extra"` mismatch — corrected to `"Extra Maintenance"`; (9) Sale property `security_deposit: 0` showing as "Rs. 0" — cleared to NULL in DB |
| 2026-06-13 | Engineering documentation skill created; all five docs initialised from codebase read |
| 2026-06-13 | `create-agent` skill created at `.claude/skills/create-agent/` and `.claude/commands/create-agent.md` |
| 2026-06-13 | 10 specialist agents created: frontend, backend, database, api-contract, auth, testing, security, devops, performance, documentation |
| 2026-06-13 | `orchestrator-agent` created as top-level coordinator for all 11 specialist agents |
| 2026-06-13 | `CLAUDE.md` written at project root — authoritative mission, priorities, and workflow contract |
| 2026-06-13 | All docs synced; `docs/security.md` and `docs/performance.md` stubs created; common reusable skills scaffolded |
| 2026-06-13 | V2 started — T1 complete: Flask-Migrate installed, Alembic initialised (`flask_server/migrations/`) |
| 2026-06-13 | Home page reimplemented as property browse page with pagination (fetches GET /properties, card grid, loading/empty/error states, prev/next pagination, "List your property" CTA linking to /more-detail) |
| 2026-06-13 | About.jsx: V1→V2 migration; auth overlay (login/register); POST /properties + 5 PATCH chain + PATCH /publish; lat/lng Nominatim bubble; R-008 brand fix ("PROPERTYDEAL") |
| 2026-06-13 | About.jsx: RV-001 fixed (isActive moved to state block); RV-004 fixed (type="button" on Continue); RV-007 fixed (publish failure shows error, does not navigate) |
| 2026-06-14 | app.py: S-001 (GET /users removed), S-002 (debug gated on FLASK_DEBUG), S-003 (CORS restricted), RV2-006 (JWT_SECRET_KEY required), RV2-010 (publish guard: property_for + pricing.rent required) |
| 2026-06-14 | About.jsx: RV2-001+RV2-002 fixed (null propertyId guards on all non-details tabs; post-auth re-trigger resets to Tab 1 if no propertyId) |
| 2026-06-14 | Preview.jsx: RV2-009 fixed — migrated from GET /users (PII) to GET /properties (V2 published listings) |
| 2026-06-14 | S-004/S-009 fixed — `_check_lengths` + `_check_numeric` helpers added to app.py; all 4 PATCH routes + POST /auth/register validate input; HTTP 400 on violation |
| 2026-06-14 | S-011 fixed — `_get_owned_property(reject_published=True)` added; all PATCH routes return 409 when property is already published |
| 2026-06-14 | S-005 fixed — `src/config.js` created with `REACT_APP_API_URL` env var; Home.jsx, About.jsx (8 URLs), Preview.jsx all migrated off hardcoded `http://127.0.0.1:5000` |
| 2026-06-14 | S-006 confirmed clean — `flask_server/instance/*.db` already in `.gitignore`; data.db not tracked in git history |
| 2026-06-14 | RV3-001 fixed — V1 write routes (POST /submit, PUT /update[1-4]) removed; User model retained for schema safety |
| 2026-06-14 | RV3-002 fixed — handleContinue else branch removed; missing token now re-opens auth overlay instead of navigating to /thanks |
| 2026-06-14 | RV3-003 fixed — password minimum length (8 chars) enforced at POST /auth/register |
| 2026-06-14 | RV3-004 fixed — role allowlist {'owner', 'builder', 'agent'} validated at POST /auth/register |
| 2026-06-14 | RV3-006 fixed — email normalized with .strip().lower() before storage (register) and lookup (login) |
| 2026-06-14 | RV3-007 fixed — publish overlay has Cancel button + backdrop click wired to handleCancel() |
| 2026-06-14 | python-dotenv added — `load_dotenv()` at startup; `flask_server/.env.example` created; `DATABASE_URL` env var now controls DB URI (defaults to SQLite); error message updated to guide users to .env |
| 2026-06-13 | V2 end-to-end integration review completed — 11 findings (2 CRITICAL, 4 HIGH, 3 MEDIUM, 2 LOW) |
| 2026-06-13 | **Frontend improvement #1:** Premium PropertyCard redesign + bug bundle (R-001, R-004, R-005, R-010) — see entry below |
| 2026-06-14 | **T7/T8:** Property Details page implemented — `GET /properties/<id>` backend route; `PropertyDetail.jsx` (hero, price card, details, features grid, Leaflet map, loading/error/not-found states); `/property/:id` route wired; Enquire button on PropertyCard navigates to detail page; R-009 resolved; docs updated |
| 2026-06-14 | Navigation wired: Header buttons connected to routes (PROPERTIES→/, DASHBOARD→/preview, LIST→/more-detail); CONTACT US + MORE + language icon removed; active state driven by useLocation; logo→Home link; brand updated to PropertyDeal; user icon auth-aware; Thanks.jsx orphan input removed, signoff updated |
| 2026-06-14 | UI polish: header overlap fixed (pt-[72px] on main); About.jsx + Thanks.jsx manual header compensations removed; logo path fixed to absolute (/logodylan.png); broken userlogo.png replaced with inline SVG; nav container made responsive (flex-1 + justify-end); divider mt-2 removed |

---

## Frontend Improvement #1 — Premium PropertyCard Redesign (2026-06-13)

### Improvement chosen

**Premium property card redesign** — the card is the core product unit and the first thing every visitor judges. Cards were plain white text boxes with no visual identity. The redesign adds a gradient visual header with an SVG property-type icon, an "Enquire" CTA button on every card, feature chips (subtype, property age), an inline SVG location pin, and correct price display logic.

### Why this was chosen

Cards are the highest-frequency UI element on the Home page. Elevating them from a plain data row to a visually structured listing card immediately signals product quality, improves scannability, and adds a conversion action (Enquire button) that was previously absent. All four outstanding bugs were isolated to `Home.jsx`, making the bundle natural.

### Bugs bundled

| ID | Fix applied |
|---|---|
| R-001 CRITICAL | `property.location ?? {}` and `property.pricing ?? {}` — `null` from backend no longer crashes the page |
| R-004 HIGH | Error catch now reads `err.response?.data?.error \|\| err.response?.data?.message \|\| err.message` |
| R-005 HIGH | Added `retryKey` state counter; "Try again" increments it so `useEffect` re-fires even when already on page 1 |
| R-010 LOW | `/mo` suffix now only rendered when `property_for === "rent"` |

### Files changed

- `Propdeal-client/src/components/home/Home.jsx` — PropertyCard rewritten; Home component bug-fixed
