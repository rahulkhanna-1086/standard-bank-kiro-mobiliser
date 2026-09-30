# Squad Mobiliser

React and TypeScript hackathon prototype for assembling delivery squads from a sample talent pool.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. The optional Express backend uses GEMINI_API_KEY from a local .env file; without a key it uses the included heuristic analyzer.

## Public demo build

```sh
npm run lint
npm run build
npm run preview
```

The production build sets VITE_DEMO_MODE=true and runs the existing heuristic analyzer in the browser. No Gemini key or backend is needed. To build for the Express/Gemini backend, override VITE_DEMO_MODE=false at build time.

The talent pool is prototype fixture data. Squad proposals do not reserve staff or connect to HR systems. Kiro and architecture documents describe proposed capabilities, not proof they are implemented.

Public demo identities use numbered candidate labels and example.com addresses.

