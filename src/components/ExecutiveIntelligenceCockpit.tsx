import React from 'react';
import { NotablePatterns } from '../types/job';
import { TrendingUp, Building2, Globe2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface ExecutiveIntelligenceCockpitProps {
  patterns: NotablePatterns;
  stats: {
    total: number;
    remoteEmea: number;
    remoteGlobal: number;
    parisHub: number;
    avgFit: number;
    saved: number;
    applied: number;
  };
  candidateName: string;
  onFilterCompany?: (company: string) => void;
}

export const ExecutiveIntelligenceCockpit: React.FC<ExecutiveIntelligenceCockpitProps> = ({
  patterns,
  stats,
  candidateName,
  onFilterCompany,
}) => {
  return (
    <section className="bg-neutral-900 text-white rounded-2xl shadow-sm border border-neutral-800 overflow-hidden">
      {/* Top Section: Header & Context */}
      <div className="p-6 sm:p-7 pb-5 border-b border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider uppercase text-neutral-400 mb-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Executive Hiring Intelligence & Metric Cockpit</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">September 2026 Daily Dispatch</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {patterns.headline}
            </h2>
          </div>

          <div className="text-xs text-neutral-400 max-w-md leading-relaxed bg-neutral-800/60 p-3 rounded-xl border border-neutral-700/60">
            <span className="text-neutral-200 font-medium">{candidateName}’s Intelligence Feed:</span>{' '}
            Curated daily across Greenhouse, Ashby, Lever, Welcome to the Jungle, and LinkedIn Jobs.
          </div>
        </div>
      </div>

      {/* Unified Metric Ribbon (Dashboard Numbers integrated directly into Executive Summary) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-neutral-800 divide-x divide-y sm:divide-y-0 divide-neutral-800 bg-neutral-900/80">
        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Curated Positions
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {stats.total}{' '}
            <span className="text-xs font-normal text-neutral-400">Roles</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Top 50 shortlisted</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Priority 1 · Remote EMEA
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {stats.remoteEmea}{' '}
            <span className="text-xs font-normal text-neutral-400">
              ({Math.round((stats.remoteEmea / (stats.total || 1)) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Zero relocation friction</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Priority 3 · Paris Hub
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums mt-1">
            {stats.parisHub}{' '}
            <span className="text-xs font-normal text-neutral-400">
              ({Math.round((stats.parisHub / (stats.total || 1)) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Sentier / 8th / 9th arr.</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Priority 2 · Global
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-200 tabular-nums mt-1">
            {stats.remoteGlobal}{' '}
            <span className="text-xs font-normal text-neutral-400">Roles</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Worldwide timezone flex</div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Language Invariant
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            100%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            English-first verified
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
            Avg Relevance Fit
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
            {stats.avgFit}%
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Calibrated to profile</div>
        </div>
      </div>

      {/* Middle Section: Executive Takeaways (2-3 lines required) */}
      <div className="p-6 sm:p-7 pt-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patterns.keyPoints.map((point, index) => (
            <div key={index} className="space-y-1.5">
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
                0{index + 1}. Market Trend
              </div>
              <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
                {point}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Bar: Companies Hiring Multiple PMs & Takeaway */}
        <div className="pt-4 border-t border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neutral-400 flex items-center gap-1.5 font-medium shrink-0">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              Companies Scaling Multiple Openings:
            </span>

            {patterns.topHiringCompanies.map((item) => (
              <button
                key={item.company}
                onClick={() => onFilterCompany && onFilterCompany(item.company)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700/60 cursor-pointer"
                title={item.note}
              >
                <span className="font-medium text-white">{item.company}</span>
                <span className="text-neutral-400 text-[11px] font-mono tabular-nums">
                  ({item.count})
                </span>
              </button>
            ))}
          </div>

          <div className="text-neutral-400 text-[11px] max-w-md lg:text-right">
            <span className="text-neutral-300 font-medium">Strategic takeaway:</span> {patterns.marketTakeaway}
          </div>
        </div>
      </div>
    </section>
  );
};
