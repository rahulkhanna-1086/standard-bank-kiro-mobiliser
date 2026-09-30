# Kiro Hook: Test on Create / Modify
Trigger: onFileCreateOrModify
FileMatch: "src/utils/**/*.ts"

## Action
Run Vitest on unit test suites:
```bash
npm run test:unit --silent
```

## Objective
Ensure the deterministic matching engine outputs strictly 100 points maximum and adheres to scoring weights.
