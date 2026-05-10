/**
 * Overlap-pattern test fixtures for the EssayPane.
 *
 * Real W1/W2 data only exercises 1 fully-nested case and 2 partial-overlap
 * cases — multi-children, 3-deep nesting, and sibling overlap-within-parent
 * paths in `buildSpans` are NOT exercised by real data. These stories
 * deliberately construct each pattern so the rendering can be inspected.
 *
 * Run via: `bun run storybook` then visit the "EssayPane" → ... stories.
 */
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FeedbackPayload, Rewrite } from "@/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EssayPane } from "@/components/EssayPane";
import { useCallback, useState } from "react";

// ─── helpers ──────────────────────────────────────────────────────────────

const makePayload = (essayText: string, rewrites: Rewrite[]): FeedbackPayload => ({
  id: "lab/synthetic",
  task: "task2",
  iteration: 1,
  tool: "codex",
  generated_at: "2026-05-10T00:00:00Z",
  scores: {
    task_response: { band: 6, descriptor_evidence: "lab", justification: "lab" },
    coherence: { band: 6, descriptor_evidence: "lab", justification: "lab" },
    lexical: { band: 6, descriptor_evidence: "lab", justification: "lab" },
    grammar: { band: 6, descriptor_evidence: "lab", justification: "lab" },
  },
  overall: 6,
  overall_rationale: "lab",
  what_changed: "",
  rewrites,
  convergence: "REFINING",
  convergence_note: "",
  raw_markdown: "",
});

const rw = (
  id: number,
  original: string,
  improved: string,
  category: Rewrite["category"] = "lexical",
): Rewrite => ({
  id,
  original,
  improved,
  reason: `Synthetic test rewrite #${id}`,
  citations: [],
  category,
});

