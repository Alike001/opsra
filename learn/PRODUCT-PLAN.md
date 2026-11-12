# TrySERV — Product Direction, Feature Plan and Release Gates
Updated: 12 Nov 2026 (Africa/Lagos). Planning checkpoint. No further feature development authorized by this document alone.
Working name: TrySERV (not trademark cleared). Independent OpenServ learning companion.

## Product promise
Understand OpenServ by doing. From first-time confusion to a real, valid SERV request, supported by contextual SERV Reasoning tutoring and links to authoritative sources.

## Why it should exist
OpenServ already has official docs, no-code builder, developer workshops, SDK, API playground and an MCP server. A docs chatbot or duplicate playground would be weak. TrySERV teaches with measurable outcomes: short guided concepts, actually graded challenges, an example API integration, error explanations, and on-device progress.

## Primary people
1. Beginner: wants to know what OpenServ offers without jargon.
2. Builder: wants to connect SERV to an actual application and understand practical errors.
3. Returning learner: wants to resume, explore features and ask focused questions.

## Minimal functional pages and experience
LANDING / — A beautiful, real landing page with a strong simple headline, 2 CTAs (Start learning / Jump to build), how it works, supported beginner/build paths, visible module preview, official-source and independent-project attribution. No false metrics or dead links.
EXPLORE — Interactive ecosystem map grounded in docs: Agents, Workflows, Connect/MCP, SDK and SERV Reasoning. Each item should explain what it does, give a realistic example and link to official docs. Can be part of landing/studio rather than a fifth navigation item.
LEARN /learn — Four short modules: ecosystem, SERV explanation, when to use reasoning, request builder. Immediate feedback with actual server-validated results. A useful error state and direct source links.
TRY /try — Checkable JSON/curl output and, only when safe server-side spending controls are configured, a genuine limited SERV call with response model, latency and status. A preview must always say NOT EXECUTED.
HELP /help — Practical troubleshooting for missing system prompt, bad endpoint, bad model, failed auth and other verified SERV situations. Use deterministic detection first and contextual SERV coaching for ambiguity. Do not manufacture support advice.

## Learning flow
Landing -> choose beginner or builder -> explore/lesson -> complete challenge -> see feedback and source -> earn XP -> resume/next -> construct request -> optionally run real SERV behind server controls.
Experienced learners may jump to code without finishing beginner material.

## Points and progress decision
Yes to simple XP and clear progress; NO to complex gamification.
- Four lessons, once-per-lesson 20 XP, max 80 XP initially.
- XP awarded only after deterministic server grading; duplicate submissions do not increase XP.
- Show completed modules, total XP, progress bar, resume CTA, final completion state.
- No user login for basic lessons; store progress/XP in browser localStorage and explicitly label as on-device, resettable, not cryptographically certified.
- No token rewards, leaderboard, certificates, accounts or fabricated user counts.
- Later server-backed progress only if real users and an explicit privacy model justify it.

## AI scope
SERV tutor explains mistakes and suggests next learning task with the current lesson's cited official source. Exact quiz grading, arithmetic, XP and completion happen in normal code. The tutor must NEVER certify progress. An actual tutor response should show real model/completion metadata and never substitute a prewritten AI answer silently.
Current tutor requires the operator to set secret server-side SERV_API_KEY + separately generated LEARN_ACCESS_TOKEN. Public visitors must not be asked for an API key. A safe limited guest demo can be designed only after rate/budget abuse tests.

## UX acceptance
Premium minimal, warm white / deep ink / restrained blue-teal accents, clean readable type, obvious actions. Short explanations, not walls of markdown. Mobile at 320/375/768 and desktop at 1024/1440. Keyboard focus and semantics; contrast checks; optimistic states only where true. No fake buttons.
Design all states: welcome, new user, resume, correct/incorrect, loading, AI unavailable, token needed, rate limit, error, completed. Have one memorable public URL, direct official citations and clear "independent community project" labeling.

## Delivery plan, in order (do not overengineer)
Phase A: Separate clean GitHub repository and brand, migrate learning app only, keep Opsra archived and intact, make a real landing page and navigation.
Exit gate: a stranger understands the product in 10 seconds and can start a lesson.

Phase B: Polish the four lessons and request builder, add source-backed ecosystem explore, on-device XP and resumable progress, check model and endpoint against current docs.
Exit gate: a novice completes all modules without account or API key, only once-per-lesson XP is earned, no dead UI.

Phase C: Turn on real SERV with operator-provided secure Render environment variables; verify actual completion IDs, latency, schema, failure conditions; contextual tutoring after wrong answers; limited genuine request lab.
Exit gate: a first-time user completes a genuinely live SERV-enhanced learning task and can see what SERV did.

Phase D: CI/security/keyboard/mobile tests, real beginner + developer usability checks, README with how-to-test, clean deployment and actual video; submit Open Track.
Exit gate: source public, real SERV use demonstrated, all claims truthful, keys private, demo reproducible.

## Scope we will NOT add before submission
Login, leaderboards, crypto points, NFTs/certificates, multi-tenant course platform, many dozens of lessons, document crawling, voice/multimodal tutor, shell access, complicated agent/MCP orchestration, billing, complex database.

## Repository and deployment strategy
Current early preview: https://servsteps-preview.onrender.com
Source is currently https://github.com/Alike001/opsra on feat/serv-learning-companion under learn/.
Existing unrelated incident product is on Opsra main. **Do not delete it.** Recommend a clean public repository Alike001/tryserv (needs owner to create it in GitHub UI; current connector has no repository-create action), then migrate only the learning files onto its main branch. Reconnect Render service once the new branch tests pass. The name may be refined after checking availability.
No laptop Docker needed; GitHub Actions + Render carry build/test/deploy.

## Mandatory truthfulness and judging gates
Official Open Track requires SERV Reasoning materially included, public repo, demo, write-up, X post and deadline 2026-11-15 23:59 UTC.
Claims of a real SERV call require actual hosted inference and completion metadata. Current copied request is just a preview. Revenue potential is an open hypothesis: onboarding as a service for SDK ecosystems and developer programs, not a proven business.
https://www.openserv.ai/hackathon-2
https://docs.openserv.ai/serv-reasoning/introduction

## Name checkpoint and deployment repair
- 12 Nov: Working name changed from ServSteps to TrySERV (shorter, learning by trying). The current preview URL may retain the old Render slug until clean repo migration.
- Deployment repair: commit c0e6145 restored the original application file tree after a previous docs-only commit unintentionally replaced the tree. Render subsequently built successfully, tests passed and reported live. Not caused by the user's environment variables.
