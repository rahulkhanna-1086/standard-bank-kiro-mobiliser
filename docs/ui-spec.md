# Screen Specifications
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: UI/UX Designer Chapter (Kiro Day Team)

The design follows Standard Bank's enterprise brand aesthetic (Corporate Navy `#0A2240`, Cobalt Blue `#0051FF`, Clean White `#FFFFFF`, and Slate Gray `#64748B`), with strict compliance with the anti-slop visual standards: high contrast, zero arbitrary gradients, single-line badges, and clear visual hierarchy.

---

## Screen 1: Initiative & Role Configurator (Top & Primary Hero Area)
**Purpose:** Facilitator specifies or selects a delivery priority initiative, urgency, duration, and target roles required.

**Layout:**
- Top Header: Standard Bank Brand Shield mark, title "Delivery Squad Mobiliser", and "Preset Scenarios" quick selector bar.
- Initiative Metadata Bar:
  - Urgency selector pill buttons (Immediate <48h, High <1w, Standard).
  - Duration selector pill buttons (2 Weeks Spike, 1 Month Sprint, 3 Months, 6 Months).
  - Allocation commitment slider/stepper (50% to 100%).
- Required Roles Strip: Horizontal card deck of required positions (e.g., 1x Architect, 2x Engineers, 1x QA, 1x Delivery Lead) with current fulfillment counters.
- Global Action Bar: "Auto-Assemble Squad" (primary cobalt button) and "Review Proposed Squad (N/Total)" drawer trigger button.

**Data displayed:**
- Initiative title, business context badge, required roles counter, total skills required count.

**Interactions:**
- Clicking a Scenario card loads preset parameters immediately.
- Clicking an unfilled role card focuses the candidate evaluation matrix on that role.
- Clicking "Auto-Assemble Squad" populates the optimal candidates across all slots.

---

## Screen 2: Candidate Recommendation & Ranking Matrix (Main Content)
**Purpose:** Display scored talent pool candidates ranked from highest to lowest match, with explainable scoring and drill-down.

**Layout:**
- Filter & Search Bar:
  - Search input for candidate name or skill.
  - Discipline filter dropdown (All, Architecture, Engineering, Testing, Data, Delivery).
  - Availability band toggle (All, Available Now, Moderate, Constrained).
  - Location hub filter (All, JHB Rosebank, JHB Simmonds St, Cape Town, Durban, Pretoria).
- Candidate Grid: 2-column or 3-column responsive card grid.
  - Candidate Card:
    - Top header: Name, seniority badge, role title, chapter icon.
    - Match Score Gauge: Big bold score percentage (e.g., 94%) with colored status ring.
    - Capacity & Availability indicator: Available % badge, current project status, handover timeline.
    - Skills match chips: Matched must-have (green), matched nice-to-have (blue), missing skills (slate outline).
    - Expandable "Why Recommended" Accordion:
      - 4-bar deterministic rubric breakdown (Skills 40pts, Capacity 30pts, Role 20pts, Workload 10pts).
      - Verified justifications list.
      - Delivery risk warnings (if capacity is below threshold).
    - Action button: "Assign to Squad" / "Remove from Squad".

**Interactions:**
- Expanding accordion reveals points math without page jump.
- Clicking "Assign" slots the candidate into the selected or best matching open role slot.

---

## Screen 3: Proposed Squad Roster & Gap Analysis Drawer (Slide-Over / Floating Panel)
**Purpose:** Provide real-time squad view, showing who is on the squad, collective skill coverage, and missing gaps.

**Layout:**
- Drawer Header: "Proposed Delivery Squad", overall match average, and close button.
- Squad Fulfillment Progress: Visual bar showing X of Y roles filled.
- Role Slot Cards: Each required role slot showing assigned employee, allocation %, and quick-swap/remove button.
- Collective Skills Matrix:
  - Tags for every skill required by the project.
  - Covered skills display green checkmark and avatar of the squad member providing it.
  - Uncovered skills display amber warning tag.
- Drawer Footer: "Clear Squad" outline button and "Generate Governance Brief" primary button.

---

## Screen 4: Executive Governance Brief Modal
**Purpose:** Review and copy an executive mobilization summary for delivery governance approval.

**Layout:**
- Modal Header: Standard Bank governance stamp, title "Executive Squad Mobilisation Brief", and export actions.
- Brief Content View:
  - Executive Overview: Initiative description, timeline, and urgency.
  - Squad Composition Table: Member name, role, chapter, allocated capacity %, and key competencies.
  - Match Justifications: Clear bullet points explaining why each person was selected.
  - Risk Mitigation & Handover Plan: Action items for any overallocation or sprint completion handovers.
- Footer Actions:
  - "Copy to Clipboard (Markdown)" button with copied confirmation toast.
  - "Close" button.
