# Open-source IELTS speaking evaluators, scoring code, related research

_Merged from codex + claude crawls on 2026-05-19T08:00Z._

## Summary

This topic gathers everything that can inform an automated IELTS Speaking judge: the official IELTS scoring constructs and key assessment indicators; commercial scoring engines (ETS SpeechRater, Pearson Versant/PTE Ordinate, Speechace, SpeechSuper, Azure Pronunciation Assessment, ELSA Speak); open research stacks (Kaldi GOP recipe, GOPT transformer scorers, wav2vec2/HuBERT/WavLM proficiency models, Whisper-based disfluency detectors); benchmark corpora (Speechocean762, L2-ARCTIC, EpaDB, TOEFL11, AI-Hub Korean-L1 English); and country-specific prep material that paraphrases the same four analytic criteria for local markets.

IELTS itself defines Speaking as an 11-14 minute recorded interaction assessed by certificated examiners on Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation — equally weighted (https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking; https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf). Automated tools should support evidence gathering for those four constructs rather than replace them. The commercial systems converge on a feature taxonomy that maps cleanly onto IELTS: **accuracy/completeness** (lexical-phonetic), **fluency** (rate + pause structure), **prosody** (stress, intonation, rhythm), and **content** (vocabulary, grammar, topic relevance). For a transcript-only LLM judge, the most portable signals are speaking-rate (wpm from diarized timings), pause-ratio and pause typology, disfluency counts (filled-pauses, edit disfluencies, repetitions), and lexical-syntactic features (type-token ratio, clause boundaries, error density) — all of which SpeechRater, Speechace, and Versant already use operationally.

## Authoritative material

### IELTS official documents

