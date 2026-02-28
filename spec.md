# Specification

## Summary
**Goal:** Fix the Motoko backend to use stable storage so all user data persists across canister upgrades and redeployments.

**Planned changes:**
- Convert all mutable state variables in `backend/main.mo` to use `stable var` declarations
- Replace non-stable collections (e.g., `HashMap`) with stable array-backed patterns using `Iter.toArray` for serialization
- Add a `system func preupgrade()` hook to serialize all non-stable collections into their stable backing arrays before upgrade
- Add a `system func postupgrade()` hook to reconstruct all non-stable collections from their stable backing arrays after upgrade
- Ensure all stored data types (transactions, expenses, budgets, savings goals, user profiles, preferences, net worth entries, emergency fund data, spending limits, blog posts, quiz questions, quiz progress, chat messages, contact submissions, AI predictions) are stable-compatible

**User-visible outcome:** All user data (transactions, goals, budgets, profiles, preferences, etc.) is preserved after canister upgrades and redeployments — no data is lost between successive deploys.
