// Standalone content validator. Fails the process on any integrity issue in
// rules, items, or their referenced assets. Runs in CI as a gate before
// `npm run build` via `.github/workflows/deploy.yml`.
//
// Rules enforced (hard errors):
//   - Every `ruleIds[*]` on every item resolves to a real rule.
//   - Every `imageAssetId` / `diagramAssetId` resolves to a file in `public/`.
//   - Every item has 1 or 2 correct options (ASA rule).
//   - Every Category in the schema has ≥1 rule authored against it.
//   - No orphan rules — every rule is referenced by at least one item
//     (prevents rules drifting out of use unnoticed).

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { ITEMS, RULES, ruleById } from "../src/content/bundle.js";
import { CategorySchema, type Category } from "../src/content/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

let errors = 0;

function err(msg: string): void {
  console.error(`✖ ${msg}`);
  errors += 1;
}

// ---- item-level checks ------------------------------------------------------

for (const it of ITEMS) {
  for (const rid of it.ruleIds) {
    if (!ruleById.has(rid)) err(`item ${it.id} → unknown rule ${rid}`);
  }
  const assetIds = [it.imageAssetId, it.diagramAssetId].filter(
    Boolean,
  ) as string[];
  for (const a of assetIds) {
    const signPath = path.join(publicDir, "signs", a);
    const diagPath = path.join(publicDir, "diagrams", a);
    if (!fs.existsSync(signPath) && !fs.existsSync(diagPath)) {
      err(`item ${it.id} → missing asset ${a} (searched signs/ and diagrams/)`);
    }
  }
  const correctCount = it.options.filter((o) => o.correct).length;
  if (correctCount < 1 || correctCount > 2) {
    err(
      `item ${it.id} → must have 1 or 2 correct options (has ${correctCount})`,
    );
  }
}

// ---- category coverage ------------------------------------------------------

const rulesByCategory = new Map<Category, number>();
for (const r of RULES) {
  rulesByCategory.set(r.category, (rulesByCategory.get(r.category) ?? 0) + 1);
}
for (const cat of CategorySchema.options) {
  if ((rulesByCategory.get(cat) ?? 0) === 0) {
    err(`category "${cat}" has no rules — every category must have at least one`);
  }
}

// ---- orphan rules -----------------------------------------------------------

const referenced = new Set(ITEMS.flatMap((i) => i.ruleIds));
for (const r of RULES) {
  if (!referenced.has(r.id)) {
    err(`orphan rule ${r.id} (${r.title}) — no item references it`);
  }
}

// ---- outcome ---------------------------------------------------------------

if (errors > 0) {
  console.error(`\n${errors} error(s).`);
  process.exit(1);
}

console.log(`✓ content OK — ${RULES.length} rules, ${ITEMS.length} items`);
