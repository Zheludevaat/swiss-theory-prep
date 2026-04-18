// The content bundle the app loads at startup. Validated once with Zod so
// any typo in rules/items.ts is caught at boot (and loudly, in dev).

import { ContentBundleSchema, type Category, type Item, type Rule } from "./schema";
import { seedRules } from "./rules";
import { seedItems } from "./items";

const raw = {
  contentVersion: "0.1.0-seed",
  generatedAt: new Date().toISOString(),
  rules: seedRules,
  items: seedItems,
};

// Parse (throws on schema violation).
const parsed = ContentBundleSchema.parse(raw);

export const CONTENT = parsed;
export const RULES: Rule[] = parsed.rules;
export const ITEMS: Item[] = parsed.items;
export const CONTENT_VERSION = parsed.contentVersion;

// Build lookup maps + cross-refs once.
export const ruleById = new Map<string, Rule>(RULES.map((r) => [r.id, r]));
export const itemById = new Map<string, Item>(ITEMS.map((i) => [i.id, i]));

/** Primary category of an item = category of its first rule. */
export function categoryOfItem(item: Item): Category | undefined {
  for (const rid of item.ruleIds) {
    const r = ruleById.get(rid);
    if (r) return r.category;
  }
  return undefined;
}

// Integrity checks that Zod can't express structurally.
for (const it of ITEMS) {
  for (const rid of it.ruleIds) {
    if (!ruleById.has(rid)) {
      throw new Error(`Item ${it.id} references unknown rule ${rid}`);
    }
  }
}
