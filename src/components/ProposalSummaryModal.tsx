import React, { useState } from 'react';
import { SquadMemberAssignment, DeliveryRequest } from '../types';
import { X, Check, Copy, Printer, ShieldCheck, Download, Users, FileCheck } from 'lucide-react';

interface ProposalSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  squad: SquadMemberAssignment[];
  deliveryRequest: DeliveryRequest;
}

export const ProposalSummaryModal: React.FC<ProposalSummaryModalProps> = ({
  isOpen,
  onClose,
  squad,
  deliveryRequest,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalCapacityAllocated = squad.reduce(
    (acc, m) => acc + m.allocatedCapacityPercent,
    0
  );

  const avgMatchScore =
    squad.length > 0
      ? Math.round(squad.reduce((acc, m) => acc + m.matchScore, 0) / squad.length)
      : 0;

  const handleCopyMarkdown = () => {
    const text = `# Squad Mobilisation Proposal
## Initiative: ${deliveryRequest.title} (${deliveryRequest.code})
**Business Unit:** ${deliveryRequest.businessUnit}
**Mobilisation Urgency:** ${deliveryRequest.urgency}
**Expected Duration:** ${deliveryRequest.duration}
**Required Allocation:** ${deliveryRequest.workloadRequirementPercent}%
**Squad Match Score:** ${avgMatchScore}% average alignment

---

### Proposed Squad Roster
${squad
  .map(
    (m, idx) =>
      `${idx + 1}. **${m.employee.name}** - ${m.employee.role} (${m.discipline} | ${m.employee.seniority})
   - Allocation: ${m.allocatedCapacityPercent}%
   - Handover/Availability: ${m.employee.releaseDate} (${m.employee.availableCapacityPercent}% free)
   - Match Score: ${m.matchScore}%
   - Location: ${m.employee.location}`
  )
  .join('\n\n')}

---
*Generated via Delivery Squad Mobiliser (Rules-Based Engine)*
`;

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

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Print not supported in sandboxed iframe', e);
      handleCopyMarkdown();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold tracking-tight">
                Squad Mobilisation Governance Brief
              </h2>
              <p className="text-xs text-slate-300">
                Formal staffing recommendation for {deliveryRequest.code}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Initiative Overview Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-slate-900">
                {deliveryRequest.title}
              </span>
              <span className="font-mono bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
                {deliveryRequest.code}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {deliveryRequest.description}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/70 text-[11px]">
              <div>
                <span className="text-slate-400 block">Business Unit</span>
                <strong className="text-slate-800">{deliveryRequest.businessUnit}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Urgency</span>
                <strong className={deliveryRequest.urgency === 'Immediate' ? 'text-rose-600' : 'text-amber-600'}>
                  {deliveryRequest.urgency}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Duration</span>
                <strong className="text-slate-800">{deliveryRequest.duration}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Required Bandwidth</span>
                <strong className="text-slate-800">{deliveryRequest.workloadRequirementPercent}% Allocation</strong>
              </div>
            </div>
          </div>

          {/* Proposed Squad Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Proposed Squad Composition ({squad.length} members)</span>
              </h3>
              <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-bold">
                Average Fit: {avgMatchScore}%
              </span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Candidate</th>
                    <th className="py-2.5 px-3">Discipline & Role</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Capacity / Status</th>
                    <th className="py-2.5 px-3 text-right">Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {squad.map((member) => (
                    <tr key={member.employeeId} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {member.employee.name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {member.employee.seniority}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-medium text-slate-800">{member.assignedRole}</span>
                        <span className="block text-[10px] text-slate-500">
                          {member.discipline} Chapter
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {member.employee.location}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-emerald-700">
                          {member.allocatedCapacityPercent}% Allocated
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {member.employee.releaseDate}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-blue-700 font-mono">
                        {member.matchScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Governance & Compliance Statement */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 space-y-1.5 text-emerald-950 text-xs">
            <div className="flex items-center space-x-1.5 font-bold">
              <FileCheck className="w-4 h-4 text-emerald-700" />
              <span>Enterprise Governance & Audit Certification</span>
            </div>
            <p className="leading-relaxed">
              This squad proposal was formulated using transparent, deterministic skill-matrix scoring, capacity headroom analysis, and role alignment criteria. No candidates were excluded based on unverified factors. Immediate approval can be logged with Chapter Facilitators for sprint kickoff.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Brief!' : 'Copy Markdown Brief'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Brief</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
