# Kiro Spec: Squad Mobiliser Requirements
# Reference: #[[file:docs/requirements.md]]

## 1. Initiative Setup & Urgency Configuration
- Support 3 high-impact preset scenarios (PayPulse Modernisation, Basel IV Risk Spike, SME Instant Credit).
- Enable adjusting urgency (Immediate <48h, High <1w, Standard), duration (2w, 1m, 3m, 6m), and allocation percentage (50-100%).
- Dynamically render required role slots across Architecture, Engineering, Testing, Data, and Delivery.

## 2. Deterministic 100-Point Scoring Engine
- Evaluate Skill Alignment (0-40 pts), Availability & Capacity Band (0-30 pts), Role & Seniority Fit (0-20 pts), and Workload Headroom Buffer (0-10 pts).
- Compute matched must-have skills, nice-to-have skills, and missing skills.
- Flag delivery risks for capacity deficit or delayed handover during immediate urgency.

## 3. Talent Pool & Search Interface
- Display 30 synthetic mock employees with real-time score ranking.
- Provide faceted filtering by Chapter/Discipline, Availability Status, Location, and text search.
- Provide collapsible "Why Recommended" transparency cards showing point breakdowns.

## 4. Squad Assembly & Roster Drawer
- Support one-click "Auto-Assemble Squad" solving for highest score per open slot.
- Real-time collective skills coverage gauge and missing skills gap warning.
- Manual assign/replace/remove actions for fine-grained facilitator tuning.

## 5. Governance Brief Generation
- Render executive summary brief with Markdown export to clipboard.
- Include candidate justifications, allocation impact, and handover mitigation.
