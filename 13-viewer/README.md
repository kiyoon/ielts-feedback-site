# IELTS Feedback Viewer

A React + Vite + shadcn/ui (Radix) viewer for the iterative-refinement feedback chain produced by `12-benchmark/`.

## Design

Three-pane layout, fully wired bidirectionally:

```
┌─────────────┬──────────────────────────────────┬───────────────────────┐
│ Sidebar     │  Header + iteration scrubber     │                       │
│ (task tabs, │  ──────────────────────────────  │                       │
│ iteration   │  Essay (left)        | Feedback  │                       │
│ list)       │  prompt + body       | (right)   │                       │
│             │  highlighted         | scores    │                       │
│             │  per criterion       | rewrites  │                       │
│             │  (click → scrolls    | markdown  │                       │
│             │   feedback)          | tab       │                       │
└─────────────┴──────────────────────────────────┴───────────────────────┘
```

Key UX features:

- **Iteration scrubber** (top) — horizontal timeline with sparkline of overall band; dot color = convergence verdict. Click any dot to jump.
- **Bidirectional click** — click a highlight in the essay → scroll the matching rewrite card into view; click a rewrite card → scroll & highlight the essay phrase. Active state animates.
- **Category-coded highlights** — Task Response (blue), Coherence (green), Lexical (amber), Grammar (red), Spelling (gray). Hover any mark for the diff (`original → improved`) + reason inline.
- **Score visualisation** — per-criterion horizontal bars normalised to 0–9, with a vertical band-7 target line; deltas vs baseline shown when available.
- **Filter** rewrites by category (TR / CC / LR / GRA / SP).
- **Compare to baseline** — toggle button stacks the no-repo baseline feedback under the selected iteration's feedback so you can see what the repo actually changed.
- **Citation sheet** — every rewrite cites a corpus file (e.g. `09-instructor-tips/05-...md`); clicking opens the corpus file in a side dialog rendered as GFM markdown.
- **Raw markdown tab** — fallback view that renders the full feedback markdown as written by the LLM (in case the extractor missed something).
- **Convergence badge** — shown per iteration in the sidebar, the scrubber, and the feedback header.
- **Theme toggle** — dark default; light mode via header button.

## Data flow

Feedback agents in `12-benchmark/` emit Markdown. A separate **extractor** uses `codex exec` (or `claude -p`) to convert each feedback markdown into a structured JSON payload (see `src/types.ts`). The viewer only reads JSON.

```
12-benchmark/results/task1/04-claude.md   ──extract──▶  13-viewer/public/data/task1/04-claude.json
                                                                      │
                              13-viewer/public/data/index.json ◀──────┘
                                       │
                                       ▼
                                 viewer fetches
```

The viewer never parses raw markdown for structured fields; it only renders raw markdown in the fallback tab.

## Running

```bash
cd 13-viewer
npm install
# Make corpus accessible to the dev server (used by CitationSheet):
ln -s ../.. public/corpus

# After the benchmark has produced at least some iterations:
npm run extract           # md → json for every feedback in 12-benchmark/results/
npm run rebuild-index     # generate public/data/index.json from the json payloads

npm run dev               # http://127.0.0.1:5173
```

If `public/data/index.json` is missing the viewer renders a clear error explaining the extract step.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind v3 + shadcn/ui (Radix primitives, copy-and-paste convention)
- `react-markdown` + `remark-gfm` + `rehype-highlight` for the markdown render
- `lucide-react` icons

No global state library — everything is local component state plus a small `data.ts` cache for fetched payloads.

## Layout invariants

- The viewer **never mutates** anything in the parent repo. `public/corpus` is a read-only symlink for the citation sheet.
- The viewer only depends on JSON in `public/data/`, so the same UI works against any extractor output (different LLM, different schema version).
- The `Convergence` field is part of the schema; the dot colors come from there.
