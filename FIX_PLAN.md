# Swiss Theory Prep — Fix Plan

Ordered, shippable chunks to take the app from "Phase 1 skeleton" to a real Swiss Cat. B exam-prep tool. Each chunk is independently deployable — at no point does the app stop working.

Gap IDs (e.g. `A-3`, `C-1`) reference the audit produced 2026-04-18. Chunks group gaps by file proximity and shared risk profile, not strictly by audit category.

## Strategy

Three foundations, then everything else can run in parallel:

1. **Chunk 1 (Honest UI)** — fix the trust-breakers. Without this, every later UX claim is suspect.
2. **Chunk 2 (Engine completeness)** — finish the scheduler features the design promises. Content needs an honest engine to land in.
3. **Chunk 3 (Content rails)** — schema + validator + CI gate. Without this, authoring 300 items will produce 300 inconsistencies.

After 1–3 ship, **content (4–6)** and **product polish (7–11)** are independent tracks. Pick whichever is more important for your next exam date.

If you only have one weekend, do **Chunks 1 + 2 + 7**. The app becomes honest, the scheduler is spec-compliant, and the mock exam stops feeling like a sketch. That alone makes the existing 20 items genuinely useful for engine debugging while real content lands.

---

## Chunk 1 — Honest UI (~1–2 h)

Stop the app from lying to the user. All bug fixes; no new features.

**Files:** `src/routes/Today.tsx`, `src/routes/Review.tsx`, `src/routes/Mock.tsx`, `src/components/Card.tsx`, `src/content/items.ts`

**Tasks**

1. (`C-1`) `Today.tsx` — pass `triage.keep` into `pickNext` via `restrictTo`. Today screen must actually serve from the triaged subset, not the full overdue pool.
2. (`C-6`) `Card.tsx` — rename "Stop" to "Skip" if it's meant to advance, OR make it actually end the session via `finishSession()` and navigate home. The current label/behavior mismatch is the worst kind of bug.
3. (`C-3`) `Mock.tsx` — replace `buildFinalIfMissing` with real handling. On the last card, `onContinue` must guarantee `onSubmit` fired (or push a synthetic "no answer" event with `userTicks: [false,false,false]` so scoring is honest).
4. (`C-5`) `Review.tsx` — fix the compose-queue effect: either add `mode`/`ruleId` to the deps array, or change the route to remount on URL change via a `key={location.search}` on the Review element in the router.
5. (`B-7`) `items.ts:266-279` — `q.priority.emergency-vehicles` should reference a new `priority.emergency-vehicles` rule (author it in `rules.ts`), not `priority.tram`.
6. (`B-8`) `items.ts:281-294` — author a `signs.priority-road` rule and re-link.

**Definition of done**

- Triage banner only appears when triage is actually applied.
- "Stop" / "Skip" name and behavior agree.
- Last-card scoring is N answers, not N−1.
- Switching review modes via URL recomposes the queue.
- `npm run validate-content` passes; no broken ruleId references.

**Ship:** one commit, push to main, GH Actions deploys. Smoke-test the live site for the triage path.

---

## Chunk 2 — Engine completeness (~3–4 h)

Make the scheduler match the design's anti-avalanche guarantees.

**Files:** `src/scheduler/pickNext.ts`, `src/scheduler/fsrs.ts`, `src/store/index.ts`, `src/db/index.ts` (write-back for deferred items), `tests/scheduler.test.ts`

**Tasks**

