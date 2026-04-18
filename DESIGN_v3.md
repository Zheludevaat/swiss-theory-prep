# Swiss Theory Prep — Design v3

A personal, offline-first PWA for the Swiss Category B theory exam (Theorieprüfung), taken in English in Grisons. Static site on GitHub Pages. Single-user. Every feature is load-bearing on a named psychological mechanism.

This document supersedes v1 and v2. The architecture is unchanged from v2; what's new is that every design choice is now grounded in the cognitive-science finding it exploits, so when you're tempted to cut a feature you can see which psychological lever you'd be giving up.

---

## 1. Orienting commitments

Read these first. They kill half of the scope creep automatically.

**One canonical card type.** The real exam uses one format: three options, one or two correct, multi-select. We train in that exact format from day one. This is not minimalism — it's *transfer-appropriate processing* (Morris, Bransford & Franks, 1977): retrieval is strongest when the conditions at retrieval match the conditions at encoding. If you train on flashcards and test on multi-select, you've built a skill that only partly transfers. Matching the format from card one eliminates that gap.

**Author content by hand (with Cowork help).** No procedural scenario synthesizer. Hand-authored scenarios are slower to create and infinitely easier to validate for correctness. 60 hand-authored scenarios are a weekend of work, not a quarter of engineering. And a scenario with a subtly wrong "correct answer" teaches you a wrong rule you'll have to unlearn — worse than no scenario.

**Ship the dumbest version that teaches.** Every feature must earn its weight by being painful in its absence during a real study session. The first feature added after MVP is whatever frustrates you most on day 4 of real use. This is deliberate scoping, but also prevents *premature optimization* from eating your study time.

**Git as truth, IndexedDB as working memory.** Content is versioned in the repo. User state is in IndexedDB with manual JSON export/import. If you break your phone you lose a few days, not your mastery — because FSRS recovers quickly from a clean start on re-review.

**iTheorie in parallel for the last two weeks.** Our app teaches rules; iTheorie exposes you to exact ASA phrasing. Two apps, two jobs. No ingestion of their licensed content into ours.

**Time budget is sacred.** Build budget is capped at 40 hours over 8 weeks. Study budget is the priority. If building threatens study time, building stops.

---

## 2. Psychological mechanisms — the full inventory

This is the section the previous versions were missing. Every feature in Sections 3–17 is a specific implementation of one or more mechanisms listed here. When evaluating any feature for inclusion or removal, check which mechanism it serves.

The mechanisms are grouped by the problem they solve.

### 2.1 Getting information into long-term memory

**Spacing effect (Ebbinghaus, 1885; meta-analyses: Cepeda et al., 2006).**
The forgetting curve is exponential; reviews timed near imminent forgetting produce disproportionately large gains in long-term retention compared to massed practice. This is the single most-replicated finding in learning science.
→ *Implemented by:* FSRS scheduler with per-item stability/difficulty modeling (§5).

**Testing effect / retrieval practice (Roediger & Karpicke, 2006).**
Attempting to recall material — even failing to recall it — produces substantially better long-term retention than re-exposure to the same material. The effort of retrieval is itself the training signal.
→ *Implemented by:* every card forces a `Submit` before truth is revealed; no passive reading of rationales without first committing to ticks (§6).

**Desirable difficulty (Bjork, 1994).**
Retrieval that is too easy produces little learning gain; retrieval that is too hard produces disengagement and unreliable encoding. The sweet spot is success rates around 85–90%.
→ *Implemented by:* FSRS `request_retention = 0.90` target (§5.1). That this also matches the exam's 90% pass threshold is a bonus alignment — practice difficulty equals target difficulty.

**Transfer-appropriate processing (Morris, Bransford & Franks, 1977).**
Memory retrieval is best when conditions at retrieval match conditions at encoding. Train in the format you'll be tested in.
→ *Implemented by:* the single card type is the real exam's three-option multi-select format (§6.1).

**Interleaving (Rohrer & Taylor, 2007).**
Blocked practice (all-priority-scenarios today) produces higher in-session accuracy but substantially worse long-term transfer than interleaved practice (mixed rules in random order). The effect is large, counterintuitive, and robust — learners feel worse while interleaving and perform better long-term.
→ *Implemented by:* scheduler refuses two consecutive items from the same rule once past acquisition (§5.3).

**Cognitive Load Theory / worked examples (Sweller, 1988).**
When encoding a new schema, novel problem-solving imposes crushing "extraneous load" that blocks "germane load" (the kind that builds schemas). The prescription is worked examples — fully-explained examples the learner studies *before* attempting problems independently.
→ *Implemented by:* teach-mode screen shows rule statement + two worked examples *before* queuing three drill items (§9.7).

