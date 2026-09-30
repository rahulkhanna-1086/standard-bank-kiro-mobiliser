import React, { useState } from 'react';
import { DeliveryRequest, RoleRequirement, Discipline, Seniority } from '../types';
import { PRESET_REQUESTS, ALL_SKILL_TAGS } from '../data/talentPool';
import { Sparkles, AlertCircle, Clock, Calendar, CheckSquare, Plus, Trash2, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

interface DeliveryRequestFormProps {
  currentRequest: DeliveryRequest;
  onRequestChange: (request: DeliveryRequest) => void;
  onResetSquad: () => void;
}

const DISCIPLINES: Discipline[] = ['Architecture', 'Engineering', 'Testing', 'Data', 'Delivery'];
const SENIORITIES: Seniority[] = ['Junior', 'Mid', 'Senior', 'Lead', 'Principal'];

export const DeliveryRequestForm: React.FC<DeliveryRequestFormProps> = ({
  currentRequest,
  onRequestChange,
  onResetSquad,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeSkillInput, setActiveSkillInput] = useState<string>('');

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_REQUESTS.find((p) => p.id === presetId);
    if (preset) {
      onRequestChange({ ...preset });
      onResetSquad();
    }
  };

  const handleFieldChange = <K extends keyof DeliveryRequest>(field: K, value: DeliveryRequest[K]) => {
    onRequestChange({
      ...currentRequest,
      [field]: value,
    });
  };

  const handleRoleCountChange = (discipline: Discipline, delta: number) => {
    const existing = currentRequest.rolesNeeded.find((r) => r.discipline === discipline);
    if (existing) {
      const newCount = Math.max(0, existing.count + delta);
      if (newCount === 0) {
        // remove role
        const updated = currentRequest.rolesNeeded.filter((r) => r.discipline !== discipline);
        handleFieldChange('rolesNeeded', updated);
      } else {
        const updated = currentRequest.rolesNeeded.map((r) =>
          r.discipline === discipline ? { ...r, count: newCount } : r
        );
        handleFieldChange('rolesNeeded', updated);
      }
    } else if (delta > 0) {
      // Add new role
      const newRole: RoleRequirement = {
        id: `role-${Date.now()}`,
        discipline,
        roleTitle: `${discipline} Specialist`,
        count: 1,
        minSeniority: 'Mid',
        requiredSkills: [],
        niceToHaveSkills: [],
      };
      handleFieldChange('rolesNeeded', [...currentRequest.rolesNeeded, newRole]);
    }
  };

  const handleAddSkillToRequest = (skill: string) => {
    if (!skill) return;
    // Add to first available role or create one
    if (currentRequest.rolesNeeded.length === 0) {
      const newRole: RoleRequirement = {
        id: `role-${Date.now()}`,
        discipline: 'Engineering',
        roleTitle: 'Software Engineer',
        count: 1,
        requiredSkills: [skill],
        niceToHaveSkills: [],
      };
      handleFieldChange('rolesNeeded', [newRole]);
      return;
    }

    // Add to all roles' requiredSkills if not already present in the active first role
    const updated = currentRequest.rolesNeeded.map((role, idx) => {
      if (idx === 0) {
        if (!role.requiredSkills.includes(skill)) {
          return { ...role, requiredSkills: [...role.requiredSkills, skill] };
        }
      }
      return role;
    });
    handleFieldChange('rolesNeeded', updated);
  };

  const handleRemoveSkillFromRole = (roleIdx: number, skillToRemove: string) => {
    const updated = currentRequest.rolesNeeded.map((role, idx) => {
      if (idx === roleIdx) {
        return {
          ...role,
          requiredSkills: role.requiredSkills.filter((s) => s !== skillToRemove),
        };
      }
      return role;
    });
    handleFieldChange('rolesNeeded', updated);
  };

  const totalHeadcountRequired = currentRequest.rolesNeeded.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 transition-all">
      {/* Top Presets Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Delivery Need
          </span>
          <div className="flex items-center space-x-2 mt-0.5">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {currentRequest.title}
            </h1>
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {currentRequest.code}
            </span>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <label htmlFor="preset-select" className="text-xs text-slate-500 font-medium whitespace-nowrap flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1" />
            Quick Scenarios:
          </label>
          <select
            id="preset-select"
            value={currentRequest.id}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {PRESET_REQUESTS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Primary Attributes Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs border-b border-slate-100">
        {/* Urgency */}
        <div>
          <span className="text-slate-400 font-medium block mb-1">Mobilisation Urgency</span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleFieldChange('urgency', 'Immediate')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1 transition cursor-pointer ${
                currentRequest.urgency === 'Immediate'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Immediate (&lt;48h)</span>
            </button>
            <button
              onClick={() => handleFieldChange('urgency', 'High')}
              className={`px-2 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                currentRequest.urgency === 'High'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              High (&lt;1w)
            </button>
            <button
              onClick={() => handleFieldChange('urgency', 'Standard')}
              className={`px-2 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                currentRequest.urgency === 'Standard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Standard
            </button>
          </div>
        </div>

        {/* Duration */}
        <div>
          <span className="text-slate-400 font-medium block mb-1">Expected Duration</span>
          <div className="flex items-center space-x-1.5 text-slate-700 font-semibold mt-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <select
              value={currentRequest.duration}
              onChange={(e) => handleFieldChange('duration', e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium cursor-pointer"
            >
              <option value="2 Weeks (Spike)">2 Weeks (Spike)</option>
              <option value="1 Month (Sprint)">1 Month (Sprint)</option>
              <option value="3 Months (Quarterly)">3 Months (Quarterly)</option>
              <option value="6 Months">6 Months</option>
            </select>
          </div>
        </div>

        {/* Workload Commitment Needed */}
        <div>
          <span className="text-slate-400 font-medium block mb-1">Required Allocation</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="font-bold text-slate-900">{currentRequest.workloadRequirementPercent}%</span>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={currentRequest.workloadRequirementPercent}
              onChange={(e) => handleFieldChange('workloadRequirementPercent', Number(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="text-slate-400 text-[11px]">
              {currentRequest.workloadRequirementPercent >= 80 ? 'Full-Time' : 'Part-Time'}
            </span>
          </div>
        </div>

        {/* Target Squad Size */}
        <div>
          <span className="text-slate-400 font-medium block mb-1">Target Squad Capacity</span>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              {totalHeadcountRequired} contributors needed
            </span>
          </div>
        </div>
      </div>

      {/* Discipline Needs Counter / Slot Picker */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Discipline Requirements:</span>
            <span className="text-[11px] text-slate-500">
              (Configure the cross-functional squad positions)
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Simple View' : 'Customize Skills & Roles'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Discipline pill counters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {DISCIPLINES.map((disc) => {
            const role = currentRequest.rolesNeeded.find((r) => r.discipline === disc);
            const count = role ? role.count : 0;
            return (
              <div
                key={disc}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition ${
                  count > 0
                    ? 'border-blue-300 bg-blue-50/70 text-blue-900 font-medium'
                    : 'border-slate-200 bg-slate-50/50 text-slate-500'
                }`}
              >
                <span>{disc}</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleRoleCountChange(disc, -1)}
                    disabled={count === 0}
                    className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-4 text-center font-bold text-slate-900">{count}</span>
                  <button
                    onClick={() => handleRoleCountChange(disc, 1)}
                    className="w-5 h-5 rounded bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Customizer for Specific Required Skills */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 bg-slate-50/70 -mx-4 -mb-4 p-4 rounded-b-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Detailed Role & Skill Breakdown
              </span>
              <span className="text-[11px] text-slate-500">
                Skills specified here directly drive the 40-point Skill Alignment matching engine
              </span>
            </div>

            {currentRequest.rolesNeeded.map((role, rIdx) => (
              <div
                key={role.id}
                className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                      {role.discipline}
                    </span>
                    <input
                      type="text"
                      value={role.roleTitle}
                      onChange={(e) => {
                        const updated = currentRequest.rolesNeeded.map((r, i) =>
                          i === rIdx ? { ...r, roleTitle: e.target.value } : r
                        );
                        handleFieldChange('rolesNeeded', updated);
                      }}
                      className="text-xs font-semibold border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-600">
                    <span>Min Seniority:</span>
                    <select
                      value={role.minSeniority || 'Mid'}
                      onChange={(e) => {
                        const updated = currentRequest.rolesNeeded.map((r, i) =>
                          i === rIdx ? { ...r, minSeniority: e.target.value as Seniority } : r
                        );
                        handleFieldChange('rolesNeeded', updated);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-xs font-medium cursor-pointer"
                    >
                      {SENIORITIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skills tags for this role */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Must-Have Skills:</span>
                  {role.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    >
                      {sk}
                      <button
                        onClick={() => handleRemoveSkillFromRole(rIdx, sk)}
                        className="ml-1 text-blue-600 hover:text-blue-900 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* Add skill tag quick selector */}
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        const val = e.target.value;
                        if (!role.requiredSkills.includes(val)) {
                          const updated = currentRequest.rolesNeeded.map((r, i) =>
                            i === rIdx ? { ...r, requiredSkills: [...r.requiredSkills, val] } : r
                          );
                          handleFieldChange('rolesNeeded', updated);
                        }
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="text-[11px] bg-slate-100 border border-dashed border-slate-300 rounded px-2 py-0.5 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    <option value="" disabled>
                      + Add skill requirement
                    </option>
                    {ALL_SKILL_TAGS.filter((s) => !role.requiredSkills.includes(s)).map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
