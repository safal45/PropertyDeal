# Roadmap — PropertyDeal

_Last updated: 2026-06-14_

---

## Version 1 — Prototype (current)

**Goal:** End-to-end listing submission flow working locally.

| # | Feature | Status |
|---|---|---|
| 1.1 | Multi-step property listing form (5 tabs) | Done |
| 1.2 | Contact capture (Step 1 — Home page) | Done |
| 1.3 | Property details tab (type, subtype, age, BHK) | Done |
| 1.4 | Location tab with map preview (Leaflet + Nominatim) | Done |
| 1.5 | Features & Amenities tab | Done |
| 1.6 | Price details tab | Done |
| 1.7 | Property images tab UI | Done (placeholder — no upload) |
| 1.8 | Flask REST API (5 endpoints) | Done |
| 1.9 | SQLite persistence | Done |
| 1.10 | Listing preview page | Done (basic) |
| 1.11 | Thank-you / confirmation screen | Done |

**V1 known gaps (must fix before any real launch):**
- Image upload not implemented
- Hardcoded `userId = 1` — sessions collide
- No authentication
- CORS is wildcard
- Money fields stored as strings

---

## Version 2 — Foundation (planned)

**Goal:** Multi-user, authenticated, production-ready data model.

| # | Feature | Priority |
|---|---|---|
| 2.1 | Normalise DB schema (separate users / properties / pricing / images tables) | Critical |
| 2.2 | User authentication (email/phone OTP or JWT) | Critical |
| 2.3 | Session-aware listing flow (user creates a draft property, owns it) | Critical |
| 2.4 | Real image upload (S3 or Cloudflare R2) | High |
| 2.5 | Property search / filter / browse page | High |
| 2.6 | Individual property detail page | **Done** |
| 2.7 | Migrate from SQLite → PostgreSQL | High |
| 2.8 | Add Alembic migrations | High |
| 2.9 | Replace Nominatim with production geocoder | Medium |
| 2.10 | Replace CRA with Vite | Medium |
| 2.11 | Restrict CORS to known origins | High |
| 2.12 | Environment-based config (dev/prod API URLs) | High |

---

## Version 3 — Product (future)

| # | Feature |
|---|---|
| 3.1 | Buyer/renter facing search with map view |
| 3.2 | Saved listings / wishlist |
| 3.3 | Contact owner (masked phone / in-app message) |
| 3.4 | Listing analytics (views, contacts) for listers |
| 3.5 | Admin dashboard |
| 3.6 | Verification / trust signals for listings |
| 3.7 | Multi-city / multi-country expansion |
