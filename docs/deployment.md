# Deployment Guide — PropertyDeal

**Stack:** React (Vercel) + Flask (Render) + PostgreSQL (Supabase free tier)

---

## Architecture

```
Browser → Vercel (React SPA)
              ↓ REACT_APP_API_URL
         Render Web Service (Flask / Gunicorn / Python 3.11)
              ↓ DATABASE_URL
         Supabase PostgreSQL (free, no expiry)
```

---

## Prerequisites

- GitHub repository pushed (both `flask_server/` and `Propdeal-client/` at the root)
- [Vercel account](https://vercel.com) — free Hobby plan
- [Render account](https://render.com) — free / Starter plan
- [Supabase account](https://supabase.com) — free tier (recommended for database)

---

## Step 1 — Create the PostgreSQL database (Supabase)

Render's free PostgreSQL plan has a 90-day expiry. Supabase gives a permanent free database.

1. Log in to Supabase → **New project**
2. Name: `propertydeal`, choose a region close to your Render service region
3. Set a strong database password and save it
4. Once the project is ready: **Project Settings → Database → Connection string → URI**
5. Copy the **Connection string** (format: `postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres`)

> Use the **direct connection** URI (not the pooler), since Flask-Migrate's `db upgrade` requires a persistent connection.

---

## Step 2 — Deploy the Backend (Render)

### Option A — Blueprint (recommended, one-click)

`render.yaml` at the repo root configures everything automatically.

1. Render dashboard → **New → Blueprint**
2. Connect your GitHub repository
3. Render reads `render.yaml` and creates `propertydeal-api`
4. After creation, go to **Environment** and set the two `sync: false` vars:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Connection string from Supabase Step 1 |
   | `CORS_ORIGINS` | Your Vercel URL (set after Step 3, use placeholder for now) |

5. Click **Save Changes** → service redeploys with full config

### Option B — Manual (if not using Blueprint)

1. Render → **New → Web Service** → connect repo
2. **Critical: set these exact values**

   | Field | Value |
   |---|---|
   | **Root Directory** | `flask_server` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `flask db upgrade && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
   | **Plan** | Starter (or Free) |

3. **Environment Variables:**

   | Key | Value |
   |---|---|
   | `PYTHON_VERSION` | `3.11.9` |
   | `JWT_SECRET_KEY` | Run `openssl rand -hex 32` locally and paste result |
   | `DATABASE_URL` | Supabase connection string from Step 1 |
   | `CORS_ORIGINS` | Placeholder for now; update after Vercel deploy |
   | `FLASK_DEBUG` | `false` |

> **Why `Root Directory: flask_server` is mandatory:** Without it, Render scans the repo root (no Python files there), defaults to Poetry, finds no `pyproject.toml`, and fails with `bash: line 1: Retrieving: command not found`.

Your API URL will be: `https://propertydeal-api.onrender.com`

---

## Step 3 — Deploy the Frontend (Vercel)

1. Vercel → **Add New → Project** → import your GitHub repo
2. Set **Root Directory** to `Propdeal-client`
3. Framework preset: **Create React App** (auto-detected)
4. **Environment Variables:**

   | Key | Value | Environments |
   |---|---|---|
   | `REACT_APP_API_URL` | `https://propertydeal-api.onrender.com` | Production, Preview |

5. Click **Deploy**

Your frontend URL will be: `https://propertydeal-xyz.vercel.app`

> `vercel.json` inside `Propdeal-client/` handles SPA routing (all unknown paths → `index.html`) and sets `CI=false` so ESLint warnings don't fail the build.

---

## Step 4 — Wire CORS (backend → frontend)

1. Render → `propertydeal-api` → **Environment**
2. Edit `CORS_ORIGINS` → set to your Vercel URL (no trailing slash):
   ```
   https://propertydeal-xyz.vercel.app
   ```
3. **Save Changes** → triggers automatic redeploy

---

## Step 5 — Smoke Test

Visit your Vercel URL:

- [ ] Home page loads with listings (or "No listings yet")
- [ ] "List your property" → register → form flow completes
- [ ] Published listing appears on Home page
- [ ] Enquire → property detail page with map renders
- [ ] Dashboard shows listings
- [ ] Unknown route → 404 page (not blank)
- [ ] Browser console: 0 errors

---

## Exact Render Settings (reference card)

```
Root Directory  : flask_server
Build Command   : pip install -r requirements.txt
Start Command   : flask db upgrade && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120
Python Version  : 3.11.9   (set via PYTHON_VERSION env var OR flask_server/runtime.txt)
```

---

## Local Development (after cloning)

**Backend:**
```bash
cd flask_server
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env       # fill in JWT_SECRET_KEY (required)
flask db upgrade
python app.py
```

**Frontend:**
```bash
cd Propdeal-client
cp .env.example .env.local  # set REACT_APP_API_URL=http://127.0.0.1:5000
npm install
npm start
```

---

## Troubleshooting

| Symptom | Root cause | Fix |
|---|---|---|
| `bash: line 1: Retrieving: command not found` | Root Directory not set to `flask_server`; Render defaulted to Poetry | Set Root Directory = `flask_server` in Render dashboard |
| Python 3.14 installed (packages fail) | No Python version pinned | Set `PYTHON_VERSION=3.11.9` env var on Render; `runtime.txt` already pins this |
| `JWT_SECRET_KEY is required` on start | Env var missing | Add it in Render → Environment |
| CORS errors in browser | `CORS_ORIGINS` doesn't include Vercel URL | Update env var on Render, Save Changes |
| `postgres://` driver error | SQLAlchemy 2.x requires `postgresql://` scheme | Already patched in `app.py` |
| White screen on page refresh (Vercel) | SPA client-side routing broken | `vercel.json` rewrites fix this; verify file exists in `Propdeal-client/` |
| 500 on first request | Migrations not run | Start command runs `flask db upgrade` automatically; check Render logs |
| Database resets on redeploy | SQLite on Render ephemeral filesystem | Use Supabase/Render PostgreSQL — never use SQLite in production |
