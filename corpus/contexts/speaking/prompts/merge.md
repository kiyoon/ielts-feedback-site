# Task: Merge two crawls for topic `{{TOPIC_ID}}` — {{TOPIC_TITLE}}

Two agents (codex and claude) independently crawled this topic. Their outputs
are at:

- `{{CODEX_PATH}}`
- `{{CLAUDE_PATH}}`

Merge them into a single curated file at:

```
{{OUTPUT_PATH}}
```

## Rules

- **Preserve all cited material from both files.** If a fact appears in only
  one file with a working URL, keep it.
- **Dedupe** identical or near-identical claims; pick the better-worded version
  and combine URLs into one citation if multiple sources support the same fact.
- **Surface disagreement.** If the two crawls give contradictory information
  (e.g. one says Band 7 wants 2 idioms per minute, the other says 4), keep
  BOTH with attribution and flag the conflict — do not silently pick one.
- **Country-specific section is sacred.** Keep every country / region that
  either crawl found. The user explicitly wants international coverage.
- **Operational signals section must be tight.** Merge into a single
  deduplicated bullet list, ranked by how directly applicable it is to scoring
  a transcript. Aim for 10-20 strong bullets max.
- **Sources list:** dedupe URLs, keep one-line descriptions.

## Output structure

Match the structure of the input files:

```markdown
# {{TOPIC_TITLE}}

_Merged from codex + claude crawls on <UTC timestamp>._

## Summary
## Authoritative material
## Country-specific prep material
## Open-source tools and code
## Practical signals for an LLM judge
## Sources
## Crawl notes
<Brief footer: what each agent contributed uniquely, any flagged conflicts,
any sections one crawl missed entirely.>
```

Write the merged content to `{{OUTPUT_PATH}}`. Do not modify the input files.