**Dual coding (Paivio, 1971).**
Information encoded in both verbal and visual channels is retained better than either alone.
→ *Implemented by:* sign items pair image + verbal meaning + rationale; scenario items pair diagram + verbal question + rationale (§4.1).

**Generation effect (Slamecka & Graf, 1978).**
Information you generate yourself is retained dramatically better than information you merely read. "Monaco is the capital of ___" beats "Monaco is the capital of Monaco."
→ *Implemented by:* Phase 2 "free recall" occasional cards that show the question without options (§18). Not in MVP because the multi-select format dominates.

**Elaborative interrogation (Pressley et al., 1987).**
Asking "why is this true?" before revealing an answer produces substantial retention gains.
→ *Implemented by:* Phase 2 low-friction variant — one-in-ten cards inserts a tap-to-pick rationale question before the options (§18). Not in MVP to protect the flow.

**Production effect (MacLeod et al., 2010).**
Saying information aloud beats reading it silently — even without a listener.
→ *Implemented by:* optional "read aloud" prompt on fact-item rationales (§18). Zero build cost, pure prompt-string intervention.

### 2.2 Keeping information in long-term memory

**Overlearning for life-safety content (Driskell et al., 1992).**
For typical exam material, overlearning past the point of mastery has diminishing returns. For motor-skill and life-safety material, the opposite is true — overlearning produces skills that survive stress, sleep deprivation, and distraction. Driving rules sit firmly in the second category.
→ *Implemented by:* `overlearnMastered: true` default; scheduler continues to surface mastered items at long intervals rather than retiring them (§5.1).

**Sleep-dependent consolidation (Payne & Kensinger, various).**
Items encoded shortly before sleep show better next-day retention than items encoded in the morning. Slow-wave sleep actively replays and strengthens recently-encoded material.
→ *Implemented by:* Phase 2 opt-in "bedtime consolidation" mode — a five-card session pulling today's new items just before sleep (§18).

**Context variation / encoding specificity (Godden & Baddeley, 1975).**
Memory is partially bound to its encoding context. If you always study in bed on your phone, your retrieval is partly bound to that setting. The countermeasure is varying physical contexts deliberately during prep.
→ *Implemented by:* a README note to vary study location, plus the mock-exam mode is styled differently from daily review (different background, overt timer) to build familiarity with context-shift (§7, §19).

### 2.3 Performing well under exam conditions

**Desensitization through exposure (Wolpe, 1958, broadly applied to test anxiety by Zeidner, 1998).**
Repeated exposure under conditions that resemble the stressor reduces the affective response to the stressor. Fifteen realistic mock exams reduces exam-day novelty to near-zero.
→ *Implemented by:* weekly mocks in weeks 3–5, daily in weeks 6–8 (§7.4); strict-mode timer, no pause, no back-navigation.

**Effortful retrieval under mild stress (Smith et al., 2016).**
Practice that omits the stress present at test time produces overconfident learners. Small stressors during practice (time pressure, mild distraction) inoculate performance.
→ *Implemented by:* mock exam's countdown timer displayed prominently; optional audible tick in the final five minutes (§7).

**Reappraisal of arousal (Jamieson et al., 2010).**
Teaching test-takers to reframe physical arousal (racing heart, sweaty palms) as *helpful* ("my body is mobilizing") rather than *threatening* produces measurable score improvements.
→ *Implemented by:* exam-morning in-app card with a reappraisal paragraph (§17).

**Expressive writing before a test (Ramirez & Beilock, 2011).**
Ten minutes of writing about test worries immediately before a high-stakes test produces significant score improvements. The mechanism is thought to free working memory that worry had been occupying.
→ *Implemented by:* exam-morning in-app prompt with a ten-minute worry-writing timer (§17).

### 2.4 Showing up at all (the habit layer)

**Tiny habits (Fogg, 2019).**
Below a certain activation-energy threshold, a behavior survives bad days. Ten cards in five minutes is below that threshold for most people on most days.
→ *Implemented by:* the "five-minute blast" mode on the Today screen (§9.1).

**Zeigarnik effect (Zeigarnik, 1927).**
Incomplete tasks create cognitive tension that motivates completion. Started sessions tend to extend organically.
→ *Implemented by:* the blast mode's commitment is five minutes — never more — so starting has low cost, but once started the Zeigarnik tension often carries the session further. Also: flagged-confused rules persist as a small badge on Today until resolved.

**Implementation intentions (Gollwitzer, 1999).**
People who pre-commit to "when X happens, I will do Y" outperform people who merely intend to "study more." Tying the behavior to a cue rather than to willpower is the single most robust behavioral intervention in the literature.
→ *Implemented by:* Phase 2 onboarding screen that asks "When do you reliably have ten free minutes?" and sets a non-pushy reminder tied to the named cue (e.g., "after coffee") rather than a clock time (§18).