- IELTS.org states that Speaking is a face-to-face interview, is recorded, has three parts, and is scored across four equally weighted criteria: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, and Pronunciation (https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking).
- Cambridge English gives the same structure and explains the constructs in scorer-facing language: fluency and coherence covers normal speed, limited hesitation, logical sequencing, and cohesive devices; lexical resource covers vocabulary range, accuracy, appropriacy, and paraphrase; grammatical range and accuracy covers variety and correctness; pronunciation covers understandability without excessive listener effort (https://www.cambridgeenglish.org/exams-and-tests/ielts/test-format/).
- British Council describes the target task demands by part: Part 1 asks everyday questions, Part 2 gives one minute preparation then a 1-2 minute long turn, and Part 3 moves to more abstract discussion; scores are reported in whole and half bands (https://takeielts.britishcouncil.org/take-ielts/test-format).
- The official IELTS Speaking Band Descriptors define Band 9 fluency as rare repetition/self-correction with content-related hesitation; Band 8 fluency as "speaks fluently with only occasional repetition or self-correction; hesitation is usually content-related, rarely language-related"; Band 6 fluency as "willing to speak at length, though may lose coherence at times due to occasional repetition, self-correction or hesitation"; Band 8 lexical resource includes wide flexible vocabulary, skilful less-common/idiomatic items, and effective paraphrase (https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf; mirror https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf; Cambridge mirror https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf).
- The official IELTS Speaking Key Assessment Criteria make the constructs operational: fluency indicators include speech rate and continuity; coherence indicators include logical sequencing, discourse markers, relevance to turn purpose, and cohesive devices; lexical indicators include variety, appropriacy, collocation, attitude, and paraphrase; grammar indicators include length of spoken sentences, subordination, verb-phrase complexity, modification, structure range, error density, and communicative effect; pronunciation indicators include chunking, rhythm, stress timing, linking, intonation, segmental production, and accent effect on intelligibility (https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf).
- British Council practice guidance tells learners to rehearse all three parts consecutively, speak clearly and accurately, say as much as possible without rushing, remain spontaneous rather than preparing answers in advance, and record themselves for review (https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/speaking).
- IDP explainer of the public descriptors, useful for cross-checking criterion paraphrases: https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors; IDC mirror of Speaking + Writing descriptors: https://idc.edu/IELTS-Speaking-Writing-Band-descriptors.pdf.

### IELTS research reports

- Isaacs, Trofimovich, Yu, and Munoz Chereau used IELTS Part 2 long-turn samples from 80 test takers and eight accredited IELTS examiners to study which segmental, prosodic, fluency, and lexicogrammatical features discriminate upper pronunciation bands; the report warns that vague descriptors can be hard for raters and that concrete pronunciation features improve consistency (https://ielts.org/researchers/our-research/research-reports/examining-the-linguistic-aspects-of-speech-that-most-efficiently-discriminate-between-upper-levels-of-the-revised-ielts-pronunciation-scale).
- Seedhouse, Harris, Naeb, and Ustunel studied candidate discourse at bands 5-8 and report that pause length per 100 words significantly differentiated bands 5 and 8; this supports using pause burden and discourse organisation as evidence for Fluency and Coherence, not as isolated mechanical counts (https://ielts.org/researchers/our-research/research-reports/the-relationship-between-speaking-features-and-band-descriptors-a-mixed-methods-study).
- "Candidate discourse in the revised IELTS Speaking test" states that the public band scales can be mapped to analytic categories for fluency, grammar, lexical resource, and pronunciation, but no single measure drives a score; the overall impression comes from a range of performance features (https://ielts.org/researchers/our-research/research-reports/candidate-discourse-in-the-revised-ielts-speaking-test).
- IELTS.org's "Demystifying the IELTS Speaking test" reiterates the four criteria and describes pronunciation as comprehensible utterances plus pronunciation features used to communicate meaning; written by an IELTS educator who splits time between New Delhi and Jeddah (https://ielts.org/news-and-insights/demystifying-the-ielts-speaking-test).

### Industry technical reports

- **ETS SpeechRater v5.0 technical report (Chen et al., 2018)** documents ~100 features across delivery, language use, and content; emphasises linear/interpretable models and fairness across L1 groups (https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12198). Earlier "construct-driven" SpeechRater paper: https://www.researchgate.net/publication/228620191_SpeechRater_A_Construct-Driven_Approach_to_Scoring_Spontaneous_Non-Native_Speech. Service page: https://www.ets.org/speechrater.html.
- **Pearson PTE Academic Automated Scoring White Paper (2018/2021)** describes the Ordinate engine that scores pace, rhythm, intonation, pronunciation, and lexical/grammatical content of unconstrained responses (https://assets.ctfassets.net/yqwtwibiobs4/018RxttvPWsMkkGIQJ5Gg3/6f410437ceb2c6f2762fbcdfa8a28e8c/2021_PTEA_White_Paper_Institutions_Automated_Scoring_White_Paper-May-2018.pdf). Plain-English overview: https://www.pearson.com/languages/community/blogs/2020/05/how-do-computers-test-english.html. PTE Core score guide: https://www.pearsonpte.com/ctf-assets/yqwtwibiobs4/4YEY3FefBoAMjxZ94QkBP4/bc9c70ebbfc7b249ad6d21195e8ed0fc/PTE_Core_Score_Guide_Jan_24_V1.pdf.
- **Speechace API documentation** defines fluency as "words correct per minute, good/bad pauses, articulation rate, hesitations, repetitions, variation in tone" and emits IELTS/CEFR/PTE/TOEIC band estimates (https://api-docs.speechace.com/features/scripted-activities/fluency-scoring; https://api-docs.speechace.com/api-reference/score-text-fluency/handling-fluency-response; https://api-docs.speechace.com/guides-on-common-topics/interpreting-overall-scores; https://www.speechace.com/the-speechace-speaking-test/).
- **Azure Pronunciation Assessment** (Microsoft Learn): scripted mode returns Accuracy + Fluency + Completeness + Prosody → PronScore; unscripted mode adds Vocabulary, Grammar, Topic content scores. JSON includes per-word `ErrorType` (None, Mispronunciation, Omission, Insertion, UnexpectedBreak, MissingBreak, Monotone) and per-syllable/per-phoneme accuracy (https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment). Transparency note: https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment. Ignite prosody+unscripted update: https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/speech-service-ignite-update-%E2%80%93-new-enhancement-features-for-pronunciation-assess/3978093.

### Benchmark corpora (authoritative)

- **speechocean762 (arXiv:2104.01378)** — open non-native English corpus, 5,000 utterances from 250 Mandarin-L1 speakers, five expert annotators per utterance, scores at phoneme (0-2), word accuracy (0-10), stress (5/10), and sentence accuracy/fluency/prosody/completeness; free for commercial and non-commercial use (https://arxiv.org/abs/2104.01378; https://www.openslr.org/101/; https://huggingface.co/datasets/mispeech/speechocean762).
- **L2-ARCTIC (Interspeech 2018)** — 27.1 h of read non-native English from 24 speakers across Hindi, Korean, Mandarin, Spanish, Arabic, Vietnamese; 150 utterances per speaker annotated for substitution/deletion/insertion phoneme errors (https://www.isca-archive.org/interspeech_2018/zhao18b_interspeech.html; PDF https://psi.engr.tamu.edu/wp-content/uploads/2018/08/zhao2018interspeech.pdf; corpus page https://psi.engr.tamu.edu/l2-arctic-corpus/).
- **GOPT (ICASSP 2022, Gong et al.)** — first transformer model evaluating multi-aspect (accuracy/fluency/prosody) × multi-granularity (phoneme/word/sentence) jointly. SOTA on speechocean762 at publication: 0.612 phone-PCC, 0.549 word-PCC, 0.742 sentence-PCC (https://arxiv.org/pdf/2205.03432; code https://github.com/YuanGongND/gopt).
- **TOEFL11 (Blanchard et al., 2013)** — 12,100 essays across 11 L1s × 3 proficiency bands, widely used for native-language identification and AES research (https://files.eric.ed.gov/fulltext/EJ1109982.pdf).

## Country-specific prep material

### China / Mandarin-language prep

- **New Channel Wuhan** explains the four criteria in Chinese, treating Fluency and Coherence as natural flow with fewer repetitions/self-corrections, logical connectors, and sufficient Part 2 length; Lexical Resource as accurate and varied word choice, collocations, idioms, synonym substitution; Grammar as simple plus complex sentences with tense/person/number/preposition control; Pronunciation as word sounds, stress, linking, weak forms, intonation — clear intelligibility matters more than a perfect native accent (https://wh.xhd.cn/info/cjzx/1058456.html).
- **New Channel Ningbo** states that Speaking uses four independent equal-weight criteria, is recorded for review, and evaluates language expression rather than whether the candidate's opinions are correct; higher pronunciation bands are clear speech where accent does not block comprehension (https://nb.xhd.cn/ncyc/1058976.html).
- **China IELTS** publishes a Chinese translation of the public Speaking Band Descriptors and notes that the English version is authoritative while the Chinese version is for reference (https://backoffice.ielts.chinaielts.org/api/assets/ielts-cms/0c5929f5-faad-45ca-83f5-ce5c8384ec95/%E8%AF%84%E5%88%86%E6%A0%87%E5%87%86-speakingfinal.pdf?version=1).
- **流利说·雅思 (LiuLiShuo IELTS)** is the flagship Chinese AI IELTS speaking app; markets itself as evaluating "词汇 / 发音 / 语法 / 流利度" (vocabulary, pronunciation, grammar, fluency), the same four pillars as IELTS Speaking (https://m.liulishuo.com/ielts.html; App Store CN https://apps.apple.com/cn/app/%E6%B5%81%E5%88%A9%E8%AF%B4-%E9%9B%85%E6%80%9D-%E9%9B%85%E6%80%9D%E5%8F%A3%E8%AF%AD%E5%86%99%E4%BD%9C%E6%8F%90%E5%88%86%E7%A5%9E%E5%99%A8/id1153192044).
- **Zhihu** roundups list "8 best AI mock-speaking tools" (可栗口语 Keli Speak, 羊驼雅思, 咕噜口语 SpeakGuru, 星空外语 SkyLingo); SkyLingo claims 96–98% agreement with human examiners and emphasises "智能追问" (intelligent follow-up questions) to mimic Part-3 pressure (https://zhuanlan.zhihu.com/p/1984706515685380414; https://zhuanlan.zhihu.com/p/1977083659740811478; https://zhuanlan.zhihu.com/p/81938378292). Sohu and Xinhua-affiliated reviews: https://www.sohu.com/a/978257652_122241873; https://www.sohu.com/a/982287840_121274206; https://www.xhby.net/content/s68a28d29e4b073aed0a2c56b.html.
- **Explinks** publishes a "20-day 5.5→7.0" cram-school breakdown of LiuLiShuo's IELTS module (https://www.explinks.com/blog/yt-ai-speaking-20days-ielts-55to70/).

### South Korea / Korean learner and research context

- **SNU Spoken Language Processing Lab `ssl_ft_pron`** model card provides Wav2Vec2, HuBERT, and WavLM models fine-tuned for automatic pronunciation assessment and explicitly warns that Speechocean762 read-speech training does not guarantee generalisation to other languages or spontaneous speaking styles (https://huggingface.co/haeylee/ssl_ft_pron).
- **AI Hub Korea** publishes a Korean-L1 English speech dataset for downstream pronunciation scoring research (https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479).
- **Speakometer** (App Store KR) advertises IELTS/TOEFL/TOEIC prep through pronunciation grading on a 0–100 scale (https://apps.apple.com/kr/app/speakometer-ai-%EC%98%81%EC%96%B4-%EB%B0%9C%EC%9D%8C-%EC%8A%A4%ED%94%BC%ED%82%B9-%EC%97%B0%EC%8A%B5/id1529508890).
- **INEAR** is a Korean-built "AI 영어말하기평가 솔루션" that explicitly mirrors the four IELTS bands (발음·유창성 + 문법·어휘) (https://inear.io/; https://inear.ai/educe).
- **TestGlider** is a popular Korean-language explainer of IELTS rubrics including the speaking criteria (https://blog.testglider.com/%EC%95%84%EC%9D%B4%EC%97%98%EC%B8%A0-%EC%A0%90%EC%88%98-%EC%B1%84%EC%A0%90-%EB%B0%A9%EB%B2%95-%EA%B8%B0%EC%A4%80-%EC%B4%9D%EC%A0%95%EB%A6%AC/).
- **IDP Korea Speaking scoring page**: https://ieltskorea.org/korea/results/scores/speaking. Other Korean AI tools: **Clipo AI** (https://clipo.ai/), **Plang AI English** (https://play.google.com/store/apps/details?id=co.aienglish&hl=en_US).
- **LangHelper** (open-source) lists Korean among SpeechSuper-supported speech-assessment languages and includes an IELTS prompt pattern combining a model-led speaking simulation with external pronunciation scores (https://github.com/NsLearning/LangHelper).

### Iran / Persian-language prep

- **Andishe Parsian** summarises IELTS Speaking scoring in Persian as four main criteria: fluency and coherence, vocabulary range, grammatical accuracy and variety, and pronunciation; warns that strong vocabulary or grammar alone is insufficient because the live examiner scores all four (https://www.andisheparsian.com/article/171/index.html).
- **Hafez Edu** states each Speaking criterion contributes 25% to the final score; gives an example where scores of 7, 7, 6, and 8 average to Band 7; highlights discourse markers as a way to connect and organise ideas (https://www.hafezedu.com/ielts-speaking-tricks/).
- **IELTS2's Persian guide** explains that candidates improve by focusing on all four criteria rather than treating Speaking as only vocabulary memorisation; Band 9 commentary links high performance to complex grammar, varied vocabulary, and fluent delivery together (https://ielts2.com/understanding-the-ielts-speaking-band-descriptors/).

### Vietnam / Vietnamese-language prep

- **DOL English** (the dominant Vietnamese IELTS academy) ships a Speaking practice app (https://www.dolenglish.vn/blog/app-hoc-ielts-mien-phi; https://tuhoc.dolenglish.vn/; vocab apps https://www.dolenglish.vn/blog/app-hoc-tu-vung-ielts-mien-phi-tren-dien-thoai).
- **KTDC** offers an AI IELTS coach platform (https://ai.ktdcgroup.vn/; https://ktdcgroup.vn/en/ielts-speaking-ai/).
- **Reviews aggregators** rate ELSA Speak top for pronunciation specifically because the company's founder is Vietnamese and the model is heavily trained on VN-accented speech (https://www.onluyen.vn/ielts/app-luyen-speaking-ielts/; https://langmaster.edu.vn/app-luyen-ielts-speaking; https://edmicro.edu.vn/ielts/app-luyen-speaking-ielts/).
- **IDP Vietnam blog** discusses the AI-examiner-vs-human-examiner debate (https://ielts.idp.com/vietnam/prepare/article-ielts-speaking-ai-vs-face-to-face/en-gb).
- **Patado (Reddit)** summarises the four IELTS Speaking criteria as fluency, pronunciation, vocabulary, and grammar; recommends repeated imitation of dialogue intonation and pronunciation (https://www.reddit.com/r/u_patadovietnam123/comments/oali9d).
- **LangGo (Reddit)** says pronunciation is one of the four scoring criteria, recommends clear word-level pronunciation, and warns that excessive self-correction can reduce Fluency (https://www.reddit.com/r/u_LanggoIELTS/comments/yhyoea).

### India and South Asia / English-language regional prep

- **AECC India** explains the four criteria for India-facing candidates: Fluency and Coherence asks whether the candidate can speak at length without unnatural pauses; Pronunciation asks whether speech is easy to understand; vocabulary and grammar are separate equal dimensions (https://www.aeccglobal.in/exams/ielts/speaking).
- **PTEIELTS** (India/Nepal-oriented prep site) paraphrases Fluency and Coherence as speaking without long pauses; Lexical Resource as vocabulary range fitted to context; Grammar as complex and compound sentence control; Pronunciation as intelligible production of English sounds (https://www.pteielts.com/ielts-speaking-assessment-criteria/).
- The IELTS.org "Demystifying" article (above) explicitly serves Indian/Saudi classroom practice — its author is based in New Delhi and Jeddah.
- **Consumer AI apps targeting Indian/Pakistani test-takers**: SmallTalk2Me (https://smalltalk2.me/ielts), Speechful (https://speechful.ai/), FixoLang/EngVarta (https://engvarta.com/ielts/), IELTS AI Coach (https://www.ieltsai.app/), IELTS AI Prep/ClearScore (https://ieltsaiprep.com/), Cathoven — claims 98% agreement with examiners (https://www.cathoven.com/), IELTS Champ (https://ieltschamp.com), IELTSpeaking iOS (https://apps.apple.com/us/app/ieltspeaking/id734412264), IELTS-Prep AI (https://www.ielts-prep.ai/). Common pitch: "instant 1–9 band score across all four criteria with examiner-aligned feedback".

### Indonesia / Indonesian EFL assessment context

- The crawls did not surface a strong Bahasa Indonesia IELTS-prep page with stable scoring detail, but an Indonesian university thesis page shows a local speaking rubric using the same observable categories that IELTS judges also need: fluency/kelancaran, pronunciation/pelafalan, vocabulary/kosakata, grammar/tata bahasa; adjacent evidence only (https://digilib.uinkhas.ac.id/46912/1/Rofiqul%20Imdad-T20186151.pdf).

### Russian / Kazakh / Central Asia

- **IELTS Score 7's Russian guide** maps the four IELTS Speaking criteria into Russian: Fluency and Coherence (beglost i svyaznost), Lexical Resource (slovarnyy zapas and paraphrase), Grammatical Range and Accuracy, and Pronunciation; presents Band 5 as maintaining flow with repetition/self-correction and Band 6 as speaking at length but sometimes losing coherence (https://ieltsscore7.com/ru/guides/ielts-speaking-scoring-criteria/).
- **IELTS-up** (Russian-origin English-language prep site) recommends linking ideas, extending answers, using appropriate vocabulary, pausing correctly, and using stress/intonation (https://www.ielts-up.com/speaking/ielts-speaking-marking.html).
- **Tinkoff Journal (T-J)** firsthand prep diary ranks several AI platforms used for Kazakhstan IELTS prep (https://t-j.ru/exam-ielts-v-kazakhstane/).
- **British Council Kazakhstan** official familiarisation test: https://kazakhstan.britishcouncil.org/ru/exam/ielts/prepare/computer-delivered-ielts-familiarisation-test. KZ mock test page: https://ielts.kz/podgotovka/probnyj-ielts/.
- **MockSpace (Uzbekistan)** markets pronunciation/fluency/grammar AI scoring against IELTS/CEFR rubrics in Central Asia (https://www.mockspace.uz/en).
- **Kazakh National University** Russian-language rubrics show local academic scoring attention to lexis, grammar, logical delivery, and pronunciation errors affecting comprehension; not IELTS-specific (https://pps.kaznu.kz/kz/Main/FileShow/2702241/88/446/22108/).

### UK / Australia / Canada — native-perspective and official-prep material

- **British Council** presents Speaking as an interactive certified-examiner test; candidates should communicate opinions, speak at length, organise ideas coherently, justify opinions, discuss abstract issues, and speak naturally rather than rush (https://takeielts.britishcouncil.org/take-ielts/test-format).
- **IDP Canada** explains the Speaking band descriptors for Canadian candidates and links IELTS prep to grammatical correctness across simple and complex structures (https://ielts.idp.com/canada/prepare/article-understanding-the-ielts-speaking-band-descriptors/).
- **AECC Global** (Australia-based) tells candidates that knowing the 11-14 minute format and the four judgement areas lets them target practice (https://www.aeccglobal.com/exams/ielts/speaking).
- **Critical takes on AI scoring validity** (UK/Australia perspective): most consumer AI tools report 0.70–0.85 correlation with real IELTS — below the 0.90+ inter-rater reliability humans achieve; descriptors like "without noticeable effort" and "frequently error-free" are subjective and AI cannot reliably interpret them (https://speaking.lingo-copilot.com/blog/can-ai-give-accurate-ielts-speaking-scores). IDP's own balanced article on AI vs face-to-face: https://ielts.idp.com/prepare/article-how-to-effectively-use-ai. GEL IELTS' transparency note: https://help.gelielts.com/hc/en-us/articles/34550917975828-Is-the-AI-feedback-accurate-and-reliable.

## Open-source tools and code

### Pronunciation scoring (acoustic, GOP family)

- **Kaldi GOP recipe (`egs/gop_speechocean762`)** — canonical open-source Goodness-of-Pronunciation baseline. Uses nnet3 TDNN acoustic model, computes phoneme posterior ratios, reports correlations on speechocean762; explains GOP-GMM and GOP-NN; uses `compute-gop` for phone-level features (https://github.com/kaldi-asr/kaldi/tree/master/egs/gop_speechocean762; README https://github.com/kaldi-asr/kaldi/blob/master/egs/gop_speechocean762/README.md).
- **speechocean762 baseline** (`jimbozhang/speechocean762`) — author-provided baseline; corpus license allows free commercial and non-commercial use (https://github.com/jimbozhang/speechocean762).
- **GOPT** (`YuanGongND/gopt`) — transformer that ingests Kaldi GOP features and predicts accuracy/completeness/fluency/prosody/total at phoneme/word/sentence granularity; PyTorch, BSD-style license; reports 0.612 phone, 0.549 word, 0.742 sentence Pearson correlation on Speechocean762 (https://github.com/YuanGongND/gopt).
- **GOP variants on PyKaldi / DNN / fine-tuned approaches** — Jazmín Vidal's stack: `gop-pykaldi` (https://github.com/JazminVidal/gop-pykaldi), `gop-dnn-epadb` (https://github.com/JazminVidal/gop-dnn-epadb), `gop-ft` transfer learning (https://github.com/JazminVidal/gop-ft).
- **tzyll/goparrot** computes GOP for oral reading assessment using Kaldi; provides posterior, likelihood, and likelihood-ratio GOP variants; adaptable by replacing language and acoustic model (https://github.com/tzyll/goparrot).
- **sweekarsud/Goodness-of-Pronunciation** implements Interspeech 2019 "Improved Goodness of Pronunciation (GoP) Measure for DNN-HMM" with HMM transition probabilities; computes phoneme-level scores from forced alignment + frame-level posteriors via Kaldi (https://github.com/sweekarsud/Goodness-of-Pronunciation).
- **Segmentation-free GOP (arXiv:2507.16838, 2025)** — alignment-free wav2vec2-based scorer; removes the forced-alignment dependency that historically hurt L2 heavy-accent speakers (https://arxiv.org/html/2507.16838v1).

### Mispronunciation detection (MDD)

- **Wav2vec2-based MDD** — momentum pseudo-labels (arXiv:2203.15937) and phonological-level MDD (arXiv:2311.07037) use self-supervised speech models to improve L2 phoneme recognition; outputs correlate with human perception of accentedness and intelligibility (https://arxiv.org/abs/2203.15937; https://arxiv.org/abs/2311.07037v1).
- **End-to-end MDD with max-F1 training** (arXiv:2108.13816): https://arxiv.org/pdf/2108.13816. Text-dependent MDD with data augmentation (arXiv:2104.08428): https://arxiv.org/pdf/2104.08428. Additional E2E MDD: https://arxiv.org/pdf/2103.03023; robust MDD for L2: https://arxiv.org/pdf/2108.11627.

### Holistic / proficiency scoring (speech-side)

- **Proficiency assessment of L2 spoken English using wav2vec 2.0** (SLT 2022, arXiv:2210.13168) — fine-tunes wav2vec2-XLSR-53 for holistic CEFR band and per-aspect scoring (relevance, formal correctness, lexical richness, pronunciation, fluency, communicative effectiveness); significantly beats BERT-on-transcript baselines; warns that ASR may not faithfully represent learner utterances in spontaneous non-native speech (https://arxiv.org/pdf/2210.13168).
- **L2 proficiency assessment using self-supervised speech representations** (arXiv:2211.08849) — different layer probing strategy (https://arxiv.org/pdf/2211.08849).
- **Assessment of L2 Oral Proficiency using Speech LLMs** (arXiv:2505.21148, 2025) — Qwen-Audio-style speech-aware LLMs for end-to-end scoring; useful prior art for any LLM-judge pipeline (https://arxiv.org/pdf/2505.21148).
- **Automatic Proficiency Assessment in L2 English Learners** (arXiv:2505.02615, 2025) — BERT-on-transcript vs wav2vec2 ablations confirming transcript-only models lose prosody/fluency signal (https://arxiv.org/html/2505.02615v1).
- **Advancing Automated Speaking Assessment with multifaceted relevance + grammar** (arXiv:2506.16285, 2025) — transcript-side features the LLM judge can directly mimic (https://arxiv.org/pdf/2506.16285).
- **Hugging Face `haeylee/ssl_ft_pron`** — fine-tuned Wav2Vec2, HuBERT, and WavLM self-supervised speech models for automatic pronunciation assessment; English; evaluated on Speechocean762; explicitly warns generalisation beyond training domain is not guaranteed (https://huggingface.co/haeylee/ssl_ft_pron).

### Disfluency / Whisper-based

- **Whisper in Focus: stuttered-speech classification** (arXiv:2311.05203) — encoder-layer probing for disfluency types (block, prolongation, repetition) (https://arxiv.org/html/2311.05203).
- **Augmenting ASR with disfluency detection** (arXiv:2409.10177) — end-to-end disfluency token tagging; template for transcript-level tagging (https://arxiv.org/html/2409.10177v2).
- **Whisper encoder for multi-stuttered speech**: https://arxiv.org/pdf/2406.05784. Probing Whisper for dysarthric speech assessment: https://arxiv.org/abs/2510.04219.
- **Towards End-to-End Spoken Grammatical Error Correction** (arXiv:2311.05550) — Whisper jointly for transcription + GEC; directly relevant to Grammatical Range & Accuracy (https://arxiv.org/pdf/2311.05550).

### IELTS-labeled and IELTS-adjacent code

- **`dustland/talk`** — AI IELTS Speaking practice covering Parts 1–3, voice-record + transcription + AI scoring against IELTS criteria (https://github.com/dustland/talk).
- **`hubeiqiao/IELTS-Speaking-Simulator`** — simulates Parts 1–3 with automatic scoring and answer-optimisation prompts (https://github.com/hubeiqiao/IELTS-Speaking-Simulator/blob/main/README_EN.md).
- **`ZainabZaman/IELTS_PracticeAndEvaluation`** — pipeline that ingests user audio + bot prompt and returns band scores across all four skills (https://github.com/ZainabZaman/IELTS_PracticeAndEvaluation).
- **`NsLearning/LangHelper`** — MIT-licensed language-learning app supporting speech conversation, ASR, TTS, and Speaking Assessment by integrating SpeechSuper and iFlytek; README has an IELTS prompt pattern where a language model asks IELTS questions one by one, receives spoken text plus pronunciation scores from external assessment tech, and combines them into a reference IELTS speaking score (https://github.com/NsLearning/LangHelper).
- **`LegendZDY/AI-IELTS-Speaking`** — MIT-licensed Python Streamlit app for IELTS Speaking practice; question/answer collection, preprocessing, model generation; more practice/generation scaffold than validated scorer (https://github.com/LegendZDY/AI-IELTS-Speaking).
- **GitHub topic indices**: https://github.com/topics/ielts; https://github.com/topics/ielts?l=python; https://github.com/topics/pronunciation-scoring; https://github.com/topics/speech-assessment.

### Commercial APIs (closed source, public docs)

- **SpeechAce** — `/score-text-fluency` returns speaking rate (correct words per minute), articulation rate, pause counts/durations, hesitation count, repetition count, plus IELTS/CEFR/PTE/TOEIC band estimates; open-ended endpoint supports IELTS-style output with optional Grammar/Vocab/Coherence feedback and `ielts_score` fields including fluency (https://api-docs.speechace.com/; https://api-docs.speechace.com/features/introduction; https://api-docs.speechace.com/api-reference/score-speech-open-ended; SDK samples https://github.com/speechace/speechace-api-samples; plans https://www.speechace.com/api-plans/; fluency API blog https://www.speechace.com/hello-fluency-api/).
- **SpeechSuper API Samples** (MIT-licensed) — scripted API returns phoneme, syllable, word, sentence assessment plus fluency, completeness, rhythm/speed, stress, liaison, plosion, tone, phoneme-level mispronunciation; unscripted English API returns overall, pronunciation, fluency, grammar, vocabulary, transcription, pause markers, filler frequency, speaking rate, speech length, vocab usage, grammar corrections, and word-level pronunciation; sample has `coreType = "speak.eval.pro"`, `test_type = "ielts"`, plus `question_prompt` and `penalize_offtopic` (https://github.com/speechsuper/SpeechSuper-API-Samples).
- **Azure Pronunciation Assessment** — REST/SDK; JS SDK class ref https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/pronunciationassessmentresult; Studio playground https://ai.azure.com/explore/aiservices/speech/pronunciationassessment; language-learning use-case doc https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-learning-with-pronunciation-assessment.
- **ELSA Speak** — proprietary DNN trained on 200M+ hours of accented speech; reports phoneme-level errors plus intonation/rhythm/stress; claims 95%+ accuracy (https://www.edtechdigest.com/2024/10/31/elsa-speak/; founder blog https://blog.elsaspeak.com/en/elsa-speak-the-future-of-ai-powered-english-learning/).
- **Pearson PTE / Versant** — Ordinate engine weights pace, rhythm, intonation, pronunciation accuracy, lexical/grammatical complexity, content relevance (scoring explainer https://goarno.io/blog/how-ai-calculates-pte-scores/).
- **ETS SpeechRater** — feature catalogue published in ETS Research Reports; covers `ipcount` (edit disfluencies), `clausecount`, `IPC` (disfluencies/clause), `IPW` (disfluencies/word), `longSilRatio` (proportion of long within-clause silences), type counts per POS class, prosody and pronunciation features (https://ai.myspeakingscore.com/how-the-speechrater-scoring-engine-scores-toefl-speaking-responses/; https://ai.myspeakingscore.com/speaking-speed-as-a-proxy-for-fluency-how-speechrater-measures-speaking-rate/; TOEFL overview https://www.toeflresources.com/blog/toefl-enhanced-speaking-scoring/).

### LLM-judge / evaluation infrastructure

- **Prometheus** (MIT-licensed) — open-source evaluator LM designed for fine-grained evaluation with custom score rubrics; rubric-first prompt format relevant to a transparent IELTS Speaking judge that outputs criterion-specific feedback before a score (https://github.com/prometheus-eval/prometheus).
- **UpTrain** (Apache-2.0) — open-source platform for evaluating and improving generative AI applications; useful as a QA/eval harness around an IELTS judge rather than as an IELTS scorer itself (https://github.com/uptrain-ai/uptrain).

### Benchmark datasets

| Dataset | Speakers / Size | What's annotated | Use |
| --- | --- | --- | --- |
| **speechocean762** | 250 Mandarin-L1, 5k utt | Phoneme (0–2), word accuracy (0–10) + stress (5/10), sentence accuracy/fluency/prosody/completeness | Pronunciation scoring benchmark (https://www.openslr.org/101/) |
| **L2-ARCTIC** | 24 speakers, 6 L1s, 27.1 h | Phoneme sub/del/ins on 150 utt/speaker | Mispronunciation detection (https://psi.engr.tamu.edu/l2-arctic-corpus/) |
| **EpaDB** | Spanish-L1 English | Phone-level pronunciation | GOP transfer-learning (gop-dnn-epadb) |
| **TOEFL11** | 12,100 essays, 11 L1s | Native-language ID, proficiency band | Lexico-grammatical proficiency modeling (https://files.eric.ed.gov/fulltext/EJ1109982.pdf) |
| **ETS Spoken (TPO)** | Internal | TOEFL Speaking responses | Used to train SpeechRater (not redistributed) |
| **AI-Hub Korean-L1 English speech** | Korean L1 | Pronunciation + transcripts | Korea-specific accent research (https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479) |

## Practical signals for an LLM judge

Ranked by how directly each signal transfers to a transcript-only judge.

1. **Anchor the final score to the four official IELTS criteria; do not let any single metric dominate.** IELTS research says multiple performance features contribute to the overall rating, and no single measure drives a score (https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf; https://ielts.org/researchers/our-research/research-reports/candidate-discourse-in-the-revised-ielts-speaking-test).
2. **Speaking rate (words/min)** — Speechace's fluency core; SpeechRater's strongest delivery feature. Compute `n_words / (turn_end - turn_start)`. Speechace's "fluent" threshold is ≥120 wpm; Band 7+ speakers cluster 130–170 wpm; under 90 wpm is a strong negative signal (https://www.speechace.com/api-plans/; https://api-docs.speechace.com/features/scripted-activities/fluency-scoring). _Note_: these thresholds are commercial vendor claims, not official IELTS bands — use as evidence, not as automatic bands.
3. **Articulation rate vs speaking rate.** Articulation rate = words / (total time − pause time). Speakers can hit decent wpm while pausing heavily (low articulation rate → laboured/pre-rehearsed). If transcript shows long silence segments between short bursts, flag Band 5–6 hesitation pattern.
4. **Pause ratio and pause typology.** SpeechRater uses `longSilRatio`; count silences >0.5 s. Within-clause pauses penalise more than between-clause pauses. IELTS Band 8 says "hesitation is content-related, rarely language-related" — approximate this by checking whether long pauses precede content words (nouns/verbs) vs function words. IELTS research found pause length per 100 words significantly differentiated bands 5 and 8 (https://ielts.org/researchers/our-research/research-reports/the-relationship-between-speaking-features-and-band-descriptors-a-mixed-methods-study).
5. **Filled-pause and hesitation tokens.** Count `uh`, `um`, `er`, `erm`, `you know`, `like` per 100 words. SpeechRater measures "umm/eer" disfluencies. >5 filled pauses per 100 words is a Band 5/6 marker; ≤2 is Band 7+.
6. **Repetition / self-correction (edit disfluency) count.** SpeechRater's `ipcount`. Excessive self-correction without forward progress caps fluency at Band 6. But penalise only when it reflects language-search rather than content-planning rephrase (https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf).
7. **Type-token ratio + advanced-vocabulary ratio.** Compute TTR over a moving 100-token window and the % of words outside the GSL/AWL top-2000 list to proxy Lexical Resource. Idiomatic/collocational use ("by and large", "off the top of my head") and topic-specific terminology lift Band 7→8. **Score paraphrase and precision, not just rare words** — official criteria include variety, appropriacy, collocation, attitude, and ability to get around a vocabulary gap (https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf).
8. **Clause depth + subordination ratio.** Count subordinating conjunctions (`because`, `although`, `whereas`, `if`, `when`) per clause; mix of finite + non-finite clauses; presence of relative clauses. Lifts Grammatical Range from 6 to 7+.
9. **Grammatical error density and communicative effect.** Whisper-based end-to-end GEC papers show errors/100-words as the workhorse Grammatical Accuracy proxy; >8 errors/100 words → Band 5; ≤2 with control of complex structures → Band 8. Distinguish error count from communicative damage: Band 6 allows frequent complex-structure errors that rarely impede communication (https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf).
10. **Cohesive-marker variety.** Range of connectives (`however`, `as a result`, `on top of that`, `having said that`) signals Coherence; over-reliance on `and / so / but` caps at Band 6. SpeechRater tracks discourse-marker counts. But cohesive devices count only when they make ideas easier to follow — Band 6 allows a range "not always appropriately" used.
11. **Content / topic relevance.** Azure's unscripted ContentScore = (Vocabulary + Grammar + Topic) / 3. The LLM judge has a structural advantage: it can directly verify whether the response addresses the cue card prompt, names the four bullet-points in Part 2, and develops Part-3 abstract questions. Flag off-topic separately from language form: SpeechSuper's IELTS unscripted sample includes `question_prompt` and `penalize_offtopic`.
12. **Long-turn sustain (Part 2).** Official task expects a 1-2 minute long turn after one minute prep. Compute words in the longest mono-speaker turn; <60 words in Part 2 suggests sub-Band 6 fluency and limits evidence for sustained fluency, topic development, lexical range, and grammar (https://takeielts.britishcouncil.org/take-ielts/test-format).
13. **Penalise memorised chunks when they fail to fit turn, topic, or interaction.** British Council practice guidance explicitly says the test is spontaneous and candidates should not prepare answers in advance; official lexical/fluency descriptors reward flexible and situationally appropriate language (https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/speaking).
14. **Do not infer phoneme-level Pronunciation from a clean transcript alone.** Official pronunciation indicators include chunking, rhythm, stress timing, linking, intonation, word stress, vowel/consonant production, and listener effort. Transcript-only scoring should mark pronunciation evidence as limited unless the transcript contains `[unintelligible]`/`[inaudible]` tags, or reliable audio-tool features (Azure `AccuracyScore`/`FluencyScore`/`ProsodyScore`, Speechace pronunciation features) are available as evidence streams — not as official IELTS criterion scores.
15. **Do not punish accent by itself.** Official descriptors define the issue as accent's effect on intelligibility; Band 9 says accent has no effect on intelligibility rather than requiring a specific native accent. L2-ARCTIC catalogues typical Hindi/Korean/Mandarin/Spanish/Arabic substitutions — if L1 is known, weight intelligibility above native-likeness.
16. **Response-length sanity.** SpeechRater excludes ultra-short responses from scoring. Under 30 words in Part 1, under 80 words in Part 2, or single-clause Part 3 answers should automatically cap Fluency & Coherence at Band 4–5.
17. **In diarized transcripts, judge only candidate speech.** Examiner prompts affect task opportunity but the assessed performance is the candidate's throughout (https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking).
18. **Calibrate audio/pronunciation models on in-domain IELTS-style spontaneous interviews before trusting them.** Speechocean762 read-speech training does not guarantee generalisation to spontaneous interview style or to other L1 groups, ages, or accents (https://huggingface.co/haeylee/ssl_ft_pron; https://github.com/kaldi-asr/kaldi/blob/master/egs/gop_speechocean762/README.md).

## Related research and methods

- **SpeechRater's three-stage automated scoring architecture** filters problematic spoken responses, extracts features, and estimates a human-like proficiency rating from fluency, pronunciation, vocabulary diversity, and grammar features; relevant because IELTS Speaking also combines multiple dimensions rather than transcript content alone (https://www.sciencedirect.com/science/article/abs/pii/S0885230810000458).
- **A 2026 Language Testing meta-analysis** of 67 automated speech evaluation studies reports a positive overall human-machine correlation of r = .654, with higher pooled correlations for delivery and overall proficiency than for grammar/vocabulary — supports using automated scores as evidence with residual uncertainty, especially for grammar and vocabulary (https://journals.sagepub.com/doi/10.1177/02655322251387816).
- **The automatic pronunciation assessment review** in ACL Findings surveys phonemic and prosodic methods for pronunciation assessment; useful background for separating segmental pronunciation, prosody, and overall intelligibility features (https://aclanthology.org/2023.findings-emnlp.557.pdf).
- **Automated scoring of TEFT speaking tasks**: https://files.eric.ed.gov/fulltext/EJ1109295.pdf.
- **Practical phoneme-level scoring write-up**: https://medium.com/@rudderanalytics/a-deep-dive-into-phoneme-level-pronunciation-assessment-b45649db5bb9.
- **RATER (third-party SpeechRater-style metrics)**: https://ratermetrics.com/.

## Sources

### IELTS official + research

- https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking — Official IELTS Speaking format, parts, timing, four criteria.
- https://www.cambridgeenglish.org/exams-and-tests/ielts/test-format/ — Cambridge English IELTS test format and criterion explanations.
- https://takeielts.britishcouncil.org/take-ielts/test-format — British Council IELTS format and Speaking task demands.
- https://ielts.org/cdn/ielts-guides/ielts-speaking-band-descriptors.pdf — Official public Speaking Band Descriptors.
- https://takeielts.britishcouncil.org/sites/default/files/ielts_speaking_band_descriptors.pdf — British Council mirror of the descriptors.
- https://assets.cambridgeenglish.org/webinars/ielts-speaking-band-descriptors.pdf — Cambridge mirror of the descriptors.
- https://idc.edu/IELTS-Speaking-Writing-Band-descriptors.pdf — IDC mirror of Speaking + Writing descriptors.
- https://ielts.org/cdn/ielts-guides/ielts-speaking-key-assessment-criteria.pdf — Official key indicators for Fluency, Coherence, Lexis, Grammar, Pronunciation.
- https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-english-practice-tests/speaking — British Council Speaking practice and review guidance.
- https://ielts.org/researchers/our-research/research-reports/examining-the-linguistic-aspects-of-speech-that-most-efficiently-discriminate-between-upper-levels-of-the-revised-ielts-pronunciation-scale — Isaacs et al. pronunciation-scale report.
- https://ielts.org/researchers/our-research/research-reports/the-relationship-between-speaking-features-and-band-descriptors-a-mixed-methods-study — Seedhouse et al. discourse-feature report.
- https://ielts.org/researchers/our-research/research-reports/candidate-discourse-in-the-revised-ielts-speaking-test — IELTS revised Speaking discourse research.
- https://ielts.org/news-and-insights/demystifying-the-ielts-speaking-test — IELTS.org Speaking criteria + classroom practice.
- https://ielts.idp.com/prepare/article-understanding-the-ielts-speaking-band-descriptors — IDP explainer of public descriptors.
- https://ielts.idp.com/prepare/article-how-to-effectively-use-ai — IDP on AI in IELTS prep.
- https://ielts.idp.com/canada/prepare/article-understanding-the-ielts-speaking-band-descriptors/ — IDP Canada descriptors explainer.
- https://help.gelielts.com/hc/en-us/articles/34550917975828-Is-the-AI-feedback-accurate-and-reliable — GEL IELTS AI reliability note.
- https://speaking.lingo-copilot.com/blog/can-ai-give-accurate-ielts-speaking-scores — Critical review of AI scoring validity.

### Country-specific (China)

- https://wh.xhd.cn/info/cjzx/1058456.html — New Channel Wuhan IELTS Speaking scoring guide (CN).
- https://nb.xhd.cn/ncyc/1058976.html — New Channel Ningbo IELTS Speaking scoring guide (CN).
- https://backoffice.ielts.chinaielts.org/api/assets/ielts-cms/0c5929f5-faad-45ca-83f5-ce5c8384ec95/%E8%AF%84%E5%88%86%E6%A0%87%E5%87%86-speakingfinal.pdf?version=1 — China IELTS Chinese translation of descriptors.
- https://m.liulishuo.com/ielts.html — LiuLiShuo IELTS (CN).
- https://apps.apple.com/cn/app/%E6%B5%81%E5%88%A9%E8%AF%B4-%E9%9B%85%E6%80%9D-%E9%9B%85%E6%80%9D%E5%8F%A3%E8%AF%AD%E5%86%99%E4%BD%9C%E6%8F%90%E5%88%86%E7%A5%9E%E5%99%A8/id1153192044 — LiuLiShuo·IELTS App Store CN.
- https://zhuanlan.zhihu.com/p/1984706515685380414 — Zhihu 2026 IELTS speaking AI roundup.
- https://zhuanlan.zhihu.com/p/81938378292 — Zhihu IELTS speaking AI testing post.
- https://zhuanlan.zhihu.com/p/1977083659740811478 — Zhihu Keli Speak deep dive.
- https://www.sohu.com/a/978257652_122241873 — Sohu top-7 IELTS speaking AI mock tools.
- https://www.sohu.com/a/982287840_121274206 — Sohu IELTS speaking app review.
- https://www.xhby.net/content/s68a28d29e4b073aed0a2c56b.html — Xinhua-affiliated review of IELTS AI scorers.
- https://www.explinks.com/blog/yt-ai-speaking-20days-ielts-55to70/ — LiuLiShuo 20-day cram diary.

### Country-specific (Korea)

- https://huggingface.co/haeylee/ssl_ft_pron — SNU SSL fine-tuned pronunciation models.
- https://www.aihub.or.kr/aihubdata/data/view.do?currMenu=11&topMenu=&aihubDataSe=data&dataSetSn=71479 — Korea AI Hub Korean-L1 English dataset.
- https://apps.apple.com/kr/app/speakometer-ai-%EC%98%81%EC%96%B4-%EB%B0%9C%EC%9D%8C-%EC%8A%A4%ED%94%BC%ED%82%B9-%EC%97%B0%EC%8A%B5/id1529508890 — Speakometer KR.
- https://inear.io/ — INEAR Korean AI speaking evaluator.
- https://inear.ai/educe — INEAR English interview solution.
- https://clipo.ai/ — Clipo AI Korean scoring tool.
- https://play.google.com/store/apps/details?id=co.aienglish&hl=en_US — Plang AI English (KR).
- https://blog.testglider.com/%EC%95%84%EC%9D%B4%EC%97%98%EC%B8%A0-%EC%A0%90%EC%88%98-%EC%B1%84%EC%A0%90-%EB%B0%A9%EB%B2%95-%EA%B8%B0%EC%A4%80-%EC%B4%9D%EC%A0%95%EB%A6%AC/ — TestGlider Korean IELTS scoring explainer.
- https://ieltskorea.org/korea/results/scores/speaking — IDP Korea Speaking scoring page.

### Country-specific (Iran)

- https://www.andisheparsian.com/article/171/index.html — Persian IELTS Speaking scoring-criteria article.
- https://www.hafezedu.com/ielts-speaking-tricks/ — Persian IELTS Speaking Band 7+ prep advice.
- https://ielts2.com/understanding-the-ielts-speaking-band-descriptors/ — Persian analysis of Speaking Band Descriptors.

### Country-specific (Vietnam)

- https://www.dolenglish.vn/blog/app-hoc-ielts-mien-phi — DOL English IELTS apps roundup.
- https://tuhoc.dolenglish.vn/ — DOL Tự Học self-study platform.
- https://www.dolenglish.vn/blog/app-hoc-tu-vung-ielts-mien-phi-tren-dien-thoai — DOL vocab apps.
- https://ktdcgroup.vn/en/ielts-speaking-ai/ — KTDC AI IELTS speaking.
- https://ai.ktdcgroup.vn/ — KTDC AI platform.
- https://www.onluyen.vn/ielts/app-luyen-speaking-ielts/ — onluyen.vn IELTS speaking apps review.
- https://langmaster.edu.vn/app-luyen-ielts-speaking — Langmaster app review (VN).
- https://edmicro.edu.vn/ielts/app-luyen-speaking-ielts/ — Vietnamese IELTS speaking app roundup.
- https://ielts.idp.com/vietnam/prepare/article-ielts-speaking-ai-vs-face-to-face/en-gb — IDP VN AI vs face-to-face.
- https://www.reddit.com/r/u_patadovietnam123/comments/oali9d — Vietnamese Patado community post.
- https://www.reddit.com/r/u_LanggoIELTS/comments/yhyoea — Vietnamese LangGo community post.

### Country-specific (South Asia)

- https://www.aeccglobal.in/exams/ielts/speaking — AECC India IELTS Speaking.
- https://www.pteielts.com/ielts-speaking-assessment-criteria/ — South Asian prep-site paraphrase.
- https://smalltalk2.me/ielts — SmallTalk2Me IELTS mock.
- https://speechful.ai/ — Speechful AI IELTS grader.
- https://engvarta.com/ielts/ — FixoLang/EngVarta.
- https://www.ieltsai.app/ — IELTS AI Coach.
- https://ieltsaiprep.com/ — IELTS AI Prep/ClearScore.
- https://ieltschamp.com — IELTS Champ.
- https://www.cathoven.com/ — Cathoven IELTS AI.
- https://apps.apple.com/us/app/ieltspeaking/id734412264 — IELTSpeaking iOS.
- https://www.ielts-prep.ai/ — IELTS-Prep AI.

### Country-specific (Indonesia, Russia/CIS, Australia)

- https://digilib.uinkhas.ac.id/46912/1/Rofiqul%20Imdad-T20186151.pdf — Indonesian EFL speaking rubric context.
- https://ieltsscore7.com/ru/guides/ielts-speaking-scoring-criteria/ — Russian IELTS Speaking scoring guide.
- https://www.ielts-up.com/speaking/ielts-speaking-marking.html — IELTS-up Speaking marking advice.
- https://t-j.ru/exam-ielts-v-kazakhstane/ — Tinkoff Journal Kazakhstan IELTS diary (RU).
- https://kazakhstan.britishcouncil.org/ru/exam/ielts/prepare/computer-delivered-ielts-familiarisation-test — British Council KZ familiarisation test.
- https://ielts.kz/podgotovka/probnyj-ielts/ — IELTS KZ mock test.
- https://www.mockspace.uz/en — MockSpace (UZ) IELTS+CEFR+DTM.
- https://pps.kaznu.kz/kz/Main/FileShow/2702241/88/446/22108/ — Kazakh National University speaking-assessment rubric.
- https://www.aeccglobal.com/exams/ielts/speaking — AECC Global/Australia IELTS Speaking.

### Commercial scoring engines + APIs

- https://onlinelibrary.wiley.com/doi/full/10.1002/ets2.12198 — ETS SpeechRater v5.0 paper (Chen 2018).
- https://www.ets.org/speechrater.html — ETS SpeechRater service page.
- https://www.researchgate.net/publication/228620191_SpeechRater_A_Construct-Driven_Approach_to_Scoring_Spontaneous_Non-Native_Speech — Construct-driven SpeechRater paper.
- https://ai.myspeakingscore.com/how-the-speechrater-scoring-engine-scores-toefl-speaking-responses/ — SpeechRater feature breakdown.
- https://ai.myspeakingscore.com/speaking-speed-as-a-proxy-for-fluency-how-speechrater-measures-speaking-rate/ — SpeechRater speaking-rate proxy.
- https://www.toeflresources.com/blog/toefl-enhanced-speaking-scoring/ — TOEFL SpeechRater scoring overview.
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment — Azure Pronunciation Assessment how-to.
- https://learn.microsoft.com/en-us/azure/cognitive-services/Speech-Service/pronunciation-assessment-tool — Azure UI / content scores.
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/pronunciation-assessment-tool — Azure portal demo doc.
- https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/speech-service/pronunciation-assessment/transparency-note-pronunciation-assessment — Azure transparency note.
- https://learn.microsoft.com/en-us/javascript/api/microsoft-cognitiveservices-speech-sdk/pronunciationassessmentresult — Azure JS SDK schema.
- https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/speech-service-ignite-update-%E2%80%93-new-enhancement-features-for-pronunciation-assess/3978093 — Azure Ignite prosody/unscripted update.
- https://ai.azure.com/explore/aiservices/speech/pronunciationassessment — Azure AI Studio playground.
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-learning-with-pronunciation-assessment — Azure language-learning use-case.
- https://api-docs.speechace.com/ — Speechace API overview.
- https://api-docs.speechace.com/features/introduction — Speechace feature introduction.
- https://api-docs.speechace.com/features/scripted-activities/fluency-scoring — Speechace fluency scoring docs.
- https://api-docs.speechace.com/api-reference/score-text-fluency/handling-fluency-response — Speechace fluency response schema.
- https://api-docs.speechace.com/api-reference/score-speech-open-ended — Speechace open-ended scoring endpoint.
- https://api-docs.speechace.com/guides-on-common-topics/interpreting-overall-scores — Speechace overall score guide.
- https://www.speechace.com/api-plans/ — Speechace plans and rubric coverage.
- https://www.speechace.com/the-speechace-speaking-test/ — Speechace product description.
- https://www.speechace.com/hello-fluency-api/ — Speechace fluency API blog.
- https://github.com/speechace/speechace-api-samples — Speechace SDK samples.
- https://github.com/speechsuper/SpeechSuper-API-Samples — SpeechSuper API samples (MIT).
- https://github.com/topics/speech-assessment — GitHub speech-assessment topic.
- https://www.edtechdigest.com/2024/10/31/elsa-speak/ — ELSA Speak profile.
- https://blog.elsaspeak.com/en/elsa-speak-the-future-of-ai-powered-english-learning/ — ELSA founder blog.
- https://assets.ctfassets.net/yqwtwibiobs4/018RxttvPWsMkkGIQJ5Gg3/6f410437ceb2c6f2762fbcdfa8a28e8c/2021_PTEA_White_Paper_Institutions_Automated_Scoring_White_Paper-May-2018.pdf — Pearson PTE Automated Scoring white paper.
- https://www.pearson.com/languages/community/blogs/2020/05/how-do-computers-test-english.html — Pearson plain-English overview.
- https://goarno.io/blog/how-ai-calculates-pte-scores/ — PTE AI scoring explainer.
- https://www.pearsonpte.com/ctf-assets/yqwtwibiobs4/4YEY3FefBoAMjxZ94QkBP4/bc9c70ebbfc7b249ad6d21195e8ed0fc/PTE_Core_Score_Guide_Jan_24_V1.pdf — PTE Core score guide.

### Open-source code

- https://github.com/kaldi-asr/kaldi/tree/master/egs/gop_speechocean762 — Kaldi GOP recipe on Speechocean762.
- https://github.com/kaldi-asr/kaldi/blob/master/egs/gop_speechocean762/README.md — Kaldi GOP README.
- https://github.com/jimbozhang/speechocean762 — Speechocean762 baseline repo.
- https://github.com/YuanGongND/gopt — GOPT transformer scorer.
- https://github.com/JazminVidal/gop-pykaldi — PyKaldi GOP.
- https://github.com/JazminVidal/gop-dnn-epadb — DNN GOP on EpaDB.
- https://github.com/JazminVidal/gop-ft — Transfer-learning GOP.
- https://github.com/tzyll/goparrot — GoParrot Kaldi GOP scoring tool.
- https://github.com/sweekarsud/Goodness-of-Pronunciation — Improved GOP for DNN-HMM.
- https://github.com/dustland/talk — AI IELTS Speaking practice + scoring.
- https://github.com/hubeiqiao/IELTS-Speaking-Simulator/blob/main/README_EN.md — IELTS Speaking Simulator.
- https://github.com/ZainabZaman/IELTS_PracticeAndEvaluation — 4-skills IELTS practice + evaluation.
- https://github.com/NsLearning/LangHelper — LangHelper speech assessment + IELTS prompt.
- https://github.com/LegendZDY/AI-IELTS-Speaking — MIT-licensed AI IELTS Speaking Streamlit app.
- https://github.com/topics/ielts — GitHub IELTS topic.
- https://github.com/topics/ielts?l=python — GitHub IELTS topic (Python).
- https://github.com/topics/pronunciation-scoring — GitHub pronunciation-scoring topic.
- https://github.com/prometheus-eval/prometheus — MIT evaluator LM for rubrics.
- https://github.com/uptrain-ai/uptrain — Apache-2.0 GenAI evaluation.

### Datasets

- https://arxiv.org/abs/2104.01378 — Speechocean762 paper.
- https://www.openslr.org/101/ — Speechocean762 OpenSLR mirror.
- https://huggingface.co/datasets/mispeech/speechocean762 — HF Speechocean762 mirror.
- https://www.isca-archive.org/interspeech_2018/zhao18b_interspeech.html — L2-ARCTIC Interspeech paper.
- https://psi.engr.tamu.edu/wp-content/uploads/2018/08/zhao2018interspeech.pdf — L2-ARCTIC PDF.
- https://psi.engr.tamu.edu/l2-arctic-corpus/ — L2-ARCTIC corpus page.
- https://psi.engr.tamu.edu/l2-arctic-corpus-docs/ — L2-ARCTIC docs.
- https://files.eric.ed.gov/fulltext/EJ1109982.pdf — TOEFL11 corpus paper.

### Research papers

- https://arxiv.org/pdf/2205.03432 — GOPT ICASSP 2022 paper.
- https://arxiv.org/html/2507.16838v1 — Segmentation-free GOP (2025).
- https://arxiv.org/abs/2203.15937 — Wav2vec2 momentum MDD.
- https://arxiv.org/abs/2311.07037v1 — Phonological-level wav2vec2 MDD.
- https://arxiv.org/pdf/2108.13816 — Max-F1 end-to-end MDD.
- https://arxiv.org/pdf/2104.08428 — Text-dependent E2E MDD.
- https://arxiv.org/pdf/2103.03023 — End-to-end MDD.
- https://arxiv.org/pdf/2108.11627 — Robust MDD for L2.
- https://arxiv.org/abs/2210.13168 / https://arxiv.org/pdf/2210.13168 — Proficiency assessment with wav2vec 2.0 (SLT 2022).
- https://arxiv.org/pdf/2211.08849 — L2 proficiency via SSL speech.
- https://arxiv.org/pdf/2505.21148 — L2 oral proficiency via Speech LLMs (2025).
- https://arxiv.org/html/2505.02615v1 — Automatic Proficiency Assessment in L2 English (2025).
- https://arxiv.org/pdf/2506.16285 — Multifaceted relevance + grammar (2025).
- https://arxiv.org/html/2311.05203 — Whisper for stuttered-speech disfluency.
- https://arxiv.org/html/2409.10177v2 — ASR augmented with disfluency detection.
- https://arxiv.org/pdf/2406.05784 — Whisper encoder for multi-stuttered speech.
- https://arxiv.org/abs/2510.04219 — Probing Whisper for dysarthric speech.
- https://arxiv.org/pdf/2311.05550 — End-to-end spoken Grammatical Error Correction.
- https://www.sciencedirect.com/science/article/abs/pii/S0885230810000458 — SpeechRater three-stage architecture paper.
- https://journals.sagepub.com/doi/10.1177/02655322251387816 — 2026 meta-analysis of automated speech evaluation.
- https://aclanthology.org/2023.findings-emnlp.557.pdf — Automatic Pronunciation Assessment review.
- https://files.eric.ed.gov/fulltext/EJ1109295.pdf — Automated scoring of TEFT speaking tasks.

### Other

- https://medium.com/@rudderanalytics/a-deep-dive-into-phoneme-level-pronunciation-assessment-b45649db5bb9 — Phoneme-level scoring write-up.
- https://ratermetrics.com/ — RATER (SpeechRater-style metrics).
- https://www.ai4chat.co/gpt/ieltsspeakingSimulator — AI4Chat IELTS speaking simulator.
- https://ai-ielts.app/ — AI IELTS practice app.
- https://upscore.ai/accuracy-and-quality — UpScore.ai accuracy whitepaper.
- https://deepielts.com/ — Deep IELTS writing/speaking checker.
- https://arxiv.org/pdf/2512.24460 — IELTS writing revision platform with AES + adaptive feedback.

## Crawl notes

- **Codex unique contributions**: deeper coverage of IELTS official research reports (Isaacs et al., Seedhouse et al., revised Speaking discourse), the official Key Assessment Criteria PDF, Persian-language prep (Andishe Parsian, Hafez Edu, IELTS2), Indonesian EFL rubric context, Kazakh National University rubric, AECC India + PTEIELTS South Asian prep, two open-source GOP variants (`tzyll/goparrot`, `sweekarsud/Goodness-of-Pronunciation`), LegendZDY's Streamlit app, Prometheus and UpTrain as LLM-judge infrastructure, the 2026 Language Testing meta-analysis, and the ACL Findings pronunciation review.
- **Claude unique contributions**: ETS SpeechRater technical reports + feature catalogue (`ipcount`, `longSilRatio`, `IPC`, `IPW`), Pearson PTE Ordinate white paper, ELSA Speak profile, the Speechocean762 + L2-ARCTIC + EpaDB + TOEFL11 + AI-Hub Korean datasets table, the GOPT ICASSP paper, segmentation-free GOP and multiple MDD/Whisper papers, the Korean app ecosystem (Speakometer, INEAR, Clipo, Plang, TestGlider), the Vietnamese DOL/KTDC/Langmaster ecosystem, Indian consumer AI apps (SmallTalk2Me, Speechful, EngVarta, Cathoven, ClearScore), Kazakh/Uzbek apps (MockSpace, Tinkoff diary), three open-source IELTS-labeled repos (`dustland/talk`, `hubeiqiao/IELTS-Speaking-Simulator`, `ZainabZaman/IELTS_PracticeAndEvaluation`), and the concrete numeric thresholds (≥120 wpm fluent; >5 filled pauses/100 words = Band 5/6; >8 grammatical errors/100 words = Band 5) in the practical signals section.
- **Sections only one crawl covered**: codex was the only crawl to dedicate an *Iran/Persian* section and an *Indonesia* section; claude was the only crawl to compile a *Datasets table* and to surface the *AI scoring validity critique* from native-examiner-side commentators. Both have been merged in.
- **Conflicts flagged**: No direct numeric disagreements (e.g. no idiom-density conflict like the example in the brief). The closest tension is *commercial-vendor thresholds vs official IELTS bands*: claude cites Speechace/SpeechRater thresholds (e.g. ≥120 wpm = "fluent", >5 filled pauses/100 words = Band 5/6), while codex repeatedly warns that no single measure determines an IELTS band. The merged Practical Signals section keeps both — the numeric thresholds are presented as commercial-vendor evidence, explicitly not as official IELTS bands.
