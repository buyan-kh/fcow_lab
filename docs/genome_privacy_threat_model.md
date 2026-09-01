# Genome Privacy Threat Model

## Scope

This phase accepts only synthetic VCF fixtures. The browser parses text locally, stores the active session in React memory, and clears it through Delete genome session. There is no API route, analytics, authentication, database, localStorage, or external evidence request.

## Threats and controls

| Threat | Control in this phase |
| --- | --- |
| A real clinical VCF is uploaded | Require `##frontier_bio_synthetic=true`; reject unmarked files. |
| Genome content is sent to a server | No `fetch`, form action, server action, or upload endpoint exists. |
| Raw variants leak through logs | Parser/session code never logs input or variant fields. |
| Genome persists after the session | State is memory-only; deletion replaces the session with `null`. |
| Reports expose original file bytes | Report serializers include normalized fields only. |
| Public evidence is mistaken for private data | Fixture labels and separate domain types are rendered beside every source. |

Production genomic uploads require security architecture, consent, legal review, access control, encryption, retention policy, incident response, and clinical governance before they are permitted.
