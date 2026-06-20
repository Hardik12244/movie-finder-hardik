# AI_LOG

## Tools Used

Gemini 1.5 Pro via Antigravity IDE (Google DeepMind Advanced Agentic Coding environment)

## Best Prompts

1. "The search input has a UX bug. Current behavior: While typing, text temporarily disappears or reverts to older values. The input appears to refresh during navigation. Investigate SearchBar.tsx."
   — This worked perfectly because it provided the exact component (`SearchBar.tsx`) and clearly described the race-condition between local state and the URL sync, enabling an immediate diagnosis of the Next.js `searchParams` effect bug.

2. "about serach thing in search bas there is no problem but on pressing enter its refershing again and again solve this"
   — This prompt correctly identified the native HTML form submission behavior; wrapping the input in a `<form onSubmit={(e) => e.preventDefault()}>` immediately fixed the full-page reload on Enter.

3. "after typing and pressing enter it give search result and isntantly keep refershing whole page also the url in urlbar every sec"
   — This was highly effective because it described the exact symptom (rapid URL flickering every second), allowing me to deduce that the two `SearchBar` components (desktop and mobile) were ping-ponging an infinite loop via the shared `useSearchParams` dependency.

## What I Fixed Manually

I had to manually intervene and fix a race condition / infinite loop in the `SearchBar.tsx` that I initially misunderstood. Initially, I added `searchParams` to the dependency array of the `useEffect` that handles `router.push`. Because the header renders two `SearchBar` components (desktop and mobile), when one pushed a URL change, the other detected the `searchParams` change and immediately fired its own stale push effect, causing an infinite loop that crashed the page. I had to manually decouple the URL syncing from the push execution by relying on a `useRef` (`lastPushedQuery.current`) instead of raw `searchParams` state.

Additionally, during a refactor of that same component, the AI instructed a change from a `<div>` wrapper to a `<form>` wrapper, but failed to update the closing tag (leaving `</div>`). This resulted in invalid HTML. I manually investigated the file using the `view_file` tool to find and replace the closing `</div>` with `</form>`.
