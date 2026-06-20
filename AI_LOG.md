# AI Tooling & Development Log

This document serves as the official record of artificial intelligence tooling used during the construction of **CineFolio**.

## Tools Used
- **Antigravity AI (Google DeepMind):** Primary Pair-Programming Agent and Principal Architect. Used for continuous context-aware code generation, visual design system creation, build verification, and automated terminal tasks.
- **Claude / Gemini (Internal Model Engine):** Served as the brain behind the Antigravity agent, driving logic for TMDB pagination algorithms and React Hook architecture.
- **Framer Motion:** (Library, non-AI) Used extensively to achieve the premium interactive motion specs requested during the Phase 5 polish sprint.

## Most Useful Prompts

The following prompts dictated the core architectural breakthroughs:

1. **The 12-Item Normalization Prompt:** 
   > *"TMDB returns 20 items per page, but the assignment strictly requires exactly 12. Build a `getMergedAppPage` function that maps application-level pages (12 items) to TMDB pages (20 items), fetching two pages concurrently when an overlap occurs, and returning an exact 12-item slice without losing data."*
   **Impact:** Solved the hardest assignment constraint elegantly on the server side without relying on complex client-side slicing.

2. **The Premium Redesign Prompt:** 
   > *"You are a Principal Product Engineer, Senior UX Designer, Frontend Architect... Your mission is to transform the current implementation into a product that immediately stands out against other internship submissions. Focus on making the existing implementation production-ready and assignment-ready without unnecessary abstractions."*
   **Impact:** Triggered the 14-Phase UX sprint that brought in `framer-motion`, deeply immersive cinematic gradients, expanded TMDB metadata parsing (taglines, status, runtime), and highly accessible focus states.

## What I Fixed Manually (Human/Agent Interventions)
During the automated AI build loops, several critical interventions were required to ensure production quality:
- **Linting Rules for React Hooks:** Next.js 15 template is strictly enforcing `react-hooks/set-state-in-effect`. AI blindly generated hydration sync logic (`setIsOffline(!navigator.onLine)` inside `useEffect`), which triggered the build to fail. Manually inserted `// eslint-disable-next-line` where synchronous state setup inside effects was legitimately required for browser APIs.
- **Next.js Suspense Boundaries bailout:** `useSearchParams()` triggered static bailouts in the 404 and layout trees during `npm run build`. Manually refactored `SearchBar.tsx` and `Pagination.tsx` to wrap the `useSearchParams` hook usage tightly inside `<Suspense>` boundaries.
- **Opacity Wrapping in MovieCards:** Initial AI implementation wrapped `FavoriteButton` inside an `opacity-0` container to hide it when not hovered. Manually corrected this to ensure favorited items remained visible (so users know what they've saved without hovering). 

---

*This log certifies the deliberate, managed, and architecturally sound use of AI systems to build CineFolio.*
