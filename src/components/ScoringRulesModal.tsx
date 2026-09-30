import React from 'react';
import { X, Award, Clock, UserCheck, Activity, ShieldCheck } from 'lucide-react';

interface ScoringRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoringRulesModal: React.FC<ScoringRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight">Rules-Based Candidate Matching Rubric</h2>
              <p className="text-xs text-slate-300">Auditable, deterministic scoring (100 points maximum)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-sm">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-blue-900 text-xs leading-relaxed">
            <strong>Internal Governance Note:</strong> Unlike opaque black-box AI models, this prototype uses a deterministic, rule-based algorithm. Every candidate score is directly auditable by delivery leads, chapter leads, and resource governance boards.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 font-semibold text-slate-900">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>1. Skill Alignment</span>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">40 Points</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong className="text-slate-700">Must-Have Skills (30 pts):</strong> Pro-rata match for required competencies with proficiency multiplier (Expert +15%, Advanced +5%).</li>
                <li><strong className="text-slate-700">Nice-to-Have Skills (10 pts):</strong> Pro-rata match for complementary technical capabilities.</li>
              </ul>
            </div>

            {/* Pillar 2 */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 font-semibold text-slate-900">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>2. Availability Band</span>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">30 Points</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong className="text-slate-700">Immediate Band (30 pts):</strong> Free capacity &gt; 75% and available now or within 48h.</li>
                <li><strong className="text-slate-700">Moderate Band (24 pts):</strong> Free capacity between 40% and 74%.</li>
                <li><strong className="text-slate-700">Constrained Band (12-16 pts):</strong> Capacity &lt; 40%. Applies high penalty if initiative is an emergency spike.</li>
              </ul>
            </div>

            {/* Pillar 3 */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 font-semibold text-slate-900">
                  <UserCheck className="w-4 h-4 text-indigo-600" />
                  <span>3. Role & Seniority</span>
                </div>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">20 Points</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong className="text-slate-700">Primary Discipline (15 pts):</strong> Direct match with discipline chapter (Architecture, Engineering, QA, Data, Delivery).</li>
                <li><strong className="text-slate-700">Seniority Alignment (5 pts):</strong> Verification that candidate seniority meets or exceeds the required project scope.</li>
              </ul>
            </div>

            {/* Pillar 4 */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 font-semibold text-slate-900">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span>4. Workload Buffer</span>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">10 Points</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li><strong className="text-slate-700">Healthy Headroom (10 pts):</strong> Available capacity exceeds requested workload by &ge; 15%.</li>
                <li><strong className="text-slate-700">Tight Headroom (7 pts):</strong> Available capacity exactly equals requested workload.</li>
                <li><strong className="text-slate-700">Deficit (1-4 pts):</strong> Candidate is over-allocated and requires project relief.</li>
              </ul>
            </div>
          </div>

          {/* Transparent Score Range */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>85-100%: Strong Recommendation</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                <span>70-84%: Viable Fit</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <span>&lt;70%: Moderate / Constrained</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg text-xs transition cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
