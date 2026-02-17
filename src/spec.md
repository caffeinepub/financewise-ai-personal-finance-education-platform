# Specification

## Summary
**Goal:** Fix Internet Identity sign-up navigation, ensure per-user data isolation, make goal deletion work with an in-app confirmation dialog, keep data consistent across pages, and make the AI assistant respond using the authenticated user’s real FinanceWise data.

**Planned changes:**
- Fix “Sign Up Free” (desktop/mobile) to navigate to a valid Internet Identity auth route and redirect authenticated users to `/dashboard`.
- Enforce account isolation so data (profile, goals, transactions, dashboard) is keyed by the authenticated Internet Identity principal and never shared across principals.
- Reset/segment frontend cached queries on identity change so the UI does not briefly show the previous user’s data after switching accounts.
- Repair Goals deletion end-to-end: show an in-app confirmation popup only for goal deletion, and on confirm delete from backend storage and update the goals list immediately.
- Ensure cross-page consistency by using shared queries and proper invalidation/refetch so Dashboard, Transactions, Goals, Analytics, and AI context reflect goal/transaction changes without full reloads.
- Upgrade the AI assistant to reference the authenticated user’s actual data (at minimum transactions, balance, savings goals) in responses, include an educational/not-financial-advice disclaimer, and provide a data-aware fallback when no data exists.

**User-visible outcome:** Clicking “Sign Up Free” opens a working Internet Identity auth flow and lands users on the dashboard after login; each Internet Identity account sees only its own data; goals can be deleted via an in-app confirmation dialog; updates to goals/transactions reflect across all relevant pages automatically; and the AI assistant answers saving/investing/expense-control questions using the user’s real dashboard numbers when available.
