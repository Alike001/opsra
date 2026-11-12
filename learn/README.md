# ServSteps — learn OpenServ by doing

> **Working name; independent community project, not an official OpenServ site.**

## Why this exists

Official documentation explains OpenServ and its APIs. ServSteps is an **interactive practice layer**: four short, sourced lessons, deterministic feedback on real exercises, a copyable first SERV request, and an optional SERV-powered tutor that explains the current lesson.

Unlike a general AI chat interface, every lesson has a concrete outcome and links to the official source. Learners can finish the free path with no signup, API key or paid inference.

## How to test

1. Open the live ServSteps preview once published. Select **I'm new**.
2. Complete "Find your way around OpenServ" (Agents, Workflows, Connect), then "What is SERV?" and observe why a wrong choice is wrong.
3. Complete "When reasoning helps" with an ambiguous decision scenario. No SERV inference is used for exact grading.
4. Complete "Build your first request". Copy the JSON and curl command; nothing is executed on this screen.
5. Verify local progress updates; navigate lessons and reload.
6. **Optional live SERV tutor:** configure \`SERV_API_KEY\` and a separate \`LEARN_ACCESS_TOKEN\` as Render secrets. Enter only the instructor access code in the browser, then ask a lesson-related question. The real model, completion ID and source appear.
7. With no secrets configured, the tutor is visibly unavailable and all free lessons remain functional.

## Run independently (no Docker, no npm dependencies)

Node 22+:

\`\`\`bash
node --check learn/server.mjs
node --test learn/test/*.test.mjs
node learn/index.mjs
\`\`\`

Visit http://localhost:3000.

## Server endpoints

- \`GET /\`: learning interface
- \`GET /api/lessons\`: four source-linked lessons, correct answers excluded
- \`POST /api/check\`: deterministic assessment / validated API request preview
- \`GET /healthz\`: health and tutor-enabled status
- \`POST /api/mentor\`: access-gated live SERV Reasoning tutor, using source-specific grounding, strict response validation and per-process limits

Request previews do **not** make paid calls. No one is asked to paste an OpenServ API key into the webpage. Local learning progress stays in the browser and does not imply an account.

## Source trust and safety

- Verified teaching sources: https://docs.openserv.ai/serv-reasoning/introduction, https://docs.openserv.ai/serv-reasoning/day-one and https://docs.openserv.ai/serv-reasoning/api/chat-completions
- A tutor request includes explicit verified lesson context, not a live web crawl.
- An incorrect model response, failure, or timeout is shown as an error, not hidden behind a prerecorded response.
- Inference is disabled unless both server environment secrets are set.
- The service restricts tutor calls to 3 per client/10 minutes and 35 per process lifetime. This is temporary staging protection, not a production multi-tenant billing service.
- No claims of official OpenServ endorsement, teaching certification, or AI explanation accuracy.

## Current phase / not yet done

- [x] Free interactive lessons, client-side progress and request builder
- [x] API backend with deterministic checks
- [x] SERV tutor implementation with HTTP stub tests
- [ ] Cloud live SERV call with operator-provisioned secret
- [ ] Live usability session with a first-time learner
- [ ] Expanded curriculum, stronger learning analytics and public billing safeguards
- [ ] Final name and independent repository

## Competition

OpenServ Edition 02, proposed Open Track; deadline November 15, 2026, 23:59 UTC. Public repo, working demo, short write-up and X post required:
https://www.openserv.ai/hackathon-2

This learning branch is isolated from the existing Opsra deployment while the new direction is tested.
