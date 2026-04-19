// Content schemas — versioned, validated at build time + at runtime on load.
// See DESIGN_v3 §5.1.

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
export type Category = z.infer<typeof CategorySchema>;

// Human labels for the UI. Kept here so the schema stays the source of truth.
export const CATEGORY_LABELS: Record<Category, string> = {
  signs: "Signs",
  priority: "Priority & right-of-way",
  maneuvers: "Maneuvers",
  speeds: "Speeds & limits",
  mountain: "Mountain roads",
  "adverse-conditions": "Adverse conditions",
  vehicle: "Vehicle & equipment",
  "driver-fitness": "Driver fitness",
  "penalties-bac": "Penalties & BAC",
  "accidents-insurance": "Accidents & insurance",
};

// Approximation of ASA's competence-catalog category weights — used to draw
// representative mock exams. Must sum to ≤1 (small slack absorbed by "other").
export const CATEGORY_WEIGHTS: Record<Category, number> = {
  signs: 0.20,
  priority: 0.18,
  speeds: 0.10,
  maneuvers: 0.14,
  mountain: 0.05,
  "adverse-conditions": 0.05,
  vehicle: 0.10,
  "driver-fitness": 0.05,
  "penalties-bac": 0.05,
  "accidents-insurance": 0.05,
};

/** Chunk 13: optional German overlay for a rule. Translation block — only the
 *  user-visible strings need to be mirrored; structural fields (id, category,
 *  legalRefs, examWeight, tags) stay language-agnostic. */
export const RuleTranslationSchema = z.object({
  title: z.string(),
  statement: z.string(),
  /** Optional — falls back to the English workedExamples when omitted. */
  workedExamples: z.array(z.string()).optional(),
});
export type RuleTranslation = z.infer<typeof RuleTranslationSchema>;

export const RuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  statement: z.string(),
  category: CategorySchema,
  legalRefs: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  examWeight: z.number().min(0).max(1),
  workedExamples: z.array(z.string()).default([]),
  notes: z.string().optional(),
  /** Chunk 13: optional German overlay. */
  de: RuleTranslationSchema.optional(),
});
export type Rule = z.infer<typeof RuleSchema>;

export const OptionSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});
export type Option = z.infer<typeof OptionSchema>;

/** Chunk 13: option correctness is language-agnostic, so only mirror the
 *  visible text. The 3-tuple shape locks DE option count to the EN tuple. */
export const ItemTranslationSchema = z.object({
  question: z.string(),
  options: z.tuple([z.string(), z.string(), z.string()]),
  rationale: z.string(),
  /** Optional override for the image/diagram alt text. */
  imageAlt: z.string().optional(),
});
export type ItemTranslation = z.infer<typeof ItemTranslationSchema>;

export const ItemSchema = z
  .object({
    id: z.string(),
    ruleIds: z.array(z.string()).min(1),
    question: z.string(),
    imageAssetId: z.string().optional(),
    diagramAssetId: z.string().optional(),
    /** D-6: human alt text for any attached image/diagram. Optional —
     *  Card.tsx synthesizes a generic fallback when missing. */
    imageAlt: z.string().optional(),
    options: z.tuple([OptionSchema, OptionSchema, OptionSchema]),
    rationale: z.string(),
    tags: z.array(z.string()).default([]),
    difficulty: z.number().int().min(1).max(5).default(3),
    /** Chunk 13: optional German overlay. */
    de: ItemTranslationSchema.optional(),
  })
  .refine(
    (it) => {
      const n = it.options.filter((o) => o.correct).length;
      return n === 1 || n === 2;
    },
    { message: "Exactly 1 or 2 options must be correct (ASA rule)." },
  );
export type Item = z.infer<typeof ItemSchema>;

export const ContentBundleSchema = z.object({
  contentVersion: z.string(),
  generatedAt: z.string(),
  rules: z.array(RuleSchema),
  items: z.array(ItemSchema),
});
export type ContentBundle = z.infer<typeof ContentBundleSchema>;
