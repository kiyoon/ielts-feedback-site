# Open-source IELTS speaking evaluators, scoring code, related research

_Crawled by claude on 2026-05-19T07:30Z. Sources cited inline._

## Summary

Automated speaking assessment splits into two camps: **commercial scoring engines** (ETS SpeechRater, Pearson Versant/PTE, Speechace, Azure Pronunciation Assessment, ELSA Speak, SpeechSuper) and **open research stacks** (Kaldi GOP recipe, GOPT/transformer scorers, wav2vec2-based proficiency models, Whisper-based disfluency detectors). The commercial systems converge on a feature taxonomy that maps cleanly onto IELTS' four bands — **accuracy / completeness** (lexical-phonetic), **fluency** (rate + pause structure), **prosody** (stress, intonation, rhythm), and **content** (vocabulary, grammar, topic relevance). Open datasets like **speechocean762** and **L2-ARCTIC** anchor reproducible benchmarks at phoneme, word, and sentence granularities. For a transcript-only LLM judge, the most portable signals are speaking-rate proxies (words-per-minute computed from diarized timings), pause-ratio (silence / total time), disfluency counts (filled-pause tokens, edit disfluencies, repetitions), and lexical-syntactic features (type-token ratio, clause boundaries) — all of which SpeechRater, Speechace and Versant already use operationally.

## Authoritative material

- **IELTS official Speaking Band Descriptors (public version)** — the four-row rubric (Fluency & Coherence; Lexical Resource; Grammatical Range & Accuracy; Pronunciation). Band-8 fluency is defined as "speaks fluently with only occasional repetition or self-correction; hesitation is usually content-related, rarely language-related" while Band-6 fluency says "is willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation". Source PDF: <https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf> and <https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf>; Cambridge mirror: <https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf>.
- **ETS SpeechRater v5.0 engine technical report (Chen et al., 2018)** — full ETS Research Report. Documents ~100 features across delivery, language use and content; emphasises linear/interpretable models and fairness across L1 groups: <https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12198>. Earlier "construct-driven" SpeechRater paper: <https://www.researchgate.net/publication/228620191_SpeechRater_A_Construct-Driven_Approach_to_Scoring_Spontaneous_Non-Native_Speech>. ETS landing page: <https://www.ets.org/speechrater.html>.
- **Azure Pronunciation Assessment** (Microsoft Learn) — official scoring categories and JSON schema. Scripted mode returns Accuracy + Fluency + Completeness + Prosody → PronScore; unscripted mode adds Vocabulary, Grammar, Topic content scores: <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment>. Transparency note (limitations and intended use): <https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment>. Ignite update on prosody + unscripted scoring: <https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/speech-service-ignite-update-%E2%80%93-new-enhancement-features-for-pronunciation-assess/3978093>.
- **Speechace API docs** — defines fluency as "words correct per minute, good/bad pauses, articulation rate, hesitations, repetitions, variation in tone" and emits IELTS/CEFR/PTE/TOEIC band estimates: <https://api-docs.speechace.com/features/scripted-activities/fluency-scoring>, <https://api-docs.speechace.com/api-reference/score-text-fluency/handling-fluency-response>, <https://api-docs.speechace.com/guides-on-common-topics/interpreting-overall-scores>, <https://www.speechace.com/the-speechace-speaking-test/>.
- **Pearson PTE Academic Automated Scoring White Paper (2019)** — describes the Ordinate engine that scores pace, rhythm, intonation, pronunciation, and lexical/grammatical content of unconstrained responses: <https://assets.ctfassets.net/yqwtwibiobs4/018RxttvPWsMkkGIQJ5Gg3/6f410437ceb2c6f2762fbcdfa8a28e8c/2021_PTEA_White_Paper_Institutions_Automated_Scoring_White_Paper-May-2018.pdf>. Plain-English overview: <https://www.pearson.com/languages/community/blogs/2020/05/how-do-computers-test-english.html>. PTE Core score guide: <https://www.pearsonpte.com/ctf-assets/yqwtwibiobs4/4YEY3FefBoAMjxZ94QkBP4/bc9c70ebbfc7b249ad6d21195e8ed0fc/PTE_Core_Score_Guide_Jan_24_V1.pdf>.
- **speechocean762 paper (arXiv:2104.01378)** — open non-native English corpus, 5,000 utterances from 250 Mandarin-L1 speakers, five expert annotators per utterance, phoneme/word/sentence-level scores: <https://arxiv.org/abs/2104.01378>, OpenSLR mirror <https://www.openslr.org/101/>, HuggingFace mirror <https://huggingface.co/datasets/mispeech/speechocean762>.
- **L2-ARCTIC (Interspeech 2018)** — 27.1 h of read non-native English from 24 speakers across Hindi, Korean, Mandarin, Spanish, Arabic, Vietnamese (later additions); 150 utterances per speaker annotated for substitution/deletion/insertion phoneme errors. Paper: <https://www.isca-archive.org/interspeech_2018/zhao18b_interspeech.html>; PDF: <https://psi.engr.tamu.edu/wp-content/uploads/2018/08/zhao2018interspeech.pdf>; corpus page: <https://psi.engr.tamu.edu/l2-arctic-corpus/>.
- **GOPT (ICASSP 2022, Gong et al.)** — first transformer model evaluating multi-aspect (accuracy / fluency / prosody) × multi-granularity (phoneme / word / sentence) jointly. SOTA on speechocean762 at publication: 0.612 phone-PCC, 0.549 word-PCC, 0.742 sentence-PCC. Paper PDF: <https://arxiv.org/pdf/2205.03432>; code: <https://github.com/YuanGongND/gopt>.
- **TOEFL11 corpus** (Blanchard et al., 2013) — 12,100 essays across 11 L1s × 3 proficiency bands, widely used for native-language identification and AES research: <https://files.eric.ed.gov/fulltext/EJ1109982.pdf>.

