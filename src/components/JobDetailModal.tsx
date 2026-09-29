import React, { useState } from 'react';
import { JobPosting, ApplicationStatus, CandidateProfile } from '../types/job';
import {
  X,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Building,
  MapPin,
  Calendar,
  Layers,
  Award,
  Globe,
  Loader2,
} from 'lucide-react';

interface JobDetailModalProps {
  job: JobPosting | null;
  activeProfile: CandidateProfile;
  onClose: () => void;
  pipelineStatus: ApplicationStatus;
  onUpdateStatus: (jobId: string, status: ApplicationStatus) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  activeProfile,
  onClose,
  pipelineStatus,
  onUpdateStatus,
}) => {
  if (!job) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [pitchContent, setPitchContent] = useState<string | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  const handleGeneratePitch = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/jobs/tailor-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id, profile: activeProfile }),
      });
      const data = await response.json();
      if (data.success && data.pitch) {
        setPitchContent(data.pitch);
      }
    } catch (err) {
      console.error('Failed to generate tailored pitch:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPitch = () => {
    if (!pitchContent) return;
    navigator.clipboard.writeText(pitchContent);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-200 flex items-start justify-between bg-neutral-50/50">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-900">{job.company}</span>
              <span aria-hidden="true">·</span>
              <span>{job.domain}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Rank #{job.rank}</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 leading-tight">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-600 pt-1">
              <span className="font-semibold text-neutral-900">{job.industry}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="flex items-center gap-1 font-medium text-neutral-800">
                <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                {job.area || job.location}
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-500">{job.experienceBar}</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-emerald-700 font-medium">{job.languageRequirement}</span>
              {job.salaryRange && (
                <>
                  <span aria-hidden="true" className="text-neutral-300">·</span>
                  <span className="font-mono text-neutral-700">{job.salaryRange}</span>
                </>
              )}
            </div>

            {/* Posting Status & Verification Sources Row */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 pt-1">
              <span className="flex items-center gap-1 font-mono text-neutral-700">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                Posted {job.postingDate} ({job.postedRelative})
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className={job.postingStatus === 'fresh' ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                {job.postingStatus === 'fresh' ? '● Fresh · Original Posting' : '▲ Reposted / Refreshed'}
              </span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-600">
                Verified: {job.verificationSources?.join(' · ') || job.source}
              </span>
            </div>

            {/* Language Requirement Callout */}
            {job.requiresNonEnglish ? (
              <div className="mt-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-semibold text-amber-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Additional Language Requirement: {job.mandatoryLanguages?.join(' + ') || 'French'}
                </div>
                <div className="text-amber-700 leading-relaxed">
                  {job.additionalLanguageDetails || 'Mandatory non-English language requirement. Segregated from the Top 50 English pool.'}
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% English-First Role · No local language barriers</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm text-neutral-700">
          {/* Fit Reason Box */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Why This Role Strongly Fits {activeProfile.name}
            </div>
            <p className="text-sm text-emerald-950 leading-relaxed font-medium">
              {job.fitReason}
            </p>
          </div>

          {/* Background Matrix Match */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {activeProfile.name}’s Background Cross-Reference
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {activeProfile.previousCompanies.map((c, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border bg-emerald-50/40 border-emerald-200 text-emerald-900 font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{c.name} · {c.domain}</span>
                </div>
              ))}

              {activeProfile.education.map((edu, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border bg-emerald-50/40 border-emerald-200 text-emerald-900 font-medium flex items-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{edu.institution} ({edu.degree})</span>
                </div>
              ))}

              <div className="p-2.5 rounded-lg border bg-emerald-50/40 border-emerald-200 text-emerald-900 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>100% English-First Verified</span>
              </div>
            </div>
          </div>

          {/* Key Responsibilities */}
          {job.keyResponsibilities && job.keyResponsibilities.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Key Responsibilities & Scope
              </h4>
              <ul className="space-y-2 text-xs text-neutral-600">
                {job.keyResponsibilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-neutral-400 font-mono">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Tailored Pitch & Cover Letter Generator */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  Tailored Executive Application Pitch for {activeProfile.name}
                </h4>
                <p className="text-xs text-neutral-500">
                  Synthesizes candidate background pillars and target sectors directly into this job’s exact requirements.
                </p>
              </div>

              {!pitchContent && (
                <button
                  onClick={handleGeneratePitch}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Pitch...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Pitch</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {pitchContent && (
              <div className="relative p-4 rounded-xl bg-neutral-900 text-neutral-100 border border-neutral-800 space-y-3 font-sans text-xs sm:text-sm leading-relaxed">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <span className="text-xs font-mono text-neutral-400">
                    Curated Application Pitch ({activeProfile.name})
                  </span>
                  <button
                    onClick={handleCopyPitch}
                    className="inline-flex items-center gap-1 text-xs text-neutral-300 hover:text-white transition-colors"
                  >
                    {copiedPitch ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy to Clipboard</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="whitespace-pre-wrap font-sans text-neutral-200">
                  {pitchContent}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Pipeline Status:</span>
            <select
              value={pipelineStatus}
              onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
              className="text-xs bg-white border border-neutral-300 rounded px-2.5 py-1 text-neutral-800 font-medium"
            >
              <option value="untracked">Untracked</option>
              <option value="saved">Saved / Bookmarked</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer Received</option>
              <option value="passed">Passed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Close
            </button>
            <a
              href={job.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors"
            >
              <span>Apply Directly on {job.source}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
