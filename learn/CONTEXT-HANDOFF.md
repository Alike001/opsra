# TrySERV — Continuation / Cross-Chat Handoff
Updated: 12 Nov 2026, Africa/Lagos. This is a durable project record, not a claim that ChatGPT memory has been manually edited.

## Goal
Independent product teaching newcomers and developers how to understand and use OpenServ, by completing checkable hands-on exercises and optionally receiving contextual SERV Reasoning coaching. User rejected generic AI dashboards, generic MCP wrappers, overengineering and fake demos. Wants proper landing page, premium simple UI/UX, points/progress, a fully working guided journey, no laptop-intensive builds, and a plan BEFORE more coding. Agreed direction: learning by doing.

## Current remote assets
- Current repo: https://github.com/Alike001/opsra — old incident-monitoring project on main; DO NOT delete or overwrite main blindly.
- Active learning branch: feat/serv-learning-companion; learning app lives in learn/ subdirectory.
- Prototype: https://servsteps-preview.onrender.com
- Render service ID srv-dbqukc0u01pc73857vl0 in workspace tea-dbgctlnb9u1s73cu22bg (Frankfurt, free).
- Render dashboard: https://dashboard.render.com/web/srv-dbqukc0u01pc73857vl0
- Last checked application commit: 6e8ae24efce74492326e27a9d7ca1acfaa68ed1f; four lessons, 12 tests passing, Render live. Recheck HEAD and deploy before any new task.
- Official docs: https://docs.openserv.ai/serv-reasoning/introduction
- Hackathon rules: https://www.openserv.ai/hackathon-2; Open Track, SERV mandatory, deadline Nov 15, 2026 23:59 UTC.
- Primary product plan: learn/PRODUCT-PLAN.md.
- Prototype technical docs: learn/MVP-SPEC.md and learn/README.md.

## Prototype implemented now
Four short official-source lessons: (1) OpenServ ecosystem Agents/Workflows/Connect/SDK, (2) What is SERV Reasoning, (3) when reasoning helps vs plain code, (4) build valid Chat Completions request.
Server-side deterministic quiz grading, JSON/curl copy preview only, localStorage on-device progress, responsive prototype learning studio, gated SERV tutor endpoint with stub tests.
SERV tutor is NOT verified from hosted Render; no env secrets configured. No proper separate landing page and no XP points yet. Browser/mobile manual usability not yet independently verified. User wants better design and a true landing page.

## Plan agreement and repo
Recommend new, clean public repo Alike001/tryserv, rather than renaming Opsra or deleting its unrelated incident history. Current GitHub connector can write commits and branches but cannot CREATE repos. User must create new repository via https://github.com/new?name=servsteps&visibility=public, then assistant can migrate the active learning code and point Render to it.
Do not move before user confirms repo exists; avoid disrupting live old Opsra and preview.

## Critical credentials and steps
SERV_API_KEY: OpenServ Reasoning API credential generated from https://console.openserv.ai/ as instructed at https://docs.openserv.ai/serv-reasoning/introduction. User previously held an API key in a local terminal; this does NOT put it on Render. Distinguish from OpenServ agent SDK registration secrets.
LEARN_ACCESS_TOKEN: a private random access code the user invents; it is NOT provided by OpenServ. A 32-byte hex string can be generated with terminal command: openssl rand -hex 32 (negligible resource use). Alternatively a password manager can generate it.
Put both in https://dashboard.render.com/web/srv-dbqukc0u01pc73857vl0 -> Environment -> add environment variables -> save/redeploy. NEVER paste actual values into chat, a public GitHub file, frontend HTML, or screenshots. Enter only LEARN_ACCESS_TOKEN into prototype "Instructor access code" to authorize a paid tutor call. Free lessons need neither key.
Public judge-friendly tutor demo needs safety budget/rate limits, so don't expose key or hardcoded password.

## Product boundaries and next tasks
1. Finalize plan and repo (new TrySERV repo; working name subject to clearance). Preserve old code.
2. Build actual landing and ecosystem exploration page, consistent lesson studio, reliable mobile.
3. Add 20 XP once per completed lesson, max 80 XP, stored on-device only for MVP; resume, reset, completion.
4. Configure SERV securely and test a REAL hosted inference; collect genuine completion ID/model/status/latency, prompt-injection and malformed output tests. No fake success.
5. Add contextual wrong-answer tutoring and limited real Try SERV exercise.
6. Test full beginner and builder journeys, mobile, keyboard, README/demo/hackathon submission.

## Resume prompt for next ChatGPT conversation
"Continue the TrySERV OpenServ learning companion. Read the canonical handoff at https://github.com/Alike001/opsra/blob/feat/serv-learning-companion/learn/CONTEXT-HANDOFF.md and product plan at learn/PRODUCT-PLAN.md. Verify current GitHub HEAD, CI and Render before taking action; do not touch old Opsra main. Focus on clean repo, landing page, XP/progress, and hosted SERV tutor verification."

## Deploy incident and rename (12 Nov 2026)
- Source of build failure: docs commit bb3bc13 used a new git tree without base_tree_sha, leaving only two docs and removing learn/server.mjs from that commit's snapshot. Not caused by SERV_API_KEY / LEARN_ACCESS_TOKEN.
- Fixed safely in c0e61452cdbe520a1fddd6db097a729d9ecc6185 using base_tree_sha from passing revision 6e8ae24 with both docs overlaid. This restored files; Render deployment dep-dbqvi1nf3r2c73afi2ug reported LIVE; CI passed (12 tests). Old preview domain is unchanged.
- Working name TrySERV; UI/docs rebrand after restored deployment; dedicated new repo Alike001/tryserv NOT created yet.
- DO NOT create a Git tree for a partial overlay without base_tree_sha. Prefer GitHub update_file for one-file changes.
