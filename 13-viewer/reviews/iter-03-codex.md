# Iteration 03 — codex

_Generated 2026-05-10T14:10:54Z by codex (took 286s)._

---

# Iter 3 — codex

## What I changed
- 13-viewer/src/lib/highlight.ts:72-84,271-285 — nested children that partially cross a sibling are now also flagged as overlaps.
- 13-viewer/src/components/EssayPane.tsx:57-80,367-379 and 13-viewer/src/styles.css:313-320 — nested child markers carry overlap metadata and get a dashed warning treatment.
- 13-viewer/src/components/RewriteCard.tsx:79-89 — rewrite cards can show both “covered by” and “overlaps” badges.
- 13-viewer/src/components/CitationSheet.tsx:1-80 — citation panel now uses the shared `useResizable` hook like the sidebar.

## Verified
- bun build passes
- Real W1/W2 matcher check: `checked=21 additions_filtered=7 unmatched=0`
- Synthetic overlap checks:
  - sub-nesting: C is covered by B
  - partial overlap: B is flagged overlap with ghost span
  - sibling overlap inside parent: child #3 remains nested under #1 and overlaps #2
- `git diff --check` passes

## What's left
- Browser Playwright smoke test could not run here because Vite failed to bind `127.0.0.1:5174` with `EPERM`; gutter visual alignment and resize drag should still be checked in a browser-capable environment.
- Reverse-order containment, where a longer parent rewrite appears after an already-located child, is still order-dependent and could be improved later.

## CONVERGENCE: REFINING