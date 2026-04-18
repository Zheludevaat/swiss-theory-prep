// Recompute `content/version.json` from the current authored content.
// Runs as a prebuild step so every deploy ships an up-to-date count.
//
// Strategy: patch-bump the semver when counts change; keep version stable
// otherwise. Fresh dev setups can always re-run manually to re-sync.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ITEMS, RULES } from "../src/content/bundle.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const versionPath = path.resolve(__dirname, "..", "content", "version.json");

type VersionFile = {
  version: string;
  itemCount: number;
  ruleCount: number;
  updatedAt: string;
};

function bumpPatch(v: string): string {
  const m = /^(\d+)\.(\d+)\.(\d+)(-.*)?$/.exec(v);
  if (!m) return v;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = Number(m[3]) + 1;
  const suffix = m[4] ?? "";
  return `${major}.${minor}.${patch}${suffix}`;
}

const current: VersionFile = fs.existsSync(versionPath)
  ? (JSON.parse(fs.readFileSync(versionPath, "utf8")) as VersionFile)
  : { version: "0.1.0-seed", itemCount: 0, ruleCount: 0, updatedAt: new Date(0).toISOString() };

const itemCount = ITEMS.length;
const ruleCount = RULES.length;
const changed = itemCount !== current.itemCount || ruleCount !== current.ruleCount;

const next: VersionFile = {
  version: changed ? bumpPatch(current.version) : current.version,
  itemCount,
  ruleCount,
  updatedAt: changed ? new Date().toISOString() : current.updatedAt,
};

fs.writeFileSync(versionPath, JSON.stringify(next, null, 2) + "\n");

if (changed) {
  console.log(
    `↑ bumped content version: ${current.version} → ${next.version} ` +
      `(items ${current.itemCount}→${itemCount}, rules ${current.ruleCount}→${ruleCount})`,
  );
} else {
  console.log(`✓ content version unchanged: ${next.version}`);
}
