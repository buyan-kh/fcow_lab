# Evidence Console Design

## Purpose

Frontier Bio's first product surface is an AI-native drug-discovery cockpit that identifies the most important uncertainty in a therapeutic program and recommends the experiment most likely to resolve it. The prototype is a front-end-only product slice with clearly illustrative data.

## Experience

The default route is a dense, dark research workspace called Evidence Console. The program header establishes context, while the main content gives visual priority to the current uncertainty and the AI's recommended next experiment. Secondary evidence and experiment task rows make the decision traceable without turning the first screen into a data dump.

## Component language

The interface uses only the component patterns represented in Beautiful UI: Sidebar Nav, Recommendation Card, Context Cards, Task Rows, Insight Cards, Tool Chips, Flowchart, and Prompt Bar. The implementation may add page-specific composition and CSS styling, but it will not introduce a second UI kit or unrelated component language.

## Layout

- Fixed left workspace rail on desktop; collapsible rail on smaller screens.
- Compact top header with program identity, demo label, and primary analysis action.
- Main two-column workspace: uncertainty and recommendation on the left, evidence context on the right.
- Lower workspace: experiment queue, decision flow, and AI insight.
- Single dark theme using obsidian, warm white, muted blue, lime validation, and amber uncertainty accents.

## Interactions

- Workspace navigation switches the active view between Programs, Evidence, Experiments, and Models.
- Run analysis enters a short thinking/loading state and updates the recommendation copy.
- Queue experiment changes the recommendation state and adds a queued task row.
- Evidence cards expand and collapse.
- Experiment filters switch between all, queued, running, and completed items.
- Prompt bar accepts a question and appends a structured, mocked AI response.
- The responsive layout converts the rail to a top bar and stacks content below tablet width.

## Data and boundaries

The prototype uses local mock data only. It does not make scientific claims, connect to external data sources, or imply that the displayed metrics are validated. Real model outputs, evidence provenance, authentication, persistence, and laboratory integrations are future boundaries.

## Validation

The site must compile successfully, render without blocking runtime errors, keep all primary controls keyboard reachable, preserve readable contrast, avoid wrapped desktop CTAs, and be checked at desktop and mobile widths in the browser.
