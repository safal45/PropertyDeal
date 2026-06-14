# Deployment Guide — PropertyDeal

**Stack:** React (Vercel) + Flask (Render) + PostgreSQL (Render or Supabase)

---

## Architecture

```
Browser → Vercel (React SPA)
              ↓ REACT_APP_API_URL
         Render Web Service (Flask/Gunicorn)
              ↓ DATABASE_URL
         Render PostgreSQL (or Supabase free tier)
```

---

## Prerequisites

- GitHub repository with `flask_server/` and `Propdeal-client/` at the root
- [Vercel account](https://vercel.com) (free)
- [Render account](https://render.com) (free tier available)

---

## Step 1 — Deploy the Backend (Render)

### 1.1 Create a PostgreSQL database

1. Log in to Render → **New → PostgreSQL**
2. Name: `propertydeal-db`
3. Plan: **Free** (or Starter for persistence beyond 90 days)
4. Click **Create Database**
5. On the database page, copy the **Internal Database URL** (starts with `postgresql://`)

### 1.2 Create the Web Service

1. Render → **New → Web Service**
2. Connect your GitHub repo
3. Configure:

   | Field | Value |
   |---|---|
   | **Name** | `propertydeal-api` |
   | **Root Directory** | `flask_server` |
   | **Runtime** | Python 3 |
   | **Build Command** | `pip install -r requirements.txt` |
   | **Start Command** | `flask db upgrade && gunicorn app:app --bind 0.0.0.0:$PORT --workers 2 --timeout 120` |
   | **Plan** | Free (or Starter) |

   > The `Procfile` inside `flask_server/` provides this start command automatically if Render detects it.

### 1.3 Set environment variables on Render

Under **Environment → Environment Variables**, add:

| Key | Value |
|---|---|
| `JWT_SECRET_KEY` | Run `openssl rand -hex 32` locally and paste the result |
| `DATABASE_URL` | The Internal Database URL copied in Step 1.1 |
| `CORS_ORIGINS` | `https://your-app.vercel.app` (fill in after Step 2) |
| `FLASK_DEBUG` | `false` |

> **Note:** Set `CORS_ORIGINS` to a placeholder now. You will update it after deploying the frontend.

### 1.4 Deploy

Click **Create Web Service**. Render will:
1. Clone the repo, enter `flask_server/`
2. Run `pip install -r requirements.txt`
3. On first start: run `flask db upgrade` (creates all tables), then start gunicorn

Your API URL will be: `https://propertydeal-api.onrender.com`

### 1.5 Seed demo data (optional — first deploy only)

Open the Render **Shell** tab and run:

```bash
python3 - <<'EOF'
import requests, os

BASE = os.environ["RENDER_EXTERNAL_URL"]
# ... paste the seed script from flask_server/seed_demo.py if needed
EOF
```

Or trigger seeding via the API using the demo account credentials.

---

## Step 2 — Deploy the Frontend (Vercel)

### 2.1 Import the project

1. Log in to Vercel → **Add New → Project**
2. Import your GitHub repository
3. Set **Root Directory** to `Propdeal-client`
4. Framework preset: **Create React App** (auto-detected)

### 2.2 Set environment variables on Vercel

Under **Environment Variables**, add:

| Key | Value | Environments |
|---|---|---|
| `REACT_APP_API_URL` | `https://propertydeal-api.onrender.com` | Production, Preview |

### 2.3 Deploy

Click **Deploy**. Vercel uses `CI=false npm run build` (from `vercel.json`) to avoid treating ESLint warnings as errors.

Your frontend URL will be: `https://propertydeal-<hash>.vercel.app`

---

## Step 3 — Wire CORS

1. Go back to Render → your `propertydeal-api` web service
2. **Environment → Edit** `CORS_ORIGINS` → set to your Vercel URL:
   ```
   https://propertydeal-<hash>.vercel.app
   ```
3. Click **Save Changes** (triggers a redeploy)

---

## Step 4 — Smoke Test

Visit your Vercel URL and verify:

- [ ] Home page loads with listings (or "No listings yet" if DB is empty)
- [ ] "List your property" → register flow completes
- [ ] Published listing appears on Home
- [ ] Enquire button opens property detail with map
- [ ] Dashboard shows published listings
- [ ] 404 page shows on unknown routes

---

## Local development (after cloning)

**Backend:**
```bash
cd flask_server
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # fill in JWT_SECRET_KEY
flask db upgrade
python app.py
```

**Frontend:**
```bash
cd Propdeal-client
cp .env.example .env.local    # set REACT_APP_API_URL=http://127.0.0.1:5000
npm install
npm start
```

---

## Free Tier Limitations

| Service | Limitation |
|---|---|
| Render Web Service (free) | Spins down after 15 min inactivity; ~30s cold start |
| Render PostgreSQL (free) | 90-day trial; database deleted after trial ends |
| Vercel (Hobby) | 100 GB bandwidth/month; no commercial use |

**Alternatives for persistent free PostgreSQL:**
- [Supabase](https://supabase.com) — 500 MB free, no expiry
- [Neon](https://neon.tech) — serverless Postgres, generous free tier

To use Supabase, replace `DATABASE_URL` on Render with the Supabase connection string (use the **Transaction** pooler URL for compatibility with gunicorn multi-workers).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| API returns CORS error | `CORS_ORIGINS` doesn't include your Vercel URL | Update env var on Render, redeploy |
| `JWT_SECRET_KEY is required` on start | Env var not set on Render | Add it in Render → Environment |
| `postgres://` error in logs | SQLAlchemy scheme mismatch | Already fixed in `app.py`; ensure latest code is deployed |
| White screen on Vercel refresh | SPA routing not configured | `vercel.json` rewrites handle this; ensure it's present in `Propdeal-client/` |
| 500 on first request after deploy | Migrations not run | Check Render logs; the start command runs `flask db upgrade` automatically |
