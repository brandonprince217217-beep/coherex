 # Coherex  

A minimal Next.js (Pages Router) project built on iPhone using Runestone + iCloud Drive.

## Project Structure


## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm start` — Run production build

## Description

Coherex is a cognitive OS for mapping beliefs, contradictions, and meaning.  
This repo contains the minimal foundation for the public website.

---

## Mind Engine

The **Mind Engine** is a no-chat adaptive personalization layer that customizes the site experience based on on-site behavioral signals — without any chat UI.

### What it does

1. **Tracks behavioral signals** client-side: clicks, scroll depth milestones, mouse hesitation (zig-zag detection), and section dwell times.
2. **Infers a mind state** — one of `confused | comparing | ready_to_act | curious | neutral` — by sending signals to `/api/mind/infer` every 5 seconds (with deterministic local fallback when the endpoint is unavailable).
3. **Adapts the page** in real time by:
   - Setting `data-mind-state` on `<html>` for CSS hooks.
   - Updating copy in `[data-mind-role="headline"]` and `[data-mind-role="cta"]` elements.
   - Reordering child `[data-block-id]` elements inside a `[data-mind-role="blocks"]` container.

### Required data attributes

| Attribute | Where | Purpose |
|---|---|---|
| `data-mind-section="<name>"` | Section wrapper | Enables dwell / entry / exit tracking |
| `data-mind-role="headline"` | `<h1>` or headline element | Copy is swapped per mind state |
| `data-mind-role="cta"` | Button or link | CTA text is swapped per mind state |
| `data-mind-role="blocks"` | Container | Children with `data-block-id` are reordered |
| `data-block-id="<id>"` | Block child | Identifies block for reordering (e.g. `intro`, `features`, `pricing`) |
| `data-mind-label="<label>"` | Any clickable | Optional label for click tracking |

### Debug mode

Append `?mind_debug=1` to any URL to show a live badge in the bottom-right corner displaying the current mind state, confidence score, and inferred intents.

```
https://example.com/?mind_debug=1
```

### Tuning thresholds and copy

- **Copy** — edit `HEADLINE_COPY` and `CTA_COPY` maps in `lib/mind/engine.ts`.
- **Inference thresholds** — edit the `heuristicInfer` function in `pages/api/mind/infer.ts` (server) and `localInfer` in `lib/mind/engine.ts` (client fallback).
- **Block priority order** — edit `BLOCK_ORDER` in `lib/mind/engine.ts`.
- **CSS hooks** — edit `styles/mind.css` to adjust state-driven visual changes.
- **Polling interval** — change `INFER_INTERVAL_MS` in `lib/mind/engine.ts` (default: 5000 ms).
