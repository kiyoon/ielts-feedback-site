# Task: Crawl IELTS Speaking material for topic `{{TOPIC_ID}}` — {{TOPIC_TITLE}}

You are helping build an evaluation corpus for an automated IELTS Speaking
judge. The judge will read a diarized transcript (examiner vs candidate) and
score it across the four official criteria:

1. Fluency & Coherence
2. Lexical Resource
3. Grammatical Range & Accuracy
4. Pronunciation

The corpus you produce here will be loaded as context for that judge. Every
fact should be **specific, citable, and useful at scoring time**.

## Topic for this run

**`{{TOPIC_ID}}` — {{TOPIC_TITLE}}**

Scope hint: {{TOPIC_HINT}}

## What to produce

Use WebSearch and WebFetch aggressively, then write a single markdown file to:

```
{{OUTPUT_PATH}}
```

Structure:

```markdown
# {{TOPIC_TITLE}}

_Crawled by claude on <UTC timestamp>. Sources cited inline._

## Summary
<2-4 sentence orientation: what this topic covers and why it matters for scoring>

## Authoritative material
<Bullet/section list of content from official sources (IELTS.org, British Council,
IDP, Cambridge, etc). Quote sparingly; paraphrase generously. Every claim needs
a URL.>

## Country-specific prep material
<Sub-sections per country/region. We want diversity — Korean cram-school tips,
Chinese 雅思 forums, Vietnamese prep, Iranian/Indian/Pakistani academies,
Indonesian, Russian/Kazakh, plus UK/Australian/Canadian native-perspective
material. Include the original-language source URL plus a brief English summary
of the key points. Skip a region only if you genuinely cannot find quality
material after searching.>

## Open-source tools and code
<Only if relevant to this topic. Repos, papers, or APIs that score/evaluate
this dimension. Include GitHub URLs, license, last-updated date if visible.>

## Practical signals for an LLM judge
<End with 5-15 concrete, operationalisable bullets the judge can apply when
reading a transcript. Example for Lexical Resource: "Band 7+ speakers
typically produce 2-4 idiomatic chunks per minute in Part 2; below 1 suggests
Band 6.">

## Sources
<Flat list of every URL referenced above, each with a one-line description.>
```

## Rules

- **Cite everything.** No claim without a URL. If you cannot source it, drop it.
- **Many countries.** This is non-negotiable — the user explicitly wants
  international perspective. Search in the target language where possible
  (the WebSearch tool handles non-English queries fine).
- **Be expansive.** Better to overshoot and have material to prune than to
  ship a thin file. Aim for at least 1500 words of dense content.
- **Operationalise.** The judge needs rules it can apply, not vague advice.
  "Use idioms" is useless; "Band 7 candidates typically deploy at least 2
  idiomatic expressions per 90-second Part 2 turn" is useful.
- **Different angle from codex.** A peer agent (codex exec) is crawling the
  same topic in parallel and may converge on the most famous sources. Where
  reasonable, dig into less-obvious material — academic papers, examiner blogs,
  cram-school PDFs, Reddit/Discord threads with detailed examiner reports,
  YouTube transcripts. We will dedupe afterwards.
- **No fluff.** No "I hope this helps", no meta-commentary, no preamble.
- **Use the Write tool** to create the file at the exact path
  `{{OUTPUT_PATH}}`. Do not print the content to stdout.
