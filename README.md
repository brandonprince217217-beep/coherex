 # Coherex  

A minimal Next.js (Pages Router) project built on iPhone using Runestone + iCloud Drive.

## Project Structure

```
pages/
  index.jsx         — Home page with mood search bar
  search.tsx        — Search results page (structured answer cards + citations)
  api/
    search.ts       — Backend: web retrieval → AI synthesis → structured JSON
components/
  InputBar.tsx      — Search input with rotating placeholder prompts
lib/
  openai.ts         — OpenAI client
  webSearch.ts      — Brave Search API web retrieval abstraction
styles/
  globals.css       — Dark-first global styles (search, loading, cards)
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Run production build

## Description

Coherex is a cognitive OS for mapping beliefs, contradictions, and meaning.  
The search experience lets users type feelings/thoughts/mood queries and receive
high-quality, structured answers grounded in current web sources.

---

## Setup & Configuration

### Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ Yes | OpenAI API key for answer synthesis |
| `BRAVE_SEARCH_API_KEY` | Recommended | Brave Web Search subscription token — enables live web retrieval. Without it the AI still responds but without external sources. Get one at https://brave.com/search/api/ |

```bash
OPENAI_API_KEY=sk-...
BRAVE_SEARCH_API_KEY=BSA...
```

---

## Rotating prompts

Rotating placeholder prompts are defined in `components/InputBar.tsx` as the
`ROTATING_PROMPTS` array.  Edit that array to change the prompts:

```ts
const ROTATING_PROMPTS = [
  "Why do I feel stuck right now?",
  "Why am I anxious about the future?",
  // add more here…
];
```

Prompts rotate every **3.5 seconds** (controlled by `ROTATION_INTERVAL_MS` in the
same file) and **pause when the input is focused** so they don't distract users
who are typing.

---

## Citation rendering

1. The backend (`pages/api/search.ts`) calls `lib/webSearch.ts` to retrieve up
   to 5 live web results from Brave Search.
2. The results are passed as `SOURCE 1 … SOURCE N` context to the OpenAI model,
   which is instructed to add inline citations like `[1]`, `[2]`.
3. The API response includes a `results` array:
   ```json
   {
     "results": [
       { "title": "...", "url": "https://...", "snippet": "..." }
     ]
   }
   ```
4. The frontend (`pages/search.tsx`) renders these as a numbered `<ol>` with
   clickable links.  Each list number corresponds to the `[N]` citation in the
   answer text.

---

## Confidence / fallback behaviour

- **High** (≥ 3 sources): answer shown normally.
- **Medium** (1–2 sources): a soft informational notice is shown.
- **Low** (0 sources — e.g. no `BRAVE_SEARCH_API_KEY`): a yellow warning banner
  tells the user the answer is best-effort without external sources.

