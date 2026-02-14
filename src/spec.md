# Specification

## Summary
**Goal:** Prevent wrong-version deployments by making both frontend and backend build versions visible and verifiable, with explicit support for rebuilding and reviewing version 242.

**Planned changes:**
- Add a single build-time configurable frontend version identifier and display it in an always-visible UI location across public and authenticated areas.
- Implement the Deployment Info page to show the frontend version and other locally-available build metadata, and ensure it is reachable via an in-app route.
- Add a backend query method that returns a backend build/version string so the frontend can display backend version alongside frontend version.
- Add an informational warning on the Deployment Info page when the configured frontend build version is not "242".

**User-visible outcome:** Operators and reviewers can immediately see the running frontend version throughout the app, open a Deployment Info page to verify both frontend and backend versions, and receive a clear warning if the build is not version 242.
