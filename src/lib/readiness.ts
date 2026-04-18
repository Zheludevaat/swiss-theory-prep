// Four-state readiness signal (DESIGN_v3 §9). Honest, no false-precision %.

import type { MemoryState } from "@/db/types";
import type { Item } from "@/content/schema";
import { isGraduated } from "@/scheduler/fsrs";

export type Readiness = "not-ready" | "building" | "exam-worthy" | "comfortable";

export const READINESS_LABEL: Record<Readiness, string> = {
  "not-ready": "Not ready",
  building: "Building",
  "exam-worthy": "Exam-worthy",
  comfortable: "Comfortable",
};

export const READINESS_BLURB: Record<Readiness, string> = {
  "not-ready": "Less than half your items are stable. Keep going.",
  building: "You're past halfway. The rules are sticking.",
  "exam-worthy": "Most items are stable. A pass is plausible today.",
  comfortable: "Stable across the board. Mock scores back this up.",
};

export type LastMockSummary = { points: number; passed: boolean; at: number };

export function computeReadiness(args: {
  items: Item[];
  memory: Map<string, MemoryState>;
  recentMocks: LastMockSummary[];
}): Readiness {
  const { items, memory, recentMocks } = args;
  if (items.length === 0) return "not-ready";

  let graduated = 0;
  for (const it of items) {
    const m = memory.get(it.id);
    if (m && isGraduated(m)) graduated += 1;
  }
  const ratio = graduated / items.length;
  const lastMock = recentMocks[0];
  const lastTwo = recentMocks.slice(0, 2);

  if (ratio >= 0.95 && lastTwo.length === 2 && lastTwo.every((m) => m.points >= 145)) {
    return "comfortable";
  }
  if (ratio >= 0.80 && lastMock && lastMock.points >= 135) {
    return "exam-worthy";
  }
  if (ratio >= 0.50) return "building";
  return "not-ready";
}
