# Opsra

Opsra is an evidence-first incident investigation workspace.

**Status:** Early controlled laboratory build. Real SERV reasoning integration is being verified; the incident fixtures are synthetic, and the first HTTP probe checks an intentionally failing lab endpoint. This is not production monitoring.

## How to test

The hosted demo currently runs at https://serv-incident-lab-staging.onrender.com. A dedicated Opsra deployment will follow this repository migration. Select a lab incident, inspect its evidence and press **Run lab HTTP probe**. This performs a real request against a deliberately faulty local lab endpoint, not a live customer system.

Details and tests will be added in subsequent commits.

## Links

- Source inspiration: https://github.com/akmatori/akmatori (Apache-2.0).
- OpenServ SERV Reasoning: https://docs.openserv.ai/serv-reasoning/introduction
