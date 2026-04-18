// Standalone content validator. Fails the process if any item references an
// unknown rule or an asset that doesn't exist under public/. Runs in CI as
// part of the deploy workflow (via `npm run validate-content`).

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { ITEMS, RULES, ruleById } from "../src/content/bundle.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "..", "public");

let errors = 0;

for (const it of ITEMS) {
  for (const rid of it.ruleIds) {
    if (!ruleById.has(rid)) {
      console.error(`✖ item ${it.id} → unknown rule ${rid}`);
      errors += 1;
    }
  }
  const assetIds = [it.imageAssetId, it.diagramAssetId].filter(
    Boolean,
  ) as string[];
  for (const a of assetIds) {
    const signPath = path.join(publicDir, "signs", a);
    const diagPath = path.join(publicDir, "diagrams", a);
    if (!fs.existsSync(signPath) && !fs.existsSync(diagPath)) {
      console.error(`✖ item ${it.id} → missing asset ${a}`);
      errors += 1;
    }
  }
  const correctCount = it.options.filter((o) => o.correct).length;
  if (correctCount < 1 || correctCount > 2) {
    console.error(
      `✖ item ${it.id} → must have 1 or 2 correct options (has ${correctCount})`,
    );
    errors += 1;
  }
}

// Warn about rules with no items.
const referenced = new Set(ITEMS.flatMap((i) => i.ruleIds));
for (const r of RULES) {
  if (!referenced.has(r.id)) {
    console.warn(`⚠ rule ${r.id} (${r.title}) has no items`);
  }
}

if (errors > 0) {
  console.error(`\n${errors} error(s).`);
  process.exit(1);
}

console.log(`✓ content OK — ${RULES.length} rules, ${ITEMS.length} items`);
