# Opsra — evidence-first incident investigations

**Problem:** On-call engineers lose time switching between alerts, logs, and runbooks, while AI-generated diagnoses can make unsupported claims about the root cause or recovery.

**Opsra** is a lightweight, read-only incident investigation workspace. It uses OpenServ SERV Reasoning to select a diagnostic tool and draft an evidence-cited hypothesis. Deterministic checks validate the cited evidence and forbid model-declared recovery.

> **Current milestone:** Controlled laboratory. The initial incident records are explicitly synthetic. The **Run lab HTTP probe** action performs a genuine HTTP request against a deliberately failing endpoint on the same server and records its status and timing. It is **not** real Grafana/Prometheus/Loki integration, production incident monitoring, or full upstream Akmatori.

## How to test — first

1. Open the public Opsra deployment (linked here after deployment).
2. Select either lab incident. Inspect source labels and citations.
3. Click **Run lab HTTP probe** to observe a real but deliberately induced HTTP 502/503 from the controlled lab server.
4. Check that the new evidence includes an HTTP status, timestamp and duration, and **does not claim production monitoring**.
5. The default report is a **prewritten fixture**, not a SERV call.
6. To test actual SERV Reasoning, the operator must configure server-side `SERV_API_KEY` and a separate `STAGING_ACCESS_TOKEN`. Enter **only the access token** in the browser; click **Run SERV investigation**.
7. Examine returned SERV completion IDs, selected `gateway_call`, trace and report citations. If an API call fails, the application displays an error rather than a fake result.
8. Recovery remains **not verified**, regardless of a model's conclusion.

No tester needs a wallet, test funds, or access to production infrastructure. The live SERV button is deliberately unavailable until secure server credentials are configured.

## Run tests

Requires Node.js 22 or newer.

```bash
npm run check
npm test
npm start
```

Open http://localhost:3000. No third-party runtime dependencies, Docker, or database required for the current lab.

## Architecture

```text
Browser -> Node HTTP server -> controlled lab evidence
                           -> optional SERV Chat Completions
SERV automatic gateway_call -> allowlisted local runbook/evidence tool
Tool result -> SERV final answer -> deterministic evidence-ID and recovery validation
```

`/healthz`, `/api/incidents`, `/api/demo` and `/api/probe` are accessible without credentials. `POST /api/investigate` requires a separate staging token and configured server-side SERV credentials, and uses a small request and rate budget.

The controlled probe can only call fixed paths on `127.0.0.1` within the running lab; arbitrary addresses and SSH/Kubernetes/write tools are not supported. Synthetic records are identified by source. In-process probe observations disappear on restart, so durable storage remains a future milestone.

## Shipping gates — do not claim complete

- [x] Original standalone incident dashboard, lab evidence and deterministic evidence checks
- [x] Safe, read-only real HTTP probe for known controlled lab failures
- [x] Backend SERV API integration code and mocked protocol tests
- [ ] Live SERV call **from the hosted app** with operator-provided server secret
- [ ] Actual Akmatori Gateway integration and separately authenticated Grafana read-only queries
- [ ] Persistent incident/audit history with verifiable independent health checks
- [ ] Prompt Guard, Shadow Agent, benchmark against a baseline, browser/mobile tests
- [ ] Sponsor eligibility and final submission artifacts

## Provenance and licenses

Opsra is an **original companion implementation** informed by the workflow of [Akmatori](https://github.com/akmatori/akmatori) (Apache-2.0). No upstream Akmatori code is bundled in this repository. Please do not call it the upstream project or claim official endorsement.

OpenServ API documentation: https://docs.openserv.ai/serv-reasoning/introduction

Deeper research, code risks and acceptance gates: [Technical Decision](docs/OPSRA-TECHNICAL-DECISION.md).
