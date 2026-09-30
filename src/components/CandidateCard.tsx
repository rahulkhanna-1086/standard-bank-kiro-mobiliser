import React, { useState } from 'react';
import { ScoredCandidate, DeliveryRequest } from '../types';
import { 
  Check, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Building2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  UserCheck, 
  Activity,
  CheckCircle2
} from 'lucide-react';

interface CandidateCardProps {
  scoredCandidate: ScoredCandidate;
  rank: number;
  deliveryRequest: DeliveryRequest;
  isSelectedInSquad: boolean;
  onToggleSquad: (candidate: ScoredCandidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  scoredCandidate,
  rank,
  deliveryRequest,
  isSelectedInSquad,
  onToggleSquad,
}) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const { employee, scoreBreakdown, targetRoleRequirement } = scoredCandidate;

  // Score color styling
  const score = scoreBreakdown.overallScore;
  let scoreColorClass = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  let badgeColorClass = 'bg-emerald-600';
  if (score < 75 && score >= 60) {
    scoreColorClass = 'text-blue-700 bg-blue-50 border-blue-300';
    badgeColorClass = 'bg-blue-600';
  } else if (score < 60) {
    scoreColorClass = 'text-amber-700 bg-amber-50 border-amber-300';
    badgeColorClass = 'bg-amber-600';
  }

  // Availability band styling
  let availabilityBadge = {
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    label: 'Immediate Availability (75%+)',
  };
  if (employee.availabilityBand === 'Moderate') {
    availabilityBadge = {
      bg: 'bg-amber-100 text-amber-800 border-amber-200',
      label: 'Moderate Availability (40-74%)',
    };
  } else if (employee.availabilityBand === 'Constrained') {
    availabilityBadge = {
      bg: 'bg-rose-100 text-rose-800 border-rose-200',
      label: 'Constrained (<40%)',
    };
  }

  // Discipline tag styling
  const disciplineColors: Record<string, string> = {
    Architecture: 'bg-purple-100 text-purple-800 border-purple-200',
    Engineering: 'bg-blue-100 text-blue-800 border-blue-200',
    Testing: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Data: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Delivery: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const matchedMustHaves = new Set(scoreBreakdown.matchedMustHaveSkills);
  const matchedNiceToHaves = new Set(scoreBreakdown.matchedNiceToHaveSkills);

  return (
    <div
      className={`rounded-xl border transition-all duration-150 ${
        isSelectedInSquad
          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Header: Rank, Match Score, Discipline, Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            {/* Rank badge */}
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              #{rank}
            </span>

            {/* Avatar & Basic Info */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs"
              style={{ backgroundColor: employee.avatarBg }}
            >
              {employee.initials}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-slate-900 text-base">
                  {employee.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {employee.seniority}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">
                {employee.role}
              </p>
            </div>
          </div>

          {/* Right side: Match score & Squad action button */}
          <div className="flex items-center space-x-3 self-end sm:self-center">
            {/* Overall Match Score Chip */}
            <div
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border text-xs font-bold ${scoreColorClass}`}
              title="Calculated via transparent 4-pillar rules rubric"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{score}% Match</span>
            </div>

            {/* Add to squad button */}
            <button
              id={`btn-toggle-squad-${employee.id}`}
              onClick={() => onToggleSquad(scoredCandidate)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer shadow-xs ${
                isSelectedInSquad
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSelectedInSquad ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Selected</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Select for Squad</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Middle row: Metadata, Discipline & Availability Indicator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-3 text-xs border-b border-slate-100">
          {/* Column 1: Location, Department, Current Project */}
          <div className="space-y-1.5 text-slate-600">
            <div className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{employee.location}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Current: <strong className="text-slate-800">{employee.currentProject}</strong>
              </span>
            </div>
          </div>

          {/* Column 2: Capacity Band and Workload Bar */}
          <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 font-medium text-[11px]">Available Capacity:</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${availabilityBadge.bg}`}>
                {employee.availableCapacityPercent}% Free ({employee.availabilityBand})
              </span>
            </div>

            {/* Capacity Meter Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all"
                style={{ width: `${employee.availableCapacityPercent}%` }}
                title={`${employee.availableCapacityPercent}% Available`}
              />
              <div
                className="bg-slate-400 h-full transition-all"
                style={{ width: `${employee.currentAllocationPercent}%` }}
                title={`${employee.currentAllocationPercent}% Committed Elsewhere`}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Handover Status: <strong className="text-slate-700">{employee.releaseDate}</strong></span>
              <span>Req: {deliveryRequest.workloadRequirementPercent}%</span>
            </div>
          </div>
        </div>

        {/* Skills Row */}
        <div className="pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700">Verified Skills & Match:</span>
            <span className="text-[11px] text-slate-400">
              {scoreBreakdown.matchedMustHaveSkills.length} required skills matched
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {employee.skills.map((skill) => {
              const isMust = matchedMustHaves.has(skill.name);
              const isNice = matchedNiceToHaves.has(skill.name);

              let chipClass = 'bg-slate-100 text-slate-700 border-slate-200';
              if (isMust) {
                chipClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
              } else if (isNice) {
                chipClass = 'bg-blue-100 text-blue-900 border-blue-300 font-medium';
              }

              return (
                <span
                  key={skill.name}
                  className={`inline-flex items-center text-[11px] px-2 py-0.5 rounded-md border ${chipClass}`}
                >
                  {isMust && <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1" />}
                  {isNice && <Plus className="w-3 h-3 text-blue-600 mr-0.5" />}
                  <span>{skill.name}</span>
                  <span className="ml-1 text-[10px] opacity-70">({skill.level})</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* "Why Recommended" Accordion Toggle */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-700 hover:text-blue-700 transition cursor-pointer"
          >
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Why is this person recommended?</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (Click to view auditable score breakdown)
              </span>
            </div>
            {showExplanation ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showExplanation && (
            <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3 text-xs animate-in fade-in duration-100">
              {/* Detailed 4-pillar progress bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Skills</span>
                    <strong className="text-blue-700">{scoreBreakdown.skillMatchScore}/40</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full"
                      style={{ width: `${(scoreBreakdown.skillMatchScore / 40) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Availability</span>
                    <strong className="text-emerald-700">{scoreBreakdown.availabilityScore}/30</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${(scoreBreakdown.availabilityScore / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Role Alignment</span>
                    <strong className="text-indigo-700">{scoreBreakdown.roleScore}/20</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full"
                      style={{ width: `${(scoreBreakdown.roleScore / 20) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>Workload Buffer</span>
                    <strong className="text-amber-700">{scoreBreakdown.workloadScore}/10</strong>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full"
                      style={{ width: `${(scoreBreakdown.workloadScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Rationale Bullet Points */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-700 block">Matching Evidence:</span>
                <ul className="space-y-1 text-slate-600">
                  {scoreBreakdown.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Warnings */}
              {scoreBreakdown.riskFlags.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-rose-700 flex items-center space-x-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Resource & Delivery Considerations:</span>
                  </span>
                  <ul className="space-y-1 text-rose-800 text-[11px]">
                    {scoreBreakdown.riskFlags.map((risk, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