1. (`A-1`) Implement triage write-back. After `triage()` returns `defer`, call a new DB method `bumpDueByOneDay(itemIds)` so deferred items don't reappear next session.
2. (`A-2`) Implement missed-day grace. In `pickNext` (or the store's `init`), check `now - lastSessionEndedAt > 72h`; if so, set new-item budget to 0 and emit a "catch up first" hint to the UI.
3. (`A-3`) Implement 70/20/10 session composition. Replace the naïve `for i < n` loop in `composeNormalSession` with explicit quotas: 70% overdue/due (priority-ranked), 20% new (budget-bounded), 10% weak-spot. Each quota draws from its own pool with the existing interleaving rule.
4. Add a "weak-spot" bucket: items with `lapses ≥ 2` or any review in last 24h with `correct === false`. Surface this as a new helper in `pickNext.ts`.
5. (`C-13`) Fix `isGraduated`'s recent-lapse heuristic in `fsrs.ts:104-106`. The current logic flags items as "not graduated" if they were last reviewed more than 7 days ago — backwards. Use `lapses === 0 || lastLapseAt < now - 14d` instead.
6. Tests: add cases that triaged items get `due` bumped, that 72h gap suspends new items, that 70/20/10 quotas are respected when each pool has supply.

**Definition of done**

- Triaged items provably don't reappear next session (test).
- `composeNormalSession(ctx, 10)` returns ≤7 overdue, ≤2 new, ≤1 weak-spot when all pools are populated.
- All 21 existing tests still pass + 5+ new tests.

**Ship:** one commit. The engine getting smarter is invisible to the UI but verifiable in tests.

---

## Chunk 3 — Content rails (~1–2 h)

Gate authoring behind quality enforcement before we 15× the content volume.

**Files:** `scripts/validateContent.ts`, `content/version.json` (new), `package.json`, `.github/workflows/deploy.yml`, `.eslintrc.cjs` (new), `src/content/bundle.ts`

**Tasks**

1. (`A-11`) Move content version to `content/version.json` (`{ version, itemCount, ruleCount, updatedAt }`). Add a `scripts/bumpContentVersion.mjs` that reads `items.ts`/`rules.ts`, recomputes counts, and writes the JSON. Wire into `prebuild`.
2. (`B-12`) Validator: enforce ≥1 rule per category (driver-fitness currently empty). Enforce every `imageAssetId`/`diagramAssetId` resolves to an existing file in `public/`.
3. (`E-1`) `.github/workflows/deploy.yml` — add `npm run validate-content` as a step before `build`.
4. (`E-6`) Add ESLint config (extends `eslint:recommended`, `@typescript-eslint/recommended`, `plugin:react-hooks/recommended`). Add `lint` script. Fix the existing `eslint-disable` comment in `Review.tsx:71` to reference a real rule.
5. Validator: fail (not warn) on orphan rules and on items referencing non-existent ruleIds (`B-12`).

**Definition of done**

- `npm run validate-content` exits non-zero on any rule/item/asset issue.
- CI fails on validator errors.
- ESLint runs clean.
- `content/version.json` exists and bumps on every build.

**Ship:** one commit. Future content PRs are now safe.

---

## Chunk 4 — Rules expansion (~4–6 h)

Grow the rule taxonomy from 15 → ~80 so categories aren't silently empty and FSRS tracks at the right granularity.

**Files:** `src/content/rules.ts` (the bulk), `src/content/items.ts` (re-link any items that hit renamed rules)

**Tasks** (group by topic; each ~30 min)

1. **Lane discipline** — keep right, lane changes, overtaking on highway, undertaking ban, exit lanes.
2. **Parking** — where it's prohibited, blue/white zones, parallel/perpendicular, distances from intersections/crossings/hydrants.
3. **Highway entry/exit** — acceleration lane priority, minimum speed, breakdown shoulder use.
4. **Vulnerable road users** — motorcycles (lane filtering legality), cyclists (1m clearance per VRV), pedestrians (priority at zebra crossings without signals), e-bikes.
5. **Trucks/blind spots** — toter Winkel, right-turn risk, mirror checks.
6. **Tunnels** — lights on, distance keeping, breakdown procedures.
7. **Winter & seasonal** — winter tire law (no fixed dates; "appropriate to conditions"), snow chain mandatory signs, daytime running lights mandate.
8. **Trailers** — speed limits when towing, weight category rules, trailer braking.
9. **Insurance & paperwork** — Haftpflicht minimum, casco optional, vehicle registration card requirements.
10. **Emergency** — Rettungsgasse formation rule, behavior near emergency vehicles, accident scene securing.
11. **Load securing** — VTS rules, max projection, lighting at night.
12. **Licence classes** — what Cat. B covers (3.5t / 8 seats), trailer combinations.
13. **Driver fitness** (currently empty category) — fatigue, medications affecting driving, prescription requirements for eyewear, illness.
14. Split coarse rules — `accidents.first-response` → `accidents.secure-scene`, `accidents.aid`, `accidents.notification`, `accidents.documentation`. Re-link the existing 3 items.
15. Add second worked example to `priority.tram` (`B-11`) and audit every rule for ≥2 examples per design §4.2.

**Definition of done**

- ~80 rules exist across all 8 categories.
- No category has fewer than 5 rules.
- No rule has fewer than 2 worked examples.
- Validator passes; existing items still resolve.

**Ship:** one commit per topic group is fine; validator catches regressions.

---

## Chunk 5 — Content authoring: signs (~10–14 h, mostly asset sourcing)

The Library Signs tab is empty because no SVGs exist. This is the highest-volume single chunk.

**Sub-chunk 5a: sign asset pipeline (~3 h)**

- Source ~100 Swiss road sign SVGs. Options in priority order:
  - Wikimedia Commons "Road signs of Switzerland" category (CC-BY-SA in most cases — verify per file).
  - Swiss federal government open-data portal (opendata.swiss).
  - Author from scratch using SVG primitives matching the SSV (Signalisationsverordnung) geometry. Time-consuming but copyright-clean.
- File naming: official Swiss code, e.g. `1.01.svg` (warning curve), `2.51.svg` (no entry), `3.03.svg` (priority road).
- Drop into `public/signs/`. Add `public/signs/ATTRIBUTION.md` listing each file's source + license.
- Update `vite.config.ts` workbox globs to include `signs/**/*.svg`. Bump `maximumFileSizeToCacheInBytes` if needed.
- (`A-13`) `Library.tsx` — group Signs tab by family: warning (1.x), priority (3.x), prohibition (2.x), mandatory (2.5x), info (4.x), supplementary (5.x). Use the leading digit.

**Sub-chunk 5b: sign items (~6–8 h)**

- Author ~120 items, each referencing one sign via `imageAssetId`. Three question patterns per sign:
  - "What does this sign mean?" (recognition)
  - "You see this sign. What must you do?" (rule application)
  - "Which combination of behaviors is correct here?" (multi-correct)
- (`A-15`) Render `imageAssetId` AND `diagramAssetId` in `Card.tsx`. Currently only the former is wired.
- (`D-6`) Pull alt text from item (add an optional `imageAlt` field to schema; default to a deterministic "Swiss road sign {code}").

**Definition of done**

- ~100 sign SVGs in `public/signs/` with attribution.
- ~120 sign items pass validator.
- Library → Signs renders grid grouped by family with mastery indicators.
- Deployed PWA precaches signs for offline use.

**Ship:** one commit per family group (warnings, priority, etc.) lets you smoke-test progressively.

---

## Chunk 6 — Content authoring: scenarios + facts + fitness (~8–10 h)

Round out to ~300 items.

**Files:** `src/content/items.ts`, `public/diagrams/` (new)

**Tasks**

1. **Scenario diagrams (~3 h)** — author ~40 reusable SVG diagrams in `public/diagrams/` for common scenarios: 4-way intersection with right-of-way arrows, T-junction, roundabout (1/2/3 lane), zebra crossing, tram crossing, highway merge, blind hill. Diagrams should be neutral templates that multiple items can re-use by overlaying labels.
2. **Priority scenarios (~3 h)** — ~60 items using `diagramAssetId`. Cover: right-hand rule edge cases, tram priority, emergency vehicles, signed exceptions, T-junctions, multi-lane roundabouts.
3. **Facts (~2 h)** — ~80 items: speed limits in each zone (50/80/100/120, plus exceptions for trailers, novices, motorcycles), BAC limits (0.05 / 0.01 novice / 0.0 commercial), document requirements, headlight rules.
4. **Maneuvers (~1 h)** — ~40 items: parking distances, U-turn legality, reversing rules, hazard light usage, tunnel breakdown procedure.
5. **Fitness (~1 h)** — ~30 items: fatigue (max driving time), medications with driving warnings, eyewear conditions, illness self-assessment.
6. (`B-10`) Author at least 20 items at difficulty 4 and 10 at difficulty 5 — currently zero items use these. Difficulty 5 should be edge cases (e.g., priority on snowy mountain road with bus stopped).

**Definition of done**

- ~300 items total in `items.ts` (current 20 + ~280 new).
- ~40 diagrams in `public/diagrams/`.
- Difficulty distribution: roughly 60/120/80/30/10 across 1–5.
- All categories have proportional coverage per `CATEGORY_WEIGHTS`.

**Ship:** commit per item batch.

---

## Chunk 7 — Mock exam upgrades (~2–3 h)

Make the mock actually feel like the exam.

**Files:** `src/routes/Mock.tsx`, `src/exam/compose.ts`

**Tasks**

1. (`A-4`) Add audible 1Hz tick in final 5 minutes via Web Audio API (oscillator → gain → destination, 50ms beep per second). Settings flag for users who hate it.
2. (`A-5`) Lobby: show settings summary block — exam date, retention target, last 5 mock results, days until exam.
3. (`A-6`) Add "Strict" / "Practice" toggle in lobby. Practice mode: allow back-navigation, show running score, allow flag-and-return. Strict (default): current behavior.
4. (`A-7`) Enforce 48h cool-down hard. `composeMockExam` should refuse to draw items seen in last 48h *unless* the entire eligible pool is exhausted, and emit a warning when it falls back.
5. (`A-8`) Visual mock differentiation: lighter background (`bg-stone-100 text-stone-900`?), serif typography (`font-serif` Tailwind), no bottom nav (already done).
6. (`C-7`) Fix the silent catch in mock finalize — surface "session ended unexpectedly" via a toast and persist answers to a recovery slot in IndexedDB before re-throwing.

**Definition of done**

- Mock exam looks visibly different from review.
- Final 5 minutes audibly different.
- Lobby is self-contained; user knows exactly what they're entering.
- Strict and Practice modes both work.
- 48h cool-down enforced or transparently relaxed.

**Ship:** one commit. Smoke-test by running an actual mock end-to-end on the live site.

---

## Chunk 8 — PWA install + update UX (~3–4 h)

Make the iPhone home-screen install respectable.

**Files:** `index.html`, `src/main.tsx`, `vite.config.ts`, `public/icons/`, `public/screenshots/` (new)

**Tasks**

1. (`F-1`) Disable auto-update during mock exam. Read mock-active state; if set, defer SW activation until session end.
2. (`F-2`) Wire `onNeedRefresh` and `onOfflineReady` from `virtual:pwa-register`. Show a small toast: "App updated — tap to reload" / "Ready to use offline".
3. (`F-3`) Add `screenshots` to manifest in `vite.config.ts`. Take 2–3 screenshots (Today, Review, Mock results) and put them in `public/screenshots/`.
4. (`F-4`, `F-5`) Generate apple-touch-icon variants (180×180, 152×152, 167×167). Add `<link rel="apple-touch-icon" sizes="180x180" href="...">` etc. to `index.html`.
5. iOS splash screens for at least the 3 most common iPhone resolutions (extend the Python icon generator with splash variants).
6. (`F-8`) Replace placeholder favicon with something distinctive. A red Swiss flag with "TP" overlay or similar. Single SVG, ~200 bytes.
7. (`F-6`) Workbox runtime caching for `public/signs/*` and `public/diagrams/*` — use `CacheFirst` with a named cache and a quota (e.g. 200 entries / 30 days).
8. (`F-7`) Add `public/offline.html` as workbox `navigateFallback` for any route not in precache.
9. (`F-9`) Add `<meta name="mobile-web-app-capable" content="yes">` alongside the `apple-` variant.

**Definition of done**

- iPhone "Add to Home Screen" shows a custom icon + splash.
- Update toast appears on next visit after a deploy.
- Mock exam isn't disrupted by SW activation.
- App works fully offline including images.

**Ship:** one commit. Verify by uninstalling from iPhone and re-installing.

---

## Chunk 9 — Accessibility + UX polish (~4–5 h)

The boring-but-essential polish that separates "it works" from "it's pleasant".

**Files:** `src/main.tsx` (ErrorBoundary), `src/components/Card.tsx`, `src/components/Layout.tsx`, `src/index.css`, `index.html`, `src/routes/*`

**Tasks**

1. (`D-1`) Add `<ErrorBoundary>` at app root. Catches throws; offers "Reload" + "Export backup" + "Wipe and restart". Persists the error to IDB for later inspection.
2. (`D-2`) Layout error state — add a "Retry" button that re-runs `init()` instead of forcing reload.
3. (`D-3`) Card option buttons — change to `<button role="checkbox" aria-checked={...}>`. Keyboard: Space toggles.
4. (`D-4`) Keyboard shortcuts in Card: `1`/`2`/`3` toggle options, `Enter` submit, `Space` continue.
5. (`D-5`) `index.html` — remove `user-scalable=no` from viewport meta (allow pinch-zoom).
6. (`D-6`) Card images — pull `imageAlt` from item (add to schema in Chunk 5b). Default to non-empty.
7. (`D-7`) First-run onboarding — a one-time dismissable card on Today: "Add to Home Screen for offline use" with an iOS-specific instruction toggle.
8. (`D-8`) Replace `confirm()` in Settings reset with a custom modal — same pattern works for any future destructive action.
9. (`D-9`) Confidence buttons — change to 2×2 grid on small screens; bump min tap target to 44×44px (WCAG).
10. (`D-10`) Empty review state — replace plain text with a card containing "Start new items" CTA when `newAvailable.length > 0`.
11. (`D-11`) Loading state — replace "Loading…" with a skeleton matching the Today layout.
12. (`D-12`) Stats daily-bars — add x-axis labels (today / -7d / -30d) and a min-height of 2px on zero-review days so they remain visible.
13. (`D-13`) Settings API key — add an explicit "Save" button below the input.
14. (`D-14`) Library — add "Expand all" / "Collapse all" buttons per category.
15. (`D-15`) Card — after Submit, focus moves to Continue (or to rationale if hidden actions enabled).
16. (`D-16`) Layout — bottom nav highlights "Today" when on Review/Teach (current route hierarchy).
17. (`D-17`) Card images — bump `max-h-48` → `max-h-80` for sign content; add a tap-to-zoom modal.
18. (`D-18`) `index.css` — add `:focus-visible { outline: 2px solid theme(colors.sky.400); outline-offset: 2px }` globally.

**Definition of done**

- VoiceOver can complete a review session end-to-end without confusion.
- No `confirm()` dialogs anywhere.
- `Tab` and `Enter` work everywhere a mouse does.
- Pinch-zoom works on sign images.

**Ship:** one or two commits — these are mostly independent polish items.

---

## Chunk 10 — Settings, Teach, and dead-code cleanup (~2–3 h)

Finish the long tail of spec features and remove dead promises.

**Files:** `src/routes/Settings.tsx`, `src/routes/Teach.tsx`, `src/routes/Today.tsx`, `src/routes/Library.tsx`, `src/store/index.ts`, `src/scheduler/fsrs.ts`

**Tasks**

1. (`A-9`) Settings — "Optimize FSRS weights" button enabled when `reviews.length ≥ 500`. Calls `ts-fsrs`'s `optimize` (or our wrapper) with the user's review history; persists new weights to settings.
2. (`A-10`) Settings — show app version + git SHA. Inject via `vite.config.ts` `define: { __APP_VERSION__: ..., __GIT_SHA__: ... }`.
3. (`A-12`) Teach — auto-trigger when ≥3 flagged items share a rule. Implement as a derived selector on the store; surface as a "drill this" prompt on Today.
4. (`A-14`) Library — show per-item mastery (graduated/learning/relearning/new) inside each rule's expanded view, not just the rule-level summary.
5. (`C-4`) "Ask Claude" — remove the dead Settings copy unless we wire a real button. If wiring: render a button on incorrect cards that copies a structured prompt (item question + user's answer + correct answer + rationale) and opens claude.ai in a new tab.
6. (`C-10`) Single source of truth for mock history — move from `localStorage` to a new IDB store `mockHistory`. Today + Stats both read from the store.
7. (`C-11`) Today.tsx — remove dead re-exports (`buildCatalog`, `allMemoryState`, `reviewsSince`).
8. (`C-12`) Mock.tsx — remove `void truthOf` and the now-unused export.
9. (`C-9`) Store `recordReview` — use the in-memory `memory` map for the previous state instead of round-tripping through IDB.

**Definition of done**

- Settings shows version + SHA.
- "Ask Claude" either works or is gone.
- Mock history is in IDB; Stats and Today agree on every value.
- No dead exports.

**Ship:** one commit.

---

## Chunk 11 — Tests + productionization (~3–4 h)

Lock the gains in.

**Files:** `tests/`, `vitest.config.ts`, `src/db/index.ts`, `.gitignore`

**Tasks**

1. (`E-2`) Add React Testing Library + jsdom. Write smoke tests for each route (renders without throw on empty + populated state).
2. (`E-2`) Integration test: write a `ReviewEvent`, close db, reopen, verify it reads back. Same for `MemoryState`. Same for triage write-back from Chunk 2.
3. (`E-3`) Triage→pickNext test: when triage produces a `keep` set, `pickNext({restrictTo: keep})` returns only items in that set. This is the test that would have caught Chunk 1's `C-1` bug.
4. (`E-4`) Add a tiny error reporter: catch unhandled errors + promise rejections, write to a `errors` IDB store with timestamp, route, message, stack. Add a "Export errors" button in Settings.
5. (`E-7`) DB upgrade safety: before destructive upgrade, attempt `exportBackup()` and stash the JSON in a `previousData` IDB store (or `localStorage`). Show a banner on first load post-upgrade: "Previous data archived. Download / discard."
6. (`E-8`) `git rm` the leaked `vite.config.ts.timestamp-*.mjs` files and confirm `.gitignore` covers them.
7. CI: `npm run lint && npm run typecheck && npm run validate-content && npm test && npm run build` — full chain in `.github/workflows/deploy.yml`.

**Definition of done**

- ≥80% line coverage on `src/scheduler/`, `src/exam/`, `src/store/`.
- Smoke tests for all 7 routes.
- DB upgrade is no longer silently destructive.
- CI runs the full quality chain.

**Ship:** one commit.

---

## Chunk 12 — Stretch (~as desired)

Nothing in here is required. All `🟢` from the audit, plus aspirational features.

- Smarter "Ask Claude" — direct API call with the user's key (Settings already has the field), inline the response, allow follow-up. Honors offline by queuing.
- Anonymous telemetry export — the user opts in, the app posts daily aggregate stats to a webhook of their choice. Useful for tracking your own readiness curve over weeks.
- Difficulty-adaptive new-item budget — instead of 0/3/10 by backlog, factor in last 24h success rate.
- Curriculum suggestions — "Your fitness category is weakest; want a 3-day fitness focus?"
- Multi-language content (DE / FR / IT) — Switzerland has 4 official languages; the real exam is in DE/FR/IT.

---

## Effort summary

| Chunk | Topic                                | ETA       | Risk   |
|-------|--------------------------------------|-----------|--------|
| 1     | Honest UI                            | 1–2 h     | Low    |
| 2     | Engine completeness                  | 3–4 h     | Medium |
| 3     | Content rails                        | 1–2 h     | Low    |
| 4     | Rules expansion                      | 4–6 h     | Medium |
| 5     | Sign content + assets                | 10–14 h   | High*  |
| 6     | Scenarios + facts + fitness          | 8–10 h    | Medium |
| 7     | Mock exam upgrades                   | 2–3 h     | Low    |
| 8     | PWA install + update UX              | 3–4 h     | Low    |
| 9     | Accessibility + UX polish            | 4–5 h     | Low    |
| 10    | Settings, Teach, dead-code cleanup   | 2–3 h     | Low    |
| 11    | Tests + productionization            | 3–4 h     | Low    |
| 12    | Stretch                              | as needed | n/a    |

**Total to "real exam-prep tool": ~40–55 h.** Roughly two intense weekends or four part-time weeks.

\* Chunk 5 risk is mostly around licensing/sourcing of sign SVGs. If we author from scratch the time goes up; if Wikimedia coverage is good the time goes down. Either way technical risk is low.

---

## How to use this plan

- One chunk per branch, one PR per chunk. Each is independently revertable.
- Update this file as chunks complete: cross out tasks, note any deviations, link to the merge commit.
- If a new gap emerges during work, append it to the relevant chunk (or open a new one) — don't let it slip into the implementation tacitly.
- The `Definition of done` lines are the contract. If you can't tick them all, the chunk isn't done.