## Country-specific prep material

### Chinese (中国)

The Chinese market has the densest concentration of AI IELTS speaking apps because outbound study volume is enormous and Cambridge English's writing AI (now bundled into BC's official prep) is licensed there. The flagship is **流利说·雅思 (LiuLiShuo IELTS)** — markets itself as evaluating "词汇 / 发音 / 语法 / 流利度" (vocabulary, pronunciation, grammar, fluency), the same four pillars as IELTS Speaking: <https://m.liulishuo.com/ielts.html>. Zhihu (the Chinese Quora) hosts active commentary; a representative roundup of "8 best AI mock-speaking tools" (e.g. **可栗口语 Keli Speak**, **羊驼雅思**, **咕噜口语 SpeakGuru**, **星空外语 SkyLingo**) is at <https://zhuanlan.zhihu.com/p/1984706515685380414> and a "20-day 5.5→7.0" cram-school style breakdown of LiuLiShuo's IELTS module: <https://www.explinks.com/blog/yt-ai-speaking-20days-ielts-55to70/>. **English summary:** Chinese tools commonly self-report 96–98% agreement with human examiners (e.g. SkyLingo) and emphasise "智能追问" (intelligent follow-up questions) to mimic Part-3 examiner pressure — that's a useful corpus signal: agreement should drop on follow-up turns where students lose footing.

### Korean (한국)

The Korean ecosystem is more pronunciation-app heavy than IELTS-specific. **Speakometer** (App Store KR) advertises IELTS/TOEFL/TOEIC prep through pronunciation grading on a 0–100 scale: <https://apps.apple.com/kr/app/speakometer-ai-%EC%98%81%EC%96%B4-%EB%B0%9C%EC%9D%8C-%EC%8A%A4%ED%94%BC%ED%82%B9-%EC%97%B0%EC%8A%B5/id1529508890>. **INEAR** (B2B/EdTech, <https://inear.io/>) markets a Korean-built "AI 영어말하기평가 솔루션" that explicitly mirrors the four IELTS bands (발음·유창성 + 문법·어휘). **TestGlider** is a popular Korean-language explainer of IELTS rubrics including the speaking criteria <https://blog.testglider.com/%EC%95%84%EC%9D%B4%EC%97%98%EC%B8%A0-%EC%A0%90%EC%88%98-%EC%B1%84%EC%A0%90-%EB%B0%A9%EB%B2%95-%EA%B8%B0%EC%A4%80-%EC%B4%9D%EC%A0%95%EB%A6%AC/>. **AI Hub Korea** publishes a Korean-L1 English speech dataset for downstream pronunciation scoring research: <https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479>.

### Vietnamese

**DOL English** (the dominant Vietnamese IELTS academy) ships a Speaking practice app: <https://www.dolenglish.vn/blog/app-hoc-ielts-mien-phi> and <https://tuhoc.dolenglish.vn/>. **KTDC** offers an AI IELTS coach platform (<https://ai.ktdcgroup.vn/> and <https://ktdcgroup.vn/en/ielts-speaking-ai/>). Reviews aggregators rate ELSA Speak top for pronunciation specifically because the company's founder is Vietnamese and the model is heavily trained on VN-accented speech: <https://www.onluyen.vn/ielts/app-luyen-speaking-ielts/>, <https://langmaster.edu.vn/app-luyen-ielts-speaking>. Vietnamese students also discuss the AI-examiner-vs-human-examiner debate via IDP's own blog: <https://ielts.idp.com/vietnam/prepare/article-ielts-speaking-ai-vs-face-to-face/en-gb>.

### Indian / South Asian

