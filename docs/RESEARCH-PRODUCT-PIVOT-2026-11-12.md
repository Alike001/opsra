# Product direction reset — research and validation gates

Date: 12 November 2026. Status: **research, not a product pivot**.

## User instruction

Avoid another "AI slop" app. A product must solve a repeated, consequential user problem even when SERV is unavailable. SERV must help with an actual ambiguous decision, not invent the problem. Do not deploy or overwrite the existing Opsra application based on these ideas alone.

## What OpenServ already solves

OpenServ's official product surface includes:
- SERV Playground: side-by-side model comparison with cost/latency/token metrics.
- OpenAI/Anthropic-compatible SERV APIs, SDK migration help, tutorial-based onboarding.
- No-code agents/workflows with Connect/MCP integration.
- SDK supporting MCP servers over HTTP, SSE and stdio with autoRegisterTools.
- An openserv-mcp developer resource server and mcp-proxy API-to-MCP adapter.

Evidence:
- https://docs.openserv.ai/llms.txt
- https://docs.openserv.ai/serv-reasoning/playground
- https://github.com/openserv-labs/sdk
- https://github.com/openserv-labs/openserv-mcp
- https://github.com/openserv-labs/mcp-proxy

**Do not build** a generic SERV playground, prompt wrapper, no-code agent platform or generic MCP connector. These are directly adjacent to implemented products. A generic agent-safety/preflight tool is also not a fresh differentiation.

SERV's own Day One guide says SERV is appropriate for **ambiguous choices, conflicting constraints, classification, policies, prioritization and tool selection**; exact arithmetic, lookups and business rules belong in code.

Source: https://docs.openserv.ai/serv-reasoning/day-one

## Tested against real product categories

### Candidate A — Cross-program eligibility and application readiness

**Jobs:** Given a public application URL and applicant/project links, identify requirements, whether each is met, the exact official source, unverified claims, and steps still required before submission.

**Real demand evidence:**
- https://www.grants.nih.gov/grants-process/submit/how-we-check-for-completeness
- https://www.grants.gov/learn-grants/grant-eligibility
NIH says standardized technical validations miss some program-specific requirements; manual reviews remain necessary. Real application pages have variable conditional rules.
- https://www.openserv.ai/hackathon-2 has public deadlines, track conditions, public repo/demo and X-post instructions.

**Existing competitors / warning:** OpenGrants already offers eligibility checks; Devpost entries "Entry Gate" and "Hackathon Readiness Checker" demonstrate artifact reviews. A generic AI checklist is **not novel**.
- https://opengrants.io/knowledge-base/checking-eligibility/
- https://devpost.com/software/entry-gate-vx2ty7
- https://devpost.com/software/hackathon-readiness-checker

**Wedge to test (unproven):** any public program, source-quoted conditional requirements, inspectable evidence, independently checked project links, and three-valued MET / MISSING / UNKNOWN rather than invented eligibility. No auto-submission; final authority is the organizer.

**Natural SERV role:** classify ambiguous conditional criteria and conflicts, choose which official subsection to inspect next, or abstain. Deterministic checks handle HTTP status, deadline arithmetic, file existence and link visibility.

**Minimum genuine test:** Three different official programs, at least 20 hand-labeled explicit/conditional requirements, a real GitHub project and a real demo URL. Measure false passes, source quote correctness, unknown rates, and time to a useful checklist. Do not build a full site unless the evidence verifier works.

**Business hypothesis:** applicant-facing assistance or pre-check tooling for grant programs, accelerators and cohort organizers. Willingness to pay unproven.

### Candidate B — Accounts receivable reconciliation exceptions

**Jobs:** Import invoices and bank/processor receipts, match exact entries deterministically, isolate ambiguous references, partial/batch payments and duplicates for human review. Export exceptions without posting or moving funds.

**Real demand evidence:** Federal Reserve notes detached remittance information and complex many-to-one matching introduce time-consuming, error-prone manual reconciliation.
- https://www.clevelandfed.org/publications/payments-research-brief/2026/prb-20260925-b2b-payments-part-two
- https://quickbooks.intuit.com/r/small-business-data/small-business-late-payments-report-2026/

**Existing competitors / warning:** Reconciles, Reconciler, SettlePair, AutoRecon and SAP sample code already provide CSV/bank matching. This is **crowded**.
- https://reconciles.ai/
- https://reconciler.co/
- https://settlepair.com/
- https://github.com/SAP-samples/sap-btp-ai-best-practices/blob/main/use-cases/invoice-matcher/MATCHING_PROCESS.md

