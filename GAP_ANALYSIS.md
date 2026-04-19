# Gap Analysis — Swiss Theory Prep vs the Swiss market

Date: 2026-04-19
Baseline: commit 9a3f4f4 (Chunk 6 shipped). 212 items / 102 rules / 89 SSV signs / 67 tests passing.
Live: https://zheludevaat.github.io/swiss-theory-prep/

This document compares the current PWA against the seven asa-licensed Swiss theory products (iTheorie, theorie24, BLINK, Fahrlehrer24, easydriver, Auto Theorie Premium, TCS Theorie24) and ranks what's missing by likely impact on Alexander's actual pass probability — not by polish.

---

## Where the PWA is already at parity with commercial apps

These items are *done*, including some commercial apps don't ship:

| Capability | Status here | Notes |
|---|---|---|
| Exam simulator: 50 q / 45 min / 135-pt threshold / ≤15 penalties | Done | `src/exam/scoring.ts`. Mirrors ASA scoring exactly. |
| Per-option partial credit (max 3 pts per question) | Done | scoreQuestion treats each tick independently. |
| Spaced repetition with anti-avalanche caps | Done | ts-fsrs + triage layer (Chunk 2). |
| Inferred grading (no Again/Hard/Good/Easy buttons — just "did you tick the right options?") | Done | `src/scheduler/grading.ts`. Better UX than commercial apps that ask Anki-style ratings. |
| Per-topic accuracy stats (Stats route, "Accuracy by category") | Done | Horizontal bar chart, similar to iTheorie radar. |
| Wrong-answer drill | Done | Review route mode. |
| Library with searchable Rules + Signs tabs | Done | 89 SVG signs grouped by SSV family. |
| Offline-first PWA (precache + runtime cache for signs) | Done | 208 precache entries, 1.4 MiB. |
| Installable on iPhone home screen with proper apple-touch-icons + splash | Done | Chunk 8. |
| Tests + CI gate + content schema validator | Done | 67 vitest, validator runs on every PR. |
| Adapted Swiss-law rationale on every item (SVG / VRV / SSV / VTS citations) | Done | More legally rigorous than most commercial apps. |

This is genuinely a respectable Phase-1 product for personal use. The remaining gaps are about *coverage*, *content authenticity*, and *language* — not engine quality.

---

## Where the gaps are — ranked by impact on pass probability

### Tier 1 — Will materially affect whether Alexander passes

**1. Question-bank fidelity (highest impact, hardest to close).**
The asa pool has roughly 800–900 active Cat. B questions; commercial licensees draw on ~2/3 of it (the other third is withheld). Our 212 self-authored items cover the *rules* well but cannot reproduce ASA *style*: phrasing tics, distractor patterns (especially the "all of the above"-style multi-correct trap), and the 2026 driver-assistance additions (effective 1 July 2026 across all licensees) that ASTRA has signalled. **Mitigation:** treat our bank as a high-quality *complement*, and use a CHF 19–25 commercial app for the final 2 weeks of prep to pattern-match the real exam wording. Do not try to clone the licensed bank; it is a copyright minefield and the withheld third is not legally obtainable.

**2. German-language exam exposure.**
The real exam is delivered in DE/FR/IT (and EN as an aid). Even an English-fluent candidate trains better in the exam language because half the test-taking skill is parsing legalese ("Wer fährt zuerst?", "Sie dürfen…", "Es ist erlaubt…"). All seven commercial apps switch language at the question level; we are English-only. **Mitigation (1-day):** add a `lang: "de" | "en"` field to each Item, author DE versions of the high-frequency rules first (priority, signs, BAC, speeds), and a language toggle in Settings. **Mitigation (heavy):** a full DE bank doubles content effort.

**3. Hazard / scenario diagrams.**
Real exam priority items show overhead intersection diagrams with arrows; our items are text-only. easydriver has animated right-of-way trainers; iTheorie/theorie24 use static intersection diagrams. Without these, the d4/d5 priority items are harder than the real exam (text descriptions force you to imagine the scene, which is more cognitively expensive than seeing it). **Mitigation:** the FIX_PLAN already targets `~40 diagrams in public/diagrams/`. Static SVG intersection diagrams (Inkscape or hand-coded SVG) for the 12 priority scenarios would close most of the gap. Animation is over-investment.

### Tier 2 — Real but smaller pass-rate impact

