// IndexedDB wrapper — the app's only persistent store (DESIGN_v3 §5.2).
// Object stores: memoryState, reviews, sessions, settings, flagged, meta.
//
// We keep this small and typed. No queries the UI can misuse — every method
// has a narrow purpose.

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import {
  DEFAULT_SETTINGS,
  type Backup,
  type FlaggedRule,
  type MemoryState,
  type MockResult,
  type ReviewEvent,
  type Session,
  type Settings,
} from "./types";

const DB_NAME = "swiss-theory-prep";
// v2: add by-timestamp index on reviews + recover from any pre-existing v1 db
//     from an earlier deploy that used a different schema. Migration from v1 is
//     destructive (the prior data shape is incompatible) but only happens once
//     to recover from the broken first deploy.
// v3: add mockHistory store. Additive — preserves all v2 data.
const DB_VERSION = 3;

interface AppDB extends DBSchema {
  memoryState: {
    key: string; // itemId
    value: MemoryState;
    indexes: { "by-due": number };
  };
  reviews: {
    key: string; // event id
    value: ReviewEvent;
    indexes: { "by-item": string; "by-session": string; "by-timestamp": number };
  };
  sessions: {
    key: string; // session id
    value: Session;
    indexes: { "by-startedAt": number };
  };
  settings: {
    key: string; // always "singleton"
    value: Settings;
  };
  flagged: {
    key: string; // ruleId
    value: FlaggedRule;
  };
  meta: {
    key: string; // e.g. "schemaVersion", "contentVersion"
    value: string;
  };
  mockHistory: {
    key: string; // mock result id (uuid)
    value: MockResult;
    indexes: { "by-at": number };
  };
}

let _db: Promise<IDBPDatabase<AppDB>> | null = null;

/** Lazily open the db. Safe to call multiple times. */
export function db(): Promise<IDBPDatabase<AppDB>> {
  if (_db) return _db;
  _db = openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(dbi, oldVersion) {
      // v0/v1 → v2: the first deploy shipped an incompatible v1 schema. If we
      // ever see that old shape, nuke it and rebuild. This is the only
      // destructive path; every later upgrade is additive.
      if (oldVersion < 2) {
        for (const name of Array.from(dbi.objectStoreNames)) {
          dbi.deleteObjectStore(name);
        }
        const mem = dbi.createObjectStore("memoryState", { keyPath: "itemId" });
        mem.createIndex("by-due", "due");

        const rev = dbi.createObjectStore("reviews", { keyPath: "id" });
        rev.createIndex("by-item", "itemId");
        rev.createIndex("by-session", "sessionId");
        rev.createIndex("by-timestamp", "timestamp");

        const sess = dbi.createObjectStore("sessions", { keyPath: "id" });
        sess.createIndex("by-startedAt", "startedAt");

        dbi.createObjectStore("settings");
        dbi.createObjectStore("flagged", { keyPath: "ruleId" });
        dbi.createObjectStore("meta");
      }
      // v2 → v3: add mockHistory store. Additive, preserves all prior data.
      if (oldVersion < 3) {
        const mock = dbi.createObjectStore("mockHistory", { keyPath: "id" });
        mock.createIndex("by-at", "at");
      }
    },
  });
  return _db;
}

// ---------- memoryState ----------

export async function getMemoryState(itemId: string): Promise<MemoryState | undefined> {
  return (await db()).get("memoryState", itemId);
}

export async function putMemoryState(state: MemoryState): Promise<void> {
  await (await db()).put("memoryState", state);
}

export async function allMemoryState(): Promise<MemoryState[]> {
  return (await db()).getAll("memoryState");
}

/**
 * Bump the `due` field on a set of items by exactly one day. Used by the
 * triage write-back path (DESIGN_v3 §6.6) so that deferred items don't get
 * reconsidered in the next session — they actually shift to tomorrow.
 *
 * Items without a persisted MemoryState are ignored (they are "new" and
 * triage should never defer something the user has never seen).
 */
export async function bumpDueByOneDay(itemIds: Iterable<string>): Promise<void> {
  const dbi = await db();
  const tx = dbi.transaction("memoryState", "readwrite");
  const store = tx.objectStore("memoryState");
  const ONE_DAY = 24 * 60 * 60 * 1000;
  for (const id of itemIds) {
    const existing = await store.get(id);
    if (!existing) continue;
    await store.put({ ...existing, due: existing.due + ONE_DAY });
  }
  await tx.done;
}

// ---------- reviews ----------

export async function addReview(ev: ReviewEvent): Promise<void> {
  await (await db()).put("reviews", ev);
}

export async function allReviews(): Promise<ReviewEvent[]> {
  return (await db()).getAll("reviews");
}

export async function reviewsSince(sinceMs: number): Promise<ReviewEvent[]> {
  const dbi = await db();
  const out: ReviewEvent[] = [];
  const idx = dbi.transaction("reviews").store.index("by-timestamp");
  for await (const cursor of idx.iterate(IDBKeyRange.lowerBound(sinceMs))) {
    out.push(cursor.value);
  }
  return out;
}

export async function reviewsForItem(itemId: string): Promise<ReviewEvent[]> {
  return (await db()).getAllFromIndex("reviews", "by-item", itemId);
}

// ---------- sessions ----------

export async function startSession(s: Session): Promise<void> {
  await (await db()).put("sessions", s);
}

export async function updateSession(s: Session): Promise<void> {
  await (await db()).put("sessions", s);
}

export async function recentSessions(limit = 30): Promise<Session[]> {
  const dbi = await db();
  const out: Session[] = [];
  const idx = dbi.transaction("sessions").store.index("by-startedAt");
  for await (const cursor of idx.iterate(null, "prev")) {
    out.push(cursor.value);
    if (out.length >= limit) break;
  }
  return out;
}

