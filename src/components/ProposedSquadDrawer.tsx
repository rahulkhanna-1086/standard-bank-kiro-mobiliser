import React from 'react';
import { SquadMemberAssignment, DeliveryRequest, Discipline } from '../types';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Sparkles, 
  FileText, 
  Clock, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ProposedSquadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  squad: SquadMemberAssignment[];
  deliveryRequest: DeliveryRequest;
  onRemoveMember: (employeeId: string) => void;
  onUpdateCapacity: (employeeId: string, capacity: number) => void;
  onClearSquad: () => void;
  onAutoAssemble: () => void;
  onOpenProposalModal: () => void;
}

export const ProposedSquadDrawer: React.FC<ProposedSquadDrawerProps> = ({
  isOpen,
  onClose,
  squad,
  deliveryRequest,
  onRemoveMember,
  onUpdateCapacity,
  onClearSquad,
  onAutoAssemble,
  onOpenProposalModal,
}) => {
  if (!isOpen) return null;

  // Calculate discipline coverage
  const totalSlotsNeeded = deliveryRequest.rolesNeeded.reduce((acc, r) => acc + r.count, 0);
  const totalFilled = squad.length;

  // Required skills collective coverage
  const allRequiredSkills: string[] = Array.from(
    new Set<string>(deliveryRequest.rolesNeeded.flatMap((r) => r.requiredSkills))
  );

  const skillsCoverageMap: Record<string, string[]> = {};
  allRequiredSkills.forEach((skill) => {
    skillsCoverageMap[skill] = [];
    squad.forEach((member) => {
      const hasSkill = member.employee.skills.some(
        (s) => s.name.toLowerCase() === skill.toLowerCase()
      );
      if (hasSkill) {
        skillsCoverageMap[skill].push(member.employee.name.split(' ')[0]);
      }
    });
  });

  const coveredSkillsCount = allRequiredSkills.filter(
    (skill) => skillsCoverageMap[skill] && skillsCoverageMap[skill].length > 0
  ).length;

  const averageMatchScore =
    squad.length > 0
      ? Math.round(squad.reduce((acc, m) => acc + m.matchScore, 0) / squad.length)
      : 0;

  const averageAvailableCapacity =
    squad.length > 0
      ? Math.round(
          squad.reduce((acc, m) => acc + m.employee.availableCapacityPercent, 0) / squad.length
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">Proposed Delivery Squad</h2>
              <p className="text-xs text-slate-300">
                {deliveryRequest.title.slice(0, 36)}...
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Squad Health & Readiness Metric Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Headcount</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">
                {totalFilled} / {totalSlotsNeeded}
              </div>
              <span className="text-[10px] text-slate-400">
                {totalFilled === totalSlotsNeeded ? 'Complete squad' : `${totalSlotsNeeded - totalFilled} open slots`}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Avg Match Score</span>
              <div className="text-base font-extrabold text-blue-700 mt-0.5">
                {squad.length > 0 ? `${averageMatchScore}%` : '—'}
              </div>
              <span className="text-[10px] text-slate-400">Rules-based fit</span>
            </div>

            <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 font-medium block">Skills Covered</span>
              <div className="text-base font-extrabold text-emerald-700 mt-0.5">
                {allRequiredSkills.length > 0 ? `${coveredSkillsCount}/${allRequiredSkills.length}` : '100%'}
              </div>
              <span className="text-[10px] text-slate-400">Must-have breadth</span>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Discipline Allocation Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Discipline Coverage Tracker
              </span>
              <span className="text-[11px] text-slate-500">
                Required positions for this delivery
              </span>
            </div>

            <div className="space-y-1.5">
              {deliveryRequest.rolesNeeded.map((role) => {
                const assignedCount = squad.filter(
                  (m) => m.discipline === role.discipline
                ).length;
                const isFulfilled = assignedCount >= role.count;

                return (
                  <div
                    key={role.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                      isFulfilled
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {isFulfilled ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                          {assignedCount}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold">{role.discipline}:</span>{' '}
                        <span className="text-slate-600">{role.roleTitle}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-800">
                      {assignedCount} / {role.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Collective Skill Coverage Matrix */}
          {allRequiredSkills.length > 0 && (
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Must-Have Skill Matrix (Collective Squad Coverage)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allRequiredSkills.map((skill) => {
                  const coveredBy = skillsCoverageMap[skill] || [];
                  const isCovered = coveredBy.length > 0;

                  return (
                    <span
                      key={skill}
                      className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded border ${
                        isCovered
                          ? 'bg-white text-emerald-800 border-emerald-300 font-medium'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                      title={
                        isCovered
                          ? `Covered by: ${coveredBy.join(', ')}`
                          : 'Not covered by any selected squad member yet'
                      }
                    >
                      {isCovered ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-rose-500 mr-1" />
                      )}
                      <span>{skill}</span>
                      {isCovered && (
                        <span className="ml-1 text-[10px] text-slate-500 font-normal">
                          ({coveredBy[0]})
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Squad Members List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                Selected Candidates ({squad.length})
              </span>
              {squad.length > 0 && (
                <button
                  onClick={onClearSquad}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {squad.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-3">
                <Users className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    No squad members selected yet
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select candidates from the ranked shortlist or use auto-assemble.
                  </p>
                </div>
                <button
                  onClick={onAutoAssemble}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Assemble Recommended Squad</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {squad.map((member) => (
                  <div
                    key={member.employeeId}
                    className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs"
                          style={{ backgroundColor: member.employee.avatarBg }}
                        >
                          {member.employee.initials}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900 text-xs">
                              {member.employee.name}
                            </span>
                            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-medium text-slate-600">
                              {member.employee.seniority}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {member.employee.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {member.matchScore}%
                        </span>
                        <button
                          onClick={() => onRemoveMember(member.employeeId)}
                          className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Remove from squad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Member allocation & capacity control */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-medium text-slate-500">Allocation:</span>
                        <span className="font-bold text-slate-800">{member.allocatedCapacityPercent}%</span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Available Cap: <strong className="text-emerald-700">{member.employee.availableCapacityPercent}%</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
          <button
            id="btn-generate-squad-brief"
            onClick={onOpenProposalModal}
            disabled={squad.length === 0}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Squad Proposal Brief</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Standard Bank Resource Governance Ready</span>
            <span>Deterministic Rules-Based</span>
          </div>
        </div>
      </div>
    </div>
  );
};
