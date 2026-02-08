# Specification

## Summary
**Goal:** Add a private (authenticated) Budget Planner page that lets logged-in users enter required (and optional advanced) financial inputs and generate a smart, clearly explained monthly budget plan.

**Planned changes:**
- Add a new authenticated/private route under the existing AppLayout pattern for a “Budget Planner” page (redirecting unauthenticated users to `/login` via existing behavior).
- Build a Budget Planner form with a clearly separated Required section and a collapsed-by-default “Advanced Details (Optional)” section with an explicit Skip action and optional-field labeling (English-only copy).
- Add a form completion progress indicator (e.g., “You’re 60% done”) and ensure the page is mobile-first with a small-screen-friendly layout.
- Implement deterministic, frontend-only budgeting logic that works with required inputs only; when advanced inputs are skipped, apply safe default averages and standard rules (e.g., 50/30/20 or 60/30/10) and display a dedicated Assumptions area; format currency using existing utilities.
- Create an on-page Budget Output section (shown after “Generate Budget Plan”) including: income summary, Needs/Wants/Savings allocation, suggested savings, visual insights (expense pie chart, savings progress bar, cash flow summary), smart recommendations, exactly 3 action steps, and a Finance Health Score (/100) with a simple explanation.
- Add privacy-first, friendly, non-judgmental messaging near the form emphasizing minimal required inputs.
- Add an optional reminder setup within the Action Plan section that works locally only (no push/SMS/email/external services) and does not require backend changes.
- Update authenticated navigation (sidebar/mobile menu) to include a “Budget Planner” entry pointing to the new private route and showing an active state.

**User-visible outcome:** Logged-in users can open a new “Budget Planner” page from the app navigation, optionally fill in advanced details (or skip them), and generate an on-page budget plan with charts, assumptions, recommendations, a 3-step action plan (with an optional local-only reminder), and a Finance Health Score.
