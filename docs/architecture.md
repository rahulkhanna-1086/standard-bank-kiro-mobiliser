# Technical Architecture & System Specification Document
**Initiative:** Delivery Squad Mobiliser  
**Role:** Senior Solution Architect (Kiro Day Experience)  
**Author:** Rahul Khanna (Solution Architect)  
**Target Event:** Enterprise Kiro Day — Global Leadership Centre (GLC)  
**Classification:** Enterprise Internal Hackathon — 100% POPIA Compliant Mock Architecture  
**Document Version:** 2.0 (Production-Grade Architecture Specification)

---

## 1. Executive Summary & Problem Context

In modern financial institutions like Enterprise, the mobilization of rapid-response cross-functional delivery squads (for high-severity production incidents, regulatory mandates, or digital modernisations like PayPulse) takes **between 2 to 4 weeks** across siloed business units, resulting in delayed time-to-market and high operational cost.

The **Delivery Squad Mobiliser** is a real-time, deterministic squad mobilization platform that matches organizational demand with internal talent in **under 60 seconds**. Built using the **AWS Kiro** specification-driven development harness, this solution operates on synthetic employee records, strictly air-gapped from live core banking infrastructure.

---

## 2. Solution Architect’s Strategic Vision for AWS Kiro

As the Solution Architect, the role is to establish the **conceptual model, system boundaries, data contracts, and algorithmic constraints** so the **Harness Engineer** and **AWS Kiro** can generate reliable, high-integrity code without drift or hallucinations.

### 2.1 The AWS Kiro Development Paradigm
AWS Kiro operates as a harness-driven AI engineering system. Kiro succeeds when specifications are:
1. **Deterministic & Testable:** Rules and algorithms must be mathematically specified, not vaguely described.
2. **Contract-First:** Data schemas (TypeScript interfaces) and API contracts must be defined before code generation.
3. **Structured via Kiro Steering:** Kiro inspects the `.kiro/` directory:
   - `.kiro/steering/tech.md`: Declares the runtime stack, libraries, and port constraints (`3011` server, `5193` client).
   - `.kiro/steering/structure.md`: Enforces folder layouts and separation of concerns.
   - `.kiro/steering/conventions.md`: Enforces coding standards (zero inline styles, typed error handling, no any types).
   - `.kiro/specs/`: Contains requirements, architectural design, and test criteria.

### 2.2 Squad Collaboration Model (Morning vs Afternoon)
- **Morning Design Session (09:00 - 12:00)**:
  - **Business Analyst (BA):** Defines business problems (e.g. *PayPulse Modernisation*, *Instant Fraud Engine*), urgency tiers, and acceptance criteria in `requirements.md`.
  - **Solution Architect (Rahul Khanna):** Translates requirements into C4 architectural models, data contracts, mathematical scoring formulas, and architectural decision records (ADRs) in `architecture.md`.
  - **Test Architect (QA):** Writes test cases, edge cases, and compliance checks in `test-cases.md`.
- **Afternoon Build & Showcase Session (13:00 - 16:30)**:
  - **Harness Engineer:** Injects the approved `.kiro/` steering and spec files into AWS Kiro.
  - **Solution Architect:** Reviews generated code against the architectural blueprint, verifies non-functional requirements (performance, accessibility, security), and leads the technical presentation during the Executive Showcase.

---

## 3. Architecture Blueprint (C4 Model)

### 3.1 C4 Level 1: System Context Diagram
```
+-------------------------------------------------------------------------------+
|                             SQUAD MOBILISER ENTERPRISE                          |
|                                                                               |
|   +-----------------------+              +--------------------------------+   |
|   | Delivery Lead / PMO   |              | System Architect / Governance  |   |
|   +-----------------------+              +--------------------------------+   |
|               \                                      /                        |
|                \   Configures Initiative            / Reviews Audit Log       |
|                 v                                  v                          |
|         +---------------------------------------------------+                 |
|         |        DELIVERY SQUAD MOBILISER (AWS KIRO)        |                 |
|         |  - Matches talent against demand in < 60s         |                 |
|         |  - 100% Deterministic 100-Point Scoring Engine   |                 |
|         |  - Air-gapped synthetic talent pool (POPIA safe)  |                 |
|         +---------------------------------------------------+                 |
|                                   |                                           |
|                     Exports Squad Governance Brief                            |
|                                   v                                           |
|                     +---------------------------+                             |
|                     | Executive Leadership Team |                             |
|                     | (GLC Showcase Committee)  |                             |
|                     +---------------------------+                             |
+-------------------------------------------------------------------------------+
```

