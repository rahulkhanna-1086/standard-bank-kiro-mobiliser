# Kiro Spec: Technical Design
# Reference: #[[file:docs/architecture.md]]

## Component Hierarchy
```
App
├── Header (Standard Bank brand, title, Kiro Day Spec Pack modal trigger)
├── InitiativeConfigurator (Scenario presets, urgency, required roles deck)
├── CandidateEvaluationSection
│   ├── FilterToolbar (Search, Discipline, Location, Availability)
│   └── CandidateGrid
│       └── CandidateCard (Score gauge, skills chips, Why Recommended accordion)
├── ProposedSquadDrawer (Roster slots, collective coverage matrix, brief trigger)
├── GovernanceBriefModal (Executive summary, markdown clipboard export)
└── KiroSpecPackModal (Playbook docs viewer: BA, Test, API, UI, Architecture, Steering)
```

## State Architecture
- `selectedScenario`: active initiative template.
- `deliveryRequest`: current customized delivery parameters and needed roles.
- `activeRoleIndex`: selected role slot currently driving candidate rankings.
- `proposedSquad`: array of `{ slotId, employee, scoreResult }`.
- `filterState`: `{ search, discipline, location, availabilityBand }`.
- `drawerOpen`: boolean.
- `briefModalOpen`: boolean.
- `specPackModalOpen`: boolean.