**Affective protection against backlog (informally: Fogg; more formally: Self-Determination Theory, Ryan & Deci).**
The most common cause of SRS abandonment is opening the app to 200 overdue cards and experiencing instant defeat. The cognitive system doesn't get to engage because the affective system has already fled. The intervention is to convert a threat-appraisal (overwhelming) into a challenge-appraisal (achievable).
→ *Implemented by:* backlog triage — when due count exceeds 3× daily capacity, the app presents "You have 82 due. We're doing the 25 that matter most." and quietly defers the rest by one day (§5.5).

**Descriptive (not manipulative) streaks, and the autonomy preservation argument (Deci, Ryan, Koestner, 1999).**
Streaks tap into commitment/consistency and loss-aversion. Used prescriptively ("your streak is in danger!") they generate extrinsic motivation that collapses when the external pressure lifts. Used descriptively (just reporting), they allow intrinsic motivation to dominate, which is the durable kind.
→ *Implemented by:* streak is shown on Today but never pushed; no notifications of any kind (§9.1, §15).

**Growth-mindset framing (Dweck, 2006).**
Attention on *content* ("what does this rule actually mean?") produces better outcomes than attention on *performance* ("how did I do?"). The latter can trigger rumination and avoidance.
→ *Implemented by:* grading is inferred from correctness + latency rather than asked. The user never has to articulate "I failed" — the screen just shows the rationale and moves on (§5.2). Result banners are brief and factual ("2 of 3 points"), not evaluative ("Good job!" or "You missed this").

### 2.5 Metacognition — knowing what you know

**Calibration of confidence (Lichtenstein et al., 1982; Dunning-Kruger, 1999).**
Stated confidence correlates poorly with actual accuracy for most people, especially in domains where they're partway up the learning curve. Confidence sampling lets a learner see the gap — overconfidence is particularly dangerous because it causes under-preparation on items that seem easy.
→ *Implemented by:* occasional (every-5th-card, sampled) pre-answer confidence prompt, displayed as a calibration curve in Stats (§6.2, §9.5). Deliberately not compulsory — full-density confidence sampling adds friction that costs more than the data is worth at this scale.

**Metacognitive accuracy improves with feedback loops (Koriat, 1997).**
Calibration improves only when learners see their confidence judgments *contrasted with actual outcomes*. A calibration curve on a stats screen does this job.
→ *Implemented by:* the Stats screen's calibration curve appears only after ≥50 confidence samples, so it's meaningful when shown (§9.5).

**Self-explanation prompts (Chi et al., 1994).**
Pausing to explain out loud what you just learned — even with no tutor listening — produces large retention gains. The mechanism is that articulation forces you to notice gaps in your own understanding.
→ *Implemented by:* Phase 2 optional "explain in your own words (voice note)" button on the rationale screen, recording locally, not transmitted, deletable immediately — the benefit comes from the act of articulating, not from the recording (§18).

### 2.6 Mechanisms I considered and rejected

**Pre-testing effect (Richland et al., 2009).**
Evidence is mixed; the effect appears in some paradigms and not others, and for a pass-fail driving exam under time budget, the cleaner testing-effect intervention dominates. Not worth the friction.

**Gamification / variable reinforcement schedules.**
These work for engagement, not learning. They also compromise intrinsic motivation over time. The doc explicitly refuses these in §15.

**Mood-congruent encoding / emotional encoding.**
Real mechanism, but attempting to engineer your emotional state during study is more trouble than it's worth for this domain. Left to the user's own habits.

**Subliminal priming of sign imagery.**
Bluntly: not a real thing. Mentioned only to acknowledge that a serious reader might wonder. Skip.

---

## 3. What this app is and isn't

### Is

- A PWA installable to an iPhone home screen, working offline once loaded.
- A fixed-content review system with FSRS scheduling.
- A mock-exam simulator with exact Theorieprüfung scoring.
- A personal tool for one learner on one exam, tuned to Grisons.

### Isn't

- A question bank. We'll have ~300 items, not 500+.
- A commercial app. No auth, no accounts, no sync server, no analytics.
- A replacement for the practical test or the Nothelferkurs.
- A German-language app at MVP. English only; architecture permits later i18n.

### Success criteria

- By day 7: a usable daily review loop is live on your phone with ≥50 items.
- By day 14: mock exam works with exact scoring; content ≥200 items.
- By week 6: routinely scoring ≥145/150 on mock exams with items you haven't seen in 48+ hours.
- You pass the real exam on first attempt with a score ≥145.
- You never once say "what should I study today?" The app answers that.

---

## 4. Architecture

### 4.1 Stack