### 3.2 C4 Level 2: Container Diagram
The architecture is structured as a full-stack TypeScript monorepo (`thandog/node-conf-starter` compatible):

```
+-------------------------------------------------------------------------------+
|                       DELIVERY SQUAD MOBILISER WORKSPACE                      |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   | FRONTEND WEB CONTAINER (Vite + React 18 + Tailwind CSS)               |   |
|   | Port: 5193 (Local / Dev) | Port: 3000 (Cloud Run Preview)             |   |
|   |                                                                       |   |
|   |   [ Initiative Configurator ]    [ Candidate Matrix / Filter Bar ]    |   |
|   |   [ Proposed Squad Drawer ]      [ Collective Skill Graph ]           |   |
|   |   [ Governance Brief Modal ]     [ Transparent Score Breakdown Modal ]|   |
|   |                                                                       |   |
|   |   State Management: React Hooks + Deterministic Client Evaluation     |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|                                HTTP / JSON REST                               |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   | BACKEND API CONTAINER (Node.js + Express + TypeScript)                |   |
|   | Port: 3011 (Local / Dev)                                              |   |
|   |                                                                       |   |
|   |   [ Routes: /api/candidates, /api/initiatives, /api/squads ]          |   |
|   |   [ Squad Assembly Engine (Greedy Bipartite Matcher) ]                |   |
|   |   [ Governance Audit Logger & Export Service ]                        |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|                                In-Memory / SQLite                             |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   | SYNTHETIC DATA STORE                                                  |   |
|   |   30 Curated POPIA-Compliant South African Talent Profiles            |   |
|   |   Preconfigured Bank Modernisation Scenarios                          |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

### 3.3 C4 Level 3: Component Diagram (Core Application Engine)
```
+-------------------------------------------------------------------------------+
|                            APPLICATION CORE ENGINE                            |
|                                                                               |
|   +-----------------------------------------------------------------------+   |
|   | 1. DETERMINISTIC SCORING ENGINE (evaluateCandidateScore)             |   |
|   |    Pillar 1: Skill Alignment (40 pts max)                             |   |
|   |    Pillar 2: Availability & Capacity Band (30 pts max)                |   |
|   |    Pillar 3: Role & Seniority Fit (20 pts max)                        |   |
|   |    Pillar 4: Workload Headroom Buffer (10 pts max)                    |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   | 2. AUTO-ASSEMBLE OPTIMIZER (Bipartite Greedy Matching)                |   |
|   |    - Iterates over required squad slots in priority order             |   |
|   |    - Selects highest-scoring unassigned candidate                     |   |
|   |    - Enforces capacity constraints and role exclusivity               |   |
|   +-----------------------------------------------------------------------+   |
|                                       |                                       |
|                                       v                                       |
|   +-----------------------------------------------------------------------+   |
|   | 3. COLLECTIVE SQUAD COVERAGE ANALYZER                                 |   |
|   |    - Aggregates squad-wide skill matrix                               |   |
|   |    - Computes overall skill coverage index (0 - 100%)                 |   |
|   |    - Detects cross-functional single points of failure (SPOF)         |   |
|   +-----------------------------------------------------------------------+   |
+-------------------------------------------------------------------------------+
```

---

## 4. Mathematical Scoring Specification (Deterministic 100-Point Rubric)

A core requirement from Enterprise governance is **Zero Black-Box AI Decisions**. All candidate scoring and squad suggestions must be 100% explainable, deterministic, and auditable.

$$\text{Total Score} = S_{\text{skills}} + S_{\text{capacity}} + S_{\text{seniority}} + S_{\text{headroom}} - P_{\text{penalties}}$$

### Pillar 1: Skill Alignment (40 Points Maximum)
- **Must-Have Coverage ($32$ pts max):**
  $$S_{\text{must}} = \left( \frac{\text{Count of Candidate Matching Must-Have Skills}}{\text{Total Required Must-Have Skills}} \right) \times 32$$
- **Proficiency Depth Boost ($4$ pts max):**
  - $+2.5$ pts for each matched skill at `Expert` level.
  - $+1.5$ pts for each matched skill at `Advanced` level.
  - Capped at $+4.0$ pts.
- **Nice-To-Have Skills ($4$ pts max):**
  $$S_{\text{nice}} = \left( \frac{\text{Count of Candidate Matching Nice-to-Have Skills}}{\text{Total Nice-to-Have Skills}} \right) \times 4$$

### Pillar 2: Availability & Capacity (30 Points Maximum)
- Available Capacity $\ge 75\%$: **$30$ pts**
- Available Capacity between $40\%$ and $74\%$: **$20$ pts**
- Available Capacity $< 40\%$: **$8$ pts**
- **Handover Friction Penalty:** If Initiative Urgency is `Immediate (<48h)` and candidate handover timeline exceeds $3$ days, deduct **$10$ pts**.

### Pillar 3: Role & Seniority Fit (20 Points Maximum)
- **Discipline Parity ($12$ pts max):**
  - Exact Discipline Match (e.g. Architecture $\rightarrow$ Architecture): **$12$ pts**
  - Adjacent Discipline (e.g. Engineering $\rightarrow$ Architecture): **$6$ pts**
  - Unrelated Discipline: **$0$ pts**
- **Seniority Fit ($8$ pts max):**
  - Exact Seniority Level: **$8$ pts**
  - $\pm 1$ Seniority Level Difference: **$5$ pts**
  - $\ge 2$ Seniority Levels Difference: **$2$ pts**

### Pillar 4: Workload Headroom Buffer (10 Points Maximum)
$$\text{Headroom} = \text{Available Capacity \%} - \text{Initiative Required Allocation \%}$$
- If $\text{Headroom} \ge 0\%$: **$10$ pts** (Candidate can fulfill commitment without burnout)
- If $\text{Headroom} < 0\%$: **$2$ pts** (Candidate is overcommitted; flags an explicit **Over-allocation Risk**)

---

## 5. Domain Entities & Data Model Contracts

All entities are strictly typed in TypeScript to maintain full schema compliance.

```typescript
export type Discipline = 'Architecture' | 'Engineering' | 'Testing' | 'Data' | 'Delivery';
export type Seniority = 'Junior' | 'Intermediate' | 'Senior' | 'Lead' | 'Principal';
export type Proficiency = 'Proficient' | 'Advanced' | 'Expert';
export type Urgency = 'Immediate (<48h)' | 'High (<1w)' | 'Standard';

