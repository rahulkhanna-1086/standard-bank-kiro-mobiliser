import React from 'react';
import { Discipline, AvailabilityBand } from '../types';
import { Search, Filter, Sparkles, X } from 'lucide-react';

interface CandidateFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDiscipline: string;
  onDisciplineChange: (discipline: string) => void;
  selectedAvailability: string;
  onAvailabilityChange: (band: string) => void;
  sortBy: 'score' | 'capacity' | 'seniority';
  onSortByChange: (sort: 'score' | 'capacity' | 'seniority') => void;
  onAutoAssemble: () => void;
  totalFilteredCount: number;
}

const DISCIPLINES: Array<string> = ['All', 'Architecture', 'Engineering', 'Testing', 'Data', 'Delivery'];
const AVAILABILITY_BANDS: Array<string> = ['All', 'Immediate', 'Moderate', 'Constrained'];

export const CandidateFilters: React.FC<CandidateFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedAvailability,
  onAvailabilityChange,
  sortBy,
  onSortByChange,
  onAutoAssemble,
  totalFilteredCount,
}) => {
  const hasActiveFilters = searchQuery !== '' || selectedDiscipline !== 'All' || selectedAvailability !== 'All';

  const handleResetFilters = () => {
    onSearchChange('');
    onDisciplineChange('All');
    onAvailabilityChange('All');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-sm space-y-3">
      {/* Top row: Search input & Auto-Assemble button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="search-talent-input"
            type="text"
            placeholder="Search by candidate name, role, or skill (e.g., Kafka, AWS, Playwright)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action button */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-auto-assemble"
            onClick={onAutoAssemble}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
            title="Auto-fill the required squad slots using top-ranked matching candidates"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            <span>Auto-Assemble Top Squad</span>
          </button>
        </div>
      </div>

      {/* Second row: Discipline tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-slate-400 font-medium mr-1.5 hidden sm:inline">
            Discipline:
          </span>
          {DISCIPLINES.map((disc) => (
            <button
              key={disc}
              onClick={() => onDisciplineChange(disc)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                selectedDiscipline === disc
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {disc}
            </button>
          ))}
        </div>

        {/* Availability & Sorting Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-medium">Availability:</span>
            <select
              value={selectedAvailability}
              onChange={(e) => onAvailabilityChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium cursor-pointer"
            >
              <option value="All">All Bands</option>
              <option value="Immediate">Immediate (75%+)</option>
              <option value="Moderate">Moderate (40-74%)</option>
              <option value="Constrained">Constrained (&lt;40%)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium cursor-pointer"
            >
              <option value="score">Match Score (High-Low)</option>
              <option value="capacity">Available Capacity (High-Low)</option>
              <option value="seniority">Seniority (High-Low)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium underline ml-1 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Shortlist summary info */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-800">{totalFilteredCount}</strong> ranked candidates matching current criteria
        </span>
        <span className="text-[11px] text-slate-400">
          Ranked in real-time by deterministic scoring
        </span>
      </div>
    </div>
  );
};
