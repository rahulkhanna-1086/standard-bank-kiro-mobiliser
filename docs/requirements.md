# Requirements (EARS Format)
# Initiative: Delivery Squad Mobiliser
# Author: Business Analyst Chapter (Kiro Day Team)

## 1. Initiative & Role Needs Capture

- REQ-001: The system shall provide predefined initiative templates for key Enterprise delivery priorities (PayPulse Real-Time Clearing Modernisation, Basel IV Regulatory Risk Spike, and SME Instant Credit Assessment).
- REQ-002: When a delivery facilitator selects an initiative template, the system shall prefill the delivery urgency, duration, allocation commitment, and target roles with their respective must-have and nice-to-have skill requirements.
- REQ-003: When a delivery facilitator customises role requirements, the system shall allow adding, removing, and adjusting roles across the five core disciplines: Architecture, Engineering, Testing, Data, and Delivery.
- REQ-004: When an initiative urgency is set to "Immediate (<48h)", the system shall prioritise candidates with high available capacity (>=75%) and penalise candidates with active handover friction.

## 2. Deterministic Matching & Scoring Engine

- REQ-005: The system shall calculate candidate compatibility using a transparent 100-point deterministic rubric: Skill Alignment (40 pts), Availability & Capacity Band (30 pts), Role & Seniority Fit (20 pts), and Workload Buffer (10 pts).
- REQ-006: Where a candidate possesses a required must-have skill at Expert proficiency, the system shall award the full maximum skill weight for that skill item.
- REQ-007: If a candidate has an available capacity percentage below the requested commitment, then the system shall flag a "Capacity Deficit" risk warning on the candidate's profile.
- REQ-008: While a delivery request is active, the system shall display an explainable breakdown ("Why Recommended") for each candidate showing exact point breakdowns, matched skills, and potential delivery risks.
- REQ-009: The system shall never employ opaque probabilistic generative weights or black-box non-deterministic scoring to rank employees.

## 3. Talent Pool Exploration & Filtering

- REQ-010: The system shall display mock employee profiles from the internal business unit pool including name, role title, chapter discipline, location hub, allocation percentage, and verified competencies.
- REQ-011: When a user filters the talent pool by discipline, location, or search keyword, the system shall instantly filter candidate cards while preserving match scores.
- REQ-012: The system shall strictly maintain 100% synthetic mock employee profiles to safeguard privacy and comply with POPIA regulations.

## 4. Squad Assembly & Collective Coverage

- REQ-013: When a user clicks "Auto-Assemble Squad", the system shall assign the highest-scoring candidate for each unfilled role requirement.
- REQ-014: While squad members are selected, the system shall dynamically compute collective skill coverage across all required skills and display unfulfilled skill gaps.
- REQ-015: When a user manually adds or removes a candidate from the proposed squad, the system shall update discipline headcount fulfillment and slot status in real time.

## 5. Executive Governance & Handover Export

- REQ-016: When a user requests "Generate Governance Brief", the system shall produce a structured proposal containing executive summary, member rosters, capacity impact, match justifications, and risk mitigations.
- REQ-017: The system shall allow the delivery facilitator to copy the governance brief to clipboard in standard Markdown format and view print-friendly styling.
