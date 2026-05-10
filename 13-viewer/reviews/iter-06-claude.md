# Iteration 06 — claude

_Generated 2026-05-10T14:26:42Z by claude (took 611s)._

---

TypeScript strict + vite build both pass clean. Here's the iter 6 summary:

```markdown
# Iter 6 — claude

## What I changed
- 13-viewer/src/lib/highlight.ts:55-65,75,84-91,106 — track `renderableContainers` (primaries + already-nested spans) instead of `primaryLocated`, so the tightest-container search picks the **closest** renderable ancestor. With A⊃B⊃C, B is in this list when C is processed, so C correctly attaches to B (not A).
- 13-viewer/src/components/EssayPane.tsx:132-149,180,191,258,337-460 — recursive grandchild rendering inside `parent-shell`. The renderer now descends via `childrenByParent[c.id]` so a nested child that has its own descendants renders them visibly. Switched the nested-child element from `<button>` to `<span role="button" tabIndex={0}>` so deep nesting is legal HTML (button inside button is invalid). Also added a `descendantsByParent` walker so the gutter bracket count reflects the full sub-hierarchy under a parent (e.g. "+2" on A when both B and C live inside it).

## Verified
- `bun run build` passes clean (TypeScript strict, only the pre-existing chunk-size advisory).
- Synthetic A⊃B⊃C: `nested[C].parentId = B`, `nested[B].parentId = A`, no overlaps emitted. **PASS**
- Synthetic two siblings (no containment among them) inside one parent: both attach to A, no false sub-nesting. **PASS** (regression preserved)
- Synthetic partial overlap: still emits both rewrites in `overlaps`, no nested entries — partial-overlap path untouched. **PASS**
- Real W1/W2: `checked=22 additions_filtered=7 unmatched=0 nested=3 overlaps=0` — residual unmatched stays at 0; the 3 real nested cases are all single-level (no real-data sub-nesting yet, so no behavior shift on real payloads).

## What's left
- Browser/Playwright visual verification of gutter-bracket vertical alignment + resize-handle drag (mouse + arrow keys) — couldn't bind a Vite port from this environment.
- Storybook scaffold under `13-viewer/src/stories/` is still on disk but unused; could be deleted in a follow-up.
- The card-side display already inherits the corrected parent (`nestedIn` now points at B for C), but a reviewer may want to verify the "covered by #B" text actually appears in the right pane on a synthetic 3-deep payload.

## CONVERGENCE: REFINING
```