A large bench of consumer apps target Indian/Pakistani test-takers: **SmallTalk2Me** <https://smalltalk2.me/ielts>, **Speechful** <https://speechful.ai/>, **FixoLang/EngVarta** <https://engvarta.com/ielts/>, **IELTS AI Coach** <https://www.ieltsai.app/>, **IELTS AI Prep / ClearScore** <https://ieltsaiprep.com/>, **Cathoven** (claims 98% agreement with examiners) <https://www.cathoven.com/>. Common pitch: "instant 1–9 band score across all four criteria with examiner-aligned feedback" — useful baseline for what these systems publicly assert they measure.

### Russian / Kazakh

A Russian-language firsthand prep diary (T-J / Tinkoff Journal) ranks several AI platforms used for Kazakhstan IELTS prep: <https://t-j.ru/exam-ielts-v-kazakhstane/>. British Council Kazakhstan's official familiarisation test: <https://kazakhstan.britishcouncil.org/ru/exam/ielts/prepare/computer-delivered-ielts-familiarisation-test>. The Uzbek-built **MockSpace** <https://www.mockspace.uz/en> markets pronunciation/fluency/grammar AI scoring against IELTS/CEFR rubrics in the Central Asian market.

### UK/Australia (native examiner critique)

Critical takes on AI scoring validity emphasise: (a) most consumer AI tools report 0.70–0.85 correlation with real IELTS — below the 0.90+ inter-rater reliability humans achieve; (b) descriptors like "without noticeable effort" and "frequently error-free" are subjective and AI can't reliably interpret them. Synthesis: <https://speaking.lingo-copilot.com/blog/can-ai-give-accurate-ielts-speaking-scores>. IDP's own balanced article on AI vs face-to-face: <https://ielts.idp.com/prepare/article-how-to-effectively-use-ai>. GEL IELTS' transparency note: <https://help.gelielts.com/hc/en-us/articles/34550917975828-Is-the-AI-feedback-accurate-and-reliable>.

## Open-source tools and code

### Pronunciation scoring (acoustic)

- **Kaldi GOP recipe (`egs/gop_speechocean762`)** — the canonical open-source Goodness-of-Pronunciation baseline. Uses an nnet3 TDNN acoustic model, computes phoneme posterior ratios, and reports correlations on speechocean762. <https://github.com/kaldi-asr/kaldi/tree/master/egs/gop_speechocean762>.
- **speechocean762 baseline** (`jimbozhang/speechocean762`) — author-provided baseline; the corpus license allows free commercial and non-commercial use. <https://github.com/jimbozhang/speechocean762>.
- **GOPT** (`YuanGongND/gopt`) — transformer that ingests Kaldi GOP features and predicts five aspects (accuracy, completeness, fluency, prosody, total) at three granularities. PyTorch, BSD-style license. <https://github.com/YuanGongND/gopt>.
- **GOP variants on PyKaldi / DNN / fine-tuned approaches** — Jazmín Vidal's stack: `gop-pykaldi` <https://github.com/JazminVidal/gop-pykaldi>, `gop-dnn-epadb` <https://github.com/JazminVidal/gop-dnn-epadb>, `gop-ft` (transfer learning) <https://github.com/JazminVidal/gop-ft>.
- **Segmentation-free GOP (arXiv:2507.16838, 2025)** — alignment-free wav2vec2-based scorer, removes the forced-alignment dependency that historically hurt L2-heavy-accent speakers. <https://arxiv.org/html/2507.16838v1>.
- **Wav2vec2-based mispronunciation detection** (arXiv:2203.15937 momentum pseudo-labels; arXiv:2311.07037 phonological-level MDD). Code links inside the papers.
- **End-to-end MDD with max-F1 training** (arXiv:2108.13816): <https://arxiv.org/pdf/2108.13816>. Full-text-dependent MDD with data augmentation (arXiv:2104.08428): <https://arxiv.org/pdf/2104.08428>.

### Holistic / proficiency scoring (speech-side)

- **Proficiency assessment of L2 spoken English using wav2vec 2.0** (SLT 2022, arXiv:2210.13168) — fine-tunes wav2vec2-XLSR-53 for both holistic CEFR band and per-aspect (relevance, formal correctness, lexical richness, pronunciation, fluency, communicative effectiveness) scoring; significantly beats BERT-on-transcript baselines. <https://arxiv.org/pdf/2210.13168>.
- **L2 proficiency assessment using self-supervised speech representations** (arXiv:2211.08849) — same family, different layer probing strategy. <https://arxiv.org/pdf/2211.08849>.
- **Assessment of L2 Oral Proficiency using Speech LLMs** (arXiv:2505.21148, 2025) — uses speech-aware LLMs (e.g. Qwen-Audio) for end-to-end scoring; useful prior art for any LLM-judge pipeline. <https://arxiv.org/pdf/2505.21148>.
- **Automatic Proficiency Assessment in L2 English Learners** (arXiv:2505.02615, 2025) — explicit BERT-on-transcript vs wav2vec2 ablations confirming that transcript-only models lose the prosody/fluency signal. <https://arxiv.org/html/2505.02615v1>.
- **Advancing Automated Speaking Assessment with multifaceted relevance + grammar** (arXiv:2506.16285, 2025) — focuses on transcript-side features the LLM judge can directly mimic. <https://arxiv.org/pdf/2506.16285>.