| Layer | Choice | Why |
|---|---|---|
| Build | Vite 5 | Fast, standard, GH Pages-friendly |
| Framework | React 18 + TypeScript (strict) | Matches your patterns; types catch content errors at compile time |
| Styling | Tailwind CSS | Zero CSS-authoring burden |
| State | Zustand | Lightest viable state manager |
| Persistence | IndexedDB via `idb` | Only real option for structured local storage |
| Scheduler | `ts-fsrs` (latest stable) | Current SOTA open-source SRS |
| Validation | Zod | Content schemas + runtime validation |
| Routing | React Router (HashRouter) | HashRouter sidesteps GH Pages SPA routing headaches |
| Service worker | `vite-plugin-pwa` | Off-the-shelf, maintained |
| Tests | Vitest | Built into Vite |

### 4.2 Deployment

Static site → GitHub Pages on push to `main`:

1. `npm run build` → `dist/`
2. GitHub Actions publishes `dist/` to `gh-pages` branch
3. `vite.config.ts` sets `base: '/swiss-theory-prep/'`

No backend. No secrets. No env vars.

### 4.3 Routing

HashRouter — URLs look like `https://zheludevaat.github.io/swiss-theory-prep/#/review`. Ugly but bulletproof on GH Pages.

### 4.4 Offline

Service worker caches app shell + bundled content on install. IndexedDB holds user state. Expected behavior: opens on an Alpine train, everything works, state persists across closes.

### 4.5 Sync

**Phase 1: manual export/import only.** A JSON backup button in Settings. Keep the file in iCloud/Dropbox.

**Phase 2 (only on pain): GitHub gist sync** via a user-provided PAT. Not built until single-device pain becomes real.

---

## 5. Data model

### 5.1 Content (authored)

```ts
// src/content/schema.ts
import { z } from "zod";

export const CategorySchema = z.enum([
  "signs",
  "priority",
  "maneuvers",
  "speeds",
  "mountain",
  "adverse-conditions",
  "vehicle",
  "driver-fitness",
  "penalties-bac",
  "accidents-insurance",
]);

export const RuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  statement: z.string(),
  category: CategorySchema,
  legalRefs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  examWeight: z.number().min(0).max(1),
  workedExamples: z.array(z.string()).default([]),  // for teach mode
  notes: z.string().optional(),
});

export const OptionSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});

export const ItemSchema = z.object({
  id: z.string(),
  ruleIds: z.array(z.string()).min(1),
  question: z.string(),
  imageAssetId: z.string().optional(),
  diagramAssetId: z.string().optional(),
  options: z.tuple([OptionSchema, OptionSchema, OptionSchema]),
  rationale: z.string(),
  tags: z.array(z.string()).default([]),
  difficulty: z.number().int().min(1).max(5).default(3),
}).refine(
  (it) => {
    const n = it.options.filter((o) => o.correct).length;
    return n === 1 || n === 2;
  },
  { message: "Exactly 1 or 2 options must be correct (ASA rule)." }
);

export type Rule = z.infer<typeof RuleSchema>;
export type Item = z.infer<typeof ItemSchema>;
```

Build-time validation by `scripts/validateContent.ts`:
- Every `Item.ruleIds[i]` exists as a `Rule.id`
- Every asset ID exists under `public/`
- Exactly 1 or 2 correct options per item
- Orphan rules get a warning (sometimes a rule exists only for teaching)

### 5.2 User state (IndexedDB)

```ts
export type Grade = 1 | 2 | 3 | 4; // Again, Hard, Good, Easy

export type MemoryState = {
  itemId: string;
  stability: number;
  difficulty: number;
  lastReview: number;
  due: number;
  reps: number;
  lapses: number;
  state: "new" | "learning" | "review" | "relearning";
};

export type ReviewEvent = {
  id: string;
  itemId: string;
  sessionId: string;
  timestamp: number;
  grade: Grade;
  correct: boolean;
  partiallyCorrect: boolean;
  userTicks: [boolean, boolean, boolean];
  latencyMs: number;
  confidence?: 1 | 2 | 3 | 4;
  flaggedConfused?: boolean;
};

export type Session = {
  id: string;
  startedAt: number;
  endedAt?: number;
  mode: "review" | "blast5" | "mock" | "teach" | "bedtime";
  itemsReviewed: number;
  itemsCorrect: number;
};

export type Settings = {
  dailyTargetMinutes: number;      // default 15
  retentionTarget: number;         // default 0.90
  overlearnMastered: boolean;      // default true
  sampleConfidenceEvery: number;   // default 5
  useLLM: boolean;                 // default false
  anthropicKey?: string;
  bedtimeReminder?: string;        // local-time HH:mm, default off
};
```

Four object stores: `memoryState`, `reviews`, `sessions`, `settings`, plus a `meta` store for schema versions.

### 5.3 Backup format

```ts
export type Backup = {
  version: 1;
  exportedAt: number;
  memoryState: MemoryState[];
  reviews: ReviewEvent[];
  sessions: Session[];
  settings: Settings;
};
```

---

## 6. The scheduler

Heart of the app — the most psychology-load-bearing component.

