# Coherex

**Coherex** is a  cognitive OS for mapping beliefs, contradictions, and meaning. This repository contains the public-facing Next.js website with AI-powered search, streaming chat, and cognitive analysis — all running on GPT-4o-mini.

---

## Table of Contents

- [Quick Start (from zero to running)](#quick-start-from-zero-to-running)
- [Getting your API keys](#getting-your-api-keys)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Quick Start (from zero to running)

Follow these steps **in order**. The whole thing takes about 5 minutes.

### Step 1 — Install Node.js

If you already have Node 18 or newer, skip this.

1. Go to **https://nodejs.org**
2. Download the **LTS** version (green button)
3. Run the installer — click Next through all the defaults
4. Open a terminal and confirm it worked:
   ```bash
   node --version   # should print v18.x or higher
   npm --version    # should print 9.x or higher
   ```

### Step 2 — Clone the repository

```bash
git clone https://github.com/brandonprince217217-beep/coherex.git
cd coherex
```

> **No git?** Download it free at https://git-scm.com, install it, then run the commands above.

### Step 3 — Install dependencies

```bash
npm install
```

This downloads all packages into a `node_modules` folder. It only needs to run once (or again after pulling new changes).

### Step 4 — Get your OpenAI API key *(required)*

The AI features (search summaries, chat, analysis) all require an OpenAI key.

1. Go to **https://platform.openai.com/api-keys**
2. Sign in or create a free account
3. Click **"Create new secret key"**
4. Give it a name like `coherex-local`, then click **Create**
5. **Copy the key immediately** — it starts with `sk-` and you can't see it again after closing the dialog

> **Cost:** The site uses `gpt-4o-mini` which is very cheap (~$0.15 per 1M input tokens). Normal use costs pennies per day.

### Step 5 — Get your Supabase keys *(needed for database features)*

Supabase provides the database behind user data and saved sessions.

1. Go to **https://supabase.com** and sign in (free tier is fine)
2. Click **"New project"** (green button, top right of the dashboard)
3. Fill in a name, pick a region, set a database password, click **Create project**
4. Once the project loads, click **Settings** (gear icon in the left sidebar)
5. Click **API** under Settings
6. Copy two values from that page:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / public key** — a long string starting with `eyJ...`

### Step 6 — Create your local environment file

```bash
cp .env.example .env.local
```

Now open `.env.local` in any text editor and replace the placeholder values:

```
OPENAI_API_KEY=sk-...your-key-here...

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

> **Important:** `.env.local` is listed in `.gitignore` — it will never be committed. Never paste real keys into `.env.example` or anywhere else that gets committed.

### Step 7 — Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser. You should see the Coherex homepage. The AI search and chat features are live once your keys are set.

---

## Getting your API keys

A quick reference if you already have accounts:

| Key | Where to find it |
|---|---|
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys → Create new secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Settings → API → anon / public |

---

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server (run `build` first) |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once (used in CI) |

---

## Environment Variables

| Variable | Required | Where to get it |
|---|---|---|
| `OPENAI_API_KEY` | **Yes** — site won't start without it | https://platform.openai.com/api-keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes for database features | Supabase Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes for database features | Supabase Settings → API |

> **Scope note:** `OPENAI_API_KEY` is server-side only (safe — never sent to the browser). Variables starting with `NEXT_PUBLIC_` are also embedded in the client bundle, so they must only ever contain non-secret public values (the Supabase anon key is intentionally public).

---

## Deployment

### Vercel (easiest — recommended)

1. Push this repo to GitHub (it's already there)
2. Go to **https://vercel.com**, sign in with GitHub, and click **"Add New Project"**
3. Import the `coherex` repository
4. Under **Environment Variables**, add all three keys from Step 4–5 above
5. Click **Deploy** — Vercel builds and hosts it automatically

Every `git push` to `main` will auto-redeploy.

### Other platforms (Railway, Render, Fly.io, VPS…)

```bash
# Build
npm run build

# Start
npm start
```

Set the three environment variables in your hosting dashboard before starting. The app listens on `PORT` (default 3000).

---

## Project Structure

```
coherex/
├── pages/
│   ├── index.jsx        # Homepage with AI search bar
│   ├── search.tsx       # Search results + AI summary
│   ├── chat.tsx         # Streaming AI chat
│   ├── chat/[id].tsx    # Cognitive engine result page
│   ├── about/           # About page
│   ├── pricing.jsx      # Pricing page
│   ├── demo.jsx         # Interactive demo
│   └── api/             # Server-side AI routes
│       ├── search.ts    # AI search (GPT-4o-mini + ranked results)
│       ├── stream.ts    # Streaming chat responses
│       ├── engine.ts    # Cognitive engine
│       ├── analyze.ts   # Message analysis
│       ├── cognitive.ts # Full cognitive breakdown
│       └── title.ts     # Auto title generation
├── components/          # Reusable UI components
├── lib/
│   ├── openai.ts        # OpenAI client (server-only)
│   ├── supabase.ts      # Supabase client
│   └── env.ts           # Startup env validation
├── styles/
│   └── globals.css      # Global styles
├── public/              # Static assets
└── __tests__/           # Tests
```

