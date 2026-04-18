// Zustand store — in-memory mirror of memory state, settings, and the active
// session. Persists via the IndexedDB layer, never directly.

import { create } from "zustand";
import { ITEMS, RULES } from "@/content/bundle";
import {
  addReview,
  allFlagged,
  allMemoryState,
  flagRule as dbFlagRule,
  clearFlag as dbClearFlag,
  getMemoryState,
  getSettings,
  putMemoryState,
  putSettings,
  recentSessions,
  reviewsSince,
  startSession,
  updateSession,
} from "@/db";
import {
  DEFAULT_SETTINGS,
  type FlaggedRule,
  type MemoryState,
  type ReviewEvent,
  type Session,
  type SessionMode,
  type Settings,
} from "@/db/types";
import { applyGrade, emptyMemory, makeScheduler } from "@/scheduler/fsrs";
import { gradeAnswer, type GradingInput } from "@/scheduler/grading";
import { buildCatalog, type CatalogIndex } from "@/scheduler/pickNext";
import { uuid } from "@/lib/uuid";

type LoadStatus = "idle" | "loading" | "ready" | "error";

type State = {
  status: LoadStatus;
  catalog: CatalogIndex;
  memory: Map<string, MemoryState>;
  settings: Settings;
  session?: Session;
  recent: Session[];
  flagged: FlaggedRule[];
  reviews24h: ReviewEvent[];
};

type Actions = {
  init: () => Promise<void>;
  reloadMemory: () => Promise<void>;
  startReview: (mode: SessionMode) => Promise<Session>;
  finishSession: () => Promise<void>;
  recordReview: (
    itemId: string,
    grading: GradingInput,
    extras?: { confidence?: 1 | 2 | 3 | 4; flaggedConfused?: boolean },
  ) => Promise<{ event: ReviewEvent; nextMemory: MemoryState }>;
  flagRule: (ruleId: string) => Promise<void>;
  clearFlag: (ruleId: string) => Promise<void>;
  saveSettings: (s: Partial<Settings>) => Promise<void>;
};

export const useStore = create<State & Actions>((set, get) => ({
  status: "idle",
  catalog: buildCatalog(ITEMS, RULES),
  memory: new Map(),
  settings: DEFAULT_SETTINGS,
  recent: [],
  flagged: [],
  reviews24h: [],

  async init() {
    if (get().status === "loading" || get().status === "ready") return;
    set({ status: "loading" });
    try {
      const [memList, settings, recent, flagged, recent24h] = await Promise.all([
        allMemoryState(),
        getSettings(),
        recentSessions(7),
        allFlagged(),
        reviewsSince(Date.now() - 24 * 60 * 60 * 1000),
      ]);
      const memory = new Map(memList.map((m) => [m.itemId, m]));
      set({
        status: "ready",
        memory,
        settings,
        recent,
        flagged,
        reviews24h: recent24h,
      });
    } catch (err) {
      console.error(err);
      set({ status: "error" });
    }
  },

  async reloadMemory() {
    const memList = await allMemoryState();
    set({ memory: new Map(memList.map((m) => [m.itemId, m])) });
  },

  async startReview(mode) {
    const session: Session = {
      id: uuid(),
      startedAt: Date.now(),
      mode,
      itemsReviewed: 0,
      itemsCorrect: 0,
    };
    await startSession(session);
    set({ session });
    return session;
  },

  async finishSession() {
    const s = get().session;
    if (!s) return;
    const ended: Session = { ...s, endedAt: Date.now() };
    await updateSession(ended);
    const recent = await recentSessions(7);
    set({ session: undefined, recent });
  },

  async recordReview(itemId, grading, extras) {
    const { settings, session } = get();
    if (!session) throw new Error("No active session");

    const result = gradeAnswer(grading);
    const scheduler = makeScheduler(settings.retentionTarget);

    const prev = (await getMemoryState(itemId)) ?? emptyMemory(itemId);
    const next = applyGrade(scheduler, prev, result.grade);
    await putMemoryState(next);

    const event: ReviewEvent = {
      id: uuid(),
      itemId,
      sessionId: session.id,
      timestamp: Date.now(),
      grade: result.grade,
      correct: result.correct,
      partiallyCorrect: result.partiallyCorrect,
      userTicks: grading.userTicks,
      latencyMs: grading.latencyMs,
      ...(extras?.confidence !== undefined ? { confidence: extras.confidence } : {}),
      ...(extras?.flaggedConfused ? { flaggedConfused: true } : {}),
    };
    await addReview(event);

    // Update session counters.
    const updated: Session = {
      ...session,
      itemsReviewed: session.itemsReviewed + 1,
      itemsCorrect: session.itemsCorrect + (result.correct ? 1 : 0),
    };
    await updateSession(updated);

    // Update memory map and reviews24h in store.
    const memory = new Map(get().memory);
    memory.set(itemId, next);
    set({
      memory,
      session: updated,
      reviews24h: [...get().reviews24h, event],
    });

    return { event, nextMemory: next };
  },

  async flagRule(ruleId) {
    await dbFlagRule(ruleId);
    set({ flagged: await allFlagged() });
  },

  async clearFlag(ruleId) {
    await dbClearFlag(ruleId);
    set({ flagged: await allFlagged() });
  },

  async saveSettings(partial) {
    const next = { ...get().settings, ...partial };
    await putSettings(next);
    set({ settings: next });
  },
}));
