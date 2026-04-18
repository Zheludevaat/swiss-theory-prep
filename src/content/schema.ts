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
});
export type Rule = z.infer<typeof RuleSchema>;

export const OptionSchema = z.object({
  text: z.string(),
  correct: z.boolean(),
});
export type Option = z.infer<typeof OptionSchema>;

export const ItemSchema = z
  .object({
    id: z.string(),
    ruleIds: z.array(z.string()).min(1),
    question: z.string(),
    imageAssetId: z.string().optional(),
    diagramAssetId: z.string().optional(),
    options: z.tuple([OptionSchema, OptionSchema, OptionSchema]),
    rationale: z.string(),
    tags: z.array(z.string()).default([]),
    difficulty: z.number().int().min(1).max(5).default(3),
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
