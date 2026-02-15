# Specification

## Summary
**Goal:** Fix key UX and persistence issues across AI Chat, Analytics, and Settings by enabling long chat scrolling, ensuring transactions save correctly, removing Challenges, and making display preferences work.

**Planned changes:**
- Update the AI assistant chat UI to support long conversations with a properly scrollable message container and reliable auto-scroll to the latest message.
- Fix Analytics “Add Income” and “Add Expense” so new transactions persist (survive refresh) and analytics charts/derived data refresh correctly after adding.
- Ensure Analytics “Remaining Balance” always renders as a properly formatted currency value (show 0 when there are no transactions), never a bare dash/minus or invalid value.
- Remove the Challenges feature from navigation and disable/remove the `/challenges` route, cleaning up any stale references.
- Make Settings display preferences functional: theme selection (light/dark/system) applies immediately and persists across reloads, and the “Show Analytics” toggle controls Analytics visibility/access (nav + route access behavior).

**User-visible outcome:** Users can chat for long sessions without messages being clipped, Analytics can successfully add and retain income/expenses with correct balance display, Challenges is no longer accessible, and Settings theme + “Show Analytics” toggles actually affect the app.
