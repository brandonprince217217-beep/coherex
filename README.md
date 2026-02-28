# Coherex

**Coherex** is a cognitive OS for mapping beliefs, contradictions, and meaning. This repository contains the public-facing Next.js website with an AI-powered site search, chat, and cognitive analysis features.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Available Commands](#available-commands)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Prerequisites

- **Node.js** ≥ 18 (20 LTS recommended)
- **npm** ≥ 9

---

## Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/brandonprince217217-beep/coherex.git
cd coherex

# 2. Install dependencies
npm install

# 3. Create your local env file from the example
cp .env.example .env.local
#    Then open .env.local and fill in your real values (see Environment Variables below)

# 4. Start the development server
npm run dev
#    → http://localhost:3000
```

---

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build the production bundle |
| `npm start` | Start the production server (requires `build` first) |
| `npm run lint` | Run ESLint (Next.js rules) |
| `npm run typecheck` | Run TypeScript type checking |
| `npm test` | Run tests in watch mode |
| `npm run test:ci` | Run tests once (for CI) |

---

## Environment Variables

Copy `.env.example` to `.env.local` and populate the values:

```
# OpenAI — Required for search and AI features (server-side only)
OPENAI_API_KEY=sk-...

# Supabase — Required for database features
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Important:** Never commit `.env.local` or any file containing real secrets. The `.gitignore` is configured to exclude all `.env*` files (except `.env.example`).

| Variable | Required | Scope | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | Yes | Server-only | OpenAI API key for AI features |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client + Server | Supabase anonymous key |

---

## Deployment

The site is a standard Next.js app and can be deployed to any platform that supports Node.js:

- **Vercel** (recommended): Connect the GitHub repo and set environment variables in the Vercel dashboard.
- **Other platforms**: Run `npm run build` and then `npm start`. Ensure all environment variables are set in your hosting environment.

**Required env vars for production:** `OPENAI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Project Structure

```
coherex/
├── pages/          # Next.js pages and API routes
│   ├── api/        # Server-side API routes (search, chat, etc.)
│   └── search.tsx  # Search results page
├── components/     # Reusable React components
├── lib/            # Shared utilities (openai, supabase, env validation)
├── styles/         # Global CSS
├── public/         # Static assets
└── __tests__/      # Test files
```