### Disfluency / Whisper-based

- **Whisper in Focus: stuttered-speech classification** (arXiv:2311.05203) — encoder-layer probing for disfluency types (block, prolongation, repetition).
- **Augmenting ASR with disfluency detection** (arXiv:2409.10177) — end-to-end disfluency token tagging; useful template for transcript-level tagging. <https://arxiv.org/html/2409.10177v2>.
- **Towards End-to-End Spoken Grammatical Error Correction** (arXiv:2311.05550) — Whisper used jointly for transcription + GEC, directly relevant to Grammatical Range & Accuracy. <https://arxiv.org/pdf/2311.05550>.

### IELTS-labeled and IELTS-adjacent code

- **`dustland/talk`** — AI IELTS Speaking practice covering Parts 1–3, voice-record + transcription + AI scoring against IELTS criteria. <https://github.com/dustland/talk>.
- **`hubeiqiao/IELTS-Speaking-Simulator`** — simulates Parts 1–3 with automatic scoring and answer-optimisation prompts. <https://github.com/hubeiqiao/IELTS-Speaking-Simulator/blob/main/README_EN.md>.
- **`ZainabZaman/IELTS_PracticeAndEvaluation`** — pipeline that ingests user audio + bot prompt and returns band scores across all four skills. <https://github.com/ZainabZaman/IELTS_PracticeAndEvaluation>.
- **GitHub topic indices**: <https://github.com/topics/ielts?l=python>, <https://github.com/topics/pronunciation-scoring>.

### Commercial APIs (closed source, public docs)

- **SpeechAce** — `/score-text-fluency` returns speaking rate (correct words per minute), articulation rate, pause counts/durations, hesitation count, repetition count, plus IELTS/CEFR/PTE/TOEIC band estimates. <https://api-docs.speechace.com/features/scripted-activities/fluency-scoring>. SDK samples: <https://github.com/speechace/speechace-api-samples>.
- **SpeechSuper** — phoneme/syllable/word/sentence-level accuracy + fluency + IELTS/PTE band estimates across 8 languages. <https://github.com/speechsuper/SpeechSuper-API-Samples>.
- **Azure Pronunciation Assessment** — REST/SDK; output JSON contains `AccuracyScore`, `FluencyScore`, `CompletenessScore`, `ProsodyScore`, `PronScore`, plus per-word `ErrorType` (None, Mispronunciation, Omission, Insertion, UnexpectedBreak, MissingBreak, Monotone) and per-syllable / per-phoneme accuracy. Unscripted mode adds `VocabularyScore`, `GrammarScore`, `TopicScore`, `ContentScore`. Docs: <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment>; portal demo: <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/pronunciation-assessment-tool>; SDK class ref: <https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/pronunciationassessmentresult>.
- **ELSA Speak** — proprietary DNN trained on 200M+ hours of accented speech; reports phoneme-level errors plus intonation/rhythm/stress; claims 95%+ accuracy. <https://www.edtechdigest.com/2024/10/31/elsa-speak/>, <https://www.linkedin.com/company/elsa-corp>.
- **Pearson PTE / Versant** — Ordinate scoring engine: weights pace, rhythm, intonation, pronunciation accuracy, lexical/grammatical complexity, content relevance. White paper above + scoring explainer: <https://goarno.io/blog/how-ai-calculates-pte-scores/>.
- **ETS SpeechRater** — full feature catalogue published in ETS Research Reports; covers `ipcount` (edit disfluencies), `clausecount`, `IPC` (disfluencies/clause), `IPW` (disfluencies/word), `longSilRatio` (proportion of long within-clause silences), type counts per POS class, plus prosody and pronunciation features. <https://ai.myspeakingscore.com/how-the-speechrater-scoring-engine-scores-toefl-speaking-responses/>, <https://ai.myspeakingscore.com/speaking-speed-as-a-proxy-for-fluency-how-speechrater-measures-speaking-rate/>.

### Datasets

