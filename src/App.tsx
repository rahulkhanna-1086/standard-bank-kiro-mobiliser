/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DeliveryRequest, ScoredCandidate, SquadMemberAssignment, Seniority } from './types';
import { TALENT_POOL, PRESET_REQUESTS } from './data/talentPool';
import { rankTalentPoolForRequest } from './utils/scoring';
import { Header } from './components/Header';
import { DeliveryRequestForm } from './components/DeliveryRequestForm';
import { CandidateFilters } from './components/CandidateFilters';
import { CandidateCard } from './components/CandidateCard';
import { ProposedSquadDrawer } from './components/ProposedSquadDrawer';
import { ScoringRulesModal } from './components/ScoringRulesModal';
import { ProposalSummaryModal } from './components/ProposalSummaryModal';
import { KiroSpecPackModal } from './components/KiroSpecPackModal';
import { AiRequirementPrompt } from './components/AiRequirementPrompt';
import { 
  Users, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const SENIORITY_ORDER: Record<Seniority, number> = {
  Principal: 5,
  Lead: 4,
  Senior: 3,
  Mid: 2,
  Junior: 1,
};

export default function App() {
  // 1. Current Delivery Need / Request
  const [currentRequest, setCurrentRequest] = useState<DeliveryRequest>(PRESET_REQUESTS[0]);

  // 2. Proposed Squad Assembly State
  const [squad, setSquad] = useState<SquadMemberAssignment[]>([]);

  // 3. Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'capacity' | 'seniority'>('score');

  // 4. Modal and Drawer Controls
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [isSquadDrawerOpen, setIsSquadDrawerOpen] = useState<boolean>(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState<boolean>(false);
  const [isSpecPackModalOpen, setIsSpecPackModalOpen] = useState<boolean>(false);

  // 5. Scored & Ranked Candidates (Deterministic Rules-Based Scoring)
  const rankedCandidates = useMemo(() => {
    // Score all candidates against current request
    const scored = rankTalentPoolForRequest(
      TALENT_POOL,
      currentRequest,
      selectedDiscipline === 'All' ? undefined : selectedDiscipline
    );

    // Apply Search Query filter (Name, Role, Skills, Location)
    let filtered = scored;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((c) => {
        const emp = c.employee;
        const nameMatch = emp.name.toLowerCase().includes(q);
        const roleMatch = emp.role.toLowerCase().includes(q);
        const locMatch = emp.location.toLowerCase().includes(q);
        const deptMatch = emp.department.toLowerCase().includes(q);
        const skillMatch = emp.skills.some((s) => s.name.toLowerCase().includes(q));
        return nameMatch || roleMatch || locMatch || deptMatch || skillMatch;
      });
    }

    // Apply Availability Band filter
    if (selectedAvailability !== 'All') {
      filtered = filtered.filter((c) => c.employee.availabilityBand === selectedAvailability);
    }

    // Apply Custom Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'capacity') {
        return b.employee.availableCapacityPercent - a.employee.availableCapacityPercent;
      }
      if (sortBy === 'seniority') {
        const senA = SENIORITY_ORDER[a.employee.seniority] || 0;
        const senB = SENIORITY_ORDER[b.employee.seniority] || 0;
        return senB - senA;
      }
      // default: overall match score
      return b.scoreBreakdown.overallScore - a.scoreBreakdown.overallScore;
    });
  }, [currentRequest, selectedDiscipline, searchQuery, selectedAvailability, sortBy]);

  // Selected candidates Set for fast lookup
  const squadMemberIds = useMemo(() => new Set(squad.map((m) => m.employeeId)), [squad]);

  // Squad metrics
  const totalSlotsNeeded = useMemo(
    () => currentRequest.rolesNeeded.reduce((sum, r) => sum + r.count, 0),
    [currentRequest]
  );

  const immediateCount = useMemo(
    () => TALENT_POOL.filter((e) => e.availabilityBand === 'Immediate').length,
    []
  );

  // Toggle candidate in/out of squad
  const handleToggleSquad = (candidate: ScoredCandidate) => {
    const isAlreadyIn = squadMemberIds.has(candidate.employee.id);
    if (isAlreadyIn) {
      setSquad((prev) => prev.filter((m) => m.employeeId !== candidate.employee.id));
    } else {
      const newAssignment: SquadMemberAssignment = {
        employeeId: candidate.employee.id,
        employee: candidate.employee,
        assignedRole: candidate.targetRoleRequirement?.roleTitle || candidate.employee.role,
        discipline: candidate.targetDiscipline,
        allocatedCapacityPercent: currentRequest.workloadRequirementPercent,
        matchScore: candidate.scoreBreakdown.overallScore,
      };
      setSquad((prev) => [...prev, newAssignment]);
    }
  };

  const handleRemoveMember = (employeeId: string) => {
    setSquad((prev) => prev.filter((m) => m.employeeId !== employeeId));
  };

  const handleUpdateCapacity = (employeeId: string, capacity: number) => {
    setSquad((prev) =>
      prev.map((m) => (m.employeeId === employeeId ? { ...m, allocatedCapacityPercent: capacity } : m))
    );
  };

  const handleClearSquad = () => {
    setSquad([]);
  };

  // Smart Auto-Assemble: Picks the highest-ranked candidates to fill each open role slot
  const handleAutoAssemble = () => {
    const newSquad: SquadMemberAssignment[] = [];
    const usedEmployeeIds = new Set<string>();

    for (const role of currentRequest.rolesNeeded) {
      let filledForThisRole = 0;

      // Get candidates eligible for this discipline, sorted by score for this role
      const eligible = TALENT_POOL.filter(
        (emp) => emp.discipline === role.discipline && !usedEmployeeIds.has(emp.id)
      )
        .map((emp) => ({
          employee: emp,
          breakdown: rankTalentPoolForRequest(
            [emp],
            { ...currentRequest, rolesNeeded: [role] }
          )[0].scoreBreakdown,
        }))
        .sort((a, b) => b.breakdown.overallScore - a.breakdown.overallScore);

      for (const cand of eligible) {
        if (filledForThisRole < role.count) {
          newSquad.push({
            employeeId: cand.employee.id,
            employee: cand.employee,
            assignedRole: role.roleTitle,
            discipline: role.discipline,
            allocatedCapacityPercent: currentRequest.workloadRequirementPercent,
            matchScore: cand.breakdown.overallScore,
          });
          usedEmployeeIds.add(cand.employee.id);
          filledForThisRole++;
        }
      }
    }

    setSquad(newSquad);
    setIsSquadDrawerOpen(true);
  };

  // Automatically apply AI-synthesized delivery requirement and auto-assemble squad
  const handleApplyAiRequest = (newRequest: DeliveryRequest, _summary: string) => {
    setCurrentRequest(newRequest);

    const newSquad: SquadMemberAssignment[] = [];
    const usedEmployeeIds = new Set<string>();

    for (const role of newRequest.rolesNeeded) {
      let filledForThisRole = 0;

      const eligible = TALENT_POOL.filter(
        (emp) => emp.discipline === role.discipline && !usedEmployeeIds.has(emp.id)
      )
        .map((emp) => ({
          employee: emp,
          breakdown: rankTalentPoolForRequest(
            [emp],
            { ...newRequest, rolesNeeded: [role] }
          )[0].scoreBreakdown,
        }))
        .sort((a, b) => b.breakdown.overallScore - a.breakdown.overallScore);

      for (const cand of eligible) {
        if (filledForThisRole < role.count) {
          newSquad.push({
            employeeId: cand.employee.id,
            employee: cand.employee,
            assignedRole: role.roleTitle,
            discipline: role.discipline,
            allocatedCapacityPercent: newRequest.workloadRequirementPercent,
            matchScore: cand.breakdown.overallScore,
          });
          usedEmployeeIds.add(cand.employee.id);
          filledForThisRole++;
        }
      }
    }

    setSquad(newSquad);
    setIsSquadDrawerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. Header */}
      <Header
        onOpenRules={() => setIsRulesModalOpen(true)}
        onOpenSpecPack={() => setIsSpecPackModalOpen(true)}
        candidatePoolCount={TALENT_POOL.length}
        availableNowCount={immediateCount}
        squadMemberCount={squad.length}
        onOpenSquadDrawer={() => setIsSquadDrawerOpen(true)}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* AI Prompt-to-Squad Mobiliser Section */}
        <section aria-label="AI Prompt Mobiliser">
          <AiRequirementPrompt onApplyAiRequest={handleApplyAiRequest} />
        </section>

        {/* Delivery Need Definition Form */}
        <section aria-label="Delivery Need Definition">
          <DeliveryRequestForm
            currentRequest={currentRequest}
            onRequestChange={setCurrentRequest}
            onResetSquad={handleClearSquad}
          />
        </section>

        {/* Talent Pool Filters and Search */}
        <section aria-label="Talent Pool Filters">
          <CandidateFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDiscipline={selectedDiscipline}
            onDisciplineChange={setSelectedDiscipline}
            selectedAvailability={selectedAvailability}
            onAvailabilityChange={setSelectedAvailability}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            onAutoAssemble={handleAutoAssemble}
            totalFilteredCount={rankedCandidates.length}
          />
        </section>

        {/* Ranked Candidate Shortlist */}
        <section aria-label="Ranked Candidate Shortlist" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                <span>Ranked Internal Talent Shortlist</span>
                <span className="text-xs font-normal text-slate-500">
                  (Sorted by suitability for {currentRequest.title})
                </span>
              </h2>
            </div>
          </div>

          {rankedCandidates.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300 p-8">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">
                No matching internal candidates found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try widening your search terms or setting the discipline and availability filters to "All".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDiscipline('All');
                  setSelectedAvailability('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {rankedCandidates.map((candidate, idx) => (
                <CandidateCard
                  key={candidate.employee.id}
                  scoredCandidate={candidate}
                  rank={idx + 1}
                  deliveryRequest={currentRequest}
                  isSelectedInSquad={squadMemberIds.has(candidate.employee.id)}
                  onToggleSquad={handleToggleSquad}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 3. Sticky Bottom Squad Assembly Dock */}
      <div className="sticky bottom-0 z-20 bg-slate-900 text-white border-t border-slate-800 shadow-xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-slate-200">Proposed Squad:</span>
              <span className="font-bold text-white bg-blue-600 px-2 py-0.5 rounded text-xs">
                {squad.length} / {totalSlotsNeeded} Filled
              </span>
            </div>
            {squad.length > 0 && (
              <span className="text-slate-400 text-xs hidden sm:inline">
                • Avg Match: <strong className="text-emerald-400">
                  {Math.round(squad.reduce((a, b) => a + b.matchScore, 0) / squad.length)}%
                </strong>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleAutoAssemble}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
            >
              Auto-Assemble
            </button>
            <button
              id="btn-dock-review-squad"
              onClick={() => setIsSquadDrawerOpen(true)}
              className="flex items-center space-x-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
            >
              <span>Review Squad</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Modals & Drawers */}
      <ProposedSquadDrawer
        isOpen={isSquadDrawerOpen}
        onClose={() => setIsSquadDrawerOpen(false)}
        squad={squad}
        deliveryRequest={currentRequest}
        onRemoveMember={handleRemoveMember}
        onUpdateCapacity={handleUpdateCapacity}
        onClearSquad={handleClearSquad}
        onAutoAssemble={handleAutoAssemble}
        onOpenProposalModal={() => {
          setIsSquadDrawerOpen(false);
          setIsProposalModalOpen(true);
        }}
      />

      <ScoringRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      <ProposalSummaryModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        squad={squad}
        deliveryRequest={currentRequest}
      />

      <KiroSpecPackModal
        isOpen={isSpecPackModalOpen}
        onClose={() => setIsSpecPackModalOpen(false)}
      />
    </div>
  );
}
