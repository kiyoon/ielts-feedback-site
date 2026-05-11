# Iteration 04 — claude

_Generated 2026-05-10T14:14:12Z by claude (took 198s)._

---

```markdown
# Iter 4 — claude

## What I changed
- apps/viewer/src/lib/highlight.ts:49-69 — sort rewrites by `original` length descending (input order as stable tiebreak) before processing in `buildSpans`. Fixes the reverse-order containment case flagged in iter-3's "What's left": when a longer parent rewrite arrives in input AFTER a shorter child it contains, the parent now claims its full range and the child becomes nested under it, instead of the parent being misrendered as a partial-overlap with two ghost fragments.

## Verified
- `bun run build` passes clean (TypeScript strict, only pre-existing chunk-size warning).
- Reverse-order regression test (synthetic): input `[child id=1 "quick brown fox", parent id=2 "big quick brown fox jumps over the lazy dog"]` → before: `overlaps={2:{withIds:[1]}}` + 2 ghost fragments; after: `nested={1:{parentId:2}}`, no overlaps, parent is one clean primary span.
- Real W1/W2 + synthetic payloads: 28 payloads checked, **0 unmatched**, 7 additions correctly filtered. Two cases iter-2 had reported as "overlap" (`w1/02-claude#7` and `w2/05-codex#7`) were actually CONTAINMENTS — they now correctly appear in `nested` rather than `overlaps`. Strictly better classification.
- Genuine partial-overlap still detected: synthetic `A=[0..32], B=[22..54]` (neither contains the other) → `overlaps={2:{withIds:[1]}}` with one ghost span at the visible tail (32..54).

## What's left
- Browser/Playwright verification of gutter-bracket vertical alignment and resize-handle drag (mouse + arrow keys) — the dev environment here couldn't bind a Vite port.
- The Storybook scaffold under `apps/viewer/src/stories/` is excluded from typecheck (iter-2) but still on disk; could be deleted in a follow-up if confirmed dead.
- `MarkSpan` in `EssayPane.tsx` declares two structurally-identical `ChildMarker` types (one inline at L57-63, one as `interface ChildMarker` at L318-324) — minor cleanup opportunity, not a bug.

## CONVERGENCE: REFINING
```