| Dataset | Speakers / Size | What's annotated | Use |
| --- | --- | --- | --- |
| **speechocean762** | 250 Mandarin-L1, 5k utt | Phoneme (0–2), word accuracy (0–10) + stress (5/10), sentence accuracy/fluency/prosody/completeness | Pronunciation scoring benchmark <https://www.openslr.org/101/> |
| **L2-ARCTIC** | 24 speakers, 6 L1s, 27.1 h | Phoneme sub/del/ins on 150 utt/speaker | Mispronunciation detection <https://psi.engr.tamu.edu/l2-arctic-corpus/> |
| **EpaDB** | Spanish-L1 English | Phone-level pronunciation | GOP transfer-learning (gop-dnn-epadb above) |
| **TOEFL11** | 12,100 essays, 11 L1s | Native-language ID, proficiency band | Lexico-grammatical proficiency modeling <https://files.eric.ed.gov/fulltext/EJ1109982.pdf> |
| **ETS Spoken (TPO)** | Internal | TOEFL Speaking responses | Used to train SpeechRater (not redistributed) |
| **AI-Hub Korean-L1 English speech** | Korean L1 | Pronunciation + transcripts | Korea-specific accent research <https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479> |

## Practical signals for an LLM judge

A diarized transcript with timestamps survives transliteration cleanly. Below are the features existing systems pay for, ranked by how directly they transfer to a transcript-only judge:

