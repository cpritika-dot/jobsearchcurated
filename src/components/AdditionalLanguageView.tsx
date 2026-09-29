import React, { useState, useMemo } from 'react';
import { JobPosting, ApplicationStatus } from '../types/job';
import { JobCard } from './JobCard';
import {
  Languages,
  Info,
  ShieldAlert,
  Search,
  ArrowLeft,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdditionalLanguageViewProps {
  jobs: JobPosting[];
  candidateName: string;
  pipelineMap: Record<string, ApplicationStatus>;
  onUpdateStatus: (jobId: string, status: ApplicationStatus) => void;
  onSelectJob: (job: JobPosting) => void;
  onSwitchToRanked: () => void;
}

export const AdditionalLanguageView: React.FC<AdditionalLanguageViewProps> = ({
  jobs,
  candidateName,
  pipelineMap,
  onUpdateStatus,
  onSelectJob,
  onSwitchToRanked,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [showExplanation, setShowExplanation] = useState(true);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company.toLowerCase().includes(q);
        const matchDomain = job.domain.toLowerCase().includes(q);
        const matchDetails = (job.additionalLanguageDetails || '').toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchDomain && !matchDetails) {
          return false;
        }
      }

      if (selectedLanguage !== 'all') {
        const hasLang = job.mandatoryLanguages?.some(
          (l) => l.toLowerCase() === selectedLanguage.toLowerCase()
        );
        if (!hasLang) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, selectedLanguage]);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return to Top 50 Feed */}
      <div className="flex items-center justify-between">
        <button
          onClick={onSwitchToRanked}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Top 50 English-Only Feed</span>
        </button>

        <div className="text-xs text-neutral-500 font-mono">
          {jobs.length} Segregated Opportunities
        </div>
      </div>

      {/* Primary Intelligence Banner */}
      <section className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-amber-800">
              <Languages className="w-4 h-4 text-amber-700" />
              <span>Language Segregation Protocol</span>
              <span aria-hidden="true" className="text-amber-400">·</span>
              <span className="text-amber-900 font-medium">Strict Quality Invariant</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
              Roles with Mandatory Non-English Language Requirements
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-3xl">
              These {jobs.length} positions represent strong domain and seniority matches for {candidateName}’s background (ERP systems, B2B SaaS, and operational automation), but require <strong>fluent French</strong> for regulatory engagement, local clinical shadowing, or French CPA discovery.
            </p>
          </div>

          <div className="shrink-0 p-3 bg-white/80 rounded-xl border border-amber-200 text-xs text-amber-950 max-w-xs space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Top 50 Feed Protected</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-normal">
              Your primary feed contains exclusively 100% English-first roles. These roles are curated separately for your reference as you continue learning French.
            </p>
          </div>
        </div>

        {/* Collapsible Explanations Box */}
        <div className="pt-3 border-t border-amber-200/60">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 transition-colors"
          >
            <span>Why are these specific roles segregated from the Top 50?</span>
            {showExplanation ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showExplanation && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-amber-200/70 space-y-1">
                <span className="font-semibold text-neutral-900">Pennylane (Accounting / Tax)</span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Requires French to interview French chartered accountants (experts-comptables) and govern French DGFIP electronic invoicing.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200/70 space-y-1">
                <span className="font-semibold text-neutral-900">PayFit (Payroll Calculus)</span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Requires French labor law fluency to translate French collective bargaining agreements (conventions collectives) and DSN rules into software.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200/70 space-y-1">
                <span className="font-semibold text-neutral-900">Swile (Works Council / CSE)</span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Conducts user discovery directly with French CSE employee union representatives and French statutory meal voucher cap administrators.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-amber-200/70 space-y-1">
                <span className="font-semibold text-neutral-900">Doctolib & Alan (Health Tech)</span>
                <p className="text-[11px] text-neutral-600 leading-relaxed">
                  Requires French for doctor in-clinic shadowing, Ségur interoperability, and French public Sécurité Sociale (CPAM) Noémie claims.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Filter and Search Toolbar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search language-restricted roles by company or title..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500 font-medium">Filter Language:</span>
          <button
            onClick={() => setSelectedLanguage('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedLanguage === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Languages ({jobs.length})
          </button>
          <button
            onClick={() => setSelectedLanguage('French')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedLanguage === 'French'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            French Mandatory ({jobs.length})
          </button>
        </div>
      </div>

      {/* List of Segregated Roles */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-neutral-200 p-8 space-y-3">
            <Languages className="w-8 h-8 text-neutral-400 mx-auto" />
            <h4 className="text-base font-semibold text-neutral-900">
              No matching language-restricted positions found
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try adjusting your search criteria or return to the Top 50 English-Only feed.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              candidateName={candidateName}
              pipelineStatus={pipelineMap[job.id] || 'untracked'}
              onUpdateStatus={onUpdateStatus}
              onSelectJob={onSelectJob}
            />
          ))
        )}
      </div>
    </div>
  );
};
