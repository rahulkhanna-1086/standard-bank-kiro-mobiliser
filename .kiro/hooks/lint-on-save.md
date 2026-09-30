# Kiro Hook: Lint on Save
Trigger: onFileSave
FileMatch: "**/*.{ts,tsx}"

## Action
Run project TypeScript strict type-check:
```bash
npm run lint
```

## Failure Policy
Block automated build if type errors or missing imports are detected.
