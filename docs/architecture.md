# Architecture — PropertyDeal

_Last updated: 2026-06-13 (synced)_

---

## Overview

PropertyDeal is a property-listing platform that lets owners or builders post rental/sale listings in a guided multi-step flow. Version 1 targets the India market (Mumbai focus visible in UI copy).

---

## System Topology

```
┌─────────────────────────────────────┐
│  Browser (React SPA)                │
│  Propdeal-client/                   │
│  Port: 3000 (CRA dev server)        │
└──────────────┬──────────────────────┘
               │ HTTP / Axios
               │ (CORS enabled, no auth token yet)
┌──────────────▼──────────────────────┐
│  Flask REST API                     │
│  flask_server/app.py                │
│  Port: 5000                         │
└──────────────┬──────────────────────┘
               │ SQLAlchemy ORM
┌──────────────▼──────────────────────┐
│  SQLite                             │
│  flask_server/instance/data.db      │
└─────────────────────────────────────┘
```

---

## Frontend

| Concern | Choice |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | Tailwind CSS v3 |
| HTTP client | Axios |
| Map | react-leaflet v4 + Leaflet v1.9 / Nominatim geocoding |
| Bundler | Create React App (react-scripts 5) |

### Page / Route Map

| Route | Component | Purpose |
|---|---|---|
| `/` | `Home` | Step 1 — Capture contact info (role, name, country, phone, email) |
| `/more-detail` | `About` | Steps 2-5 — Tabbed property details form |
| `/thanks` | `Thanks` | Confirmation screen after listing submission |
| `/preview` | `Preview` | Read-only listing preview (fetches all users) |

### Multi-step Form Flow (About.jsx)

```
Tab 1: PROPERTY DETAILS  →  [auth overlay if no token] → POST /properties → PATCH /properties/<id>/details
Tab 2: LOCATION DETAILS  →  PATCH /properties/<id>/location  (lat/lng from Nominatim)
Tab 3: FEATURES          →  PATCH /properties/<id>/features
Tab 4: PRICE DETAILS     →  PATCH /properties/<id>/pricing
Tab 5: PUBLISH           →  PATCH /properties/<id>/publish → navigate /thanks
```

---

## Backend

| Concern | Choice |
|---|---|
| Framework | Flask |
| ORM | Flask-SQLAlchemy |
| CORS | Flask-CORS (wildcard — dev only) |
| Database | SQLite (file: `instance/data.db`) |
| Auth | None (V1) |

### API Endpoints — V1 (legacy, kept until frontend migrated)

| Method | Path | Handler | Description |
|---|---|---|---|
| POST | `/submit` | `submit()` | Create a new user+property record |
| PUT | `/update/<id>` | `update_user()` | Update property details (type, subtype, age, BHK) |
| PUT | `/update2/<id>` | `update_user2()` | Update location fields |
| PUT | `/update3/<id>` | `update_user3()` | Update features/amenities |
| PUT | `/update4/<id>` | `update_user4()` | Update price fields |
| GET | `/users` | `get_users()` | Fetch all records |

### API Endpoints — V2

All V2 property routes require `Authorization: Bearer <access_token>`. Property mutation routes additionally enforce ownership (`property.user_id == jwt.identity`).

| Method | Path | Auth | Handler | Description |
|---|---|---|---|---|
| POST | `/auth/register` | — | `register()` | Create account; returns `access_token` |
| POST | `/auth/login` | — | `login()` | Verify credentials; returns `access_token` |
| POST | `/properties` | JWT | `create_property()` | Create draft property; returns `property_id` + `status` |
| GET | `/properties` | — | `list_properties()` | Browse published listings; paginated (`?page&limit`); future filters: city, property_type, property_for, min_rent, max_rent |
| PATCH | `/properties/<id>/details` | JWT + owner | `update_property_details()` | Update property_for, type, subtype, age, bhk_type |
| PATCH | `/properties/<id>/location` | JWT + owner | `update_property_location()` | Upsert location (building, locality, landmark, city, lat, lng) |
| PATCH | `/properties/<id>/features` | JWT + owner | `update_property_features()` | Upsert features (pets, parking, cctv, water, electricity) |
| PATCH | `/properties/<id>/pricing` | JWT + owner | `update_property_pricing()` | Upsert pricing (rent, security_deposit, maintenance) |
| PATCH | `/properties/<id>/publish` | JWT + owner | `publish_property()` | Set status → published; idempotent |

---

## Agent System

All development is governed by a 12-agent hierarchy rooted at `.claude/agents/`.

```
orchestrator-agent          ← top-level coordinator
├── architecture-agent      ← ADRs, overengineering prevention
├── frontend-agent          ← React, Tailwind, routing, state
├── backend-agent           ← Flask routes, middleware, business logic
├── database-agent          ← Schema, ORM, migrations, queries
├── api-contract-agent      ← Endpoint design, contracts, versioning
├── auth-agent              ← Authentication, authorisation (V2)
├── testing-agent           ← Tests, coverage, strategy
├── security-agent          ← Vulnerabilities, secure defaults
├── devops-agent            ← Deployment, env config, CI/CD
├── performance-agent       ← Bundle size, latency, query efficiency
└── documentation-agent     ← docs/* maintenance, ADR records
```

Each agent declares its scope, what it must not touch, and its workflow in `AGENT.md`.  
All agents read `CLAUDE.md` and `docs/*` before acting.

## Skill Library

Reusable skills live in `.claude/commands/` (invocable as `/skill-name`):

| Skill | Purpose |
|---|---|
| `create-agent` | Scaffold a new agent under `.claude/agents/` |
| `update-docs` | Sync `docs/*` with current project state |
| `create-feature` | Full feature scaffold (component + endpoint + model + test) |
| `create-api` | Flask endpoint with validation and contract doc |
| `create-model` | SQLAlchemy model with types, timestamps, relationships |
| `create-component` | React component following project conventions |
| `create-test` | Tests for a given feature, file, or endpoint |
| `review-code` | Code review against CLAUDE.md standards |
| `create-migration` | Alembic migration file for a schema change |
| `engineering-documentation` | Update all docs after architectural decisions |

---

## Known Architectural Issues (V1)

1. **Hardcoded user ID** — `About.jsx:581` uses `const userId = 1` — every session overwrites the same record.
2. **No authentication** — any client can read or mutate any record.
3. **Denormalised schema** — user identity and property data are one flat table (`User`).
4. **No image upload** — `PropImages` tab is a placeholder only.
5. **CORS wildcard** — must be locked down before any deployment.
6. **SQLite** — not suitable for concurrent writes in production.
