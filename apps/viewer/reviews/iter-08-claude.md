# Iteration 08 — claude

_Generated 2026-05-10T14:32:24Z by claude (took 186s)._

---

Dead selectors fully removed. Summary follows.

```markdown
# Iter 8 — claude

## What I changed
- apps/viewer/src/styles.css:100-121 — dropped the dead `:not([data-overlapping="true"])` filter from the five category `.essay-mark` rules. The `data-overlapping` attribute hasn't been emitted by any component since the parent-shell refactor (parents now render as a separate `.parent-shell` element, not as an `.essay-mark` with that flag), so the negation was always-true noise that obscured the actual style intent.
- apps/viewer/src/styles.css (~line 141 prior) — removed the obsolete `.essay-mark[data-overlapping="true"] { background: transparent !important; ... }` block. Same reason: nothing emits this attribute anymore.
- apps/viewer/src/styles.css (~lines 235–268 prior) — removed the entire dead `.mark-note` block (16 rules: base style + 5 category colors + 2 overlapping-state rules). `.mark-note` is never rendered anywhere in the JSX (verified via repo-wide grep), and the helper `--mark-note-color` variable went with it. Net deletion ≈ 35 lines.

## Verified
- `cd apps/viewer && bun run build` passes clean (tsc + vite). Output: `dist/assets/index-*.css 29.02 kB` (down from prior).
- `grep -r "data-overlapping\|mark-note" apps/viewer/src` returns no matches — confirming the deleted selectors were genuinely unreferenced and removing them changes no rendered styling.
- Matcher logic in `apps/viewer/src/lib/highlight.ts` was NOT touched, so the locator invariants verified by iter-07 (0 unmatched on real W1/W2, partial-overlap / sub-nesting / sibling-overlap synthetic checks) remain intact.

## What's left
- Browser/Playwright visual verification still blocked in this environment (Vite EPERM on 127.0.0.1:5173). Gutter-bracket vertical alignment claim ("aligned with the actual text range") is correct in principle — `getBoundingClientRect()` on a wrap-spanning inline returns the union rect, so `top` is the first line's top and `top+height` is the last line's bottom — but should still be eyeballed in a real browser.
- The gutter-bracket button only reads the parent's bounding rect; for a parent whose first/last line carries small adjacent prose (i.e. the parent's text doesn't fill those lines), the bracket extends slightly above/below the actual highlighted characters because the inline rect snaps to line boxes. A future polish could measure the parent's `getClientRects()[0].top` and `getClientRects().at(-1).bottom` instead — same numbers in practice for a span (since each client rect is a per-line box) but more explicit about intent.
- Storybook scaffold under `apps/viewer/src/stories/` and `apps/viewer/src/components/EssayPane.stories.tsx` is still present but unused; nothing imports it. A future iter could either wire it up (`bun run storybook` script) or delete the stub.

## CONVERGENCE: REFINING
```
