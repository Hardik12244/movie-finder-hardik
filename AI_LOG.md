# CineFolio AI Engineering Log

## Product Transformation Journey
**Date:** June 20, 2026
**Shift:** From "Movie Browser" to "Movie Discovery Platform"

### Architectural Decisions

1. **Discovery Platform Transition**
   * **Challenge:** The initial application was a standard assignment implementation (a simple paginated grid). It lacked retention mechanics.
   * **Solution:** Overhauled the homepage into multiple horizontal discovery rows using `framer-motion` for snapping carousels (`Trending This Week`, `Top Rated Movies`).
   * **Tradeoff:** Added more API endpoints and layout complexity, but the massive UX improvement justifies the minimal overhead.

2. **Search Loop Remediation**
   * **Challenge:** Next.js asynchronous `router.push` and App Router's soft navigation caused an infinite loop between Desktop and Mobile `SearchBar` components via the shared `useSearchParams`.
   * **Solution:** Decoupled the push effect from `searchParams`. Pushes are now *exclusively* driven by the `debouncedQuery` changing, and we verify `debouncedQuery !== lastPushedQuery.current` before pushing. 

3. **Client/Server Component Strategy for Favorites**
   * **Challenge:** The Favorites page needed "Trending Alternatives" for empty states, but the page was a "use client" component due to Context usage.
   * **Solution:** Converted `app/favorites/page.tsx` back to a Server Component to fetch TMDB data securely, and pushed the Context/Storage logic down into a new `FavoritesClient.tsx` child component.

### Product Decisions

1. **Search Gamification**
   * Added `localStorage` tracking for recent searches to reduce friction.
   * Added a `/` global keyboard shortcut to auto-focus the search bar, a staple of premium SaaS products.

2. **Continuity & Retention**
   * Created a `RecentlyViewedTracker` that caches the last 10 visited movies locally.
   * Displayed the "Recently Viewed" carousel on the homepage to create immediate continuity when users return to the app.
   * Solved the "dead end" problem on the Detail page by fetching and rendering `Similar Movies` and `Because You Liked This` (Recommendations).

3. **Analytics Gamification**
   * Upgraded the Favorites section from a simple grid into an analytics dashboard computing "Average Rating", "Favorite Genre", and "Movies Saved" purely on the client side. 

### Manual Fixes
* **Linting Hooks:** Strictly silenced `react-hooks/set-state-in-effect` during hydration steps in custom hooks where synchronous setting is required to map `localStorage` to state during initial mount.
* **HTML Validation:** Fixed an unclosed `</div>` tag that was converted to a `<form>` without its corresponding closing tag in `SearchBar.tsx`.

## Final Tech Stack
* Next.js 15 (App Router)
* TypeScript
* Tailwind CSS (Vanilla utilities, no components library)
* Framer Motion (Micro-interactions and carousels)
* Lucide React (Icons)
* TMDB API
