# Specification

## Summary
**Goal:** Make the Blog page (/blog) show 15 static Problem → Solution finance blog entries, and replace the site favicon with the provided SVG.

**Planned changes:**
- Update the existing `/blog` route to render exactly 15 on-page static blog entries in a list/grid, each with clearly labeled “Problem:” and “Solution:” lines.
- Remove/avoid any blog fetching logic, loading states, preview queries/mutations, or automatic default-content initialization for the Blog page.
- Add the provided SVG file to `frontend/public/favicon.svg` and update `frontend/index.html` to reference it via `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`.

**User-visible outcome:** Users (including unauthenticated visitors) can visit `/blog` to read 15 brief Problem/Solution finance entries instantly (no loading/fetching), and the browser tab displays the new SVG favicon (where supported).
