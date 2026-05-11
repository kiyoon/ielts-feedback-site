# Iteration 09 — codex

_Generated 2026-05-10T14:34:56Z by codex (took 152s)._

---

# Iter 9 — codex

## What I changed
- apps/viewer/src/components/EssayPane.tsx:167-185 — gutter brackets now measure the first and last rendered inline client rects for parent shells, aligning the bracket to the actual multi-line text range.
- apps/viewer/src/App.tsx:435-452 — resize separator labels now explicitly mention drag and ArrowLeft/ArrowRight keyboard resizing.

## Verified
- bun build passes
- Real W1/W2 locator check: `checked=21 additions_filtered=7 unmatched=0 nested=3 overlaps=0`
- Confirmed `react-resizable-panels` Separator already handles ArrowLeft/ArrowRight keyboard resize.

## What's left
- Browser/Playwright visual verification of gutter alignment and console cleanliness was not run in this environment.
- Storybook scaffold remains unused.

## CONVERGENCE: REFINING