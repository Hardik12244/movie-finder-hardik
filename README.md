# CineFolio — Movie Discovery App

Built for Jeevan — Hardik Garg

CineFolio is a fast, focused movie discovery tool built as a Next.js application. It leverages the TMDB API to provide a seamless browsing, searching, and favoriting experience.

## Features

- **Browse Popular Movies:** Navigate through the latest trending movies.
- **Search:** Instant search functionality with debounced inputs.
- **Favorites:** Save movies to your favorites. Favorites persist across sessions via local storage.
- **Manual Pagination:** A highly deliberate "reel counter" style pagination that strictly adheres to the 12-movies-per-page requirement.
- **Responsive Design:** Looks great on mobile, tablet, and desktop screens.
- **Polished UI/UX:** Comprehensive loading states, error states, and micro-interactions.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- TMDB API

## Getting Started

1. Clone the repository.
2. Create a `.env.local` file in the root directory and add your TMDB API Key:
   ```env
   NEXT_PUBLIC_TMDB_API_KEY=YOUR_TMDB_API_KEY_HERE
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
