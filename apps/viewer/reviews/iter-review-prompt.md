# Iterative reviewer prompt — IELTS Feedback Viewer

You are an iterative code reviewer + implementer. Your job is to **make small, targeted improvements** to the IELTS feedback viewer at `/Users/kiyoon/project/ielts-feedback/apps/viewer/`.

## Focus areas (in priority order)

1. **Overlap rendering correctness.** Real essays sometimes contain rewrites whose `original` strings overlap each other. Make sure all of these render sensibly:
   - Fully-nested child inside a parent (already handled — child is an inline italic clickable)
   - Multiple children in one parent (renders all of them at their positions)
   - **Partial overlap** — A spans 0–50, B spans 30–80. Currently B is wrongly marked "nested" with parent=A even though B extends past A. This case should either render B at a different occurrence or be flagged differently.
   - **Sub-nesting** — A contains B contains C. C currently shows "covered by A" but should be "covered by B".
   - **Sibling overlap** within a parent (rare but possible).

2. **Zero "could not be located" on real data.** With the latest parser + ellipsis-anchor + addition-detection logic, the residual count is 0 across all 21 W1/W2 iterations. **Verify it stays 0.** If you change the matcher, run the verification script at `/Users/kiyoon/project/ielts-feedback/real-essays/extract-chain.py` style equivalent (Python one-liner is fine).

3. **UX polish.**
   - The right-margin gutter bracket (`]`) for parent-of-nested marks should be aligned vertically with the actual text range. Verify with playwright if useful.
   - Hover/focus interactions: hovering a narrower nested child must NOT highlight the parent (currently fixed via `:has(.nested-child:hover)` exclusion + no outline on hover).
   - The "Suggested additions" card should render only meta/structural suggestions (not regular corrections).
   - Citation panel resize handle, sidebar resize handle — should both work via mouse drag and keyboard arrow keys.

4. **Code quality.** TypeScript strict mode passes. No unused imports/locals. Build clean (`cd apps/viewer && bun run build`). No browser-console errors at runtime.

## What you can edit

- `apps/viewer/src/**/*.{ts,tsx,css}` — viewer code
- `apps/viewer/public/data/**/*.json` — only if a payload schema change requires it (avoid touching individual feedback payloads otherwise)
- `apps/viewer/extract/*.{md,sh,mjs,json}` — extractor changes

## What you must NOT edit

- `benchmark/**` — that's the experiment, don't touch
- `real-essays/**` — student data, don't touch
- Top-level files like `.gitignore`, `CLAUDE.md`, etc. unless absolutely necessary

## Workflow each iteration

1. Read the viewer code in `apps/viewer/src/`.
2. Read the most recent prior iteration's summary (under `apps/viewer/reviews/iter-*.md` if any).
3. Identify ONE or TWO targeted improvements that fit the focus areas above.
4. Make the edits.
5. Run `cd /Users/kiyoon/project/ielts-feedback/apps/viewer && bun run build` and confirm it builds clean.
6. If the build fails, fix the failure before exiting.
7. Output a concise summary in this exact format:

```markdown
# Iter N — <codex|claude>

## What I changed
- file:line range — short description
- ...

## Verified
- bun build passes
- (any other check you ran, e.g., grep, regex test, playwright snapshot)

## What's left
- short list of issues you noticed but didn't fix this round; the next iteration can pick them up
- if you genuinely think the viewer is now perfect, write "no further improvements identified" — three of these in a row will halt the loop early.

## CONVERGENCE: CONVERGED | REFINING
(One line, exactly. CONVERGED means you couldn't find anything else worth changing.)
```

## Hard rules

- Don't make sweeping refactors. Each iteration's diff should be small and focused.
- Don't change the public payload schema unless a previous iter's summary said it needed changing.
- Don't add new dependencies unless absolutely required.
- Keep TypeScript strict — no `any`, no unused imports/locals.
- The build MUST pass at the end of every iteration.
