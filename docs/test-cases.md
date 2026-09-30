# Test Cases
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: Test Architect Chapter (Kiro Day Team)

## TC-001: Preset Initiative Template Selection
- GIVEN a delivery facilitator is on the Initiative Configurator
- WHEN they select the "PayPulse Real-Time Clearing Modernisation" scenario
- THEN the system populates the title, "Immediate (<48h)" urgency, "2 Weeks" duration, and 85% allocation
- AND populates required roles: 1x Lead Cloud Architect, 2x Senior Java/Kafka Engineer, 1x SDET Automation Specialist, 1x Technical Delivery Manager
- AND all required skills (AWS, Kafka, ISO 20022, Java Spring Boot, Playwright) are tagged as must-have

## TC-002: Deterministic 100-Point Rubric Calculation
- GIVEN a candidate "Demo Candidate 01" with 100% must-have skills match, 85% available capacity, and exact role seniority
- WHEN the matching engine evaluates compatibility against the Lead Cloud Architect role
- THEN the system awards 40/40 for Skill Alignment
- AND awards 30/30 for Availability & Capacity Band
- AND awards 20/20 for Role & Seniority Fit
- AND awards 10/10 for Workload Buffer
- AND the final computed match score equals 100%

## TC-003: Urgent Delivery Low Capacity Penalty
- GIVEN an initiative with urgency "Immediate (<48h)" requiring 80% allocation
- WHEN a candidate with available capacity of 20% is scored
- THEN the system penalises the Availability & Capacity score by at least 15 points
- AND flags an explicit risk notice: "Capacity Deficit: Overallocated on current work"

## TC-004: Explainable Recommendation Transparency
- GIVEN any evaluated candidate card
- WHEN the user clicks "Why Recommended" accordion
- THEN the component expands to reveal points awarded across all 4 deterministic pillars
- AND lists verified matched skills with proficiency badges
- AND details delivery risk flags or confirms "No delivery risks flagged"

## TC-005: Auto-Assemble Squad Optimization
- GIVEN a delivery request requiring 5 roles across Architecture, Engineering, Testing, and Delivery
- WHEN the facilitator clicks "Auto-Assemble Squad"
- THEN the system selects the highest-scoring candidate for each unfilled position without assigning the same employee twice
- AND the proposed squad drawer opens displaying 5/5 roles filled
- AND the collective skill coverage indicator shows >=90%

## TC-006: Collective Skill Gap Identification
- GIVEN a squad has been assembled missing an expert in "ISO 20022"
- WHEN the squad coverage analysis executes
- THEN the system marks "ISO 20022" as an uncovered skill gap
- AND highlights the gap with an amber warning badge in the squad analysis summary

## TC-007: Manual Candidate Replacement in Squad
- GIVEN an assembled squad with employee A assigned to the Engineering slot
- WHEN the facilitator removes employee A and assigns employee B
- THEN employee A is released back to available status
- AND employee B is locked in the Engineering slot
- AND collective squad capacity and skills recalculate immediately

## TC-008: Governance Brief Generation & Clipboard Copy
- GIVEN a fully or partially assembled squad
- WHEN the facilitator clicks "Review Governance Brief"
- THEN a formatted executive modal displays the initiative overview, squad roster, allocation impact, and risk mitigation plan
- AND clicking "Copy Brief (Markdown)" copies the clean text to the clipboard and triggers a confirmation toast

## TC-009: Talent Pool Discipline & Location Filter
- GIVEN the mock talent pool of 30 employees
- WHEN the user selects "Cape Town" in the location filter and "Testing" in the discipline filter
- THEN only QA/SDET specialists based in Cape Town are displayed in the candidate grid
- AND candidates maintain their dynamic match scores against the current active role requirement

## TC-010: Zero PII and Synthetic Mock Data Verification
- GIVEN all employee records in the talent pool
- WHEN verifying user identifiers, emails, and contact records
- THEN all domains use `@example.com` mock aliases with fictitious names
- AND no external live directory APIs or private employee databases are queried
