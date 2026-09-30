import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  CheckSquare, 
  Terminal, 
  Layers, 
  Compass, 
  Copy, 
  Check, 
  BookOpen, 
  Sliders, 
  Cpu, 
  Lightbulb, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

interface KiroSpecPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'specs' | 'harness' | 'showcase';
type SpecSubTab = 'ba' | 'test' | 'api' | 'ui' | 'arch';
type HarnessSubTab = 'steering' | 'specs' | 'hooks';

export const KiroSpecPackModal: React.FC<KiroSpecPackModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [specSubTab, setSpecSubTab] = useState<SpecSubTab>('ba');
  const [harnessSubTab, setHarnessSubTab] = useState<HarnessSubTab>('steering');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write fallback triggered', err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSubTabContent = () => {
    if (activeTab === 'specs') {
      switch (specSubTab) {
        case 'ba':
          return {
            title: 'Business Analyst: EARS Requirements',
            file: 'docs/requirements.md',
            role: '2 Business Analysts',
            content: `# Requirements (EARS Format)
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: Business Analyst Chapter (Kiro Day Team)

## 1. Initiative & Role Needs Capture
- REQ-001: The system shall provide predefined initiative templates for key Standard Bank delivery priorities (PayPulse Real-Time Clearing Modernisation, Basel IV Regulatory Risk Spike, and SME Instant Credit Assessment).
- REQ-002: When a delivery facilitator selects an initiative template, the system shall prefill the delivery urgency, duration, allocation commitment, and target roles with their respective must-have and nice-to-have skill requirements.
- REQ-003: When a delivery facilitator customises role requirements, the system shall allow adding, removing, and adjusting roles across the five core disciplines: Architecture, Engineering, Testing, Data, and Delivery.
- REQ-004: When an initiative urgency is set to "Immediate (<48h)", the system shall prioritise candidates with high available capacity (>=75%) and penalise candidates with active handover friction.

## 2. Deterministic Matching & Scoring Engine
- REQ-005: The system shall calculate candidate compatibility using a transparent 100-point deterministic rubric: Skill Alignment (40 pts), Availability & Capacity Band (30 pts), Role & Seniority Fit (20 pts), and Workload Buffer (10 pts).
- REQ-006: Where a candidate possesses a required must-have skill at Expert proficiency, the system shall award the full maximum skill weight for that skill item.
- REQ-007: If a candidate has an available capacity percentage below the requested commitment, then the system shall flag a "Capacity Deficit" risk warning on the candidate's profile.
- REQ-008: While a delivery request is active, the system shall display an explainable breakdown ("Why Recommended") for each candidate showing exact point breakdowns, matched skills, and potential delivery risks.
- REQ-009: The system shall never employ opaque probabilistic generative weights or black-box non-deterministic scoring to rank employees.

## 3. Talent Pool & Privacy
- REQ-010: The system shall display mock employee profiles from the internal business unit pool including name, role title, chapter discipline, location hub, allocation percentage, and verified competencies.
- REQ-011: When a user filters the talent pool by discipline, location, or search keyword, the system shall instantly filter candidate cards while preserving match scores.
- REQ-012: The system shall strictly maintain 100% synthetic mock employee profiles to safeguard privacy and comply with POPIA regulations.

## 4. Squad Assembly & Collective Coverage
- REQ-013: When a user clicks "Auto-Assemble Squad", the system shall assign the highest-scoring candidate for each unfilled role requirement.
- REQ-014: While squad members are selected, the system shall dynamically compute collective skill coverage across all required skills and display unfulfilled skill gaps.
- REQ-015: When a user manually adds or removes a candidate from the proposed squad, the system shall update discipline headcount fulfillment and slot status in real time.

## 5. Executive Governance & Handover Export
- REQ-016: When a user requests "Generate Governance Brief", the system shall produce a structured proposal containing executive summary, member rosters, capacity impact, match justifications, and risk mitigations.
- REQ-017: The system shall allow the delivery facilitator to copy the governance brief to clipboard in standard Markdown format and view print-friendly styling.`
          };
        case 'test':
          return {
            title: 'Test Architect: GIVEN/WHEN/THEN Acceptance Test Cases',
            file: 'docs/test-cases.md',
            role: '2 Test Architects',
            content: `# Test Cases (Acceptance Criteria)
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: Test Architect Chapter (Kiro Day Team)

## TC-001: Preset Initiative Template Selection
- GIVEN a delivery facilitator is on the Initiative Configurator
- WHEN they select the "PayPulse Real-Time Clearing Modernisation" scenario
- THEN the system populates title, "Immediate (<48h)" urgency, "2 Weeks" duration, and 85% allocation
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

## TC-008: Zero PII and Synthetic Mock Data Verification
- GIVEN all employee records in the talent pool
- WHEN verifying user identifiers, emails, and contact records
- THEN all domains use @example.com mock aliases with fictitious names
- AND no external live directory APIs or private employee databases are queried`
          };
        case 'api':
          return {
            title: 'API Designer: Endpoint Contracts',
            file: 'docs/api-spec.md',
            role: '2 API Designers',
            content: `# API Specification
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: API Designer Chapter (Kiro Day Team)

## POST /api/evaluate-candidates
Scores all candidates in the talent pool against a specific delivery role requirement using the deterministic 100-point rubric.

Request body:
- roleRequirement (object, required): discipline, targetSeniority, requiredSkills, niceToHaveSkills
- deliveryContext (object, required): urgency, allocationRequired, duration

Success response (200 OK):
- candidates (array of ScoredCandidate): candidateId, totalScore, breakdown, matchedSkills, missingSkills, risks

---

## POST /api/squad/auto-assemble
Optimally selects candidates for all unfilled roles in an active delivery request using bipartite best-fit matching.

Request body:
- deliveryRequest (object, required)
- currentSquad (array of object, optional)

Success response (200 OK):
- proposedSquad (array): slotId, employee, matchScore
- collectiveMetrics (object): overallMatchAverage, collectiveSkillsCovered, missingSkillGaps, headcountFulfilled

---

## GET /api/scenarios
Retrieves predefined Standard Bank initiative scenarios for rapid setup.

Success response (200 OK):
- scenarios (array of ScenarioObject): id, title, description, urgency, duration, allocationRequired, rolesNeeded

---

## POST /api/governance/generate-brief
Generates an executive-level squad mobilization and governance summary with full audit trail.

Request body:
- deliveryRequest (object, required)
- squad (array of object, required)
- author (string, optional)

Success response (200 OK):
- briefId (string): e.g. "SB-MOB-2026-09-01"
- title (string): Executive brief title
- markdownContent (string): Formatted Markdown summary ready for clipboard/email`
          };
        case 'ui':
          return {
            title: 'UI/UX Designer: Screen Specifications',
            file: 'docs/ui-spec.md',
            role: '2 UI/UX Designers',
            content: `# Screen Specifications
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: UI/UX Designer Chapter (Kiro Day Team)

## Screen 1: Initiative & Role Configurator
- Top Header: Standard Bank Brand Shield mark, title "Delivery Squad Mobiliser", and "Preset Scenarios" quick selector bar.
- Initiative Metadata Bar: Urgency selector pill buttons (Immediate <48h, High <1w, Standard), Duration selector, Allocation slider.
- Required Roles Strip: Horizontal card deck of required positions with fulfillment counters.
- Global Action Bar: "Auto-Assemble Squad" (primary cobalt button) and "Review Proposed Squad" drawer button.

## Screen 2: Candidate Recommendation & Ranking Matrix
- Filter & Search Bar: Search input for candidate name/skill, Discipline filter, Availability band toggle, Location hub filter.
- Candidate Grid: 2-column or 3-column responsive card grid.
  - Candidate Card: Seniority badge, role title, chapter icon, big score gauge (e.g. 94%), available capacity %, handover timeline.
  - Skills match chips: Matched must-have (green), matched nice-to-have (blue), missing skills (slate outline).
  - Expandable "Why Recommended" Accordion: 4-bar deterministic breakdown (Skills 40, Capacity 30, Role 20, Workload 10), verified justifications, delivery risk warnings.

## Screen 3: Proposed Squad Roster & Gap Analysis Drawer
- Slide-over panel displaying real-time squad view, showing who is on the squad, collective skill coverage, and missing gaps.
- Collective Skills Matrix: Tags for every skill required by project; covered skills show green checkmark, uncovered show amber warning.
- Drawer Footer: "Clear Squad" outline button and "Generate Governance Brief" primary button.

## Screen 4: Executive Governance Brief Modal
- Formatted executive mobilization summary for delivery governance approval.
- Includes executive overview, member roster table, match justifications, and handover mitigation plan with 1-click Markdown copy.`
          };
        case 'arch':
          return {
            title: 'Architect: System Design & Data Model',
            file: 'docs/architecture.md',
            role: '1-2 System Architects',
            content: `# Architecture Document
# Initiative: Standard Bank Delivery Squad Mobiliser
# Author: System Architect Chapter (Kiro Day Team)

## 1. Components
- Initiative Context Provider: Holds current delivery target (urgency, required roles, must-have skills, allocation).
- Deterministic Rules Engine (matchingEngine.ts): Evaluates talent pool members using mathematical weights. Zero black-box AI bias.
- Squad Collective Analyzer: Aggregates individual squad members into a collective skill graph, verifying skill overlap and flagging uncovered dependencies.
- Governance Brief Generator: Synthesizes the decision audit trail, handover timelines, and candidate justifications into an executive approval brief.
- Talent Pool Repository: In-memory repository of 30 structured synthetic mock employee profiles.

## 2. Deterministic Scoring Rubric (100 Points Max)
1. Skill Alignment (40 pts):
   - Must-have match: (matchedMustHave / totalMustHave) * 32 pts.
   - Skill proficiency boost: +2.5 pts for Expert, +1.5 pts for Advanced up to 4 pts.
   - Nice-to-have match: up to 4 pts proportional to coverage.
2. Availability & Capacity Band (30 pts):
   - Available capacity >= 75%: 30 pts.
   - Available capacity 40-74%: 20 pts.
   - Available capacity < 40%: 8 pts.
   - Urgency penalty: if Urgency is "Immediate" and Handover > 3 days, deduct 10 pts.
3. Role & Seniority Fit (20 pts):
   - Exact discipline match: 12 pts (related: 6 pts).
   - Seniority parity: Exact seniority: 8 pts; 1 level diff: 5 pts; >1 level: 2 pts.
4. Workload Headroom Buffer (10 pts):
   - Calculated from (availableCapacityPercent - allocationRequired). Positive = 10 pts. Deficit = 2 pts with explicit risk flag.

## 3. Data Privacy & POPIA Compliance
- 100% synthetic mock data to ensure complete POPIA privacy compliance. Zero real PII.`
          };
      }
    } else if (activeTab === 'harness') {
      switch (harnessSubTab) {
        case 'steering':
          return {
            title: 'Harness Engineer: Persistent Steering Files',
            file: '.kiro/steering/{product,tech,structure,conventions}.md',
            role: '1-2 Harness Engineers',
            content: `# Persistent Steering Files (.kiro/steering/)

### .kiro/steering/product.md
Mission: Rapidly mobilise cross-functional delivery squads for critical Standard Bank business initiatives.
Constraints: 100% Synthetic mock data for POPIA compliance. Fully transparent mathematical scoring (no black-box AI bias).

### .kiro/steering/tech.md
Stack: TypeScript (strict mode), React 18+ Vite, Tailwind CSS, Lucide React icons.
Performance: Matching engine computation < 15ms across 30+ candidate profiles.

### .kiro/steering/structure.md
Defines strict separation of concerns between docs/ specification pack, .kiro/ harness configurations, src/components/, src/data/, and src/utils/scoring.

### .kiro/steering/conventions.md
Strict anti-slop guidelines: Zero arbitrary gradients, high-contrast typography, single-line badges, deterministic pure scoring functions with zero side-effects.`
          };
        case 'specs':
          return {
            title: 'Harness Engineer: 3-Phase Kiro Specs Workflow',
            file: '.kiro/specs/squad-mobiliser/{requirements,design,tasks}.md',
            role: '1-2 Harness Engineers',
            content: `# Kiro Spec: 3-Phase Build Workflow

### Phase 1: requirements.md
- Extracted directly from Business Analyst EARS requirements (REQ-001 to REQ-017).
- Defines initiative setup, deterministic scoring rubric, search/filter criteria, auto-assembly logic, and governance brief output.

### Phase 2: design.md
- Translates requirements into component hierarchy: Header, InitiativeConfigurator, CandidateCard, ProposedSquadDrawer, GovernanceBriefModal.
- Formulates React state architecture and data flow.

### Phase 3: tasks.md (Execution tracking)
- [x] Task 1: Domain types (types.ts)
- [x] Task 2: Synthetic talent pool (30 profiles) & scenarios
- [x] Task 3: Deterministic 100-pt scoring engine
- [x] Task 4: Initiative Configurator UI
- [x] Task 5: Candidate Card with score breakdown accordion
- [x] Task 6: Faceted search & filter toolbar
- [x] Task 7: Proposed Squad drawer with auto-assemble & collective coverage
- [x] Task 8: Governance brief modal with Markdown clipboard export
- [x] Task 9: Kiro Spec Pack & Showcase inspector
- [x] Task 10: Strict TypeScript verification`
          };
        case 'hooks':
          return {
            title: 'Harness Engineer: Automated Quality Hooks',
            file: '.kiro/hooks/{lint-on-save,test-on-create}.md',
            role: '1-2 Harness Engineers',
            content: `# Automated Hooks (.kiro/hooks/)

### Hook 1: lint-on-save.md
Trigger: onFileSave
FileMatch: "**/*.{ts,tsx}"
Action: Run TypeScript strict type-check: "npm run lint"
Failure Policy: Block automated build if type errors or missing imports are detected.

### Hook 2: test-on-create.md
Trigger: onFileCreateOrModify
FileMatch: "src/utils/**/*.ts"
Action: Run test suites: "npm run test:unit --silent"
Objective: Verify deterministic matching engine outputs strictly 100 points maximum and adheres to scoring weights.`
          };
      }
    } else {
      return {
        title: 'Kiro Day Showcase: What We Learnt',
        file: 'Showcase Presentation & Debrief',
        role: 'Full 2-Pizza Team (10-15 Members)',
        content: `# Kiro Day Showcase: Standard Bank Delivery Squad Mobiliser

## 1. Documentation & Specification Pack
- Morning session focused entirely on specification rigor across 6 roles.
- Business Analysts authored 17 unambiguous EARS requirements (ubiquitous, event-driven, state-driven, and unwanted conditions).
- Test Architects paired with BAs to translate every requirement into Given/When/Then test scenarios before a single line of code was built.
- UI Designers, API Designers, and Architects drafted exact screen components, JSON schemas, and deterministic rubric weights.

## 2. The Agent Harness
- The Harness Engineer served as the vital bridge between human specification and the AI coding agent.
- Persistent steering files (.kiro/steering/) prevented hallucination, enforced the Standard Bank enterprise color palette, and prohibited generic AI slop.
- Automated hooks ensured code passed strict TypeScript validation and linting on every save.

## 3. The Working Prototype Demo
- Solves a real Standard Bank bottleneck: turning 2-3 weeks of staffing negotiations into 60 seconds of deterministic talent matching.
- Live demonstration shows:
  - Preset initiative selection (PayPulse Clearing, Basel IV Spike, SME Credit).
  - 100-point explainable scoring matrix with full point breakdown per candidate.
  - One-click auto-assembly with real-time collective skill gap analysis.
  - Executive-ready governance brief export for instant sponsor sign-off.

## 4. What We Learnt: What Changed About Software Engineering?
- "Coding is no longer the bottleneck — thinking clearly is."
- When specifications are structured (EARS, GIVEN/WHEN/THEN, typed schemas), the AI agent executes with remarkable precision.
- Separation of concerns between domain specialists (BAs, QAs, Architects) and the Harness Engineer unlocks 10x development velocity without sacrificing governance or quality.`
      };
    }
  };

  const currentContent = getSubTabContent();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wide text-white">KIRO DAY PLAYBOOK</span>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 border border-blue-700 text-blue-300 font-medium">
                  Spec Pack & Harness Showcase
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Morning Specification Pack • Agent Harness Configuration • Showcase Findings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation Tabs */}
        <div className="px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`py-3 text-sm font-semibold border-b-2 flex items-center space-x-2 cursor-pointer transition ${
                activeTab === 'specs'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Spec Pack (docs/)</span>
            </button>

            <button
              onClick={() => setActiveTab('harness')}
              className={`py-3 text-sm font-semibold border-b-2 flex items-center space-x-2 cursor-pointer transition ${
                activeTab === 'harness'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Agent Harness (.kiro/)</span>
            </button>

            <button
              onClick={() => setActiveTab('showcase')}
              className={`py-3 text-sm font-semibold border-b-2 flex items-center space-x-2 cursor-pointer transition ${
                activeTab === 'showcase'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Showcase & What We Learnt</span>
            </button>
          </div>

          <button
            onClick={() => handleCopy(currentContent.content)}
            className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Artefact</span>
              </>
            )}
          </button>
        </div>

        {/* Sub-Tabs for Specs & Harness */}
        {activeTab === 'specs' && (
          <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => setSpecSubTab('ba')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                specSubTab === 'ba'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Business Analyst (EARS)
            </button>
            <button
              onClick={() => setSpecSubTab('test')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                specSubTab === 'test'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Test Architect (Given/When/Then)
            </button>
            <button
              onClick={() => setSpecSubTab('api')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                specSubTab === 'api'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              API Designer (Endpoints)
            </button>
            <button
              onClick={() => setSpecSubTab('ui')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                specSubTab === 'ui'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              UI/UX Designer (Screens)
            </button>
            <button
              onClick={() => setSpecSubTab('arch')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                specSubTab === 'arch'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              System Architect (Design & Rubric)
            </button>
          </div>
        )}

        {activeTab === 'harness' && (
          <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex space-x-2 overflow-x-auto text-xs">
            <button
              onClick={() => setHarnessSubTab('steering')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                harnessSubTab === 'steering'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Steering Context (.kiro/steering/)
            </button>
            <button
              onClick={() => setHarnessSubTab('specs')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                harnessSubTab === 'specs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              3-Phase Specs (.kiro/specs/)
            </button>
            <button
              onClick={() => setHarnessSubTab('hooks')}
              className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition ${
                harnessSubTab === 'hooks'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Automated Hooks (.kiro/hooks/)
            </button>
          </div>
        )}

        {/* Content Viewer */}
        <div className="p-6 flex-1 overflow-y-auto bg-slate-900/70">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{currentContent.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Artefact: <code className="text-blue-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono text-[11px]">{currentContent.file}</code> • Author: <span className="text-slate-300 font-medium">{currentContent.role}</span>
              </p>
            </div>
            <div className="text-xs bg-slate-800/80 border border-slate-700/70 px-2.5 py-1 rounded text-slate-300">
              Kiro Day Playbook Aligned
            </div>
          </div>

          <pre className="font-mono text-xs text-slate-200 bg-slate-950 p-5 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {currentContent.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Standard Bank 2-Pizza Team • Morning Design to Afternoon Kiro Build</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
