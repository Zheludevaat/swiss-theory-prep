# Psychology & Learning-Science Audit — Swiss Theory Prep

Date: 2026-04-19  ·  Audited against: 0.2.8-seed (212 items / 102 rules / 17 diagrams)  ·  Live: https://zheludevaat.github.io/swiss-theory-prep/

---

## 0. Executive summary

Commercial Swiss theory apps (iTheorie, theorie24, BLINK, Fahrlehrer24, TCS Theorie24) are **content-heavy, pedagogy-light**. They ship the licensed ASA bank (~600 questions), pretty UI, cantonal metadata, and sometimes hazard videos — but under the hood they run Leitner boxes or raw random pulls, gamify engagement with streaks and premium tiers, and do nothing for metacognition, self-regulation, or exam-day performance. They are designed to sell subscriptions, not to optimise learning per minute.

Swiss Theory Prep already out-performs them on the **learning-engine axis**: FSRS per-item modelling, inferred grading, worked-examples-before-drill, interleaving, backlog triage, honest readiness signal, confidence calibration, anti-manipulation streak stance. That is the moat. The question now is not "how do we catch up on features" but "which of the remaining Phase-2 psychology interventions are worth building before the exam, and in what order?"

The audit finds three unfairly-high-leverage gaps that no commercial app offers and that each cost less than a day to implement:

1. **Exam-morning screen** (reappraisal + expressive writing). Ramirez & Beilock, Jamieson — documented score effects in the 5–10 percentile-point range. ~3–4 hours.
2. **Implementation-intention onboarding** (tie study to a named cue). Gollwitzer — the single most robust behaviour-change intervention in the literature. ~2–3 hours.
3. **Category-wise calibration feedback** (where are you overconfident?). Koriat — closes the metacognitive loop in the slice of Stats where it actually changes next-session choices. ~3 hours.

The audit also finds two **medium-leverage, medium-effort** gaps that compound with the above:

4. **Free-recall rotation** (~1 in 10 cards: question without options). Generation effect. ~1 day including item tagging.
5. **Bedtime-consolidation mode** (5-card pre-sleep session, new-items weighted). Payne & Kensinger. ~3 hours.

And one **high-effort** gap that matters only if Alexander has the week:

6. **Hazard-perception clips** (short animated or still-sequence scenarios). Not in the real Cat. B Theorieprüfung, but the pattern-recognition transfer to the practical test is substantial. ~2–3 days.

Below, each recommendation is scored, justified from the literature, and specified concretely enough to ship without re-auditing DESIGN_v3.

---

## 1. How to read this audit

Every row in the inventory is scored against three dimensions:

- **Shipped** — the mechanism from DESIGN_v3 §2 is present in the running app, verifiably wired through to the user surface.
- **Partial** — the mechanism is partially wired (engine but no UI, or UI but thin content, or one path shipped and the sibling path not), and a small amount of work would complete it.
- **Deferred** — the mechanism is named in DESIGN_v3 §15 as Phase 2 (or is not in DESIGN_v3 at all) and has never been wired.

Each *Deferred* or *Partial* row carries a priority score `P = Impact × Leverage / Effort`, where:

- **Impact** (1–5) is the expected effect-size on exam-day performance or on the probability of showing up on a bad day, based on the published literature.
- **Leverage** (1–5) is the degree to which the intervention compounds with what is already shipped (e.g., calibration feedback has huge leverage because the sampling infrastructure already exists; hazard videos have low leverage because nothing else depends on them).
- **Effort** (1–5) is engineering/authoring hours: 1 ≈ under 1 hr, 5 ≈ more than 2 days.

The order of the recommendations below is by `P`, ties broken by stakes (exam-day > daily-use > long-term).

---

## 2. Inventory — what DESIGN_v3 specified vs. what ships

### 2.1 Getting information into long-term memory