1. **Speaking rate (words/min)**. Speechace's fluency core; SpeechRater's strongest delivery feature. Compute `n_words / (turn_end - turn_start)`. Reference: ≥120 wpm is Speechace's "fluent" threshold (<https://www.speechace.com/api-plans/>). Band-7+ speakers cluster 130–170 wpm; under 90 wpm is a strong negative signal for fluency.
2. **Articulation rate vs speaking rate**. Articulation rate = words / (total time − pause time). Speakers can hit decent wpm while pausing heavily (low articulation rate → laboured but pre-rehearsed). If transcript shows long silence segments between short bursts, flag Band 5–6 hesitation pattern.
3. **Pause ratio and pause typology**. SpeechRater uses `longSilRatio` (long within-clause silence / total within-clause silence). For diarized transcripts, count silences >0.5 s (SpeechRater's threshold). Within-clause pauses penalise more than between-clause pauses; if you can detect clause boundaries (commas, finite-verb counts), report both. IELTS Band 8 = "hesitation is content-related"; the judge can approximate this by checking whether long pauses precede content words (nouns/verbs) vs function words.
4. **Filled-pause and hesitation tokens**. Count `uh`, `um`, `er`, `erm`, `you know`, `like` per 100 words. SpeechRater measures "umm/eer" disfluencies. >5 filled pauses per 100 words is a Band-5/6 marker; ≤2 is Band 7+.
5. **Repetition / self-correction count**. Edit disfluencies = adjacent repeated tokens or repaired sequences ("I went — I mean I was going to"). SpeechRater's `ipcount`. Excessive self-correction without progress → Band 6 fluency cap.
6. **Type-token ratio + advanced-vocabulary ratio**. SpeechRater counts word types across POS classes. The judge can compute TTR over a moving 100-token window and the % of words outside the GSL/AWL top-2000 list to proxy Lexical Resource. Idiomatic/collocational use (e.g. "by and large", "off the top of my head") and topic-specific terminology lift Band 7→8.
7. **Clause depth + subordination ratio**. PTE/Versant uses "complexity of grammar". Count subordinating conjunctions (`because`, `although`, `whereas`, `if`, `when`) per clause; mix of finite + non-finite clauses; presence of relative clauses. Lifts Grammatical Range score from 6 to 7+.
8. **Grammatical error density**. Whisper-based end-to-end GEC papers (arXiv:2311.05550) show errors/100-words is the workhorse Grammatical Accuracy proxy. >8 errors/100 words → Band 5; ≤2 with control of complex structures → Band 8.
9. **Cohesive-marker variety**. Range of connectives (`however`, `as a result`, `on top of that`, `having said that`) signals Coherence; over-reliance on `and / so / but` caps at Band 6. SpeechRater explicitly tracks discourse-marker counts.
10. **Content / topic relevance**. Azure's unscripted ContentScore = (Vocabulary + Grammar + Topic) / 3. The LLM judge has a structural advantage here: it can directly verify whether the response addresses the cue card prompt, names the four bullet-points in Part 2, and develops Part-3 abstract questions.
11. **Long-turn sustain (Part 2 specific)**. IELTS Band 6 says "willing to produce long turns"; Band 4 fails to sustain. Compute words in the longest mono-speaker turn; <60 words in Part 2 suggests <Band 6 fluency.
12. **Pronunciation features that DO survive transcripts (partially)**. The judge cannot hear phonemes, but if upstream ASR confidence is exposed, low-confidence words correlate with mispronunciation/accent strength (Pearson Versant relies on this signal heavily). If `[unintelligible]`/`[inaudible]` tags appear in the transcript, treat them as a pronunciation penalty.
13. **Prosody proxies via punctuation**. Many ASRs (Whisper, Azure) emit punctuation derived from prosodic phrasing. Sentences ending mid-thought (no terminal punctuation), monotone runs flagged by repeated commas, and absent question intonation on yes/no questions are mild signals.
14. **L1-specific error patterns** (only if L1 known). L2-ARCTIC catalogues typical Hindi/Korean/Mandarin/Spanish/Arabic substitutions; the judge can be more lenient on /θ/-/s/ and /v/-/w/ confusions for known L1s and weight intelligibility above native-likeness, matching IELTS Pronunciation Band 7 ("uses a wide range of pronunciation features with mixed control").
15. **Response-length sanity**. SpeechRater excludes ultra-short responses from scoring. Under 30 words in Part 1, under 80 words in Part 2, or single-clause Part 3 answers should automatically cap Fluency & Coherence at Band 4–5.

## Sources

- <https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf> — British Council public Speaking Band Descriptors PDF.
- <https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf> — IELTS.org canonical Speaking descriptors.
- <https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf> — Cambridge English mirror.
- <https://idc.edu/IELTS-Speaking-Writing-Band-descriptors.pdf> — IDC mirror of Speaking + Writing descriptors.
- <https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors> — IDP explainer.
- <https://ielts.idp.com/prepare/article-how-to-effectively-use-ai> — IDP on AI in IELTS prep.
- <https://help.gelielts.com/hc/en-us/articles/34550917975828-Is-the-AI-feedback-accurate-and-reliable> — GEL IELTS AI reliability note.
- <https://speaking.lingo-copilot.com/blog/can-ai-give-accurate-ielts-speaking-scores> — critical review of AI scoring validity.
- <https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12198> — ETS SpeechRater v5.0 paper (Chen 2018).
- <https://www.ets.org/speechrater.html> — ETS SpeechRater service page.
- <https://www.researchgate.net/publication/228620191_SpeechRater_A_Construct-Driven_Approach_to_Scoring_Spontaneous_Non-Native_Speech> — original SpeechRater construct-driven paper.
- <https://ai.myspeakingscore.com/how-the-speechrater-scoring-engine-scores-toefl-speaking-responses/> — SpeechRater feature breakdown.
- <https://ai.myspeakingscore.com/speaking-speed-as-a-proxy-for-fluency-how-speechrater-measures-speaking-rate/> — SpeechRater speaking-rate proxy.
- <https://www.toeflresources.com/blog/toefl-enhanced-speaking-scoring/> — TOEFL SpeechRater scoring overview.
- <https://files.eric.ed.gov/fulltext/EJ1109295.pdf> — Automated scoring of TEFT speaking tasks.
- <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment> — Azure Pronunciation Assessment how-to.
- <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/pronunciation-assessment-tool> — Azure portal demo doc.
- <https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment> — Azure transparency note.
- <https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/pronunciationassessmentresult> — JS SDK output schema.
- <https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/speech-service-ignite-update-%E2%80%93-new-enhancement-features-for-pronunciation-assess/3978093> — Azure Ignite update with prosody + unscripted scoring.
- <https://www.speechace.com/api-plans/> — Speechace plans and rubric coverage.
- <https://www.speechace.com/the-speechace-speaking-test/> — Speechace product description.
- <https://www.speechace.com/hello-fluency-api/> — Speechace fluency API blog post.
- <https://api-docs.speechace.com/features/scripted-activities/fluency-scoring> — Speechace fluency scoring docs.
- <https://api-docs.speechace.com/api-reference/score-text-fluency/handling-fluency-response> — Speechace fluency response schema.
- <https://api-docs.speechace.com/guides-on-common-topics/interpreting-overall-scores> — Speechace overall score guide.
- <https://github.com/speechace/speechace-api-samples> — Speechace SDK samples.
- <https://github.com/speechsuper/SpeechSuper-API-Samples> — SpeechSuper API samples.
- <https://www.edtechdigest.com/2024/10/31/elsa-speak/> — ELSA Speak profile.
- <https://blog.elsaspeak.com/en/elsa-speak-the-future-of-ai-powered-english-learning/> — ELSA founder blog.
- <https://assets.ctfassets.net/yqwtwibiobs4/018RxttvPWsMkkGIQJ5Gg3/6f410437ceb2c6f2762fbcdfa8a28e8c/2021_PTEA_White_Paper_Institutions_Automated_Scoring_White_Paper-May-2018.pdf> — Pearson PTE Automated Scoring white paper.
- <https://www.pearson.com/languages/community/blogs/2020/05/how-do-computers-test-english.html> — Pearson plain-English overview.
- <https://goarno.io/blog/how-ai-calculates-pte-scores/> — PTE AI scoring explainer.
- <https://www.pearsonpte.com/ctf-assets/yqwtwibiobs4/4YEY3FefBoAMjxZ94QkBP4/bc9c70ebbfc7b249ad6d21195e8ed0fc/PTE_Core_Score_Guide_Jan_24_V1.pdf> — PTE Core score guide.
- <https://arxiv.org/abs/2104.01378> — speechocean762 paper.
- <https://www.openslr.org/101/> — speechocean762 OpenSLR mirror.
- <https://github.com/jimbozhang/speechocean762> — speechocean762 baseline repo.
- <https://huggingface.co/datasets/mispeech/speechocean762> — HF mirror of speechocean762.
- <https://github.com/kaldi-asr/kaldi/tree/master/egs/gop_speechocean762> — Kaldi GOP recipe on speechocean762.
- <https://github.com/YuanGongND/gopt> — GOPT transformer scorer.
- <https://arxiv.org/pdf/2205.03432> — GOPT ICASSP 2022 paper.
- <https://github.com/JazminVidal/gop-pykaldi> — PyKaldi GOP.
- <https://github.com/JazminVidal/gop-dnn-epadb> — DNN GOP on EpaDB.
- <https://github.com/JazminVidal/gop-ft> — Transfer-learning GOP.
- <https://github.com/sweekarsud/Goodness-of-Pronunciation> — Standalone GOP project.
- <https://arxiv.org/html/2507.16838v1> — Segmentation-free GOP (2025).
- <https://arxiv.org/pdf/2203.15937> — Wav2vec2 momentum MDD.
- <https://arxiv.org/abs/2311.07037v1> — Phonological-level wav2vec2 MDD.
- <https://arxiv.org/pdf/2108.13816> — Max-F1 end-to-end MDD.
- <https://arxiv.org/pdf/2104.08428> — Text-dependent E2E MDD with augmentation.
- <https://arxiv.org/pdf/2103.03023> — End-to-end mispronunciation detection.
- <https://arxiv.org/pdf/2108.11627> — Robust MDD for L2.
- <https://arxiv.org/pdf/2210.13168> — Proficiency assessment with wav2vec 2.0 (SLT 2022).
- <https://arxiv.org/pdf/2211.08849> — L2 proficiency via self-supervised speech.
- <https://arxiv.org/pdf/2505.21148> — L2 oral proficiency via Speech LLMs (2025).
- <https://arxiv.org/html/2505.02615v1> — Automatic Proficiency Assessment in L2 English Learners (2025).
- <https://arxiv.org/pdf/2506.16285> — Multifaceted relevance + grammar for speaking assessment (2025).
- <https://arxiv.org/html/2311.05203> — Whisper for stuttered-speech disfluency classification.
- <https://arxiv.org/html/2409.10177v2> — ASR augmented with disfluency detection.
- <https://arxiv.org/pdf/2406.05784> — Whisper encoder for multi-stuttered speech classification.
- <https://arxiv.org/abs/2510.04219> — Probing Whisper for dysarthric speech assessment.
- <https://arxiv.org/pdf/2311.05550> — End-to-end spoken Grammatical Error Correction.
- <https://www.isca-archive.org/interspeech_2018/zhao18b_interspeech.html> — L2-ARCTIC Interspeech 2018 paper.
- <https://psi.engr.tamu.edu/wp-content/uploads/2018/08/zhao2018interspeech.pdf> — L2-ARCTIC PDF.
- <https://psi.engr.tamu.edu/l2-arctic-corpus/> — L2-ARCTIC corpus page.
- <https://psi.engr.tamu.edu/l2-arctic-corpus-docs/> — L2-ARCTIC docs.
- <https://files.eric.ed.gov/fulltext/EJ1109982.pdf> — TOEFL11 corpus paper.
- <https://github.com/dustland/talk> — Open IELTS Speaking practice + scoring.
- <https://github.com/hubeiqiao/IELTS-Speaking-Simulator/blob/main/README_EN.md> — IELTS Speaking Simulator with scoring.
- <https://github.com/ZainabZaman/IELTS_PracticeAndEvaluation> — 4-skills IELTS practice & evaluation.
- <https://github.com/topics/ielts?l=python> — GitHub topic index: IELTS.
- <https://github.com/topics/pronunciation-scoring> — GitHub topic index: pronunciation scoring.
- <https://medium.com/@rudderanalytics/a-deep-dive-into-phoneme-level-pronunciation-assessment-b45649db5bb9> — Practical phoneme-level scoring write-up.
- <https://ratermetrics.com/> — RATER (third-party SpeechRater-style metrics).
- <https://m.liulishuo.com/ielts.html> — LiuLiShuo IELTS (CN).
- <https://zhuanlan.zhihu.com/p/1984706515685380414> — Zhihu 2026 IELTS speaking AI roundup.
- <https://zhuanlan.zhihu.com/p/81938378292> — Zhihu IELTS speaking AI testing post.
- <https://www.sohu.com/a/978257652_122241873> — Sohu top-7 IELTS speaking AI mock tools.
- <https://www.sohu.com/a/982287840_121274206> — Sohu IELTS speaking app review.
- <https://www.xhby.net/content/s68a28d29e4b073aed0a2c56b.html> — Xinhua-affiliated review of IELTS AI scorers.
- <https://zhuanlan.zhihu.com/p/1977083659740811478> — Zhihu Keli Speak deep dive.
- <https://www.explinks.com/blog/yt-ai-speaking-20days-ielts-55to70/> — LiuLiShuo 20-day cram diary.
- <https://apps.apple.com/cn/app/%E6%B5%81%E5%88%A9%E8%AF%B4-%E9%9B%85%E6%80%9D-%E9%9B%85%E6%80%9D%E5%8F%A3%E8%AF%AD%E5%86%99%E4%BD%9C%E6%8F%90%E5%88%86%E7%A5%9E%E5%99%A8/id1153192044> — LiuLiShuo·IELTS App Store CN.
- <https://ieltskorea.org/korea/results/scores/speaking> — IDP Korea Speaking scoring page.
- <https://apps.apple.com/kr/app/speakometer-ai-%EC%98%81%EC%96%B4-%EB%B0%9C%EC%9D%8C-%EC%8A%A4%ED%94%BC%ED%82%B9-%EC%97%B0%EC%8A%B5/id1529508890> — Speakometer KR.
- <https://blog.testglider.com/%EC%95%84%EC%9D%B4%EC%97%98%EC%B8%A0-%EC%A0%90%EC%88%98-%EC%B1%84%EC%A0%90-%EB%B0%A9%EB%B2%95-%EA%B8%B0%EC%A4%80-%EC%B4%9D%EC%A0%95%EB%A6%AC/> — TestGlider Korean IELTS scoring explainer.
- <https://inear.io/> — INEAR Korean AI speaking evaluator.
- <https://inear.ai/educe> — INEAR English interview solution.
- <https://clipo.ai/> — Clipo AI Korean scoring tool.
- <https://play.google.com/store/apps/details?id=co.aienglish&hl=en_US> — Plang AI English (KR).
- <https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479> — Korea AI Hub Korean-L1 English dataset.
- <https://edmicro.edu.vn/ielts/app-luyen-speaking-ielts/> — Vietnamese IELTS speaking app roundup.
- <https://www.onluyen.vn/ielts/app-luyen-speaking-ielts/> — onluyen.vn IELTS speaking apps review.
- <https://www.dolenglish.vn/blog/app-hoc-ielts-mien-phi> — DOL English IELTS apps roundup.
- <https://tuhoc.dolenglish.vn/> — DOL Tự Học self-study platform.
- <https://ktdcgroup.vn/en/ielts-speaking-ai/> — KTDC AI IELTS speaking.
- <https://ai.ktdcgroup.vn/> — KTDC AI platform.
- <https://langmaster.edu.vn/app-luyen-ielts-speaking> — Langmaster app review (VN).
- <https://www.dolenglish.vn/blog/app-hoc-tu-vung-ielts-mien-phi-tren-dien-thoai> — DOL vocab apps.
- <https://ielts.idp.com/vietnam/prepare/article-ielts-speaking-ai-vs-face-to-face/en-gb> — IDP VN AI vs face-to-face.
- <https://smalltalk2.me/ielts> — SmallTalk2Me IELTS mock test.
- <https://speechful.ai/> — Speechful AI IELTS grader.
- <https://engvarta.com/ielts/> — FixoLang / EngVarta.
- <https://www.ieltsai.app/> — IELTS AI Coach.
- <https://ieltsaiprep.com/> — IELTS AI Prep / ClearScore.
- <https://ieltschamp.com> — IELTS Champ.
- <https://www.cathoven.com/> — Cathoven IELTS AI.
- <https://apps.apple.com/us/app/ieltspeaking/id734412264> — IELTSpeaking iOS app.
- <https://www.ielts-prep.ai/> — IELTS-Prep AI.
- <https://t-j.ru/exam-ielts-v-kazakhstane/> — Tinkoff Journal Kazakhstan IELTS diary (RU).
- <https://kazakhstan.britishcouncil.org/ru/exam/ielts/prepare/computer-delivered-ielts-familiarisation-test> — British Council KZ familiarisation test (RU).
- <https://ielts.kz/podgotovka/probnyj-ielts/> — IELTS KZ mock test page.
- <https://www.mockspace.uz/en> — MockSpace (UZ) IELTS+CEFR+DTM mocks.
- <https://www.ai4chat.co/gpt/ieltsspeakingSimulator> — AI4Chat IELTS speaking simulator.
- <https://ai-ielts.app/> — AI IELTS practice app.
- <https://upscore.ai/accuracy-and-quality> — UpScore.ai accuracy whitepaper.
- <https://deepielts.com/> — Deep IELTS writing/speaking checker.
- <https://arxiv.org/pdf/2512.24460> — IELTS writing revision platform with AES + adaptive feedback.
- <https://ai.azure.com/explore/aiservices/speech/pronunciationassessment> — Azure AI Studio Pronunciation Assessment playground.
- <https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-learning-with-pronunciation-assessment> — Azure language-learning use-case doc.