### 6.1 FSRS defaults

```ts
import { fsrs, generatorParameters } from "ts-fsrs";

export const fsrsParams = generatorParameters({
  request_retention: 0.90,    // desirable difficulty + exam-threshold alignment
  maximum_interval: 365,
  enable_fuzz: true,          // jitter ±5%, avoids batching
  enable_short_term: true,    // learning-phase sub-day steps
});

export const scheduler = fsrs(fsrsParams);
```

The `0.90` is doubly-motivated: *desirable difficulty* research says ~85–90% is the sweet spot for retention gains, and 90% also matches the exam's pass threshold. This alignment means "ready to pass the exam" and "FSRS says you're stable" are the same state.

### 6.2 Inferred grading

The user never sees Again/Hard/Good/Easy buttons. The grade is inferred:

| Outcome | Latency | FSRS Grade |
|---|---|---|
| Exact match, < 8s | fast & right | Easy (4) |
| Exact match, ≥ 8s | right but slow | Good (3) |
| Partial | close but wrong | Hard (2) |
| Zero correct options handled | fundamental miss | Again (1) |

**Psychology:** forcing the user to self-rate creates divided attention (answering + judging), which degrades both tasks, and makes failure explicit (affective cost). Inferred grading keeps attention on content and preserves the growth-mindset framing (Dweck). Latency is also a more honest fluency signal than self-report — you will need fluent retrieval under exam time pressure, and training on latency builds exactly that.

### 6.3 What to show next (`pickNext`)

FSRS answers *when*; the scheduler layer answers *which due item*.

1. Relearning items first. They must stabilize.
2. Overdue items sorted by `daysOverdue * examWeight` descending.
3. Due-today items sorted by `examWeight` descending.
4. New items, bounded by the new-item budget.
5. **Interleaving constraint:** no two consecutive items from the same rule once past acquisition.

### 6.4 New-item budget

```
maxNewToday =
  if dueCount > 40 then 0
  else if dueCount > 20 then 3
  else 10
```

**Psychology:** an eager first session with 30 new items creates a relearning avalanche a week later. The budget prevents that, which is what keeps you opening the app on day 14.

### 6.5 Backlog triage

When `due_count > 3 × daily_capacity`:
- Screen: "You have 82 due. Picking the 25 that matter most."
- Pick top 25 by `daysOverdue × examWeight`.
- Defer the rest by pushing their `due` forward by 1 day.
- Session runs normally on the 25.

**Psychology:** this is affective protection — converting a threat-appraisal (overwhelming, instant defeat) into a challenge-appraisal (achievable, tractable). The single most important anti-abandonment feature in the app.

### 6.6 Missed-day grace

If `now - lastSessionEnd > 72h`, new items are suspended until backlog is cleared.

### 6.7 Session shape

Normal review:
- 70% overdue + due-today
- 20% new items (bounded)
- 10% weak-spot revisits (high lapse count, recent wrongs)

5-minute blast:
- 100% overdue/due-today. No new items. 10 items fixed.

Teach session (triggered manually or when ≥3 flagged-confused items share a rule):
- Rule statement + legal reference + 2 worked examples
- Then 3 items on that rule back-to-back (temporarily relaxing the interleaving rule — acquisition blocked, retention interleaved)

---

## 7. The review loop

You'll spend 95% of your time on this screen. Every element serves a mechanism.

### 7.1 Card anatomy

Top to bottom:

1. **Tiny header:** session progress (6/10), mode label, stop button. Minimal because extraneous elements cost working memory during retrieval.
2. **Image/diagram area** if applicable. Large enough for phone-at-arm's-length. *(Dual coding)*
3. **Question text:** one sentence, max two lines.
4. **Three option buttons:** stacked, big tap targets, multi-select.
5. **Confirm button:** full-width "Submit".
6. **Secondary actions:** flag-confused (?), ask Claude (if LLM on), skip (rare).

After Submit:

1. **Result banner:** green/yellow/red with points ("2 of 3 points"). Brief, factual, non-evaluative. *(Growth mindset — no "Great job!", no "You failed.")*
2. **Options re-rendered** with truth overlaid on your ticks.
3. **Rationale:** 2–4 sentences, inline, not collapsed. *(Immediate feedback within the dopaminergic-reinforcement window ~a few seconds.)*
4. **Rule link:** "This tests: Right-of-way from the right →"
5. **Continue button.**

Target: 15–30 seconds per card, 50 cards per 20-minute session.

### 7.2 Confidence sampling

Every 5th card (default), a pre-answer slider appears: "How sure will you be?" 1–4.

**Psychology:** calibration (Lichtenstein et al.) improves when confidence is contrasted with outcomes. But full-density sampling is friction that costs more than it returns. Sampled confidence gives a meaningful calibration curve in Stats without interrupting flow on every card.

