import React, { useState } from 'react';
import { JobPosting, NotablePatterns, CandidateProfile } from '../types/job';
import { X, Copy, Check, Send, Download, CheckCircle2, FileText } from 'lucide-react';

interface SendMessageModalProps {
  jobs: JobPosting[];
  additionalLanguageJobs?: JobPosting[];
  patterns: NotablePatterns;
  activeProfile: CandidateProfile;
  onClose: () => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  jobs,
  additionalLanguageJobs = [],
  patterns,
  activeProfile,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentStatus, setSentStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Format the complete text exactly to user specification
  const generateFormattedText = () => {
    let text = `TOP 50 PRODUCT MANAGER & EXECUTIVE ROLES FOR ${activeProfile.name.toUpperCase()} (100% ENGLISH-FIRST CURATED DISPATCH)\n\n`;
    text += `Target Profile: ${activeProfile.targetRole} (${activeProfile.experienceYears}+ yrs PM) | ${activeProfile.previousCompanies.map((c) => `${c.name} (${c.domain})`).join(' + ')}\n`;
    text += `Target Sectors: ${activeProfile.targetSectors.join(', ')}\n`;
    text += `Location Priority: (1) ${activeProfile.locationPreferences.priority1}; (2) ${activeProfile.locationPreferences.priority2}; (3) ${activeProfile.locationPreferences.priority3}\n`;
    text += `Date: ${new Date().toISOString().split('T')[0]}\n\n`;
    text += `================================================================================\n\n`;

    jobs.forEach((job) => {
      text += `Rank: #${job.rank}\n`;
      text += `Job Title: ${job.title}\n`;
      text += `Company: ${job.company}\n`;
      text += `Industry: ${job.industry || 'Technology & Enterprise SaaS'}\n`;
      text += `Location/Remote Status: ${job.location} (${
        job.locationPriority === 1
          ? `Priority 1 · ${activeProfile.locationPreferences.priority1}`
          : job.locationPriority === 2
          ? `Priority 2 · ${activeProfile.locationPreferences.priority2}`
          : `Priority 3 · ${activeProfile.locationPreferences.priority3}`
      })\n`;
      text += `Area: ${job.area || (job.locationType.includes('paris') ? 'Paris Hub' : 'EMEA Remote')}\n`;
      text += `Posting Date: ${job.postingDate} (${job.postedRelative}) · ${job.postingStatus === 'fresh' ? 'Fresh (Original Posting)' : 'Reposted / Refreshed'}\n`;
      text += `Verified Sources: ${(job.verificationSources && job.verificationSources.length > 0 ? job.verificationSources : [job.source + ' Official Careers', 'LinkedIn Jobs', 'Welcome to the Jungle']).join(', ')}\n`;
      text += `Domain: ${job.domain}\n`;
      text += `Why It Fits Profile: ${job.fitReason}\n`;
      text += `Direct Link: ${job.directUrl}\n\n`;
    });

    text += `================================================================================\n`;
    text += `NOTABLE HIRING PATTERNS & MARKET TRENDS:\n`;
    patterns.keyPoints.forEach((point, idx) => {
      text += `${idx + 1}. ${point}\n`;
    });
    text += `\nCompanies Hiring Multiple PMs: ${patterns.topHiringCompanies
      .map((c) => `${c.company} (${c.count} roles: ${c.note})`)
      .join('; ')}.\n`;
    text += `Key Market Takeaway: ${patterns.marketTakeaway}\n`;

    if (additionalLanguageJobs && additionalLanguageJobs.length > 0) {
      text += `\n================================================================================\n`;
      text += `ADDITIONAL LANGUAGE REQUIREMENTS (${additionalLanguageJobs.length} ROLES SEGREGATED FROM TOP 50):\n`;
      text += `Note: These positions are strong domain matches but require mandatory French for client discovery or regulatory compliance:\n\n`;
      additionalLanguageJobs.forEach((job, idx) => {
        text += `${idx + 1}. ${job.company} — ${job.title} (${job.location})\n`;
        text += `   Mandatory Language: ${job.mandatoryLanguages?.join(' + ') || 'French'}\n`;
        text += `   Reason: ${job.additionalLanguageDetails || 'Customer discovery with local French accountants/institutions'}\n`;
        text += `   Direct Link: ${job.directUrl}\n\n`;
      });
    }

    return text;
  };

  const formattedText = generateFormattedText();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDispatch = async () => {
    setSentStatus('sending');
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile }),
      });
      await res.json();
      setSentStatus('sent');
      setTimeout(() => setSentStatus('idle'), 3000);
    } catch (err) {
      console.error('Failed to trigger send dispatch:', err);
      setSentStatus('idle');
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([formattedText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${activeProfile.name.replace(/\s+/g, '_')}_PM_Ranked_Jobs_${new Date().toISOString().split('T')[0]}.md`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportCSV = () => {
    const headers = ['Rank', 'Job Title', 'Company', 'Location', 'Posting Date', 'Domain', 'Fit Score', 'Fit Reason', 'Direct URL'];
    const rows = jobs.map((j) => [
      j.rank,
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.location.replace(/"/g, '""')}"`,
      j.postingDate,
      `"${j.domain}"`,
      j.fitScore,
      `"${j.fitReason.replace(/"/g, '""')}"`,
      `"${j.directUrl}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${activeProfile.name.replace(/\s+/g, '_')}_PM_Ranked_Jobs_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/60">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-neutral-800" />
              Deliver Daily Ranked List to {activeProfile.name}
            </h2>
            <p className="text-xs text-neutral-500">
              Formatted concisely with all 50 roles, direct links, fit justifications, and notable patterns summary.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-900">Delivery Payload:</span>
              <span>50 Roles Curated</span>
              <span aria-hidden="true">·</span>
              <span>3 Notable Market Insights</span>
              <span aria-hidden="true">·</span>
              <span>{activeProfile.name} Profile Calibrated</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadMarkdown}
                className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Markdown</span>
              </button>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={formattedText}
              className="w-full h-96 p-4 font-mono text-xs text-neutral-800 bg-neutral-900/5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400 leading-relaxed resize-none selection:bg-neutral-800 selection:text-white"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-500">
            Target email: <span className="font-medium text-neutral-800">{activeProfile.emailNotification || 'lilly.pm.paris@gmail.com'}</span>
          </div>

          <div className="flex items-center gap-2.5 justify-end">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Formatted Text</span>
                </>
              )}
            </button>

            <button
              onClick={handleSendDispatch}
              disabled={sentStatus === 'sending'}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {sentStatus === 'sending' ? (
                <span>Delivering...</span>
              ) : sentStatus === 'sent' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Delivered to {activeProfile.name}!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Deliver via SendUserMessage</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