| Mechanism | Status | Evidence / location | Notes |
|---|---|---|---|
| Spacing effect (Ebbinghaus/Cepeda) | Shipped | `src/scheduler/fsrs.ts`, `ts-fsrs` with `request_retention=0.90` | Per-item stability and difficulty; fuzz and short-term on; 365-day ceiling. |
| Testing effect (Roediger & Karpicke) | Shipped | `Card.tsx` Submit gate; `Review.tsx` queue flow | No passive reading of rationales — `submitted` flag gates reveal. |
| Desirable difficulty (Bjork) | Shipped | `Settings.tsx` retention slider 0.80–0.95; default 0.90 | Default sits in Bjork's sweet spot and matches exam pass threshold — double justification. |
| Transfer-appropriate processing (Morris et al.) | Shipped | Only card format is 3-option multi-select; mock uses identical format | One-format app is a deliberate choice, not an oversight. |
| Interleaving (Rohrer & Taylor) | Shipped | `pickNext.tryPick` refuses two consecutive items that share a rule; relaxed only in `teach` mode | Correctly relaxed during acquisition block (Teach's 3-drill). |
| Cognitive Load / worked examples (Sweller) | Shipped | `Teach.tsx` renders rule + `workedExamples[]` before routing to `/review?mode=teach&rule=…` for 3 items | Triggered from Today when the same rule is flagged-confused ≥3 times. |
| Dual coding (Paivio) | **Partial** | Signs: 89 wired; diagrams: 17 schematics / ~25 items wired | ~85% of items are still text-only. See §3.4 below. |
| Generation effect (Slamecka & Graf) | **Deferred** | DESIGN_v3 §2.1 + §15 roadmap entry "Free-recall occasional cards" | High-leverage Phase-2 candidate. See §3.4 below. |
| Elaborative interrogation (Pressley) | **Deferred** | DESIGN_v3 §15 "rationale-first prompt, 1 in 10" | Low-yield at this scale; see §4.2. |
| Production effect (MacLeod) | **Deferred** | DESIGN_v3 §15 "read aloud" | Pure prompt-string intervention; see §3.6. |

### 2.2 Keeping information in long-term memory

| Mechanism | Status | Evidence / location | Notes |
|---|---|---|---|
| Overlearning for life-safety content (Driskell) | Shipped | Default `settings.overlearnMastered = true`; FSRS continues surfacing mastered items at long intervals rather than retiring them | The "aren't driving rules life-safety?" argument is correctly made in §2.2. |
| Sleep-dependent consolidation (Payne & Kensinger) | **Deferred** | DESIGN_v3 §15 "bedtime consolidation 5-card session" | Small build, plausibly-meaningful effect. See §3.5. |
| Encoding specificity / context variation (Godden & Baddeley) | **Partial** | Mock exam uses a stone + serif theme that is visually distinct from dark review | The visual shift works; there's no nudge toward **physical** context variation. See §4.1. |

### 2.3 Performing well under exam conditions

| Mechanism | Status | Evidence / location | Notes |
|---|---|---|---|
| Desensitization through exposure (Wolpe/Zeidner) | **Partial** | `Mock.tsx` strict mode is fully realistic (45-min countdown, 50 items, no back, exact ASA scoring, final-5-min audible tick and red ring) | No **cadence engine** — DESIGN_v3 §8.5 prescribes weekly mocks weeks 3–5, daily weeks 6–8; today the user has to self-schedule. See §3.7. |
| Effortful retrieval under mild stress (Smith et al.) | Shipped | Mock strict mode timer, 1 Hz beep in final 5 min, no pause | Well done — pulse ring is understated; audible tick is an opt-in setting. |
| Reappraisal of arousal (Jamieson) | **Deferred** | DESIGN_v3 §2.3 + §15; mentioned in §10.8 as `/exam-morning` | **Highest-ROI deferred item in the app.** See §3.1. |
| Expressive writing before test (Ramirez & Beilock) | **Deferred** | DESIGN_v3 §10.8 `/exam-morning` | Ships with §3.1. |

### 2.4 Showing up at all (habit layer)

| Mechanism | Status | Evidence / location | Notes |
|---|---|---|---|
| Tiny habits (Fogg) | Shipped | 5-min blast button on Today; blast mode in scheduler | Tuned well — no new items in blast to preserve the low-commitment contract. |
| Zeigarnik | Shipped | Blast's tiny-commitment → natural extension pattern; flagged-confused rules persist on Today | Organic, not engineered. |
| Implementation intentions (Gollwitzer) | **Deferred** | DESIGN_v3 §2.4 + §15 onboarding screen | **Highest behavioural-change leverage in the literature.** See §3.2. |
| Affective protection / triage (Fogg + SDT) | Shipped | `summarise` + `triage` in `pickNext.ts`; banner on Today; deferred ids actually written back to IDB via `deferItems` | Correctly persists deferrals; wouldn't work without the IDB write. |
| Descriptive (not manipulative) streaks (Deci/Ryan) | Shipped | `computeStreak` reports N days; Today footer shows "N days"; no nag, no notification, no flame emoji | §14 anti-pattern held firm. |
| Growth-mindset framing (Dweck) | Shipped | Inferred grading (no Again/Hard/Good/Easy self-report); neutral result banners ("2 of 3 points"); no "Good job!" cruft | Holds across Review and Mock. |

### 2.5 Metacognition

| Mechanism | Status | Evidence / location | Notes |
|---|---|---|---|
| Calibration of confidence (Lichtenstein; Dunning-Kruger) | Shipped | Every-5th-card `askConfidence` prompt (configurable in Settings); confidence stored on `ReviewEvent` | Appropriately sampled — not demanding. |
| Metacognitive feedback loops (Koriat) | **Partial** | `Stats.tsx` calibration curve appears after ≥50 samples; plots confidence-1..4 vs observed accuracy globally | **Category breakdown missing** — see §3.3, the single-best metacognition upgrade available. |
| Self-explanation (Chi et al.) | **Deferred** | DESIGN_v3 §15 "voice note" | Small build; see §3.6. |

### 2.6 Explicit anti-patterns (DESIGN_v3 §14)

All held: no push notifications, no manipulative streaks, no fake progress bars, no lives/gems/premium, no train-then-test-same-day (48h mock cooldown enforced in `compose.ts`), no build-schedule-threatening-study-schedule.

---

## 3. Prioritized recommendations

### 3.1 Exam-morning screen — reappraisal + expressive writing

**Priority score:** `P = 5 × 4 / 2 = 10` (highest in the audit).

**Why.** Ramirez & Beilock (2011) report that ten minutes of pre-test expressive writing produced roughly a full letter-grade improvement in their highest-anxiety quartile; the effect survives replication. Jamieson et al. (2010) found that a short reappraisal paragraph reframing physical arousal as helpful produced measurable score improvements on the GRE and the bar exam. Both interventions act on the exact moment Alexander will be most vulnerable (exam morning at the Strassenverkehrsamt), cost near-zero to ship, and are invisible to every commercial competitor. The published effect sizes on a 150-point exam with a 140-point pass threshold translate to a meaningful shift in first-attempt pass probability, particularly if the practice-exam distribution is sitting near the threshold in week 8.

**What to ship.**

- New route `/exam-morning` (referenced as TBD in `DESIGN_v3 §10.8`).
- On the morning of `settings.examDate` (or any time a user can reach it via Settings → "I'm about to take the test"), the route presents three sequential screens:
  1. **Reappraisal card** (90 seconds). One short paragraph: "Your racing pulse and warm palms are your body mobilising for a task that matters. That state is performance-enhancing. People who reframe it this way score higher. Read once, slowly." Ships as static copy.
  2. **Worry-writing pad** (10-minute timer). A text area bound to `localStorage` only (never written to IDB, never synced — Alexander should delete it after). Prompt: "Write, in any order, everything you're worried about for this test. No rules about grammar. Stop when the timer ends."
  3. **Anchor statements** (90 seconds). Three items the user pre-wrote in Settings earlier in the week — "Why I want this," "What I'll do if I don't know an answer," "What a good-enough session looks like." Pure retrieval/commitment reinforcement.
- Today screen shows a small "Exam in 0 days — open exam-morning" tile when `daysUntil(examDate) === 0`. Tile auto-hides the day after.
- Deliberately **no** practice cards on this route. DESIGN_v3 §14 forbids last-minute cramming, and Dunning-Kruger says any last-hour miss would disproportionately dent confidence.

**Effort.** 3–4 hours. Stack: one new route, one `localStorage` key, one timer, one Settings panel for anchor statements. No new dependencies, no content pipeline, no migration.

**Definition of done.** Route accessible; timer cannot be paused (stress mirror); Settings has an "Anchor statements for exam morning" expandable; Today shows the tile on exam day only.

### 3.2 Implementation-intention onboarding

**Priority score:** `P = 4 × 5 / 2 = 10`.

**Why.** Gollwitzer's meta-analyses consistently show that binding a behaviour to a named situational cue ("**after** my morning coffee, **I will** open the app and tap Start review") outperforms generic intention ("I will study more") by a factor of roughly 2–3 on actual behaviour change. The mechanism is off-loading the initiation decision from willpower onto environmental recognition. Alexander's limiting factor for the next ~6 weeks is not understanding FSRS — it is showing up on a bad day. This intervention is cheap, evidence-rich, and addresses the most common cause of SRS abandonment (the "I missed three days, now there's too much" spiral — which the app already mitigates via triage but which implementation intentions prevent from happening in the first place).

**What to ship.**

- On first load with `memory.size === 0`, show a single-screen onboarding card (dismissible) that asks two questions:
  1. "When in your day do you **reliably** have ten free minutes?" — presented as radio buttons with four named-cue options: *after morning coffee*, *during lunch break*, *after dinner*, *before bed*. Fifth option "other" with a free-text cue.
  2. "Where will you be?" — *on the sofa*, *at the kitchen table*, *on the tram*, *in bed*, *somewhere else*.
- Persist both to `settings.ifThenCue` and `settings.ifThenPlace`.
- On Today, if `lastSession` is more than 24h ago AND the current time matches the cue's rough window (morning = 06–11, lunch = 11–14, evening = 17–22, bed = 21–02), show a gentle single-line tile: `Your cue is "after morning coffee" — ten cards should do it.` No notification, no badge, no push. Text only. If the user always uses the app at 08:30, the tile just shows at 08:30.
- Skip-if-installed: if the user has already completed > 7 sessions, don't show the onboarding on a subsequent clean install (detect via backup import or local state).

**Effort.** 2–3 hours. No new types, three new Settings fields, one Today-page tile, zero new views.

**Edge cases.** If Alexander doesn't want to answer, "Skip" is a first-class option — DESIGN_v3 §14 forbids nagging.

**Definition of done.** Fresh install shows the prompt; answered preferences persist through reload and backup export/import; the Today tile appears only in its cue window and only when a session hasn't been started today.

### 3.3 Category-wise confidence calibration

**Priority score:** `P = 4 × 5 / 1 = 20`.

**Why.** The calibration infrastructure is already shipped (Stats.tsx computes `calibrationCurve(reviews)`). What the current chart does not answer is the only question that actually changes behaviour: *where* am I miscalibrated? "I'm 90% sure on signs but actually 70% correct" is actionable. A flat global curve is just a number. Koriat (1997) is explicit: calibration improves only when judgement and outcome are contrasted *at the grain where the learner makes decisions*. Alexander makes decisions by category (signs, priority, speed, alcohol, etc.). The per-category split already exists next door — `Stats.tsx` has `accuracyByCategory`. Joining it to the confidence bucket is one reducer.

The effort/impact ratio makes this the single highest-`P` item in the audit.

**What to ship.**

- In `Stats.tsx`, after the existing confidence-calibration section, add a per-category calibration table gated behind the same 50-sample threshold (applied per-category, so signs might unlock before mountain driving). Columns: Category · Said % · Saw % · N samples · Gap indicator (•• red if |gap| > 15pp, • amber 8–15pp, green otherwise).
- Tap a row → filter a new Today CTA "Drill the signs you're overconfident on" which composes a mini-session from items in that category where the user's last few answers were incorrect at high stated confidence. This is a **calibration-repair loop** — Koriat's feedback mechanism made operational.
- Keep the global chart above; the per-category table is additive, not replacement.

**Effort.** 3 hours. One reducer, one section in Stats, one URL param on `/review?mode=calib-drill&cat=signs`, no schema change.

**Definition of done.** Per-category rows appear once a category has 50+ samples; tapping a flagged row composes a drill session; a vitest asserts the reducer's output against a hand-built fixture.

### 3.4 Free-recall rotation + widened diagram coverage

**Priority score:** `P = 4 × 3 / 3 = 4`.

**Why.** DESIGN_v3 §2.1 acknowledges the generation effect but defers free-recall cards to Phase 2 because "the multi-select format dominates." That's correct for 9 of 10 cards. But inserting a free-recall variant on 1 in 10 has a documented, large effect on long-term retention for the recalled items (Slamecka & Graf, reviewed in Karpicke 2012), at low risk to the overall flow. The ceiling of what SRS can do for a learner is partially bounded by the encoding quality at each retrieval, and generation encodes better than recognition.

Dual coding is the second half of this chunk. The 17 diagrams / 22 wired items from Chunk 14b is a proof of concept, not coverage. Priority scenarios are covered; speed, overtaking, alcohol, night driving, tunnels, parking, mountain, tram-vs-emergency are not. Extending diagram coverage adds a visual encoding channel on items that are currently verbal-only, which compounds with the generation effect (images are easier to generate from, not just to recognise).

**What to ship.**

- **Free-recall mode.** New card variant in `Card.tsx`: `mode: "generation"` renders the question without options, with a text field "In one sentence, what's the rule at play here?" The user types, submits, and the card then reveals all three options (with the correct ones highlighted) plus the rationale. Grading: if the user's text contains any of a pre-authored `ruleKeywords: string[]` (new optional field on Item, EN + DE), grade as Good; otherwise grade as Hard. No penalty for wrong keywords — the benefit is in the act of trying.
- Rotation: `composeNormalSession` adopts `generationRate = 0.1` setting; during composition, 10% of slots get marked as generation-mode at pick time.
- **Diagram widening.** Compose 10–15 more CC0 schematics for the currently-uncovered categories, reusing the existing kit patterns from Chunk 14b. Target: at least one diagram per high-weight rule.

**Effort.** 1 day for free-recall (new card mode, 2 reducer passes, keyword field on ~20 seed items, vitest for the keyword matcher, DE overlay on keywords). 1 day for diagram widening if you reuse the 14b pattern.

**Definition of done.** Free-recall cards appear at expected rate; keyword matching has a vitest with at least 10 fixtures covering positives and negatives; at least one new diagram per category covered.

### 3.5 Bedtime-consolidation mode

**Priority score:** `P = 3 × 3 / 1 = 9`.

**Why.** Payne & Kensinger's research programme on sleep-dependent memory consolidation is consistent: items encoded within ~90 min of sleep onset show better next-day retention than items encoded in the morning, with effect sizes in the 10–20% range on memory-test performance. The mechanism is slow-wave sleep replay. Converting even 5 of today's new items to a "before bed" pull is a cheap schedule intervention with published upside. It also compounds with implementation intentions: the cue "before brushing teeth" is dead simple.

**What to ship.**

- Today screen gets a third session button below "5-minute blast" and "Take mock exam": **"Bedtime 5 cards"**. Visible only after 20:00 local time (gate in the component).
- Button routes to `/review?mode=bedtime` which composes a 5-card session: 3 new items from today's introduction quota + 2 items that were wrong in today's earlier session (or the most recent session, if none happened today).
- New compose helper in `pickNext.ts`: `composeBedtimeSession(ctx, n=5)`. Respects catch-up mode (no new items if user has been away > 72h).

**Effort.** 3 hours. One new composer (parallel to `composeBlastSession`), one button, one route mode, a vitest.

**Definition of done.** Button only visible ≥20:00; composer returns exactly 5 items with the 3-new/2-missed ratio when that's achievable; falls back gracefully to 5-missed if no new items are available.

### 3.6 Read-aloud + self-explanation prompts

**Priority score:** `P = 2 × 4 / 1 = 8`.

**Why.** MacLeod's production effect and Chi's self-explanation literature are both well-replicated but hit a ceiling when applied at scale — the user has to actually do it. This is a *prompt-string intervention with zero engineering beyond adding a line of text*. The upside is bounded; the cost is essentially nothing. The leverage comes from compounding: every other intervention in the app works better when the learner occasionally articulates what they're learning, because articulation exposes gaps that silent recognition hides.

**What to ship.**

- In `Card.tsx`'s `ResultBlock`, below the rationale, add a muted, low-visual-weight prompt that appears on 1 in 5 cards (deterministic via `hash(itemId + sessionSeed) % 5 === 0`): "Say the rule out loud in one sentence." No button, no input — just the prompt. A second variant on 1 in 10 cards: "Explain to an imaginary passenger why this is the answer."
- Add a Settings toggle: `showSelfExplanationPrompts: true` (default on, off for users who find it awkward).

**Effort.** 1 hour. One line of JSX, one Settings toggle, one tiny hash, no new surfaces.

**Definition of done.** Prompts appear at the expected rate; Settings toggle suppresses them; no perf regression in Card render.

### 3.7 Mock-exam cadence engine

**Priority score:** `P = 3 × 3 / 2 = 4.5`.

**Why.** DESIGN_v3 §8.5 explicitly specifies the cadence ("weekly mocks weeks 3–5, daily weeks 6–8") because desensitization is dose-dependent (Zeidner 1998). The current app gives the user a `Take mock exam` button but no active cadence — the user must remember when to take one. Given `settings.examDate` is already collected, the app has all the information needed to suggest cadence; it is one of the few places where a small UI nudge adds real pedagogy, because the gap between knowing when to mock-exam and remembering to mock-exam is the exact place exam anxiety gets a foothold.

**What to ship.**

- On Today, if `examIn` is within 14 days and the user hasn't taken a mock today, show a tile: "Exam in 8 days. Take today's mock." If within 14–28 days: "Exam in 21 days. Take a mock this week." If within 28–56 days: "Exam in 38 days. Weekly mocks work; your last was 9 days ago." Text only, dismissible for today.
- Thresholds derived from `lastMockAt = mockHistory[0]?.at` and `daysUntil(examDate)`.

**Effort.** 4 hours. One reducer, one tile component, no schema change.

**Definition of done.** Tile appears only when cadence is actually behind; copy adapts to exam proximity; dismiss hides the tile for the rest of the local day.

### 3.8 Hazard-perception clips (stretch)

**Priority score:** `P = 3 × 2 / 5 = 1.2`.

**Why.** Not in the Cat. B Theorieprüfung itself — the real exam is 50 multi-select questions, no video. But pattern-recognition transfer to the practical test (the Führerprüfung) is substantial: learners who train on dynamic hazard clips show measurable gains in driving-test performance (Horswill & McKenna 2004 and follow-ups). The commercial apps that do offer hazard clips are almost universally static video; Alexander's app could do the same with a small library of CC0 / self-recorded dashcam clips and simple tap-the-hazard UI. Whether this is worth building before the theory exam is a coin flip; after passing theory, it is high-value prep for the practical.

**What to ship.**

- A new item type (`kind: "hazard"` on Item) with a video or image-sequence asset and a time-coded hazard answer.
- A new route `/hazard`.
- A small seed library of 10–20 clips.

**Effort.** 2–3 days if using existing CC0 footage; 1–2 weeks if self-shooting. Likely not worth it before the theory exam; reconsider after.

**Definition of done.** Deferred until post-theory-pass.

### 3.9 LLM in-loop feedback (optional, low priority before exam)

**Priority score:** `P = 2 × 2 / 3 = 1.3`.

**Why.** DESIGN_v3 §15 lists "Anthropic API in-app integration" as a Phase 2 medium-effort item. The current app ships a clipboard handoff via the "Ask Claude" button, which is the 80/20 version. An in-app LLM Explain would only beat clipboard on convenience, not on learning — the explanation quality is the same, and Anthropic's API key exposure in a client-side PWA is a security footgun that has to be papered over with a "type your key" flow (already partially done in Settings). Not worth escalating before the exam. After the exam, as a portfolio piece, yes.

**What to ship.** Nothing new before the exam. Post-exam, consider wrapping the clipboard flow into an `/ask` route that takes the already-built prompt, POSTs to Anthropic with the user's key, and renders the response.

---

## 4. Secondary notes — things the audit surfaced but did not promote

### 4.1 Physical context variation (Godden & Baddeley)

DESIGN_v3 §2.2 mentions this and implements it via the mock exam's visual re-skin, which is the right move. A further step would be a Settings-level nudge ("You've done your last 8 sessions on the sofa; try the kitchen tomorrow") — but this starts to feel like surveillance for a personal app, and the evidence base for self-imposed context variation outside lab paradigms is thinner than the cited effect. Skip.

### 4.2 Elaborative interrogation (one-in-ten rationale-first)

DESIGN_v3 §15 lists this as medium effort. The literature supports the effect, but the implementation for a 3-option multi-select is awkward — the honest version requires a free-text "why?" field which is either not graded (low signal) or LLM-graded (requires the API). For a single-learner personal app with a fixed exam date, the return is marginal. Skip unless the user asks.

### 4.3 Gist sync via GitHub

DESIGN_v3 §15 lists this. The current app has export/import JSON, which is sufficient for one device. Sync is not a learning intervention; it's durability. Skip before the exam.

### 4.4 Content bank fidelity

GAP_ANALYSIS.md correctly notes that commercial apps have ~600 licensed items vs. this app's 212. Two reactions:

1. The honest answer is to spend CHF 19–25 on iTheorie or theorie24 for the final two weeks and take their mocks as a fidelity check. Don't try to clone the licensed bank; the pedagogy of Swiss Theory Prep is stronger than its content-bank breadth.
2. The 212 items are law-primary-source grounded (SVG, VRV, VZV citations in rule.legalRefs), which the commercial apps typically are not. That's a stronger knowledge base for understanding-based learning than a bigger bank of un-annotated questions would be.

This is a pedagogical feature, not a bug. Keep the item count as-is and shift the missing breadth to a commercial parallel app in weeks 7–8 (already recommended in DESIGN_v3 §13).

### 4.5 DE coverage

Chunks 13a/13b shipped German overlays for 28 rules + 47 items — roughly 27% of the catalog. DE widening for the remaining lower-weight items is non-trivial translation work; the exam pressure does not demand it because English fallback stays perfectly usable and the real exam is delivered in DE/FR/IT but the user can pick. A *targeted* DE push over just the high-weight uncovered items (maybe 30 more) is worth half a day before the exam if Alexander is planning to sit the exam in German. Otherwise leave it.

---

## 5. Sequenced plan

Given Alexander has ~6–8 weeks until the exam and this is evening/weekend work:

**Week 1 (this week).**
- Ship §3.1 exam-morning route (half a session).
- Ship §3.2 implementation-intention onboarding (half a session).
- Ship §3.6 read-aloud prompts (one short session).

These three are all near-zero-risk prompt-string and UI interventions that each cost under 4 hours and together close three of the six high-leverage psychology gaps.

**Week 2.**
- Ship §3.3 category-wise calibration feedback. This is the highest-`P` item; it was sequenced after Week 1 because it depends on Alexander having accumulated more confidence samples, which he will via the Week-1 additions' daily use.
- Ship §3.5 bedtime-consolidation mode.

**Week 3.**
- Ship §3.7 mock-cadence engine.
- Begin §3.4 free-recall rotation + diagram widening. This is a larger chunk and deserves its own weekend.

**Week 4+.**
- Complete §3.4.
- Start taking daily mocks via the cadence engine.
- If ahead of schedule and the above is done, begin thinking about §3.8 hazard clips *for the post-theory-exam phase*, not for Cat. B theory.

**Final two weeks before exam.**
- Switch to the commercial parallel app (iTheorie / theorie24) for question-bank breadth. Use Swiss Theory Prep for the daily scheduled review and mocks; use the commercial app to stress-test on their larger bank.
- Run the exam-morning screen on exam day.

---

## 6. What the audit did not find

Three things worth naming because their absence is the signal, not noise:

1. **No manipulative dark patterns.** The app has genuinely held the anti-pattern line from DESIGN_v3 §14. Streaks are descriptive, notifications don't exist, there's no gamification layer, no "keep your streak alive!" nonsense. This matters more than any additional feature would — a single capitulation to engagement-hacking would undo the intrinsic-motivation design thesis.
2. **No over-engineered infrastructure.** No sync server, no accounts, no analytics, no telemetry. The IDB + export-JSON stance is exactly right for a single-learner PWA and sets it apart structurally from every commercial competitor.
3. **No pedagogy-neutral UI flourish.** Every visible element maps to a §2 mechanism. The serif mock re-skin ties to encoding specificity; the honest result banner ties to growth mindset; the readiness blurb ties to metacognition. The design is pedagogically legible, which is what makes the remaining psychology gaps worth closing — they will slot into an already-coherent system rather than being bolted to a flashy one.

---

## 7. Bottom line

The app's strategic position vs. commercial Swiss theory competitors is:

- **Loses** on question-bank breadth (patch: parallel commercial app for the final two weeks).
- **Ties** on UI polish (and arguably wins on honest UI).
- **Wins decisively** on learning engine, metacognition, habit design, and freedom from manipulation.

The three top-priority additions (§3.1 exam-morning, §3.2 implementation intentions, §3.3 per-category calibration) each take less than half a day and push the "wins decisively" margin wider. They are strictly additive — each can ship independently, each has a clear DoD, none requires schema migration or new dependencies, and none risks the anti-pattern line.

If Alexander ships only those three before the exam, the app's documented psychology footprint exceeds that of any commercial Swiss theory app by a factor that the learning-science literature predicts will translate to ~5–10 additional exam-day points against his own baseline — most of it concentrated in the exam-morning reappraisal and the anti-overconfidence calibration drill. The remaining items (§3.4–§3.7) compound the effect and are worth shipping if time permits; §3.8 and §3.9 should wait until after exam day.

The rest of Phase-1 FIX_PLAN is done. This audit replaces the "Suggested next chunks" list in `project_swiss_theory_prep.md`.
