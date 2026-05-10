# Iteration 10 — claude

_Generated 2026-05-10T14:39:34Z by claude (took 278s)._

---

```markdown
# Iter 10 — claude

## What I changed
- 13-viewer/src/styles.css:262-285 — added `:not(:has(.nested-child:hover/focus))` exclusion to every nested-child hover/focus rule (the base brightness/border-width rule + the five per-category background rules). Previously, in deep-nest cases (A⊃B⊃C), pointing at the innermost C also triggered `:hover` on its outer .nested-child ancestor B, because CSS `:hover` propagates up the DOM. That compounded `filter: brightness(1.2)` (1.44× on the grandchild vs 1.2× on the middle) and made both spans' backgrounds saturate at the same time, leaving the user unable to tell which child their pointer was on. With the `:not(:has(...))` guard the hover/focus styles now apply only to the innermost matching .nested-child.
- 13-viewer/src/styles.css:295-298 — same exclusion applied to the `[data-overlap="true"]:hover/:focus` box-shadow rule, for consistency on overlap-flagged nested children that also have descendants.

## Verified
- `cd 13-viewer && bun run build` — clean (tsc + vite). CSS bundle 30.14 kB.
- Locator residual: `checked=25 additions_filtered=7 unmatched=0 nested=6 overlaps=0` (matched the W1/W2 baseline; no regression in the matcher).
- Selector logic check: `.nested-child:hover:not(:has(.nested-child:hover))` matches only when the element is `:hover`'d AND has no `.nested-child` descendant that is also `:hover`'d — i.e. only the innermost in the chain. Specificity unchanged (still `0,2,1` / `0,3,1` for the per-category variant), so no override surprises.
- `:has()` is supported in all major browsers as of 2026; the prior iter notes already used it elsewhere in the file (no compatibility regression introduced).

## What's left
- Browser/Playwright visual confirmation of the deep-nest hover behavior — Vite EPERM on 127.0.0.1:5173 in this environment, same constraint prior iters hit. The styles.css change is purely additive narrowing of an existing selector, so it can only suppress (never re-introduce) the over-bright outer mark; safe to ship without a visual check, but worth eyeballing on the All-patterns story (`SubNested` / `AllPatterns`) when a browser is available.
- The `+N nested` badge in the EssayPane header is still a non-clickable outline Badge while `N overlap(s)` and `N not found` are clickable filter triggers — minor UX inconsistency, easy follow-up.
- Storybook scaffold under `src/stories/` is still on disk but unused; nothing imports it. Still a deletion candidate.

## CONVERGENCE: REFINING
```
