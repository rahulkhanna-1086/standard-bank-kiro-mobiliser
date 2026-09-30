# Coding Conventions & Anti-Slop Guidelines

## Engineering Rules
1. **Strict Type Safety**: All props, domain models, and calculation outputs must be explicitly typed. No `any` types.
2. **Deterministic Functions**: `calculateCandidateScore` must remain pure with zero side-effects or external network mutations.
3. **Anti-Slop Design Principles**:
   - Zero arbitrary purple-to-blue gradients.
   - Clean, high-contrast typography using Tailwind slate and standard navy palette.
   - Every metric card must feature explicit semantic units (e.g. `% match`, `pts`, `hrs`).
   - Single-line chips and badges without awkward line wrapping.
   - Distinctive container padding math with balanced whitespace.
4. **Accessibility**: Minimum contrast ratio of 4.5:1 for body copy. Unique HTML IDs for interactive triggers.
