import React from 'react';
import { NotablePatterns } from '../types/job';
import { TrendingUp, Building2, Globe2, Briefcase } from 'lucide-react';

interface NotablePatternsCardProps {
  patterns: NotablePatterns;
  onFilterCompany?: (company: string) => void;
}

export const NotablePatternsCard: React.FC<NotablePatternsCardProps> = ({
  patterns,
  onFilterCompany,
}) => {
  return (
    <div className="bg-neutral-900 text-white rounded-xl p-6 sm:p-7 shadow-sm border border-neutral-800">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-5 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Executive Market Intelligence · September 2026
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            {patterns.headline}
          </h2>
        </div>
        <div className="text-xs text-neutral-400 max-w-xs leading-relaxed">
          Curated specifically for Lilly’s 7+ years track record in Flipkart e-commerce, SAP enterprise software, and Factoreal B2B SaaS.
        </div>
      </div>

      {/* 2-3 Notable Patterns requested by user brief */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
        {patterns.keyPoints.map((point, index) => (
          <div key={index} className="space-y-1.5">
            <div className="text-xs font-mono text-neutral-400">
              0{index + 1}. Insight
            </div>
            <p className="text-sm text-neutral-200 leading-relaxed font-normal">
              {point}
            </p>
          </div>
        ))}
      </div>

      {/* Companies hiring multiple PMs */}
      <div className="mt-6 pt-5 border-t border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-400 shrink-0">
          <Building2 className="w-4 h-4 text-neutral-400" />
          <span className="font-medium text-neutral-300">Companies Hiring Multiple PMs:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {patterns.topHiringCompanies.map((item) => (
            <button
              key={item.company}
              onClick={() => onFilterCompany && onFilterCompany(item.company)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 transition-colors border border-neutral-700/60"
              title={item.note}
            >
              <span className="font-medium text-white">{item.company}</span>
              <span className="text-neutral-400 text-[11px] font-mono tabular-nums">
                ({item.count} roles)
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
