# Specification

## Summary
**Goal:** Implement complete backend-first data persistence with Internet Identity authentication for all private pages.

**Planned changes:**
- Set up Internet Identity authentication with persistent sessions across browser refreshes
- Create backend HashMap<Principal, UserData> structure to store isolated user data
- Implement backend API endpoints for CRUD operations on transactions, goals, budgets, preferences, predictions, and quiz progress
- Modify Dashboard to fetch all data from backend on mount and after mutations
- Update Transactions page to save/fetch transaction history from backend
- Update Goals page to save/fetch savings goals from backend
- Update Analytics page to fetch transaction data and preferences from backend
- Update Budget Planner to save/fetch budget plans from backend
- Update Calculators to save/fetch calculation history from backend
- Update AI Insights to save/fetch predictions from backend
- Update Quiz/Learning pages to save/fetch progress and scores from backend
- Update Settings to save/fetch user preferences from backend
- Configure React Query hooks to invalidate and refetch after all mutations
- Update logout handler to clear frontend state while preserving backend data
- Test data persistence across browser refresh, logout/login cycles, and different devices

**User-visible outcome:** Users can log in with Internet Identity and all their data (transactions, goals, budgets, analytics, calculator history, AI predictions, quiz progress, and preferences) persists across sessions, devices, and after logout/login cycles. Each user has completely isolated data storage.
