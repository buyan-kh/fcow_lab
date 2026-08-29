# Evidence Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished single-route Frontier Bio Evidence Console prototype that surfaces the highest-value uncertainty in a drug program and recommends the next experiment.

**Architecture:** Use the generated Sites Vite application with one React route and focused local components in `src/`. Keep all demo state in the route so the prototype is deterministic and backend-free. Use only Beautiful UI component patterns for the visible primitives: Sidebar Nav, Recommendation Card, Context Cards, Task Rows, Insight Cards, Tool Chips, Flowchart, and Prompt Bar.

**Tech Stack:** Vite, React, TypeScript, CSS, `@openai/sites-vite-plugin`, the generated project package manager.

---

### Task 1: Scaffold the site and remove starter content

**Files:**
- Create: generated site files in `/Users/buyan/Projects/frontier_bio`
- Inspect: `package.json`, `src/`, `public/`, `.openai/hosting.json`

- [ ] **Step 1: Scaffold the empty workspace**

Run `npm create --yes @openai/sites@0.2.0 . -- --yes` from `/Users/buyan/Projects/frontier_bio` and wait for the command to finish.

- [ ] **Step 2: Install generated dependencies**

Run the package manager command specified by the generated project, using `npm install` only if the scaffold did not install dependencies.

- [ ] **Step 3: Inspect the generated entry points**

Read `package.json`, the primary route, the global stylesheet, and `.openai/hosting.json`. Preserve the scaffold's scripts, lockfile, and Sites plugin configuration.

- [ ] **Step 4: Commit the clean scaffold**

Run `git add .` and `git commit -m "chore: scaffold evidence console site"`.

### Task 2: Add the Evidence Console data model and page composition

**Files:**
- Create: `src/data.ts`
- Create: `src/components/SidebarNav.tsx`
- Create: `src/components/RecommendationCard.tsx`
- Create: `src/components/ContextCard.tsx`
- Create: `src/components/TaskRows.tsx`
- Create: `src/components/InsightCard.tsx`
- Create: `src/components/DecisionFlow.tsx`
- Create: `src/components/PromptBar.tsx`
- Modify: the generated primary route file

- [ ] **Step 1: Define deterministic demo data**

Create typed arrays and objects for one explicitly illustrative program: `AX-014 / Target validation`, with uncertainty copy, three evidence cards, four experiments, a decision flow, and three prompt responses. Include stable IDs and status values so controls can update the view without network calls.

- [ ] **Step 2: Build the sidebar primitive**

Implement a keyboard-reachable sidebar with the Beautiful UI Sidebar Nav pattern. The component accepts `activeSection` and `onSectionChange`, renders Programs, Evidence, Experiments, and Models, and exposes a compact mobile toggle.

- [ ] **Step 3: Build the recommendation primitive**

Implement a Beautiful UI Recommendation Card with uncertainty severity, recommendation title, rationale, evidence chips, and `Queue experiment` / `Dismiss` actions. Support queued and dismissed states through props.

- [ ] **Step 4: Build the context, task, insight, flow, and prompt primitives**

Keep each component single-purpose. Context cards expand on click and keyboard activation. Task rows filter by status. Insight cards render a compact structured observation. DecisionFlow renders the dotted decision path. PromptBar accepts text, has a submit button, and calls a callback with the submitted prompt.

- [ ] **Step 5: Compose the primary route**

Replace starter content with the responsive Evidence Console layout. Use the approved copy and mark all program data with an `Illustrative dataset` label. Keep the first viewport focused on the uncertainty and recommendation, with evidence context visible beside it.

- [ ] **Step 6: Commit the first meaningful product slice**

Run `git add src` plus the route file and commit with `feat: add evidence console product slice`.

### Task 3: Implement the visual system and responsive behavior

**Files:**
- Modify: the generated global stylesheet
- Modify: route and component class names only where needed for layout

- [ ] **Step 1: Establish the theme tokens**

Define CSS variables for obsidian surfaces, warm-white text, muted blue, lime validation, amber uncertainty, hairline borders, and the shared radius/spacing scale. Use a single dark theme throughout the page.

- [ ] **Step 2: Implement desktop layout rhythm**

Set the sidebar width, content max-width, two-column upper grid, lower three-panel grid, dense 8px spacing rhythm, restrained shadows, and hover/active states. Use no gradients, fake scientific charts, or unrelated visual primitives.

- [ ] **Step 3: Implement typography and accessibility states**

Use a strong sans display face for headings and a readable mono face only for labels and program metadata. Add visible focus rings, readable placeholder/helper text, button contrast, `aria-expanded`, `aria-current`, and `aria-live` where state changes are announced.

- [ ] **Step 4: Implement mobile collapse rules**

Below 768px, collapse the sidebar into a top bar, stack the main columns, make task rows readable without horizontal overflow, and keep the recommendation actions on one line where space allows.

- [ ] **Step 5: Commit the visual system**

Run `git add .` and `git commit -m "style: finish evidence console visual system"`.

### Task 4: Wire interactions and verify the complete user flow

**Files:**
- Modify: the primary route
- Modify: affected components

- [ ] **Step 1: Add navigation state**

Make the sidebar controls switch the active section label and content summary while preserving the shared shell.

- [ ] **Step 2: Add analysis state**

Make `Run analysis` enter a short Thinking state, then update the insight and recommendation copy. Disable the button during the state transition and announce the result with `aria-live`.

- [ ] **Step 3: Add recommendation actions**

Queueing the recommendation changes its CTA state and inserts the related experiment into the visible queue. Dismissing it hides the card and exposes a recoverable `Restore recommendation` action.

- [ ] **Step 4: Add evidence and task interactions**

Make evidence cards expandable and task filters update the visible rows. Ensure all controls work with keyboard activation.

- [ ] **Step 5: Add prompt responses**

Submit a prompt and append the matching local structured response, falling back to a concise “not in demo scope” message for unknown prompts.

- [ ] **Step 6: Commit the interaction pass**

Run `git add .` and `git commit -m "feat: wire evidence console interactions"`.

### Task 5: Build, browser-check, and publish

**Files:**
- Modify: only files required to fix compilation or blocking visual defects

- [ ] **Step 1: Run the production build**

Run the project's build script and fix all TypeScript or bundler failures. Rerun until it succeeds.

- [ ] **Step 2: Start the dev server**

Run the project's development script in a retained foreground session and use the exact local URL printed by the server.

- [ ] **Step 3: Perform browser verification**

Open the meaningful first route in the browser and inspect desktop and mobile widths. Verify the uncertainty card, recommendation action, navigation, analysis state, evidence expansion, task filters, prompt submission, focus states, and absence of horizontal overflow.

- [ ] **Step 4: Fix only observed issues**

Apply focused patches for real compile/runtime/layout issues, rerun the build, and repeat browser verification for the affected flow.

- [ ] **Step 5: Publish through Sites hosting**

Use the Sites hosting flow after the final build and browser verification. Keep the dev server alive until hosting completes.
