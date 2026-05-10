#!/usr/bin/env node
// Rebuild public/data/index.json from the per-iteration JSON payloads.
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "public", "data");
const BENCH = join(HERE, "..", "..", "12-benchmark");

const TASKS = ["task1", "task2"];

async function readEssay(task) {
  const p = join(BENCH, "essays", `${task}-essay.md`);
  const md = await readFile(p, "utf8");
  // Allow EOF as a terminator so we don't silently swallow the section when
  // the next "## " heading is missing (e.g. file ends after ## Essay).
  const promptMatch = md.match(/##\s+Prompt\s+([\s\S]*?)(?:\n##\s+|$)/);
  const prompt = (promptMatch?.[1] ?? "").trim();
  const essayMatch = md.match(/##\s+Essay\s+([\s\S]*?)(?:\n##\s+|$)/);
  const text = (essayMatch?.[1] ?? "").trim();
  const wcMatch = md.match(/##\s+Word Count\s+([^\n]*)/);
  const wcDigits = wcMatch?.[1]?.match(/(\d+)/);
  const word_count = wcDigits
    ? parseInt(wcDigits[1], 10)
    : text
      ? text.split(/\s+/).filter(Boolean).length
      : 0;
  return { prompt, text, word_count };
}

async function listIterations(task) {
  const dir = join(DATA, task);
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return [];
  }
  const out = [];
  for (const f of entries) {
    if (!f.endsWith(".json")) continue;
    const full = join(dir, f);
    const st = await stat(full);
    if (!st.isFile()) continue;
    try {
      const raw = await readFile(full, "utf8");
      const p = JSON.parse(raw);
      out.push({
        id: p.id,
        iteration: p.iteration,
        tool: p.tool,
        overall: p.overall,
        convergence: p.convergence ?? "UNKNOWN",
        generated_at: p.generated_at,
      });
    } catch (e) {
      console.warn(`skip ${full}: ${e.message}`);
    }
  }
  out.sort((a, b) => a.iteration - b.iteration);
  return out;
}

async function main() {
  const tasks = {};
  for (const t of TASKS) {
    tasks[t] = {
      essay: await readEssay(t).catch(() => ({ prompt: "", text: "", word_count: 0 })),
      iterations: await listIterations(t),
    };
  }
  const index = { generated_at: new Date().toISOString(), tasks };
  await writeFile(join(DATA, "index.json"), JSON.stringify(index, null, 2));
  for (const t of TASKS) {
    console.log(`${t}: ${tasks[t].iterations.length} iterations`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
