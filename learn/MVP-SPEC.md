# TrySERV MVP decision (12 Nov 2026)

## One measurable outcome

A person with no previous OpenServ experience should complete four lessons, understand when SERV is appropriate, and generate a syntactically valid request without sharing any API key.

## Audience

- Newcomers: short sourced introductions with immediate practice.
- Developers: jump directly to code exercise and obtain contextual SERV explanation.

## Not a docs chatbot

The free material is a tiny, grounded course with server-checked progress challenges. The AI has a constrained role: personalized concept clarification and next-action guidance. Don't build an encyclopedia, document-crawler, token marketplace or general-purpose agent platform.

## Success criteria

- All four lessons usable without signup and without paid API calls.
- A wrong choice gets accurate grounded feedback; exercise answers cannot be accidentally guessed by front-end source.
- Builder checks required model/system/user and yields a real Chat Completions request body.
- The tutor actually calls SERV when enabled, with model/ID/provenance shown; fail closed if unavailable.
- Links to official documentation in every lesson.
- Works on 320px and larger; keyboard accessible; controls do what they say.
- Honest independent-project attribution and no browser exposure of SERV_API_KEY.
- Before submission test at least two real learners, one newcomer and one developer; note any problems.

## Explicit non-goals

Profiles, login, badges, certificates, payments, twenty lessons, AI-generated course content, live docs scraping, fake demo completions, or autonomous code editing.

## Unresolved

The official docs and playground already exist. Differentiate through practical completion, measured learner outcomes and the grounded coaching experience. Genuine desirability and willingness to pay have not been proven. Avoid guaranteeing no implementation blockers.

## Hosting

Use a separate free Render Node service deploying branch feat/serv-learning-companion, with \`node --test learn/test/*.test.mjs\` as build check and \`node learn/index.mjs\` as startup. No database, Docker or paid inference until user explicitly configures secrets through Render's Environment page.
