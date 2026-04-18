// Descriptive-only streak. Reports consecutive local-day windows that had at
// least one finished session. Never pushed, never nagged. See DESIGN_v3 §9.1.

import type { Session } from "@/db/types";

export function computeStreak(sessions: Session[], now = Date.now()): number {
  if (sessions.length === 0) return 0;
  const days = new Set<string>();
  for (const s of sessions) {
    if (!s.endedAt && s.itemsReviewed === 0) continue;
    const d = new Date(s.startedAt);
    d.setHours(0, 0, 0, 0);
    days.add(d.toISOString().slice(0, 10));
  }
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(0, 0, 0, 0);
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
