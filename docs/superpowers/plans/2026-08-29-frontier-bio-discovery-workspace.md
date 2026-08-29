# Frontier Bio Discovery Workspace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing Frontier Bio prototype into a readable AI-native drug-discovery workspace whose primary flow is biology → uncertainty → experiment → modality → candidate → development decision.

**Architecture:** Keep the existing single-route Next/Vinext site and use source-owned shadcn primitives for standard interaction surfaces. Use Beautiful UI registry components for thinking, loading, and tool-use states. Keep the first dataset deterministic and explicitly illustrative, while moving decision-ranking logic into a small tested domain module that can later be replaced by a real inference service.

**Tech Stack:** React 19, Next 16/Vinext, Tailwind CSS v4, shadcn/ui with Radix primitives, Beautiful UI registry components, Geist/Geist Mono, Liveline, Vitest.

---

### Task 1: Establish a failing domain test for experiment ranking

**Files:**
- Create: `lib/decision.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Add the test command and write the failing test**

Add Vitest and a test script:

```bash
npm install -D vitest
```

Add this script to `package.json`:

```json
"test": "vitest run"
```

Create `lib/decision.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { rankExperiments, type ExperimentCandidate } from './decision';

describe('rankExperiments', () => {
  it('puts the experiment with the highest decision impact and information gain first', () => {
    const candidates: ExperimentCandidate[] = [
      { id: 'cheap-but-weak', title: 'Repeat target screen', decisionImpact: 3, informationGain: 2, feasibility: 10, cost: 1 },
      { id: 'decision-critical', title: 'Paired perturbation and rescue', decisionImpact: 10, informationGain: 9, feasibility: 7, cost: 5 },
    ];

    expect(rankExperiments(candidates)[0].id).toBe('decision-critical');
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails for the missing module**

Run:

```bash
npm test -- lib/decision.test.ts
```

Expected: Vitest fails because `lib/decision.ts` does not exist. Do not implement the module before observing this failure.

- [ ] **Step 3: Commit the red test**

```bash
git add package.json package-lock.json lib/decision.test.ts
git commit -m "test: define experiment ranking behavior"
```

### Task 2: Implement the tested decision-ranking module

**Files:**
- Create: `lib/decision.ts`
- Test: `lib/decision.test.ts`

- [ ] **Step 1: Implement the smallest scoring function that satisfies the test**

Create `lib/decision.ts`:

```ts
export type ExperimentCandidate = {
  id: string;
  title: string;
  decisionImpact: number;
  informationGain: number;
  feasibility: number;
  cost: number;
};

export function rankExperiments(candidates: ExperimentCandidate[]) {
  return [...candidates].sort((a, b) => {
    const scoreA = a.decisionImpact * 0.4 + a.informationGain * 0.35 + a.feasibility * 0.15 - a.cost * 0.1;
    const scoreB = b.decisionImpact * 0.4 + b.informationGain * 0.35 + b.feasibility * 0.15 - b.cost * 0.1;
    return scoreB - scoreA;
  });
}
```

- [ ] **Step 2: Run the focused test and the full test suite**

Run:

```bash
npm test -- lib/decision.test.ts
npm test
```

Expected: both commands pass with one test passing.

- [ ] **Step 3: Commit the green domain module**

```bash
git add lib/decision.ts lib/decision.test.ts
git commit -m "feat: rank experiments by decision value"
```

### Task 3: Initialize shadcn and install the component foundation

**Files:**
- Create: `components.json`
- Create: `components/ui/button.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/separator.tsx`
- Create: `components/ui/tabs.tsx`
- Create: `components/ui/sheet.tsx`
- Create: `lib/utils.ts`
- Modify: `app/globals.css`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Initialize shadcn non-interactively with Radix primitives**

Run:

```bash
npx shadcn@latest init -d --base radix
```

Inspect the generated `components.json`, `components/ui/utils.ts`, and CSS changes. Preserve the existing Vinext setup and retain literal Geist font declarations in `@theme inline` if the CLI changes them.

- [ ] **Step 2: Add only the shadcn primitives required by the first workspace slice**

Run:

```bash
npx shadcn@latest add button badge card input separator tabs sheet
```

Use these source-owned primitives for standard buttons, status badges, tabs, inputs, dividers, and responsive navigation.

- [ ] **Step 3: Verify the generated foundation compiles before composing the product**

Run:

```bash
npm run lint
npm run build
```

Expected: both commands exit successfully. If the CLI rewrites the theme, restore the existing Beautiful UI semantic tokens with `apply_patch` while keeping the generated component source.

- [ ] **Step 4: Commit the foundation**

```bash
git add components.json components/ui app/globals.css package.json package-lock.json
git commit -m "chore: add shadcn foundation"
```

### Task 4: Add the requested Beautiful UI state components

**Files:**
- Create or replace: `components/ThinkingState.tsx`
- Create or replace: `components/LoadingState.tsx`
- Create or replace: `components/ToolChips.tsx`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Pull the registry source from the requested Beautiful UI URLs**

Run:

```bash
npx shadcn@latest add https://www.beautifului.dev/r/thinking-state.json
npx shadcn@latest add https://www.beautifului.dev/r/loading-state.json
npx shadcn@latest add https://www.beautifului.dev/r/tool-chips.json
```

Inspect the generated source. Keep the components self-contained and preserve the foundation-token contract. If the registry uses lowercase filenames, rename the source to the PascalCase paths above with `apply_patch` and update imports.

- [ ] **Step 2: Adapt only the content and props needed for Frontier Bio**

Use the components for these states:

- `ThinkingState`: “Weighting evidence”, “Finding contradictions”, “Selecting next experiment”.
- `LoadingState`: the full program analysis state.
- `ToolChips`: evidence retrieval, hypothesis comparison, experiment ranking, and decision record writing.

Do not add decorative AI copy or unsupported confidence claims.

- [ ] **Step 3: Verify the state components in isolation through the existing route**

Temporarily render each component in a small development-only section or the first coherent slice, then run:

```bash
npm run lint
npm run build
```

Expected: no TypeScript, import, or CSS errors.

- [ ] **Step 4: Commit the state foundation**

```bash
git add components/ThinkingState.tsx components/LoadingState.tsx components/ToolChips.tsx package.json package-lock.json
git commit -m "feat: add beautiful ui reasoning states"
```

### Task 5: Replace demo data with a drug-discovery program model

**Files:**
- Create: `lib/program.ts`
- Modify: `data.ts`
- Test: `lib/decision.test.ts`

- [ ] **Step 1: Add a failing test for the program’s gating uncertainty**

Update the import block at the top of `lib/decision.test.ts`:

```ts
import { getGatingUncertainty } from './program';
```

Then append this test to `lib/decision.test.ts`:

```ts
it('returns the uncertainty that controls the next capital decision', () => {
  const uncertainty = getGatingUncertainty({
    uncertainties: [
      { id: 'tractability', question: 'Can the target be drugged?', decisionImpact: 5 },
      { id: 'translation', question: 'Will the mechanism translate to human biology?', decisionImpact: 10 },
    ],
  });

  expect(uncertainty.id).toBe('translation');
});
```

- [ ] **Step 2: Run the test and confirm the missing module failure**

Run:

```bash
npm test -- lib/decision.test.ts
```

Expected: failure because `lib/program.ts` and `getGatingUncertainty` do not exist.

- [ ] **Step 3: Implement typed program objects and the gating-uncertainty selector**

Create `lib/program.ts` with:

```ts
export type ProgramUncertainty = {
  id: string;
  question: string;
  decisionImpact: number;
};

export type ProgramSnapshot = {
  uncertainties: ProgramUncertainty[];
};

export function getGatingUncertainty(program: ProgramSnapshot) {
  if (program.uncertainties.length === 0) {
    throw new Error('Program needs at least one uncertainty');
  }

  return [...program.uncertainties].sort((a, b) => b.decisionImpact - a.decisionImpact)[0];
}
```

- [ ] **Step 4: Replace `data.ts` with a single realistic but explicitly illustrative discovery program**

The fixture must include:

- Disease area and unmet-need framing.
- Target hypothesis and mechanism hypothesis.
- Human genetics evidence.
- Perturbation evidence.
- A translational gap.
- Three ranked experiments.
- A modality gate showing why the modality is not selected until biology is stronger.
- Three illustrative candidate records after the mechanism gate.
- Explicit labels such as `Illustrative dataset` and `Not for clinical use`.

- [ ] **Step 5: Run the tests and commit the model**

```bash
npm test
git add lib/program.ts lib/decision.test.ts data.ts
git commit -m "feat: model drug discovery decision objects"
```

### Task 6: Recompose the program cockpit around the discovery loop

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/SidebarNav.tsx`
- Modify: `components/RecommendationCard.tsx`
- Modify: `components/ContextCards.tsx`
- Modify: `components/TaskRows.tsx`
- Modify: `components/PromptBar.tsx`
- Create: `components/DiscoveryPipeline.tsx`
- Create: `components/DecisionRecord.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add the large program header and discovery navigation**

The first viewport must include:

- Frontier Bio wordmark and program switcher.
- `AX-014 / Target validation` context.
- Main title: `What must be true before we fund the next step?`
- A single prominent action: `Run analysis`.
- Tabs: `Overview`, `Biology`, `Experiments`, `Molecules`, `Development`.
- Large readable program metadata.

- [ ] **Step 2: Build the decision section**

Compose:

- Current decision.
- Gating uncertainty.
- Evidence state counts.
- Recommendation with exact experiment name.
- Falsifying result and decision consequence.

Use shadcn `Card`, `Badge`, `Separator`, and `Button` where they carry actual structure. Avoid nested card stacks.

- [ ] **Step 3: Add the experiment selector**

Render ranked experiments from `rankExperiments`. Each row must show:

- Experiment title.
- Hypotheses distinguished.
- Information gain.
- Cost/time.
- Feasibility.
- Status.
- Approve action.

The approved experiment must update the visible decision state without navigating away.

- [ ] **Step 4: Add the drug-discovery pipeline section**

Create `components/DiscoveryPipeline.tsx` with the explicit path:

```text
biology
→ causal target
→ mechanism validation
→ modality gate
→ candidate design
→ synthesis and assay
→ PK/PD and safety
→ development candidate
```

The active stage is mechanism validation. Later stages are visible but clearly marked as pending rather than falsely complete.

- [ ] **Step 5: Add the candidate and decision record surfaces**

Create `components/DecisionRecord.tsx` showing:

- Decision question.
- Evidence used.
- Recommendation.
- Experiment selected.
- Advance/pause/kill criteria.
- Owner and timestamp.

Add a compact illustrative molecule shortlist below the pipeline, clearly labeled as a future-stage internal view and not a claim of a discovered drug.

- [ ] **Step 6: Connect the reasoning components**

Use `ThinkingState`, `LoadingState`, and `ToolChips` for the analysis cycle:

```text
idle → thinking → analysis complete → experiment approved
```

The UI must show the state transition, preserve the recommendation, and allow the user to inspect evidence after completion.

- [ ] **Step 7: Use the prompt as a secondary control, not the product center**

The prompt should answer questions about the visible program state. Keep it below the primary decision surface and use the shadcn `Input` foundation. Do not let chat replace the evidence or experiment workflow.

- [ ] **Step 8: Commit the product composition**

```bash
git add app/page.tsx app/globals.css components
git commit -m "feat: build drug discovery program cockpit"
```

### Task 7: Apply the readable research-workspace visual system

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `components/*.tsx`

- [ ] **Step 1: Declare the design read and dials in the implementation notes**

Design read:

> Reading this as: a regulated, evidence-heavy research workspace for drug-discovery scientists and program leads, with a calm technical language, leaning toward Dooping’s operational patterns plus source-owned shadcn primitives and Beautiful UI state components.

Set:

- `DESIGN_VARIANCE: 3`
- `MOTION_INTENSITY: 2`
- `VISUAL_DENSITY: 5`

The page needs calm hierarchy, high legibility, and enough density for program review without cockpit clutter.

- [ ] **Step 2: Enforce readable type and spacing tokens**

Use:

- 16px body text minimum.
- 14px evidence and experiment rows minimum.
- 20–30px primary uncertainty text.
- 18–24px section headings.
- 13px metadata minimum.
- 24px minimum desktop section spacing.
- 16px minimum mobile horizontal padding.

Keep one accent color, one radius scale, and token-based surfaces. Remove 9px labels where they carry meaningful information.

- [ ] **Step 3: Remove AI-slop patterns**

Do not use:

- Purple AI gradients.
- Glowing borders.
- Equal bento cards.
- Decorative dots without semantic meaning.
- Fake confidence meters.
- Excessive rounded cards.
- Dense miniature copy.
- Hand-rolled SVG icons.

Use accessible icons from one installed icon family or text labels where an icon adds no meaning.

- [ ] **Step 4: Verify responsive behavior at desktop and mobile widths**

Ensure the main grid collapses without intrinsic-width overflow and that the mobile view keeps primary uncertainty and experiment text readable. Use `minmax(0, 1fr)` for single-column grid tracks and `min-width: 0` on grid children.

- [ ] **Step 5: Commit the visual system**

```bash
git add app/globals.css app/layout.tsx components
git commit -m "style: establish readable research workspace system"
```

### Task 8: Verify the complete workflow and publish

**Files:**
- Test: `lib/decision.test.ts`
- Modify: any files required by actual failures only

- [ ] **Step 1: Run the test suite**

```bash
npm test
```

Expected: all domain tests pass.

- [ ] **Step 2: Run lint and build**

```bash
npm run lint
npm run build
```

Expected: both exit successfully.

- [ ] **Step 3: Smoke-test the local workflow in the retained browser tab**

Verify:

1. The program cockpit is visible at the first viewport.
2. The text is readable at desktop width.
3. `Run analysis` transitions through thinking/loading and completes.
4. Evidence expands to reveal provenance.
5. One experiment can be approved.
6. The pipeline updates its active stage.
7. The decision record reflects the approved experiment.
8. Prompt submission answers from visible program context.
9. The 390px layout has no horizontal overflow.

- [ ] **Step 4: Run final source checks**

```bash
git diff --check
git status --short
```

Expected: no whitespace errors and no uncommitted source changes.

- [ ] **Step 5: Package and publish the verified source**

Use the existing Sites project and the `sites-hosting` workflow. Push the exact verified commit, package the successful build with `scripts/package-site.sh`, save a new site version, deploy it, and confirm the production status. Keep the local preview available until the hosted deployment is confirmed.