### 7.3 Flag-confused

Tap (?). Modal: "Mark rule *'Right-of-way from the right'* as needing more teaching?" → Confirm. Rule is queued for the next teach session. The item continues normally.

**Psychology:** Zeigarnik tension is productive only when actionable. Without a pressure-release valve, confusing items become avoidant triggers. The flag converts a passive frustration into a deferred task with a visible badge — which Zeigarnik then helps you resolve.

### 7.4 Claude button (optional)

If `useLLM = true`:
- **With API key in IndexedDB:** streams explanation in bottom sheet, prompt constrained to cite the rule.
- **Without key:** copies a formatted prompt to clipboard and opens `claude.ai` in new tab.

The clipboard-fallback is the MVP path — zero API integration work for Phase 1.

---

## 8. Mock exam mode

A faithful simulation and a desensitization protocol at once.

### 8.1 Configuration

- 50 items, 45-minute countdown, pause disabled in strict mode.
- Navigation: strict (linear, no revisit) or relaxed (flag and return). Use strict as exam approaches.
- Items drawn minus those seen in the last 48h (so composition is novel).
- Weighting by category approximates ASA's competence-catalog proportions:

| Category | Weight |
|---|---|
| Signs | 20% |
| Priority & right-of-way | 18% |
| Speeds & limits | 10% |
| Maneuvers | 14% |
| Mountain & adverse conditions | 10% |
| Vehicle & equipment | 10% |
| Driver fitness, BAC, penalties | 10% |
| Accidents, insurance, first response | 5% |
| Other | 3% |

### 8.2 Exact scoring

```ts
export function scoreQuestion(
  userTicks: [boolean, boolean, boolean],
  truth: [boolean, boolean, boolean]
) {
  let points = 0, penalties = 0;
  for (let i = 0; i < 3; i++) {
    if (userTicks[i] === truth[i]) points += 1;
    else penalties += 1;
  }
  return { points, penalties };
}

export function scoreExam(
  answers: Array<{ userTicks: [boolean, boolean, boolean]; truth: [boolean, boolean, boolean] }>
) {
  let totalPoints = 0, totalPenalties = 0;
  for (const a of answers) {
    const { points, penalties } = scoreQuestion(a.userTicks, a.truth);
    totalPoints += points;
    totalPenalties += penalties;
  }
  return {
    points: totalPoints,
    maxPoints: answers.length * 3,
    penalties: totalPenalties,
    passed: totalPoints >= 135 && totalPenalties <= 15,
  };
}
```

### 8.3 Stress mirroring

