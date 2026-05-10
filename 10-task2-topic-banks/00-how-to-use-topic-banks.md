# How to use the Task 2 Topic Banks

> Audience: an LLM agent (or human tutor) generating feedback on band-6 IELTS Task 2 essays. The 17 topic files in this folder are the **content layer** that pairs with the **language layer** in `05-band-6-to-7/vocabulary-upgrades.md` and the **feedback patterns** in `06-feedback-patterns/`.

---

## 1. Why these banks exist

The repo's diagnostic work (see `09-instructor-tips/`) shows that the band-6 ceiling has two faces:

| Face | Diagnostic | Where to find the fix |
|---|---|---|
| **Lexical / grammatical thinness** | "Limited vocabulary, repetitive grammar." | `05-band-6-to-7/vocabulary-upgrades.md` |
| **Idea / content thinness** | "Doesn't know enough to say about the topic." | **THIS folder.** |

A band-6 student often produces three or four generic ideas ("technology helps people communicate; some people use it too much") and pads them with weak intensifiers. They cannot reach band 7 because **task response** marking docks them for under-developed ideas, not just lexis. These topic banks give the student (or the agent assisting them) a deeper reservoir of arguments to draw from.

---

## 2. When to cite a topic bank

Whenever an essay's prompt clearly maps onto one of the 17 topics, the agent should **explicitly recommend specific upgrades from that file**. Three triggers:

1. **The student's idea is generic.** Suggest a more specific argument from the file's `Core arguments FOR/AGAINST` table.
2. **The student's vocabulary is on-topic but band-6.** Suggest a 1:1 swap from the file's `Topic-specific C1 vocabulary cluster`.
3. **The student missed a counter-argument.** Point at the `Concession patterns` section.

### Citation format

When pointing the student at a topic bank, use this exact pattern (so a downstream tool can detect and link it):

```
See `10-task2-topic-banks/topic-NN-NAME.md` § [Section name]
```

Example:
> Your second body paragraph treats "online learning is convenient" as the whole argument. See `10-task2-topic-banks/topic-01-education.md` § Core arguments FOR — rows 4 and 7 give you a more discriminating reason ("self-paced learning suits non-traditional students") plus a concrete example.

---

## 3. Topic-to-prompt mapping (rule of thumb)

| If the prompt mentions… | Use… |
|---|---|
| schools, universities, students, online learning, exams | `topic-01-education.md` |
| pollution, climate, recycling, conservation, energy | `topic-02-environment.md` |
| internet, smartphones, AI, social media, screens | `topic-03-technology.md` |
| obesity, exercise, diet, hospitals, mental health | `topic-04-health.md` |
| culture, traditions, immigration, gender, generations | `topic-05-society-and-culture.md` |
| laws, taxes, government spending, freedom of speech | `topic-06-government-and-politics.md` |
| cities, traffic, housing, rural areas, urban planning | `topic-07-urbanisation.md` |
| international trade, multinational firms, English language | `topic-08-globalisation.md` |
| news, advertising, fake news, journalists, celebrities | `topic-09-media-and-communication.md` |
| jobs, careers, remote work, retirement, automation | `topic-10-work-and-employment.md` |
| parents, children, ageing, grandparents, family size | `topic-11-family-and-children.md` |
| crime, prison, punishment, deterrence, rehabilitation | `topic-12-crime-and-justice.md` |
| money, consumerism, inequality, foreign aid, taxation | `topic-13-money-and-economy.md` |
| tourists, travel, holidays, eco-tourism, gap years | `topic-14-travel-and-tourism.md` |
| sport, athletes, fitness, leisure, e-sports | `topic-15-sport-and-leisure.md` |
| art, museums, music, films, cultural heritage | `topic-16-arts-and-culture.md` |
| science, research, space, scientific funding | `topic-17-science-and-research.md` |

If a prompt straddles two topics (e.g. "online learning" = education + technology), cite **both** files — the agent should pick the dominant theme and treat the other as supporting.

---

## 4. How to use each section of a topic file

| Section | What the agent does with it |
|---|---|
| `Sub-topics commonly seen` | Confirm the prompt is on-topic; locate the right slant. |
| `Sample real exam prompts` | Show the student the *prompt family* their question belongs to. |
| `Core arguments FOR/AGAINST` | Pull a specific row when the student's argument is too generic. Each row gives Argument + Reason + Example + Useful phrase, in that order — recommend the **whole row** as one upgrade. |
| `C1 vocabulary cluster` | 1:1 lexical upgrades. Mark the band-6 word in the student's text and propose one of the 25+ items here. |
| `Common collocations` | Use when the student's essay has weak verb-noun pairings on this topic (e.g. "make pollution" → "cause pollution / pollute heavily"). |
| `Concession patterns` | When the student's essay is one-sided or absolute, suggest one of the ready-made concessions to insert before the conclusion. |
| `Ready-to-adapt thesis statements` | Use when the student's introduction has no clear position. Match the question type. |
| `Sample body paragraphs` | Reference paragraph-level structure (TS → reason → example → mini-conclusion). Don't paste them as the student's own work — point at them as a model. |
| `Common pitfalls / clichés` | Flag when the student has used one of these (e.g. "double-edged sword", "in this modern era"). |

---

## 5. What the agent must **not** do

- **Don't paste sample paragraphs into student feedback as their fix.** They are calibration material; the student must rewrite in their own words.
- **Don't recommend more than 3-4 upgrades per essay.** The student cannot internalise 20 changes at once. Pick the highest-leverage ones.
- **Don't assume one bank covers a cross-topic prompt.** If the prompt is "should governments tax junk food", that's `topic-04-health.md` AND `topic-06-government-and-politics.md` AND `topic-13-money-and-economy.md`. Cite all relevant.
- **Don't introduce statistics the bank labels as "studies suggest".** The banks deliberately avoid invented numbers; if the student adds "73 % of teenagers", flag it as an unverifiable claim.
- **Don't recommend a band-9 lexical item from the cluster if the student's surrounding sentence is band-5.** Mismatch is worse than no upgrade.

---

## 6. Practical agent workflow

```
1. Identify prompt → match to topic file(s) using §3 above.
2. Diagnose the essay (TR / CC / LR / GRA — see 06-feedback-patterns/).
3. For each weakness:
     - if content-thin → cite topic-XX § Core arguments
     - if lexically weak → cite topic-XX § C1 vocabulary
     - if no counter-view → cite topic-XX § Concession patterns
     - if cliché-heavy → cite topic-XX § Common pitfalls
4. Suggest 3-4 specific row-level upgrades. No more.
5. Reference 04-task2-essays/samples-band-7_0.md if the student
   needs to see what band 7 actually looks like on this topic.
```

---

## 7. Maintenance

- The topic files are deliberately **band-7 calibrated**, not band-9. Resist the urge to upgrade vocabulary further; band-9 jargon is unhelpful to a band-6 student.
- Examples are kept generic on purpose ("studies suggest", "OECD reports", "according to the WHO") so they remain plausible across years and don't go stale.
- British English spelling is used throughout (organise, behaviour, programme).