**Natural SERV role:** interpret ambiguous remittance text and propose candidate explanations only after deterministic amount/currency/reference checks. It may NEVER silently apply ledger entries, approve transfers or make accounting decisions without human review. Do NOT send sensitive bank files by default.

**Minimum genuine test:** Real consented or properly redacted CSV exports, manually verified ambiguous cases, invariant control totals, deterministic exact matching, edge-case tests (splits, duplicate, partial, fees). Must outperform rules-only on ambiguity without inventing a match.

**Business hypothesis:** time saved for small merchants/bookkeepers. Real category, but competitive and privacy-sensitive.

### Candidate C — Supplier quotation requirements comparator

**Jobs:** Compare 2–3 quoted offers against the original purchase specification; identify missing freight/VAT, incompatible quantities or delivery terms and unanswered supplier questions.

**Existing market:** QuoteCompare, PROCAI, Quotal and supplier-quote tooling already offer this.
- https://getquotecompare.com/
- https://www.procai.world/quote-comparison-tools
- https://sourcinghq.ai/tools/compare-supplier-quotes

**Natural SERV role:** reason about non-equivalent product descriptions and conflicting conditions; deterministic code handles money, quantities and dates. Never invent missing costs.

**Minimum genuine test:** Three real/reviewed quotations covering one procurement, exact source quotes and arithmetic tests; a small-business buyer must prefer result over manual spreadsheet workflow.

**Business hypothesis:** recurring SME purchasing comparison, but document/OCR and supplier-format complexity create deadline risk.

### Rejected categories

- Generic OpenServ integration helper: OpenServ already ships onboarding, SDK, docs, No-code, Playground and MCP support.
- Broad DevOps/incident dashboard: Akmatori, Rootly, PagerDuty and many others already do it; existing Opsra only supports synthetic lab.
- Generic first-issue finder: Open Source Radar already checks unclaimed issues, linked PRs, repo freshness and contribution rules. https://github.com/TanbirRamim/open-source-radar
- General "Agent Preflight": close to existing first-edition entrants and user's own previous repo, not an exciting novel wedge.

## Ranking for Nov 15 hackathon (qualitative, NOT proof of winning)

| Criterion | A: application check | B: reconciliation | C: quote compare |
|---|---|---|---|
| Directly testable with public real-world sources | Strong | Moderate (financial data) | Moderate (documents) |
| Natural SERV ambiguity / policy interpretation | Strong | Moderate | Strong |
| Non-AI core useful | Strong | Strong | Strong |
| Shipping risk in short deadline | Lower | Medium | Medium to high |
| Potential repeat paid use | Unproven / medium | Strong but crowded | Plausible but crowded |
| Competitive uniqueness | Not proven | Not proven | Not proven |

**Research preference for a quick validation experiment: A**, because real public rule sources and artifact links are available now without customer credentials. **If the source-grounded checker fails or looks no better than existing tooling, stop rather than dress it up.** B may have stronger business economics but carries privacy/data integration constraints. No final commitment to A, B or C has been made.

## Non-negotiable acceptance tests before a pivot

1. Show a concrete user task that is painful without the product (not a sentence about "AI").
2. Produce a meaningful artifact the user can act on — resolved checklist with cited source; recon exceptions; or comparable purchase terms.
3. At least 10 real/official input cases and separate edge cases; no fake production activity.
4. SERV does work that is demonstrably ambiguous and decision-oriented, not string parsing or arithmetic.
5. Structured output and app-side independent validation; false-pass count reported.
6. Every production dependency verified before deployment, plus cost and secrets guardrails.
7. One primary page, zero decorative actions, responsive mobile/desktop, direct export.
8. Compare against a basic non-AI approach and state what improved and what did not.
9. Record competitor overlap honestly; no claim of novel market without evidence.
10. Do not overwrite the existing live Opsra staging application merely to test an idea.

## Timeline and submission

OpenServ Edition 02 deadline: **15 November 2026 23:59 UTC**. Public repo, demo and short write-up; X post and associated submission rules described in the official FAQ:
https://www.openserv.ai/hackathon-2

Because time is short, **validate the hardest assumption first**, not the landing page. Official evaluation: creativity, user readiness and revenue potential.

