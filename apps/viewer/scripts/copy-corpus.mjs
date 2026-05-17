#!/usr/bin/env node
// Copies repo-root corpus files into public/corpus/ so they ship as static
// assets in `vite build`. Mirrors what the /corpus dev-server middleware
// exposes (see vite.config.ts), but materialised on disk for production.

import { mkdir, copyFile, readdir, stat, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const VIEWER_ROOT = path.resolve(here, "..");
const REPO_ROOT = path.resolve(VIEWER_ROOT, "../..");
const OUT = path.join(VIEWER_ROOT, "public", "corpus");

// Folders (relative to repo root) whose .md files should ship with the build.
const SOURCES = [
  "contexts",
  "real-essays",
  "real-essays/feedback",
  "benchmark/essays",
  "benchmark/results",
];

const ALLOW_EXT = new Set([".md", ".markdown", ".txt"]);

async function walk(dir, onFile) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return;
    throw e;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      await walk(full, onFile);
    } else if (ent.isFile() && ALLOW_EXT.has(path.extname(ent.name).toLowerCase())) {
      await onFile(full);
    }
  }
}

let copied = 0;
await rm(OUT, { recursive: true, force: true });

for (const src of SOURCES) {
  const abs = path.join(REPO_ROOT, src);
  await walk(abs, async (file) => {
    const rel = path.relative(REPO_ROOT, file);
    const dest = path.join(OUT, rel);
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(file, dest);
    copied += 1;
  });
}

console.log(`copy-corpus: copied ${copied} files into ${path.relative(REPO_ROOT, OUT)}`);
