# UI/UX review — claude (synthesis)

_Generated 2026-05-09T15:26:59Z by claude -p, with codex output as input._

---

I've read the viewer code, the styles, the types, and the benchmark data. Here is the synthesis.

---

# Synthesis review (claude, second reviewer)

## 1. Items I AGREE with codex on

- **Default to latest CONVERGED, not numerically latest** (codex #1). Confirmed at `App.tsx:36`. Combined with the sidebar's ASC sort (`Sidebar.tsx:51`), the selected row also lands at the *bottom* of a 50-item list — auto-scroll is essential.
- **Convergence summary, not isolated dots** (codex #2). The chain state ("first converged at iter N", "stable since N") is the actual W6 question; per-iteration verdicts can't answer it.
- **Justification/descriptor evidence must escape tooltips** (codex #3). Confirmed at `ScoresCard.tsx:41-55`; the source data (`04-claude.md:23-29`) packs the most useful study content into those fields. Hover-only kills mobile/screen-reader and copy-paste.
- **Keyboard a11y on marks and rewrite cards is a blocker** (codex #4). `EssayPane.tsx:96` uses a clickable `<span>`; `RewriteCard.tsx:34` uses a clickable `<Card>` div. No `role`, `tabIndex`, `onKeyDown`, no focus ring. The bidirectional click is *the* primary correction-locating workflow (W3).
- **Surface unmatched rewrites** (codex #5). `highlight.ts:18` silently drops them; the header still says "N suggestions." Show `located N / M` and mark unmatched cards.
- **Compare mode is poor** (codex #6). Confirmed at `App.tsx:136-152`: two `FeedbackPane`s stacked vertically, both labelled "Feedback", and the bottom one is passed `baseline={null}` so it can't even show deltas.
- **Color-only signals + light-theme contrast** (codex #8). Worse than codex stated — see "missed" item E.
- **Pane headers carry no state** (codex #10). "Feedback" / "Feedback" with no iteration/tool/baseline label is a comparison hazard.

## 2. Items I DISAGREE with (or want to nuance)

- **Codex #9 (responsive): severity High → Medium.** This is a single user studying for IELTS on a laptop, per the README workflows. Tablet is plausible, phone is not the primary surface. Worth doing, but not at the cost of any item above. Codex's severity ordering puts mobile above some accessibility/correctness work; flip it.
- **Codex #6 fix shape.** Codex proposes inventing a `BaselineComparisonCard`. The payload already contains `feedback.what_changed` (rendered at `FeedbackPane.tsx:62-73`). Promote *that* to the top of the pane in compare mode (or replace the stacked baseline pane with a focused "diff vs baseline" view that uses score deltas already computed in `ScoresCard.tsx:58-67` plus `what_changed` + a list of rewrites unique to selected). Don't build a new compare structure that ignores existing fields.
- **Codex #7 fix shape.** Persistent side panel, yes. But making it a non-modal `Sheet` (Radix) that slides in without dimming the viewer is enough — codex implies a structural redesign of the right rail. The smaller change preserves the rest of the layout.

## 3. Items codex MISSED that matter

- **(A) Multi-citation parsing is likely broken.** `Rewrite.citation` is `string` (`types.ts:61`). The benchmark data emits multiple citations joined by "; " plus `§` section anchors per row (e.g. `04-claude.md:34` has two files). `CitationSheet.tsx:21` does `path.replace(/[#:].*$/, "")` which strips at `:` or `#` only — `;` and `§` slip through, so the fetch path is malformed. Either the extractor splits these into chips (then verify the JSON schema), or the viewer must split + render multiple chips. **Severity: High, W5.** Verify the actual JSON before fixing.
- **(B) Sidebar sort ASC + auto-select latest = selection always at bottom.** `Sidebar.tsx:51` sorts ascending. Even after fixing default-to-converged, the current behaviour buries the selection. Either reverse sort, or *guarantee* the selected row scrolls into view on mount. Codex covered the auto-scroll fix; the sort-order interaction makes it doubly important.
- **(C) Light-theme contrast is broken at the variant level**, not just "likely low." `badge.tsx:14-15` declares `text-emerald-300`/`text-amber-300` in the base classes (no `dark:` prefix on the foreground for the light path) — so convergence badges are near-invisible on white in light mode. Same in `ScoresCard.tsx:61-62` (`text-emerald-400`/`text-amber-400`). This is a fail-on-first-toggle bug, not a tuning issue.
- **(D) Sidebar has no filtering for 50+ entries split across tools.** No "claude only", "converged only", "delta vs prior > 0" filter. With ≥50 iterations and two tools, scanning is slow. **W1.**
- **(E) `convergence_note` placement.** Rendered at the bottom of the structured tab *after* all rewrites (`FeedbackPane.tsx:92-103`). For W6 it should be near the header next to the `ConvergenceBadge` at `FeedbackPane.tsx:47`. Codex flagged this in #2 but the simple textual move is the cheapest win and worth pulling out separately.
- **(F) Sparkline range clips at band 5–9** (`IterationScrubber.tsx:32`). Any iteration outside that range is silently flattened to the floor/ceiling. Minor, but if a baseline scores 4.5 the chart lies. Use `min/max` of actual data with padding.
- **(G) No way to dismiss the prompt `<details>` once read.** It's `open` by default (`EssayPane.tsx:52`) and re-opens every time you switch iterations because the component remounts on essay change — fine, but with 50 iterations the prompt is re-pushing essay content down on every selection. Persist open/closed state.

## 4. Final priority-ranked top 8

1. **Keyboard + screen-reader access on marks & RewriteCard** (codex #4). Blocker; primary correction workflow currently mouse-only.
2. **Default to latest CONVERGED + scroll selected sidebar row + scrubber dot into view** (codex #1 + my B). Single biggest W1/W6 fix.
3. **Move criterion descriptor evidence + justification + convergence note out of tooltips into expandable rows / above-the-fold sections** (codex #3 + my E). Primary content cannot be hover-only.
4. **Verify and fix multi-citation handling end-to-end** (my A). Confirm the extracted JSON schema, then either split into citation chips or fix the path-cleaning regex. Without this, W5 is a dead workflow.
5. **Compare mode redesign around `what_changed` + score deltas, with explicit pane labels** (codex #6, #10 + my reuse-existing-field nuance). Replace the stacked-pane layout with a diff summary that uses fields already in the payload.
6. **Surface unmatched rewrites in `EssayPane` + per-card "not in essay" tag + "search phrase" fallback** (codex #5). Closes the W3 gap when `buildSpans` silently fails.
7. **Fix light-theme color tokens for convergence badge + score deltas; add icon/text backup for category and convergence dots** (codex #8 + my C). Includes adding a category legend somewhere visible (currently the legend lives only in tooltip rim and the filter bar).
8. **Persistent non-modal citation panel (Sheet, not Dialog) with selected rewrite context pinned at top** (codex #7, scoped down). Side-by-side reading without obscuring the viewer.

Deferred (still worth doing, just below the top 8): responsive layout (codex #9), sidebar filters by tool/convergence (my D), sparkline auto-range (my F), prompt-details persistence (my G).