**4. Driver-assistance content (ADAS) — new July 2026 ASA additions.**
Items on lane-keep, adaptive cruise, emergency-brake assist, and the "driver retains responsibility" framing are entering the official bank. We have zero coverage. **Mitigation:** author 8–10 ADAS items grounded in the new SVG Art. 31a / VRV revisions. ~2 hours of work.

**5. First-aid theory.**
Confirmed correctly omitted: Swiss Nothilfe is a separate in-person 10-hour course with no written exam. No action needed; flag this in README so Alexander doesn't worry about it.

**6. Theory book / narrative rules.**
theorie24 ships a "digital theory book with legal basis" — long-form prose explaining each rule, not just MCQ rationales. Library currently shows rules as one-liners with worked examples. Strong learners read narratives; weak learners cram MCQs. Alexander's pattern is the former. **Mitigation:** add a `narrative: string` field on Rule (markdown), and render it in the Teach route. Could also generate from existing rationale strings + worked examples.

**7. Sign-search / sign-quiz mode.**
Library shows 89 signs but there's no "what does this sign mean?" drill mode (e.g. random sign → 3 captions). easydriver and verkehrstheorie both have this. **Mitigation:** new Review mode `signs-only` that composes items where `imageAssetId` is set. Already 80% of the wiring exists from Chunk 5b.

### Tier 3 — Nice-to-have, small marginal benefit

**8. Read-aloud (TTS).** theorie24 + easydriver ship this. Browser `speechSynthesis` is one short hook; useful if Alexander studies on commutes.

**9. Cantonal-tracking metadata.** Swiss exam content is the same across cantons but appointment booking, fees, and licence-issuance differ. A Settings field "Canton: ZH" could surface the relevant Strassenverkehrsamt URL on the Stats page.

**10. Audio scenarios for adverse conditions.** Real exam doesn't include audio; this is over-investment.

**11. Streaks / gamification.** iTheorie has trophies; theorie24 has Game Mode. Adherence helper, not a learning helper. Skip unless Alexander notices himself drifting.

**12. Cross-device sync.** Commercial apps offer web + iOS + Android. We are PWA-only — installable on iPhone, but the IndexedDB store doesn't sync across devices. For a single-device user, irrelevant. For a power user, would need a backend.

---

## Suggested next 4 chunks (if Alexander wants more)

If continuing past Phase 1, ordered by ROI per hour:

**Chunk 13 — German-language overlay (1 day).**
Add `lang` field to Item; author DE versions of priority + signs + BAC items; Settings toggle; Library shows both. Closes the highest-impact gap that is fully under our control.

**Chunk 14 — Intersection diagrams for priority items (~2 days). DONE.**
- 14a (shipped): `diagramAssetId` schema + Card render path + fullscreen zoom + 3 CC0 Rettungsgasse scenes wired.
- 14b (shipped, 2026-04-19): 17 hand-authored CC0 priority/intersection schematics composed and wired onto 22 priority items (right-hand, yielding, roundabout, tram, emergency, school-bus, mountain-descent scenarios) with EN + DE `imageAlt` where DE overlays exist.

**Chunk 15 — Narrative theory book (~half-day).**
Add `narrative` markdown field on Rule, expose in Teach route, write narratives for the 30 highest-weight rules.

**Chunk 16 — Signs quiz mode + ADAS items (~half-day).**
New Review mode that drills signs only; author 8–10 driver-assistance items per the 2026 ASA update.

---

## Honest bottom line

For a personal-use PWA built solo over ~2 weeks, this app is competitive with the commercial Swiss field on every dimension *except* question-bank breadth (212 vs ~600 effective in commercial apps) and German-language coverage. The engine, scoring, scheduling, signs library, offline behaviour, and accessibility are at or above the commercial baseline.

The *cheapest* and most honest path to maximizing Alexander's actual pass probability is:

1. Use this app as the daily driver for understanding *why* each rule exists (the rationales here are better than commercial apps).
2. In the final 14 days before the exam, supplement with one CHF 19–25 commercial app (BLINK or Fahrlehrer24) to pattern-match real ASA wording — including the withheld third we can never see.
3. If you have a free weekend before then, ship **Chunk 13 (German overlay)** and **Chunk 14 (priority diagrams)** — those two alone close the largest training-vs-exam delta.

Sources for the competitive scan: asa.ch/lernmittel · auto.itheorie.ch · theorie24.ch · blinkdrive.ch · fahrlehrer24.ch · verkehrstheorie.ch · easydriver.ch · todrive.ch · comparis.ch.
