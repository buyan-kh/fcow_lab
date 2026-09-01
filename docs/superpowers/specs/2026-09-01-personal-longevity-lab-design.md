# Personal Longevity Lab Design

## Goal

Pivot the default Frontier Bio experience from genomic evidence review to a local, consumer-facing personal health research lab for high-agency users. The MVP should help someone choose a goal, establish a baseline, run one safe measurable experiment, check in daily, and review a two-week learning report.

## Product boundary

- The first screen says “research only · not medical advice” and explains that the prototype uses synthetic fixtures only.
- No real health records, DNA, device credentials, or clinical files are uploaded, stored, transmitted, or logged.
- The prototype does not diagnose, predict personal risk, prescribe, recommend dosage, or recommend an individual drug.
- Research output can describe behavior-level hypotheses and disease-level evidence summaries, but it cannot turn those into personal treatment advice.

## Flow

1. Choose a goal: Sleep, Energy, Focus, Body composition, Strength, Metabolic health, Stress, or Healthy aging.
2. Load a local synthetic profile (manual entry is represented as local demo input, not a connector).
3. Review a baseline covering sleep, energy, focus, caffeine, and activity.
4. Accept one safe, reversible experiment; the fixture experiment is an afternoon caffeine cutoff.
5. Complete a daily check-in for the two-week protocol.
6. Review trend lines and a plain-language weekly report.

## Architecture

Add typed `lib/lab` domain, deterministic fixtures, and a client-side `PersonalLabWorkspace`. The page shell switches between this lab and the preserved legacy Company mode. Use existing shadcn Button, Card, Badge, and Input primitives; keep visual styling restrained and local to `lab-*` classes. No network calls are introduced.

## Success criteria

- A user can complete the flow without a backend or external API.
- Goal selection, baseline, experiment, check-in, trends, and report states are all interactive.
- The UI labels fixture data and safety boundaries at the point of use.
- Existing genome tests and Company mode remain intact.
