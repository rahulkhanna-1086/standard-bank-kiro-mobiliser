# API Specification
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: API Designer Chapter (Kiro Day Team)

The application provides a modular client-side & proxy-ready contract defining endpoints for squad evaluation, scoring, and governance brief generation.

---

## POST /api/evaluate-candidates
Scores all candidates in the talent pool against a specific delivery role requirement using the deterministic 100-point rubric.

**Request body:**
- roleRequirement (object, required) — Role specification
  - discipline (string, required) — "Architecture" | "Engineering" | "Testing" | "Data" | "Delivery"
  - targetSeniority (string, required) — "Junior" | "Intermediate" | "Senior" | "Lead" | "Principal"
  - requiredSkills (array of string, required) — Must-have skill tags
  - niceToHaveSkills (array of string, optional) — Secondary skill tags
- deliveryContext (object, required) — Project urgency and allocation
  - urgency (string, required) — "Immediate (<48h)" | "High (<1w)" | "Standard"
  - allocationRequired (number, required) — Percentage required (e.g., 80)
  - duration (string, required) — Expected engagement duration

**Success response (200 OK):**
- candidates (array) — Scored candidate records
  - candidateId (string) — Employee ID
  - totalScore (number) — 0 to 100
  - breakdown (object) — { skillsScore, capacityScore, seniorityScore, bufferScore }
  - matchedSkills (array) — Matched must-have & nice-to-have skill names
  - missingSkills (array) — Unmatched required skills
  - risks (array of string) — Capacity or handover warnings

**Error responses:**
- 400 Bad Request — Missing role requirement or invalid discipline
- 422 Unprocessable Entity — Invalid allocation percentage (< 10 or > 100)

---

## POST /api/squad/auto-assemble
Optimally selects candidates for all unfilled roles in an active delivery request using bipartite best-fit matching.

**Request body:**
- deliveryRequest (object, required) — Full initiative specification including all needed roles
- currentSquad (array of object, optional) — Already locked-in squad assignments

**Success response (200 OK):**
- proposedSquad (array) — Selected candidate allocations
  - slotId (string) — Target role slot
  - employee (object) — Candidate details and assigned role
  - matchScore (number) — Calculated score
- collectiveMetrics (object)
  - overallMatchAverage (number) — Squad average percentage
  - collectiveSkillsCovered (array of string) — All covered skills
  - missingSkillGaps (array of string) — Critical missing competencies
  - headcountFulfilled (string) — e.g. "5/5"

---

## GET /api/scenarios
Retrieves predefined Standard Bank initiative scenarios for rapid setup.

**Success response (200 OK):**
- scenarios (array of object)
  - id (string) — Scenario ID
  - title (string) — Name of initiative
  - description (string) — Business background and goals
  - urgency (string) — Urgency level
  - duration (string) — Project duration
  - allocationRequired (number) — Required commitment percentage
  - rolesNeeded (array of object) — Required positions with skills

---

## POST /api/governance/generate-brief
Generates an executive-level squad mobilization and governance summary.

**Request body:**
- deliveryRequest (object, required) — Initiative details
- squad (array of object, required) — Squad roster with candidate assignments
- author (string, optional) — Facilitator name or squad lead

**Success response (200 OK):**
- briefId (string) — Unique brief reference (e.g., "SB-MOB-2026-09-01")
- title (string) — Executive brief title
- generatedAt (string) — ISO timestamp
- markdownContent (string) — Formatted Markdown summary ready for clipboard/email
- summaryStats (object) — Total headcount, average allocation, skills covered %