// Wrapper that provides the TooltipProvider + essay-pane state. Stories pass
// just the payload and we manage active/unmatched/etc. internally.
function Harness({ essayText, rewrites }: { essayText: string; rewrites: Rewrite[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [scrollKey, setScrollKey] = useState(0);
  const [promptOpen, setPromptOpen] = useState(false);
  // Stable callbacks — EssayPane's effects depend on these references; an
  // inline arrow on each render would re-trigger the effect into an infinite
  // loop ("Maximum update depth exceeded").
  const handleMarkClick = useCallback((rw: Rewrite) => {
    setActive(rw.id);
    setScrollKey((k) => k + 1);
  }, []);
  const handleLocationReport = useCallback(() => {}, []);
  const handleSetLocationFilter = useCallback(() => {}, []);
  const payload = makePayload(essayText, rewrites);
  return (
    <TooltipProvider delayDuration={150}>
      <div style={{ height: "92vh", maxWidth: 880 }}>
        <EssayPane
          essay={{ prompt: "Synthetic test essay (no real prompt)", text: essayText, word_count: essayText.split(/\s+/).length }}
          feedback={payload}
          activeRewriteId={active}
          onMarkClick={handleMarkClick}
          scrollKey={scrollKey}
          onLocationReport={handleLocationReport}
          promptOpen={promptOpen}
          setPromptOpen={setPromptOpen}
          onSetLocationFilter={handleSetLocationFilter}
        />
      </div>
    </TooltipProvider>
  );
}

const meta: Meta<typeof Harness> = {
  title: "EssayPane / Overlap patterns",
  component: Harness,
  parameters: { layout: "padded" },
  argTypes: {
    essayText: { control: false },
    rewrites: { control: false },
  },
};
export default meta;
type Story = StoryObj<typeof Harness>;

// ─── 1. clean: no overlaps ────────────────────────────────────────────────

const ESSAY_CLEAN =
  "Mathematics has shaped computer science. Logic, binary representation, and algorithms are all rooted in mathematical thinking. Modern computers depend on these foundations every day.";

export const NoOverlaps: Story = {
  args: {
    essayText: ESSAY_CLEAN,
    rewrites: [
      rw(1, "Mathematics has shaped computer science.", "Mathematics has decisively shaped computer science.", "task_response"),
      rw(2, "Logic, binary representation, and algorithms", "Logic, binary representation and algorithms", "lexical"),
      rw(3, "depend on these foundations every day", "rely on these mathematical foundations daily", "lexical"),
    ],
  },
};

// ─── 2. single nested: 1 child fully inside 1 parent (the W1 iter-08 case) ─

const ESSAY_NESTED =
  "This explains how Samuel Morse invented Morse code in 1844, the first ever information which only used electronic signals, so that no physical objects such as people or dove needed.";

export const SingleNested: Story = {
  args: {
    essayText: ESSAY_NESTED,
    rewrites: [
      rw(1, "the first ever information which only used electronic signals, so that no physical objects such as people or dove needed.", "the first communication system to rely solely on electrical signals, removing the need for human couriers or carrier pigeons.", "grammar"),
      rw(2, "no physical objects such as people or dove needed.", "no human messengers or animal carriers were needed.", "grammar"),
    ],
  },
};

// ─── 3. multi-children: 2 children inside 1 parent ────────────────────────

const ESSAY_MULTI =
  "Computers consist of a full of small switches which can turn on and off. By doing that, it can calculate in binary digits.";

export const MultiChildren: Story = {
  args: {
    essayText: ESSAY_MULTI,
    rewrites: [
      // Parent: full first sentence
      rw(1, "Computers consist of a full of small switches which can turn on and off.", "Computers consist of countless tiny switches that can be either on or off.", "grammar"),
      // Child #1: "a full of small switches"
      rw(2, "a full of small switches", "a vast array of small switches", "grammar"),
      // Child #2: "which can turn on and off"
      rw(3, "which can turn on and off", "that can be either on or off", "grammar"),
      // Independent sibling sentence
      rw(4, "By doing that, it can calculate in binary digits.", "By combining these on/off states, computers perform calculations in binary.", "coherence"),
    ],
  },
};

// ─── 4. sub-nesting: A ⊃ B ⊃ C ─────────────────────────────────────────────

const ESSAY_SUBNEST =
  "If it has billions and trillions of switches, then it can go up to almost countless numbers.";

export const SubNested: Story = {
  args: {
    essayText: ESSAY_SUBNEST,
    rewrites: [
      // A: full sentence
      rw(1, "If it has billions and trillions of switches, then it can go up to almost countless numbers.", "Because modern computers contain billions of such switches, they can represent extremely large numbers.", "grammar"),
      // B: middle clause inside A
      rw(2, "billions and trillions of switches, then it can go up to almost countless numbers", "billions of switches, allowing them to represent extremely large numbers", "lexical"),
      // C: shortest inside B (and inside A)
      rw(3, "billions and trillions of switches", "billions of microscopic switches", "lexical"),
    ],
  },
};

// ─── 5. partial overlap: B starts inside A, extends past A ────────────────

const ESSAY_PARTIAL =
  "Mathematics has been developed for a long time and remains essential. People have built up mathematical rules by defining new logics to solve problems.";

export const PartialOverlap: Story = {
  args: {
    essayText: ESSAY_PARTIAL,
    rewrites: [
      // A: first sentence
      rw(1, "Mathematics has been developed for a long time and remains essential.", "Mathematics has been refined over millennia and remains foundational.", "lexical"),
      // B: starts inside A's last clause, extends into the next sentence — partial overlap
      rw(2, "remains essential. People have built up mathematical rules by defining new logics to solve problems.", "remains foundational, with successive generations refining its rules to solve real problems.", "task_response"),
      // C: independent in second sentence
      rw(3, "defining new logics", "developing new systems of logic", "lexical"),
    ],
  },
};

// ─── 6. all-the-things: stress test combining every pattern ───────────────

const ESSAY_ALL =
  "Mathematics has shaped computing in deep ways. Computers consist of countless tiny switches that flip on and off. By combining these states, modern processors represent vast numbers and complex data.";

export const AllPatterns: Story = {
  args: {
    essayText: ESSAY_ALL,
    rewrites: [
      // Plain non-overlapping mark
      rw(1, "Mathematics has shaped computing in deep ways.", "Mathematics has fundamentally shaped computing.", "task_response"),
      // Parent for nested + sub-nest
      rw(2, "Computers consist of countless tiny switches that flip on and off.", "At their core, computers consist of countless tiny switches that can be either on or off.", "grammar"),
      // Child 1 of #2
      rw(3, "countless tiny switches that flip on and off", "countless tiny switches that can be either on or off", "grammar"),
      // Sub-child 2: nested inside #3
      rw(4, "flip on and off", "be either on or off", "lexical"),
      // Partial overlap with #5 below
      rw(5, "By combining these states, modern processors represent vast numbers and complex data.", "By combining these on/off states, modern processors can represent extremely large numbers.", "coherence"),
      // Partial overlap: starts at "modern processors", extends into vast/complex
      rw(6, "modern processors represent vast numbers and complex data.", "modern processors can represent extremely large numbers and complex data.", "lexical"),
      // Addition (renders in the additions card, not in essay)
      rw(7, "(missing concluding paragraph)", "Add a synthesis conclusion that ties the binary mechanism back to the prompt.", "task_response"),
    ],
  },
};
