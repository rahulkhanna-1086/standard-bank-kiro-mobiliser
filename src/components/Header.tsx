import React from 'react';
import { ShieldCheck, Info, Users, Briefcase, Zap, Download } from 'lucide-react';

interface HeaderProps {
  onOpenRules: () => void;
  onOpenSpecPack: () => void;
  candidatePoolCount: number;
  availableNowCount: number;
  squadMemberCount: number;
  onOpenSquadDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenRules,
  onOpenSpecPack,
  candidatePoolCount,
  availableNowCount,
  squadMemberCount,
  onOpenSquadDrawer,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top corporate bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-lg text-white">
                  SQUAD MOBILISER
                </span>
                <span className="text-blue-400 font-medium text-xs px-2 py-0.5 bg-blue-950/70 border border-blue-800/60 rounded">
                  Group Tech & Architecture
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Delivery Squad Mobiliser • PBB Digital Engineering Talent Pool
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-xs text-slate-300 border-r border-slate-800 pr-4">
              <div className="flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>Talent Pool: <strong className="text-white">{candidatePoolCount}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Immediate Capacity: <strong className="text-emerald-400">{availableNowCount}</strong></span>
              </div>
            </div>

            <a
              id="btn-download-project"
              href="/squad-mobiliser.zip"
              download="squad-mobiliser.zip"
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-lg border border-slate-700 transition cursor-pointer"
              title="Download entire project code, specs, and docs as a .ZIP file"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Download ZIP</span>
            </a>

            <button
              id="btn-kiro-spec-pack"
              onClick={onOpenSpecPack}
              className="flex items-center space-x-1.5 text-xs bg-indigo-950/70 hover:bg-indigo-900/80 text-indigo-300 hover:text-white px-3 py-2 rounded-lg border border-indigo-800/80 transition cursor-pointer shadow-xs"
              title="View Kiro Day Spec Pack & Harness files"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span>Kiro Spec Pack</span>
            </button>

            <button
              id="btn-scoring-rules"
              onClick={onOpenRules}
              className="flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-2 rounded-lg border border-slate-700 transition cursor-pointer"
              title="View transparent scoring rules"
            >
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Scoring Rubric</span>
            </button>

            <button
              id="btn-open-squad"
              onClick={onOpenSquadDrawer}
              className="relative flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition shadow-sm cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>Proposed Squad</span>
              {squadMemberCount > 0 && (
                <span className="inline-flex items-center justify-center bg-white text-blue-900 font-bold text-xs w-5 h-5 rounded-full">
                  {squadMemberCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
