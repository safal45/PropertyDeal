# Database — PropertyDeal

_Last updated: 2026-06-13_

---

## V1 — Current State (SQLite, single table)

### Engine

SQLite — file at `flask_server/instance/data.db`  
ORM: Flask-SQLAlchemy

---

### Table: `user`

> **Design note:** This table conflates two concerns — the _contact_ (who is listing) and the _property_ (what is being listed). This is a known V1 shortcut; see the proposed V2 schema below.

| Column | SQLAlchemy Type | Notes |
|---|---|---|
| `id` | `Integer` PK, auto-increment | |
| `role` | `String(80)` | `"owner"` or `"builder"` |
| `name` | `String(80)` | Lister's full name |
| `country` | `String(80)` | Currently only `"India"` |
| `countrycode` | `String(80)` | E.g. `"+91"` |
| `phone` | `String(20)` | |
| `email` | `String(120)` | |
| `propertyfor` | `String(20)` | `"Rent"` or `"Sale"` |
| `propertytype` | `String(80)` | `"Residential"`, `"Commercial"`, `"Land/Plot"` |
| `propertysubtype` | `String(80)` | E.g. `"Flat/Apartment"`, `"Office Space"` |
| `propertyage` | `String(80)` | E.g. `"1-3 Years"` |
| `bhktype` | `String(20)` | `"1 BHK"`, `"2 BHK"`, etc. |
| `building` | `String(80)` | Building/society name |
| `locality` | `String(80)` | Area/locality |
| `landmark` | `String(80)` | Street / landmark |
| `city` | `String(120)` | City, state |
| `ispetsallowed` | `String(10)` | `"Yes"` / `"No"` |
| `watersupply` | `String(80)` | `"Municipal Corporation (BMC)"`, `"Borewell"`, `"Both"` |
| `electricity` | `String(80)` | `"Rare/No Powercut"` / `"Frequent Powercut"` |
| `reservedparking` | `String(10)` | `"Yes"` / `"No"` |
| `cctv` | `String(10)` | `"Yes"` / `"No"` |
| `maintenance` | `String(120)` | `"Included in Rent"` / `"Extra Maintenance"` |
| `rent` | `String(120)` | Stored as string — no validation |
| `security` | `String(120)` | Security deposit amount |
| `maintenancetype` | `String(120)` | `"Monthly"` / `"Annually"` |
| `maintenanceprice` | `String(120)` | Stored as string |

---

## Known Issues in V1 Schema

| # | Issue | Impact |
|---|---|---|
| 1 | User identity + property data in one table | Cannot support one user owning multiple properties |
| 2 | Boolean-like fields stored as `String` (`"Yes"`/`"No"`) | No DB-level constraint, fragile comparisons |
| 3 | Money fields (`rent`, `security`, `maintenanceprice`) stored as `String` | Cannot sort, filter, or aggregate by price |
| 4 | No timestamps (`created_at`, `updated_at`) | Cannot sort listings by recency |
| 5 | No soft-delete / status field | Cannot unpublish a listing |
| 6 | No image storage | Property images tab is a UI placeholder only |
| 7 | No indexes | Full-table scan on every `/users` call |

---

## Proposed V2 Schema (for planning)

> To be formalised when V2 work begins. Do not implement until architecture decision is recorded in `decisions.md`.

```
users
  id          UUID PK
  name        VARCHAR(100)
  email       VARCHAR(150) UNIQUE
  phone       VARCHAR(20)
  country     VARCHAR(80)
  country_code VARCHAR(10)
  role        ENUM('owner', 'builder', 'agent')
  created_at  TIMESTAMP
  updated_at  TIMESTAMP

properties
  id              UUID PK
  user_id         UUID FK → users.id
  status          ENUM('draft', 'published', 'unpublished')
  property_for    ENUM('Rent', 'Sale')
  property_type   ENUM('Residential', 'Commercial', 'Land/Plot')
  property_subtype VARCHAR(100)
  property_age    VARCHAR(50)
  bhk_type        VARCHAR(20)
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

property_locations
  id          UUID PK
  property_id UUID FK → properties.id
  building    VARCHAR(150)
  locality    VARCHAR(150)
  landmark    VARCHAR(150)
  city        VARCHAR(150)
  lat         DECIMAL(9,6)
  lng         DECIMAL(9,6)

property_features
  id                UUID PK
  property_id       UUID FK → properties.id
  is_pets_allowed   BOOLEAN
  water_supply      VARCHAR(80)
  electricity       VARCHAR(80)
  reserved_parking  BOOLEAN
  cctv              BOOLEAN

property_pricing
  id                 UUID PK
  property_id        UUID FK → properties.id
  rent               DECIMAL(12,2)
  security_deposit   DECIMAL(12,2)
  maintenance        ENUM('Included in Rent', 'Extra')
  maintenance_price  DECIMAL(12,2)
  maintenance_type   ENUM('Monthly', 'Annually')

property_images
  id           UUID PK
  property_id  UUID FK → properties.id
  url          VARCHAR(500)
  order        INTEGER
  created_at   TIMESTAMP
```
