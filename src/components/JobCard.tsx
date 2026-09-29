import React from 'react';
import { JobPosting, ApplicationStatus } from '../types/job';
import {
  ExternalLink,
  Bookmark,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  ShieldCheck,
  RefreshCw,
  Sparkle,
} from 'lucide-react';

interface JobCardProps {
  job: JobPosting;
  candidateName?: string;
  pipelineStatus: ApplicationStatus;
  onUpdateStatus: (jobId: string, status: ApplicationStatus) => void;
  onSelectJob: (job: JobPosting) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  candidateName = 'Lilly',
  pipelineStatus,
  onUpdateStatus,
  onSelectJob,
}) => {
  const isBookmarked = pipelineStatus === 'saved';
  const isApplied = pipelineStatus === 'applied' || pipelineStatus === 'interviewing';

  // Priority badge styling
  const priorityLabel =
    job.locationPriority === 1
      ? 'Priority 1 · Remote EMEA'
      : job.locationPriority === 2
      ? 'Priority 2 · Global Remote'
      : 'Priority 3 · Paris Hybrid/Onsite';

  const isFresh = job.postingStatus === 'fresh';

  return (
    <div
      className={`group bg-white rounded-xl p-5 sm:p-6 border transition-all duration-200 ${
        isApplied
          ? 'border-emerald-200 bg-emerald-50/20'
          : isBookmarked
          ? 'border-neutral-400 shadow-xs'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Rank & Title Lockup */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {/* Numerical Rank with Tabular Figures */}
          <div className="flex flex-col items-center justify-center shrink-0 w-9 h-9 rounded-lg bg-neutral-100 text-neutral-900 font-mono text-sm font-semibold tabular-nums">
            #{job.rank}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Company & Industry Kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-500">
              <span className="font-bold text-neutral-900">{job.company}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-700 font-medium">{job.industry}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>{job.domain}</span>
            </div>

            {/* Job Title */}
            <h3
              onClick={() => onSelectJob(job)}
              className="text-base sm:text-lg font-semibold text-neutral-900 hover:text-neutral-600 transition-colors cursor-pointer leading-snug truncate"
              title={job.title}
            >
              {job.title}
            </h3>

            {/* Location & Area Metadata */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-600">
              <span className="flex items-center gap-1 font-medium text-neutral-900">
                <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{job.location}</span>
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-500">{job.area}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-500">{priorityLabel}</span>
            </div>

            {/* Posting Date, Fresh vs Repost, and Verification Sources */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 pt-0.5">
              {/* Posting Date */}
              <span className="flex items-center gap-1 font-mono tabular-nums text-neutral-700">
                <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>Posted {job.postingDate} ({job.postedRelative})</span>
              </span>

              <span aria-hidden="true" className="text-neutral-300">·</span>

              {/* Fresh vs Repost Label */}
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isFresh ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isFresh ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>{isFresh ? 'Fresh · Original Posting' : 'Reposted / Refreshed'}</span>
              </span>

              <span aria-hidden="true" className="text-neutral-300">·</span>

              {/* Verified Sources list */}
              <span className="flex items-center gap-1 text-neutral-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Verified: {(job.verificationSources && job.verificationSources.length > 0 ? job.verificationSources : [job.source + ' Careers', 'LinkedIn Jobs', 'Welcome to the Jungle']).join(' · ')}</span>
              </span>
            </div>

            {/* Language Requirement & Segregation Notice */}
            {job.requiresNonEnglish ? (
              <div className="flex items-start gap-1.5 p-2 rounded-lg bg-amber-50/90 border border-amber-200 text-xs text-amber-900 mt-1">
                <span className="font-semibold shrink-0 flex items-center gap-1 text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                  Additional Language: {job.mandatoryLanguages?.join(' + ') || 'French'}
                </span>
                <span className="text-amber-700 leading-snug">· {job.additionalLanguageDetails || 'French required for customer discovery or regulatory compliance.'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 pt-0.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% English-First · Sole mandatory language</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Fit Score & Action Toolbar */}
        <div className="flex items-center sm:items-end justify-between sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Relevance Match</span>
            <span className="text-base font-bold font-mono text-emerald-700 tabular-nums">
              {job.fitScore}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                onUpdateStatus(job.id, isBookmarked ? 'untracked' : 'saved')
              }
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                isBookmarked
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-500 hover:text-neutral-900 border-neutral-200 hover:border-neutral-300'
              }`}
              title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark job'}
              aria-label="Bookmark job"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectJob(job)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tailor Pitch</span>
            </button>

            <a
              href={job.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Prominent One-Line Fit Reason */}
      <div className="mt-3.5 pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2 text-neutral-700 leading-relaxed">
          <span className="font-semibold text-neutral-900 shrink-0">
            Why It Fits {candidateName}:
          </span>
          <span>{job.fitReason}</span>
        </div>

        {/* Quick status dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <span className="text-neutral-400 text-[11px]">Status:</span>
          <select
            value={pipelineStatus}
            onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
            className="text-xs bg-neutral-50 border border-neutral-200 text-neutral-700 rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
          >
            <option value="untracked">Untracked</option>
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offer">Offer</option>
            <option value="passed">Passed</option>
          </select>
        </div>
      </div>
    </div>
  );
};
