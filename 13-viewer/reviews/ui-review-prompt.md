# UI/UX review prompt — IELTS Feedback Viewer

You are a senior product designer + frontend engineer reviewing the UI/UX of an IELTS feedback viewer that lives in `/Users/kiyoon/project/ielts-feedback/13-viewer/`. The viewer renders the output of an iterative refinement experiment (`12-benchmark/`) where ~50 LLM iterations of feedback are produced per essay; an extractor converts each markdown feedback into a JSON payload that the viewer consumes.

## Your scope

- This is a UI/UX review **only**. Do not touch types, build issues, dependency versions, or code style. A separate code-review pass will follow.
- Focus on: information hierarchy, navigation, scannability, click affordances, comparison/diff features, accessibility (keyboard, screen-reader landmarks, contrast), responsiveness, color semantics, common workflows the user will actually do.

## What to read (in this order)

1. `13-viewer/README.md` — design intent
2. `13-viewer/src/App.tsx` — shell layout
3. `13-viewer/src/components/Sidebar.tsx`
4. `13-viewer/src/components/IterationScrubber.tsx`
5. `13-viewer/src/components/EssayPane.tsx`
6. `13-viewer/src/components/FeedbackPane.tsx`
7. `13-viewer/src/components/RewriteCard.tsx`
8. `13-viewer/src/components/ScoresCard.tsx`
9. `13-viewer/src/components/CitationSheet.tsx`
10. `13-viewer/src/components/ConvergenceBadge.tsx`
11. `13-viewer/src/styles.css` — category color tokens, mark styling
12. `13-viewer/src/types.ts` — payload shape
13. Skim `12-benchmark/results/task1/04-claude.md` to understand the data the viewer must visualise

## Workflows the viewer must support well

The user is preparing IELTS Writing test, currently band 6.0, targeting 7.0. Their actual workflows:

- **(W1) Find which iteration to read.** Open the viewer, see all 50+ iterations, pick the most useful one (probably the last CONVERGED iteration, but also wants to compare baseline vs final).
- **(W2) Read feedback for one essay.** Per-criterion scores, per-criterion justification, the top concrete rewrites, the convergence note.
- **(W3) Locate corrections in the essay.** See "the figure of USA" → "US consumption" mapping and where it appears in their writing.
- **(W4) Compare baseline (no-repo) vs latest (full-repo) feedback.** Did the corpus actually help? What does it add?
- **(W5) Verify suggestions against the corpus.** Each rewrite cites a corpus file; does it actually say what the suggestion claims?
- **(W6) Track convergence.** When did the chain stop changing? Was it iter 12 or iter 35?

## What to produce

Write a critique focused on **specific, actionable, prioritised** improvements. For each issue:

- **Severity:** Blocker / High / Medium / Nice-to-have
- **Workflow affected:** W1–W6 (or "general")
- **Issue:** what's wrong
- **Proposed fix:** concrete change (component, class, prop, layout)
- **Rationale:** why it matters

Do NOT propose features that already exist. Read the code first.

Then end with a "consensus stance" section listing the **5–10 most important changes**, ranked.

## Anti-patterns to call out

- Hidden information that requires too many clicks
- Color-only signal (without text/icon backup) — accessibility
- Tooltips for primary content (hover-only = mobile-broken; only acceptable for secondary detail)
- Cluttered headers, vague badge labels
- Redundant panes (e.g. sidebar AND scrubber listing the same iterations) unless they serve different jobs
- Modal-only access to corpus citations when a side-by-side panel would be better
- Compare mode that's hard to escape

Be specific. Quote file:line where you can. The author should be able to act on each item without further questions.
