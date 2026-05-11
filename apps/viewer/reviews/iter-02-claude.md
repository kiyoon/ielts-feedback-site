# Iteration 02 — claude

_Generated 2026-05-10T14:06:08Z by claude (took 646s)._

---

Build clean. Iter 2 summary:

```markdown
# Iter 2 — claude

## What I changed
- apps/viewer/src/lib/highlight.ts:3-16,77-91,247-261 — added `kind: "primary" | "overlap-ghost"` to `HighlightSpan`; when an overlap is detected, emit ghost span(s) for each free sub-range of the overlap's range so the visible portion is rendered inline. Added `freeSubRanges` helper.
- apps/viewer/src/components/EssayPane.tsx:210-225,110-117,318-340,400-455 — pass `kind` to `MarkSpan`; ghost spans render as a standard interactive mark with `data-kind="overlap-ghost"`, distinct aria-label and tooltip note (warning-tinted "partial overlap"); excluded ghost spans from the `N/total highlighted` counter so overlaps aren't double-counted.
- apps/viewer/src/styles.css:123-135 — new `.essay-mark[data-kind="overlap-ghost"]` style: dashed warning underline + light warning tint, intensifying on hover/active.
- apps/viewer/tsconfig.app.json — excluded `src/stories` from typecheck (pre-existing Storybook scaffolding had unused-React imports breaking strict build).

## Verified
- `bun run build` passes clean (TypeScript strict, no warnings beyond pre-existing chunk-size).
- Python verifier (mirrors highlight.ts logic) across 24 W1/W2 iteration files: **0 unmatched** post addition-filter.
- Synthetic ghost test (Node script over the two real overlap cases):
  - w1/02-claude#7 (range 775–895 overlapping #5 at 838–895) → ghost at 775–838 = "the first ever information which only used electronic signals,"
  - w2/05-codex#7 (range 836–899 overlapping #6 at 885–899) → ghost at 836–885 = "People did not fully understand when it comes to "

## What's left
- Browser-level visual verification of gutter bracket alignment and ghost-mark contrast in dark mode (Playwright pass would catch any regressions).
- Citation panel resize handle (CitationSheet) wasn't touched — should be confirmed working via mouse + arrow keys; sidebar handle already uses the shared `useResizable` hook.
- Storybook scaffold files in `src/stories` are now ignored — they're unused and could be deleted in a follow-up if confirmed dead.

## CONVERGENCE: REFINING
```
