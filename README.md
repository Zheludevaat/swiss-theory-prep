# Swiss Theory Prep

Personal, offline-first PWA for the Swiss Category B theory exam
(Theorieprüfung), taken in English. Built per
[`DESIGN_v3.md`](./DESIGN_v3.md) — every feature ties back to a named
psychological mechanism (spaced repetition, desirable difficulty,
interleaving, transfer-appropriate processing, etc.).

## Status

Phase 1 MVP. Ships with ~20 seed items and 15 rules across all categories so
the app is usable on day one. Authoring the full ~300-item catalog happens in
a parallel `swiss-theory-content` repo; replace `src/content/items.ts` +
`src/content/rules.ts` (or load from a JSON bundle) as you grow it.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

The first time you run, your catalog will show as "Not ready" on Today.
Hit **Start review** — a handful of new items will appear and the FSRS
scheduler will begin building state.

## Build

```bash
npm run typecheck
npm test
npm run build        # emits dist/ (served from /swiss-theory-prep/)
```

Override the base path for non-GitHub-Pages hosting:

```bash
VITE_BASE=/ npm run build
```

## Deploy

`main` pushes deploy automatically via `.github/workflows/deploy.yml`.

Settings → Pages in your GitHub repo → set Source to "GitHub Actions". That's
it. No secrets, no environment variables, no backend.

Once deployed:

1. Open the site in Safari on iPhone.
2. Share → Add to Home Screen.
3. The app now runs offline.

## Project layout

```
src/
  App.tsx                 Route tree
  main.tsx                Entry + SW registration
  components/
    Layout.tsx            Shell + bottom tab bar
    Card.tsx              Core learning unit (three options, Submit, rationale)
  routes/
    Today.tsx             §10.1 — readiness, due count, last session, streak
    Review.tsx            §7 — normal / blast5 / teach review loop
    Mock.tsx              §8 — 45-minute timed mock with exact ASA scoring
    Library.tsx           §10.4 — rules + signs browser
    Stats.tsx             §10.5 — daily bars, category accuracy, calibration
    Settings.tsx          §10.6 — target, retention, backup, reset
    Teach.tsx             §10.7 — worked examples + 3 drill items
  content/
    schema.ts             Zod schemas + category weights
    rules.ts              Hand-authored seed rules
    items.ts              Hand-authored seed items
    bundle.ts             Runtime validation + lookup maps
  db/
    types.ts              User-state types (MemoryState, ReviewEvent, …)
    index.ts              IndexedDB wrapper (idb), 6 object stores
  scheduler/
    fsrs.ts               ts-fsrs wrapper, MemoryState <-> Card mapping
    grading.ts            Inferred grading from correctness + latency
    pickNext.ts           pickNext, interleaving, new-item budget, triage
  exam/
    scoring.ts            scoreQuestion, scoreExam (pass: ≥135 pts, ≤15 pen)
    compose.ts            Category-weighted draw with 48h cool-down
  store/
    index.ts              Zustand store (mirror of db state + session)
  lib/                    Small utilities (uuid, time, streak, readiness)
scripts/
  validateContent.ts      Build-time content integrity checks
tests/
  scoring.test.ts         Exact-scoring tests (safety-critical)
  grading.test.ts         Inferred-grading tests
  scheduler.test.ts       pickNext / triage / session composition
```

## Content authoring

Each item must have exactly one or two correct options (ASA format). Every
item links to at least one rule; rules carry an `examWeight ∈ [0,1]` that
drives `pickNext` priority and triage ranking.

When adding items:

1. Edit `src/content/rules.ts` and/or `src/content/items.ts`.
2. `npm run validate-content` — checks rule references and asset paths.
3. Bump `contentVersion` in `src/content/bundle.ts` (currently derived from
   the seed bundle; once you load from JSON, bump that file instead).

For signs, drop SVGs into `public/signs/` named by official code (e.g.
`2.30.svg` = Stop). Reference via `imageAssetId: "2.30.svg"` on items.

## Philosophy (abridged — full version in DESIGN_v3.md §2)

- **Spacing effect.** FSRS with per-item stability/difficulty.
- **Testing effect.** Every card forces Submit before truth is revealed.
- **Desirable difficulty.** `request_retention = 0.90` — also the exam pass
  threshold.
- **Transfer-appropriate processing.** The card matches the real exam format
  from day one: three options, one or two correct, multi-select.
- **Interleaving.** The scheduler refuses two consecutive items from the
  same rule once past acquisition.
- **Worked examples.** Teach mode presents the rule + two worked examples
  before any drill items.
- **Growth-mindset framing.** Grades are inferred from correctness + latency
  — the user never self-rates.
- **Backlog triage.** When due count exceeds 3× daily capacity, the app
  surfaces the 25 that matter most and silently defers the rest.
- **No dark patterns.** No notifications, no streak manipulation, no gems,
  no lives.

## Attribution

Swiss sign SVGs (when you add them) come from Wikimedia Commons under their
respective permissive licences; list specific sources in a sidecar
`public/signs/ATTRIBUTION.md`.

## Licence

Personal project. Do what you want, don't sue anyone. The underlying ASA
question catalog is licensed content — this app does not reproduce it.
