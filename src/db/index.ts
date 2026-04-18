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
  type ReviewEvent,
  type Session,
  type Settings,
} from "./types";

const DB_NAME = "swiss-theory-prep";
// v2: add by-timestamp index on reviews + recover from any pre-existing v1 db
// from an earlier deploy that used a different schema. Migration is destructive
// (the prior data shape is incompatible), but the app stores only personal
// review state, which is recreated as the user studies.
const DB_VERSION = 2;

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
}

let _db: Promise<IDBPDatabase<AppDB>> | null = null;

/** Lazily open the db. Safe to call multiple times. */
export function db(): Promise<IDBPDatabase<AppDB>> {
  if (_db) return _db;
  _db = openDB<AppDB>(DB_NAME, DB_VERSION, {
    upgrade(dbi, oldVersion) {
      // Any upgrade path (including recovery from an incompatible older build)
      // rebuilds from scratch. Drop every store we know about, plus anything
      // else the db may have, then create the canonical v2 schema.
      for (const name of Array.from(dbi.objectStoreNames)) {
        dbi.deleteObjectStore(name);
      }
      void oldVersion;

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

// ---------- backup ----------

export async function exportBackup(): Promise<Backup> {
  const [memoryState, reviews, sessions, settings, flagged] = await Promise.all([
    allMemoryState(),
    allReviews(),
    recentSessions(10_000),
    getSettings(),
    allFlagged(),
  ]);
  return {
    version: 1,
    exportedAt: Date.now(),
    memoryState,
    reviews,
    sessions,
    settings,
    flagged,
  };
}

/** Replaces current state with the backup. Destructive on purpose. */
export async function importBackup(b: Backup): Promise<void> {
  if (b.version !== 1) {
    throw new Error(`Unsupported backup version: ${b.version as number}`);
  }
  const dbi = await db();
  const tx = dbi.transaction(
    ["memoryState", "reviews", "sessions", "settings", "flagged"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("memoryState").clear(),
    tx.objectStore("reviews").clear(),
    tx.objectStore("sessions").clear(),
    tx.objectStore("settings").clear(),
    tx.objectStore("flagged").clear(),
  ]);
  for (const m of b.memoryState) await tx.objectStore("memoryState").put(m);
  for (const r of b.reviews) await tx.objectStore("reviews").put(r);
  for (const s of b.sessions) await tx.objectStore("sessions").put(s);
  await tx.objectStore("settings").put(b.settings, "singleton");
  if (b.flagged) {
    for (const f of b.flagged) await tx.objectStore("flagged").put(f);
  }
  await tx.done;
}

/** Destructive. Used by Settings → reset. */
export async function wipeAll(): Promise<void> {
  const dbi = await db();
  const tx = dbi.transaction(
    ["memoryState", "reviews", "sessions", "settings", "flagged", "meta"],
    "readwrite",
  );
  await Promise.all([
    tx.objectStore("memoryState").clear(),
    tx.objectStore("reviews").clear(),
    tx.objectStore("sessions").clear(),
    tx.objectStore("settings").clear(),
    tx.objectStore("flagged").clear(),
    tx.objectStore("meta").clear(),
  ]);
  await tx.done;
}
