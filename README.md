# CineFolio: Movie Discovery Platform

CineFolio is a premium, consumer-grade movie discovery platform built with Next.js 15, React 19, and Tailwind CSS. Originally an internship assignment, the project has been fully transformed into an immersive cinematic experience heavily inspired by platforms like Netflix and Letterboxd.

## Features

- **Immersive Discovery:** Discover movies through interactive carousels (Trending, Top Rated) and Genre filtering directly on the homepage.
- **Deep Cinematic UI:** Features parallax hero sections, dynamic glassmorphism metadata cards, and `framer-motion` staggered grid animations.
- **Flawless Search & History:** Lightning-fast, debounced search that auto-syncs with the URL to support native browser navigation. Features LocalStorage gamification with "Recent Searches" and `/` keyboard shortcuts.
- **Personalized Analytics:** The Favorites page acts as a local analytics dashboard, computing your Average Rating, Top Genre, and Total Saved movies on the client side without needing a backend.
- **Endless Exploration:** The Movie Details page features detailed TMDB metrics (Budget, Revenue, Production Studios) and provides "Similar Movies" and "Because You Liked This" recommendations to prevent dead-ends.
- **Smart Continuity:** A "Recently Viewed" engine caches your history locally, creating seamless transition states between pages.

## Architecture & Technical Decisions

- **Framework:** Next.js 15 (App Router)
- **Styling:** Vanilla Tailwind CSS with custom CSS variables for effortless dark-mode UI tokens.
- **State Management:** React Context API for global state (Favorites) with robust client-side `localStorage` hydration to prevent SSR mismatches.
- **Data Fetching:** Parallelized Server Components fetching from the TMDB API to eliminate client-side waterfalls. Custom caching and deduplication where necessary.
- **Animations:** Framer Motion for complex staggered entrance animations, layout ID morphing (Genre chips), and parallax scroll bindings.
- **Search Logic:** Decoupled the URL syncing from the local controlled input state using `lastPushedQuery` refs to guarantee zero flickering or race conditions during rapid typing.

## TMDB Pagination

The application implements a custom pagination adapter. TMDB endpoints natively return 20 results per page. However, the assignment demands strictly 12 movies per page. To satisfy this requirement, the `getMergedAppPage` function transparently intercepts App Pages and maps them across the bounds of TMDB Pages, firing parallel requests when a 12-item slice spans across two different TMDB pages.

## AI Usage

This application was heavily refined and built using Advanced Agentic Coding methodologies.
For a detailed architectural breakdown of the AI's product decisions and bug fixes, please read `AI_LOG.md`.

## Installation & Running Locally

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env.local` file and add your TMDB API Key:
   `NEXT_PUBLIC_TMDB_API_KEY=your_key_here`
4. Run `npm run dev` to start the development server on `localhost:3000`.

## Production Readiness

This project passes all Next.js 15 strict linting (`react-hooks/exhaustive-deps`, `react-hooks/set-state-in-effect`) and builds cleanly with Turbopack optimizations. It is fully responsive across mobile, tablet, and desktop viewports, with robust touch-target support for horizontal carousels.
