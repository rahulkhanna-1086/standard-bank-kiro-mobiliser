# Project Structure Steering

## Directory Organisation
```
docs/
├── requirements.md      # EARS-format requirements (BA)
├── test-cases.md        # Acceptance criteria (Test Architect)
├── api-spec.md          # Endpoint specifications (API Designer)
├── ui-spec.md           # Screen specifications (UI/UX Designer)
└── architecture.md      # System design + data model (Architect)

.kiro/
├── steering/
│   ├── product.md       # Product vision and core constraints
│   ├── tech.md          # Tech stack & performance criteria
│   ├── structure.md     # Directory conventions & layout
│   └── conventions.md   # Coding rules & patterns
├── specs/
│   └── squad-mobiliser/
│       ├── requirements.md
│       ├── design.md
│       └── tasks.md
└── hooks/
    ├── lint-on-save.md
    └── test-on-create.md

src/
├── components/          # Reusable UI components
│   ├── InitiativeConfigurator.tsx
│   ├── CandidateCard.tsx
│   ├── ProposedSquadDrawer.tsx
│   ├── GovernanceBriefModal.tsx
│   └── KiroSpecPackModal.tsx
├── data/
│   ├── talentPool.ts    # 30 Synthetic employee profiles
│   └── scenarios.ts     # Enterprise delivery initiatives
├── utils/
│   └── matchingEngine.ts# Deterministic 100-pt rubric
├── types.ts             # Domain models & TypeScript interfaces
├── App.tsx              # Main orchestrator view
└── main.tsx             # React DOM entrypoint
```
