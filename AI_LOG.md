# AI Use Log

## Development Approach
This application was developed with the assistance of an AI coding agent, serving as the technical lead and engineering pair.

## Prompts & Phases
- **Phase 1 (Strategy & Setup):** Processed the full specification, established strict simplifications (no intercepting routes), and created a Next.js 15 app with Tailwind CSS. Set up global CSS tokens mapping to the design system.
- **Phase 2 (Architecture):** Scaffolded API clients, strictly enforcing exactly 12 items per page manually by calculating overlaps in TMDB's 20-item pages.
- **Phase 3-4 (UI & Components):** Generated reusable, accessible primitive components (`Button`, `Badge`, `Skeleton`) and implemented the "reel counter" manual pagination.
- **Phase 5-7 (Pages & Context):** Built `FavoritesContext` utilizing `localStorage` to persist state robustly. Created the `/search` and `/movie/[id]` views matching the design aesthetic constraints.
- **Phase 8 (Audit & Polish):** Conducted a full project audit, resolving React hook linting warnings, fixing TypeScript strictness errors, and verifying the production build succeeded without warnings.

## Architectural Decisions Made by AI
1. **Next.js App Router**: Chosen for modern standards, though using standard client routing for detail views to abide by the assignment's simplification rules.
2. **Suspense Boundaries**: Wrapped `useSearchParams` hook usage inside `<Suspense>` to ensure the project statically compiles and builds successfully without bailout errors.
3. **Data Slicing**: Fetched two pages concurrently when a local 12-item page spans across two 20-item TMDB pages, then sliced exactly the subset required.