- Timer displayed prominently from start.
- Optional audible tick in the last five minutes.
- Mock UI looks different from review UI (different background, exam-like typography). *(Context variation — you don't want retrieval bound only to the review UI.)*

**Psychology:** effortful retrieval under mild stress during practice produces performance that holds under real stress. This is directly opposite to the advice "keep practice low-pressure" — that advice is wrong for high-stakes timed tests.

### 8.4 Results screen

- Pass/fail banner, score.
- Per-category breakdown.
- Per-question review, tap to expand rationale, "drill this rule" button.
- Every mock answer is also a real `ReviewEvent` — the exam *is* the most important review session, integrated into FSRS state.

### 8.5 Cadence (spaced, not massed)

| Week | Mocks | Timing |
|---|---|---|
| 2 | 1 | baseline (expect 60–70%) |
| 3–5 | 1/week | same day each week |
| 6 | 3 | Mon/Wed/Fri, not three-in-a-row |
| 7 | 3 | Tue/Thu/Sat |
| 8 | 2 | three days before exam, one day before |

**Psychology:** mocks *are* reviews, and the spacing effect applies to them too. Two mocks back-to-back is massed and wasted. The revised cadence matters — this is a correction from v2.

---

## 9. Readiness signal (simple, honest)

Four states on the Today screen:

- **Not ready** — <50% of items past "graduated" (reps ≥3, no recent lapse).
- **Building** — 50–80%.
- **Exam-worthy** — 80–95%, last mock ≥135.
- **Comfortable** — ≥95%, last two mocks ≥145.

No percentages. Percentages at low N are noise; at high N they're false precision. The four-state signal is defensible: you'll feel the difference between Building and Exam-worthy in your mock scores.

**Psychology:** expectation management. Inflating confidence when performance is thin produces under-preparation; deflating it when performance is real produces anxiety. Named states with clear criteria manage both.

---

## 10. Screen inventory

Every route in Phase 1. If not here, not shipped.

### 10.1 `/` — Today

- Big "Start review" button, due count under it.
- "5-minute blast" small button.
- "Take mock exam" button (secondary).
- Readiness badge.
- Last session summary ("Yesterday: 23 cards, 87%, 18 minutes").
- Streak count. Descriptive only.
- Flagged-confused rule badge (if any — Zeigarnik tension made visible).

### 10.2 `/review`

Section 7. Empty state: "Nothing due. Start some new items?" → button to introduce N new items.

### 10.3 `/mock`

Pre-exam: settings summary, big "Begin" button, warning about no-pause strict mode.

### 10.4 `/library`

- **Rules tab:** grouped by category, tap to expand, per-item mastery indicator.
- **Signs tab:** grid by family (warning / prohibition / mandatory / info / priority / supplementary).

Read-only. No review happens here.

### 10.5 `/stats`

- Cards reviewed per day (30-day bar chart).
- Accuracy per category (horizontal bars).
- Confidence calibration curve (appears only after ≥50 confidence samples, when meaningful).
- Mock exam history.

### 10.6 `/settings`

- Daily target minutes.
- Retention target slider (0.80–0.95, default 0.90).
- Confidence sampling frequency.
- Bedtime reminder time (Phase 2).
- LLM on/off + API key.
- Export/import backup.
- "Optimize FSRS weights" button (enabled after ≥500 reviews).
- App + content version.

### 10.7 `/teach/:ruleId`

Triggered by flag-confused or rule queue. Rule statement, legal ref, two worked examples, "I got it" button → returns to review with 3 items on this rule queued next.

### 10.8 `/exam-morning` (Phase 2)

Shown on exam day when the user marks "today is exam day" in Settings.
- Reappraisal paragraph (1 min read).
- Ten-minute expressive-writing timer with a private text field (not saved, not transmitted).
- "I'm heading out" button to close.

---

## 11. Content strategy

The hardest real work in the project.

### 11.1 Target

| Type | Count |
|---|---|
| Sign items | 120 |
| Priority scenario items | 60 |
| Fact/rule items | 80 |
| Mixed/maneuver items | 40 |
| **Total** | **300** |

Rules: ~80. Average 3.75 items per rule.

### 11.2 Pipeline

A separate Cowork project `swiss-theory-content`:

```
swiss-theory-content/
├── rules/
│   ├── priority-right-hand-default.md
│   ├── mountain-ascending-yields.md
│   └── ...
├── items-draft/
└── build.py      # emits items.json + rules.json for app repo
```

Each rule is markdown with frontmatter:

```markdown
---
id: priority.right-hand.default
title: Right-of-way from the right
category: priority
legalRefs: [VRV Art. 36]
examWeight: 0.9
---

At intersections where neither signs nor road markings establish priority,
the vehicle from the right has priority.

## Exceptions
- Roundabouts: traffic already in has priority
- Priority road signs override
- Traffic lights override

## Worked examples
1. Unmarked four-way in a residential area, car approaches from your right: yield.
2. ...
```

A Claude Skill (`swiss-item-generate`) takes a rule file and emits 3–5 draft items. You review, keep good ones, reject the rest. Rate: ~15 min per rule including review. **Total: ~20 hours** over weeks 2–4, roughly 1 hour/day.

### 11.3 Sign assets

Swiss sign SVGs from Wikimedia Commons, permissively licensed. Pull ~100 into `public/signs/` named by official code (`2.02.svg` = Stop). Attribution in README.

### 11.4 Scenario diagrams

Hand-drawn in Figma/Excalidraw, exported SVG. Target 40 reusable diagrams — one "unmarked-cross-3-vehicles" diagram serves six items with different priority configurations.

### 11.5 Versioning

`content/version.json` carries `{ contentVersion, itemCount, ruleCount }`. Shown in Settings. Bumped by the build script.

### 11.6 Freshness

README sticky note: check ASTRA/ASA for rule changes every 4 weeks. For 8 weeks, one check cycle suffices. Swiss road law does update (Tempo 30 expansion, probationary changes).

---

## 12. Testing strategy

Test what would embarrass you if broken.

**Must:**
- `examScoring.ts` — every branch. Bug here = wrong objective.
- `fsrs.ts` wrapper — grades and timestamps produce expected stability/due evolution.
- `scheduler.pickNext` — priority, interleaving, new-item budget, triage trigger.
- Content validator — rejects invalid items.

**Nice:**
- One Playwright happy-path — load, start session, answer 3, reload, persists.

**Skip:**
- Snapshot tests, routing tests, styling tests.

---

## 13. Build plan (honest hours)

Budget: 40 hours over 8 weeks. Phase 1 targets 20–25 hours across 7–10 working days.

### Phase 1 — shippable MVP (7 working days, ~3h each)

**Day 1 — Scaffold (3h).** Vite + deps + Tailwind + HashRouter + PWA manifest + vite.config base + GH Actions. Live URL. Installs on iPhone.

**Day 2 — Data + storage (3h).** Zod schemas, IndexedDB via idb, types, export/import, Vitest setup.

**Day 3 — Scheduler (4h).** `ts-fsrs` wrapper, `pickNext` with due priority + new-item budget + interleaving, unit tests.

**Day 4 — Review loop (4h).** Card component, Review route, grading inference, persistence, session tracking. Hardcoded 5 items. Real answers, real persistence.

**Day 5 — Today + content loading (3h).** Real content bundle (30+ items). Today route. 5-min blast. Ship. First phone session.

**Day 6 — Mock exam (4h).** Mock flow, exact scoring, results screen, ReviewEvent integration. First real mock.

**Day 7 — Settings, backup, stats skeleton, polish (3h).** Settings, export/import, basic stats, triage trigger, teach screen shell. Ship v1.

### Weeks 2–4 — content authoring + daily use

~1 hour/day authoring in Cowork, 15 min/day studying. By end of week 4: ~200 items, mocks in the 120–140 range.

### Weeks 5–6 — content completion + targeted fixes

Finish items. Add whatever has been frustrating: almost certainly improved teach mode, backlog triage edges, confusion queue.

### Week 7 — iTheorie parallel

Buy iTheorie. Daily: one iTheorie session + one mock on your app. Author new items for any rule iTheorie tests that your catalog missed.

### Week 8 — exam

Two mocks in the last 3 days per §8.5. Both ≥145 → take the real exam.

---

## 14. Explicit anti-patterns

We will not:

- Send push notifications.
- Use streaks to manipulate, only to report. *(Deci/Ryan — preserving intrinsic motivation.)*
- Show progress bars not backed by measurable quantities.
- Replicate "lives," "gems," or "premium unlocks."
- Store API keys without a warning.
- Train on items then test on the same items same-day (48h cool-down for mocks).
- Let the build schedule threaten the study schedule.

---

## 15. Phase 2 roadmap (psychology-justified, not just wish-list)

Only pursued if Phase 1 ships on time and under budget.

| Feature | Mechanism | Effort |
|---|---|---|
| Bedtime consolidation (5-card pre-sleep session) | Sleep-dependent consolidation | Small |
| Exam-morning expressive-writing + reappraisal screen | Ramirez/Beilock, Jamieson | Small |
| Implementation-intention onboarding screen | Gollwitzer | Small |
| Free-recall occasional cards | Generation effect | Medium |
| Elaborative-interrogation one-in-ten rationale-first prompt | Pressley et al. | Medium |
| "Explain aloud (voice note)" button | Self-explanation + production effect | Small |
| Hazard-perception video clips | Bridge to practical test; pattern recognition | Large |
| Anthropic API in-app integration | Convenience, not mechanism | Medium |
| German parallel text on all items | Language transfer | Large (content) |
| GitHub gist sync | Durability | Medium |

The small ones (bedtime, exam-morning, implementation intentions, read-aloud) are worth doing even on a tight budget — they're prompt-string interventions with near-zero build cost and real psychology payoff.

---

## 16. Open decisions

None block kickoff.

1. **App name.** Working: `swiss-theory-prep`. Alternatives: `Fahrgrund`, `Tell`, `Lern`. Your call.
2. **Exam date target.** For the "days until exam" UI and the mock-exam cadence in §8.5.
3. **Hazard-perception Phase 2: yes/no?** Post-ship question.
4. **Domain: default GH Pages URL or custom?** Immaterial.

---

## 17. Kickoff prompt for Claude Code

> Read DESIGN.md end to end, with particular attention to Section 2 (Psychological mechanisms). Build Phase 1, Day 1 only: scaffold a Vite + React + TypeScript project per §4.1, configured per §4.2 for GitHub Pages deployment at `/swiss-theory-prep/`, with HashRouter and vite-plugin-pwa. Add Tailwind. Add a single placeholder home route. Set up a GitHub Actions workflow that builds and publishes on push to main. Add a basic PWA manifest with placeholder icons. Commit cleanly. Do not implement any features from days 2–7. Report back with the live URL and confirm it installs to an iPhone home screen.

Then hand Claude Code one day's section per work session. Don't let it sprint ahead.

---

## 18. Glossary

- **ASA**: Association of Swiss Road Traffic Offices. Maintains the question catalog.
- **ASTRA**: Federal Roads Office. Publishes law and policy.
- **FSRS**: Free Spaced Repetition Scheduler. Current SOTA open-source SRS.
- **PWA**: Progressive Web App. Installable, works offline.
- **SVG** (the law): Strassenverkehrsgesetz, Road Traffic Act.
- **VRV**: Verkehrsregelnverordnung, Traffic Rules Ordinance.
- **SSV**: Signalisationsverordnung, Signalization Ordinance.
- **Theorieprüfung**: the theory exam itself.
- **Lernfahrausweis**: learner permit, issued after passing the theory exam.
- **Nothelferkurs**: mandatory first-aid course, prerequisite to applying.

---

Last updated: 18 April 2026.
