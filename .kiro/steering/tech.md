# Tech Steering
# Reference: #[[file:docs/architecture.md]]

## Technology Stack
- **Language**: TypeScript (strict mode enabled)
- **Frontend Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS with custom Standard Bank enterprise palette (`#0A2240` primary, `#0051FF` cobalt)
- **Icons**: `lucide-react`
- **State Management**: React state + memoized deterministic calculations
- **Testing**: Vitest + Playwright (configured for unit & integration testing)

## Performance Budgets
- Matching engine calculation: < 15ms across 30+ candidates
- UI reaction to filter changes: instantaneous (< 16ms, 60fps)
- Zero external network dependencies for mock data evaluation