// ---------- settings ----------

export async function getSettings(): Promise<Settings> {
  const s = await (await db()).get("settings", "singleton");
  return s ?? DEFAULT_SETTINGS;
}

export async function putSettings(s: Settings): Promise<void> {
  await (await db()).put("settings", s, "singleton");
}

// ---------- flagged rules ----------

export async function flagRule(ruleId: string): Promise<FlaggedRule> {
  const dbi = await db();
  const existing = await dbi.get("flagged", ruleId);
  const now = Date.now();
  const next: FlaggedRule = existing
    ? { ...existing, lastFlaggedAt: now, count: existing.count + 1 }
    : { ruleId, flaggedAt: now, lastFlaggedAt: now, count: 1 };
  await dbi.put("flagged", next);
  return next;
}

export async function clearFlag(ruleId: string): Promise<void> {
  await (await db()).delete("flagged", ruleId);
}

export async function allFlagged(): Promise<FlaggedRule[]> {
  return (await db()).getAll("flagged");
}

// ---------- mock history ----------

export async function addMockResult(m: MockResult): Promise<void> {
  await (await db()).put("mockHistory", m);
}

export async function allMockResults(): Promise<MockResult[]> {
  const dbi = await db();
  const out: MockResult[] = [];
  const idx = dbi.transaction("mockHistory").store.index("by-at");
  for await (const cursor of idx.iterate(null, "prev")) {
    out.push(cursor.value);
  }
  return out;
}

export async function recentMockResults(limit: number): Promise<MockResult[]> {
  const all = await allMockResults();
  return all.slice(0, limit);
}

/**
 * One-shot migration: copy any pre-existing localStorage["mockHistory"]
 * entries into the IDB store, then delete the localStorage key. Safe to call
 * many times — it's a no-op once the key is gone.
 *
 * Old shape was `{ points, passed, at }` with no id/maxPoints/penalties/mode.
 * We synthesise a v1-compatible record so historical entries still render in
 * Stats, but mark mode as "strict" since that was the only mode pre-Chunk 7.
 */
export async function migrateLocalStorageMockHistory(): Promise<number> {
  let migrated = 0;
  try {
    const raw = localStorage.getItem("mockHistory");
    if (!raw) return 0;
    const arr = JSON.parse(raw) as Array<{
      points?: number;
      passed?: boolean;
      at?: number;
    }>;
    if (!Array.isArray(arr)) {
      localStorage.removeItem("mockHistory");
      return 0;
    }
    const dbi = await db();
    const tx = dbi.transaction("mockHistory", "readwrite");
    for (const entry of arr) {
      if (typeof entry?.at !== "number" || typeof entry.points !== "number") continue;
      const id = `legacy-${entry.at}`;
      // Don't overwrite if already migrated.
      const existing = await tx.objectStore("mockHistory").get(id);
      if (existing) continue;
      const result: MockResult = {
        id,
        at: entry.at,
        points: entry.points,
        maxPoints: 150,
        penalties: 0,
        passed: !!entry.passed,
        mode: "strict",
      };
      await tx.objectStore("mockHistory").put(result);
      migrated++;
    }
    await tx.done;
    localStorage.removeItem("mockHistory");
  } catch {
    /* best-effort migration; don't crash startup */
  }
  return migrated;
}

// ---------- backup ----------

export async function exportBackup(): Promise<Backup> {
  const [memoryState, reviews, sessions, settings, flagged, mockHistory] =
    await Promise.all([
      allMemoryState(),
      allReviews(),
      recentSessions(10_000),
      getSettings(),
      allFlagged(),
      allMockResults(),
    ]);
  return {
    version: 2,
    exportedAt: Date.now(),
    memoryState,
    reviews,
    sessions,
    settings,
    flagged,
    mockHistory,
  };
}

/** Replaces current state with the backup. Destructive on purpose. */
export async function importBackup(b: Backup): Promise<void> {
  if (b.version !== 1 && b.version !== 2) {
    throw new Error(`Unsupported backup version: ${b.version as number}`);
  }
  const dbi = await db();
  const tx = dbi.transaction(
    ["memoryState", "reviews", "sessions", "settings", "flagged", "mockHistory"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("memoryState").clear(),
    tx.objectStore("reviews").clear(),
    tx.objectStore("sessions").clear(),
    tx.objectStore("settings").clear(),
    tx.objectStore("flagged").clear(),
    tx.objectStore("mockHistory").clear(),
  ]);
  for (const m of b.memoryState) await tx.objectStore("memoryState").put(m);
  for (const r of b.reviews) await tx.objectStore("reviews").put(r);
  for (const s of b.sessions) await tx.objectStore("sessions").put(s);
  await tx.objectStore("settings").put(b.settings, "singleton");
  if (b.flagged) {
    for (const f of b.flagged) await tx.objectStore("flagged").put(f);
  }
  if (b.mockHistory) {
    for (const m of b.mockHistory) await tx.objectStore("mockHistory").put(m);
  }
  await tx.done;
}

/** Destructive. Used by Settings → reset. */
export async function wipeAll(): Promise<void> {
  const dbi = await db();
  const tx = dbi.transaction(
    ["memoryState", "reviews", "sessions", "settings", "flagged", "meta", "mockHistory"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("memoryState").clear(),
    tx.objectStore("reviews").clear(),
    tx.objectStore("sessions").clear(),
    tx.objectStore("settings").clear(),
    tx.objectStore("flagged").clear(),
    tx.objectStore("meta").clear(),
    tx.objectStore("mockHistory").clear(),
  ]);
  await tx.done;
}
