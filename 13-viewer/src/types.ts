// JSON payload schemas consumed by the viewer.
//
// The benchmark produces feedback as Markdown (see ../12-benchmark/results/).
// A separate extractor (see ../extract/) uses an LLM to parse each markdown
// file into one of these structured payloads. The UI never parses raw
// markdown to extract scores or rewrites — it only renders raw markdown as a
// human-readable fallback view.

export type TaskKey = "task1" | "task2";
export type Tool = "codex" | "claude" | "baseline";
export type Convergence = "CONVERGED" | "REFINING" | "UNKNOWN";

export type Category =
  | "task_response"
  | "coherence"
  | "lexical"
  | "grammar"
  | "spelling";

export const CATEGORIES: Category[] = [
  "task_response",
  "coherence",
  "lexical",
  "grammar",
  "spelling",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  task_response: "Task Response",
  coherence: "Coherence & Cohesion",
  lexical: "Lexical Resource",
  grammar: "Grammatical Range & Accuracy",
  spelling: "Spelling & Mechanics",
};

export const CATEGORY_SHORT: Record<Category, string> = {
  task_response: "TR",
  coherence: "CC",
  lexical: "LR",
  grammar: "GRA",
  spelling: "SP",
};

export const CATEGORY_TOKEN: Record<Category, string> = {
  task_response: "tr",
  coherence: "cc",
  lexical: "lr",
  grammar: "gra",
  spelling: "sp",
};

export interface EssayDoc {
  prompt: string;
  text: string;
  word_count: number;
}

export interface CriterionScore {
  band: number;
  descriptor_evidence: string;
  justification: string;
}

export interface Rewrite {
  id: number;
  original: string; // candidate's exact phrase from the essay (verbatim)
  improved: string;
  reason: string;
  // Multiple citations (split by ";" / "§" / commas in extractor). Empty array
  // is allowed (the original markdown row may not have cited a corpus file).
  citations: string[];
  category: Category;
  // Optional precomputed offset into essay text. If absent, the viewer will
  // try to find `original` via substring match at runtime.
  offset?: { start: number; end: number };
}

export interface FocusArea {
  area: string;            // short name e.g. "Article omission (the/a)"
  rationale: string;       // one-sentence why-it-matters
  corpus_drill: string[];  // corpus files to study (may be empty for baseline)
}

export interface FeedbackPayload {
  id: string; // "task1/04-claude"
  task: TaskKey;
  iteration: number; // 0 for baseline
  tool: Tool;
  generated_at: string;
  prior_id?: string;

  scores: {
    task_response: CriterionScore;
    coherence: CriterionScore;
    lexical: CriterionScore;
    grammar: CriterionScore;
  };
  overall: number;
  overall_rationale: string;

  what_changed: string;

  // Student-facing structural / pattern-level / strengths sections.
  // All optional so old payloads (without these sections) still validate.
  structural_feedback?: string;     // markdown — essay-level critique
  focus_areas?: FocusArea[];        // ranked, drill recommendations
  whats_working?: string;           // markdown — explicit strengths to anchor

  rewrites: Rewrite[];

  convergence: Convergence;
  convergence_note: string;

  raw_markdown: string;
}

export interface IterationSummary {
  id: string;
  iteration: number;
  tool: Tool;
  overall: number;
  convergence: Convergence;
  generated_at: string;
}

export interface IndexPayload {
  generated_at: string;
  tasks: Record<
    TaskKey,
    {
      essay: EssayDoc;
      iterations: IterationSummary[];
    }
  >;
}