export interface Skill {
  name: string;
  category: 'Cloud' | 'Security' | 'Architecture' | 'Frontend' | 'Backend' | 'Data' | 'DevOps' | 'Testing';
  proficiency: Proficiency;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  discipline: Discipline;
  title: string;
  seniority: Seniority;
  location: string; // e.g. "Johannesburg (Rosebank)", "Cape Town (Foreshore)"
  currentAllocationPercent: number; // e.g. 20
  availableCapacityPercent: number; // e.g. 80
  currentProject: string;
  handoverTimeline: string; // e.g. "Available Now", "3 days"
  skills: Skill[];
}

export interface RoleRequirement {
  id: string;
  discipline: Discipline;
  title: string;
  targetSeniority: Seniority;
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

export interface DeliveryRequest {
  id: string;
  title: string;
  description: string;
  urgency: Urgency;
  duration: '2 Weeks' | '1 Month' | '3 Months' | '6 Months';
  allocationRequired: number; // e.g. 80%
  rolesNeeded: RoleRequirement[];
}

export interface ScoreBreakdown {
  totalScore: number; // 0 - 100
  skillScore: number; // 0 - 40
  capacityScore: number; // 0 - 30
  seniorityScore: number; // 0 - 20
  headroomScore: number; // 0 - 10
  matchedMustHaveSkills: string[];
  missingMustHaveSkills: string[];
  matchedNiceToHaveSkills: string[];
  riskFlags: string[];
  recommendationStrength: 'Strong Match' | 'Viable Match' | 'Alternative Match';
}

export interface SquadMemberAssignment {
  slotId: string;
  roleTitle: string;
  employee: Employee;
  scoreBreakdown: ScoreBreakdown;
}
```

---

## 6. Architectural Decision Records (ADRs)

### ADR-01: Deterministic Weighted Scoring vs. LLM-Based Scoring
- **Context:** Deciding how candidates are evaluated against squad slots.
- **Decision:** Implement a deterministic mathematical scoring rubric rather than prompt-based LLM generation.
- **Rationale:** Enterprise governance and audit standards require zero hallucination, repeatable scoring, and verifiable mathematical justification for talent staffing.

### ADR-02: Client-Side Reactive Evaluation with Backend REST Compatibility
- **Context:** Candidate scoring response time during dynamic slider adjustments.
- **Decision:** Run scoring algorithms client-side for instantaneous reactive UI updates (<10ms), while exposing identical REST endpoints (`POST /api/squads/auto-assemble`) on the Express backend.
- **Rationale:** Ensures frictionless user experience during the live hackathon showcase with zero network lag, while preserving standard service decoupling.

### ADR-03: Synthetic POPIA-Compliant Talent Pool
- **Context:** Accessing employee data during hackathon development.
- **Decision:** Use 30 curated synthetic South African employee profiles with realistic banking skillsets.
- **Rationale:** Satisfies the explicit hackathon directive: *"The solution will not integrate with any Enterprise systems, and all data used during the exercise will be mock data."* Ensures 100% POPIA compliance with zero privacy risk.

### ADR-04: Port Configuration & Workstation Alignment
- **Context:** Standardizing local development ports with `node-conf-starter`.
- **Decision:** Configure Express Backend on port `3011` and Vite Frontend on port `5193`, while retaining fallback support for port `3000` inside cloud preview containers.
- **Rationale:** Eliminates port conflict with default system services and complies with developer workstation constraints.

---

## 7. Solution Architect’s Team Guidance for Kiro Day

### 7.1 How to Guide the Business Analyst (BA)
- **Clarify Inputs:** Ensure the BA defines crisp required skills and urgency levels in `requirements.md`.
- **Align Scenarios:** Use the 3 pre-built realistic scenarios:
  1. *PayPulse Modernisation* (Cloud Platform, React Native, Kafka, AWS ECS).
  2. *Instant Fraud Detection Spike* (Golang, Python, ML Ops, DynamoDB).
  3. *Core Banking Clearing Migration* (Java/Spring Boot, PostgreSQL, Terraform).

### 7.2 How to Guide the Test Architect (QA)
- **Boundary Validation:** Test candidate capacity edge cases ($0\%$ capacity, $100\%$ capacity).
- **Penalty Enforcement:** Verify that candidate handover timelines $> 3$ days properly trigger the $10$-point deduction during `Immediate (<48h)` initiatives.
- **Uniqueness Check:** Ensure the Auto-Assembly algorithm never assigns the same employee to multiple squad slots.

### 7.3 How to Guide the Harness Engineer (AWS Kiro Execution)
- **Directory Structure:** Ensure all docs are placed in `/docs/` and synced with `/.kiro/steering/` and `/.kiro/specs/`.
- **Kiro Prompts:** Direct the Harness Engineer to instruct Kiro using explicit contracts:
  > *"Kiro, implement the greedy bipartite matching optimizer in `src/utils/scoring.ts` conforming strictly to the formulas in `docs/architecture.md` and interfaces in `src/types/index.ts`."*
- **Rapid Iteration:** Remind the engineer: *"Coding is not the bottleneck; our clear specification is the harness that guides Kiro."*

### 7.4 Executive Showcase Pitch (What to Say to Judges at GLC)
1. **The Hook:** *"Good afternoon. In Enterprise, assembling a rapid-response delivery squad currently takes 2 to 4 weeks of email chains and spreadsheet approvals. Today, we built the Delivery Squad Mobiliser in AWS Kiro, cutting that cycle from 3 weeks to 60 seconds."*
2. **The Architecture:** *"Our solution is built on 3 core architectural pillars: 100% POPIA-compliant synthetic data, a transparent 100-point deterministic matching engine with zero black-box bias, and instant collective skill coverage analysis."*
3. **The Live Demo:** *"Watch as we select an urgent PayPulse initiative, run one-click Auto-Assembly, inspect the explainable scoring audit log, and export an executive-ready Governance Brief."*
4. **The Closing:** *"What we proved today is that with AWS Kiro, engineering velocity multiplies when the Solution Architect provides an airtight specification."*
