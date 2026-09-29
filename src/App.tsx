import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ExecutiveIntelligenceCockpit } from './components/ExecutiveIntelligenceCockpit';
import { ProfileBriefing } from './components/ProfileBriefing';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { SendMessageModal } from './components/SendMessageModal';
import { ProfileModal } from './components/ProfileModal';
import { ScheduleModal } from './components/ScheduleModal';
import { AdditionalLanguageView } from './components/AdditionalLanguageView';
import {
  JobPosting,
  NotablePatterns,
  CandidateProfile,
  ScheduleConfig,
  ScheduleRunLog,
  ApplicationStatus,
} from './types/job';
import { INITIAL_CURATED_JOBS, NOTABLE_PATTERNS, ADDITIONAL_LANGUAGE_JOBS } from './data/curatedJobs';
import { INITIAL_PROFILES, LILLY_PROFILE } from './data/presetProfiles';
import { rankJobsForProfile } from './utils/matchingEngine';
import {
  Search,
  ArrowUpDown,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  User,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Languages,
} from 'lucide-react';

const DEFAULT_SCHEDULE: ScheduleConfig = {
  id: 'sched-default',
  profileId: 'profile-lilly',
  enabled: true,
  frequency: 'daily',
  runTime: '08:30',
  timezone: 'Europe/Paris',
  targetEmail: 'lilly.pm.paris@gmail.com',
  channels: {
    email: true,
    dashboardNotification: true,
    webhook: false,
  },
  status: 'active',
  lastRunTimestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
};

export default function App() {
  // Profiles store
  const [allProfiles, setAllProfiles] = useState<CandidateProfile[]>(() => {
    try {
      const saved = localStorage.getItem('executive_pm_profiles');
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfile, setActiveProfile] = useState<CandidateProfile>(() => {
    try {
      const savedId = localStorage.getItem('executive_pm_active_profile_id');
      const found = allProfiles.find((p) => p.id === savedId);
      return found || LILLY_PROFILE;
    } catch {
      return LILLY_PROFILE;
    }
  });

  // Schedule store
  const [schedule, setSchedule] = useState<ScheduleConfig>(() => {
    try {
      const saved = localStorage.getItem('executive_pm_schedule');
      return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
    } catch {
      return DEFAULT_SCHEDULE;
    }
  });

  const [runLogs, setRunLogs] = useState<ScheduleRunLog[]>(() => {
    try {
      const saved = localStorage.getItem('executive_pm_run_logs');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'log-seed',
              scheduleId: 'sched-default',
              profileId: LILLY_PROFILE.id,
              profileName: LILLY_PROFILE.name,
              timestamp: new Date().toISOString(),
              status: 'success',
              jobsScanned: 50,
              topFitScore: 99,
              deliveredTo: LILLY_PROFILE.emailNotification || 'lilly.pm.paris@gmail.com',
              digestSummary: 'Top 50 Curated PM/Senior PM Roles matched and ranked.',
            },
          ];
    } catch {
      return [];
    }
  });

  // Raw unranked jobs pool
  const [rawJobs, setRawJobs] = useState<JobPosting[]>(INITIAL_CURATED_JOBS);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // Application Pipeline state stored in localStorage
  const [pipelineMap, setPipelineMap] = useState<Record<string, ApplicationStatus>>(() => {
    try {
      const saved = localStorage.getItem('lilly_pm_pipeline');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modals & Navigation
  const [activeView, setActiveView] = useState<'ranked' | 'additional-languages' | 'patterns' | 'pipeline' | 'profile'>('ranked');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isSendMessageOpen, setIsSendMessageOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLocationPriority, setSelectedLocationPriority] = useState<number | 'all'>('all');
  const [filterPostingStatus, setFilterPostingStatus] = useState<'all' | 'fresh' | 'repost'>('all');
  const [sortBy, setSortBy] = useState<'fit' | 'recency' | 'company'>('fit');
  const [filterPipeline, setFilterPipeline] = useState<string>('all');

  // Persist state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('executive_pm_profiles', JSON.stringify(allProfiles));
      localStorage.setItem('executive_pm_active_profile_id', activeProfile.id);
      localStorage.setItem('executive_pm_schedule', JSON.stringify(schedule));
      localStorage.setItem('executive_pm_run_logs', JSON.stringify(runLogs));
      localStorage.setItem('lilly_pm_pipeline', JSON.stringify(pipelineMap));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [allProfiles, activeProfile, schedule, runLogs, pipelineMap]);

  // Compute dynamically ranked jobs & patterns for active profile
  const { rankedJobs, additionalLanguageJobs, dynamicPatterns } = useMemo(() => {
    const res = rankJobsForProfile(rawJobs, activeProfile, ADDITIONAL_LANGUAGE_JOBS);
    return {
      rankedJobs: res.rankedJobs,
      additionalLanguageJobs: res.additionalLanguageJobs,
      dynamicPatterns: res.patterns,
    };
  }, [rawJobs, activeProfile]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/jobs/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile }),
      });
      const data = await res.json();
      if (data.success && data.jobs) {
        setRawJobs(data.jobs);
        setLastUpdated(data.lastUpdated);
      }
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTriggerScheduledRun = async () => {
    try {
      const res = await fetch('/api/schedule/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: activeProfile,
          scheduleId: schedule.id,
          targetEmail: schedule.targetEmail || activeProfile.emailNotification,
        }),
      });
      const data = await res.json();
      if (data.success && data.runLog) {
        setRunLogs((prev) => [data.runLog, ...prev.slice(0, 19)]);
        setSchedule((prev) => ({
          ...prev,
          lastRunTimestamp: data.runLog.timestamp,
        }));
      }
    } catch (err) {
      console.error('Failed to run scheduled job:', err);
    }
  };

  const handleSaveProfile = (updatedProfile: CandidateProfile) => {
    setAllProfiles((prev) => {
      const index = prev.findIndex((p) => p.id === updatedProfile.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = updatedProfile;
        return copy;
      }
      return [...prev, updatedProfile];
    });
    setActiveProfile(updatedProfile);
  };

  const handleSelectProfile = (selected: CandidateProfile) => {
    setActiveProfile(selected);
    setSchedule((prev) => ({
      ...prev,
      profileId: selected.id,
      targetEmail: selected.emailNotification || prev.targetEmail,
    }));
  };

  const handleSaveSchedule = (newConfig: ScheduleConfig) => {
    setSchedule(newConfig);
  };

  const updateJobStatus = (jobId: string, status: ApplicationStatus) => {
    setPipelineMap((prev) => ({
      ...prev,
      [jobId]: status,
    }));
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = rankedJobs.length;
    const remoteEmea = rankedJobs.filter((j) => j.locationPriority === 1).length;
    const remoteGlobal = rankedJobs.filter((j) => j.locationPriority === 2).length;
    const parisHub = rankedJobs.filter((j) => j.locationPriority === 3).length;
    const avgFit = Math.round(
      rankedJobs.reduce((acc, curr) => acc + curr.fitScore, 0) / (total || 1)
    );
    const saved = Object.values(pipelineMap).filter((s) => s === 'saved').length;
    const applied = Object.values(pipelineMap).filter(
      (s) => s === 'applied' || s === 'interviewing' || s === 'offer'
    ).length;

    return { total, remoteEmea, remoteGlobal, parisHub, avgFit, saved, applied };
  }, [rankedJobs, pipelineMap]);

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    return rankedJobs
      .filter((job) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchCompany = job.company.toLowerCase().includes(q);
          const matchDomain = job.domain.toLowerCase().includes(q);
          const matchFit = job.fitReason.toLowerCase().includes(q);
          const matchLocation = job.location.toLowerCase().includes(q);
          const matchIndustry = (job.industry || '').toLowerCase().includes(q);
          const matchArea = (job.area || '').toLowerCase().includes(q);
          const matchSources = (job.verificationSources || []).some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchDomain && !matchFit && !matchLocation && !matchIndustry && !matchArea && !matchSources) {
            return false;
          }
        }

        // Domain filter
        if (selectedDomain !== 'all' && job.domain !== selectedDomain) {
          return false;
        }

        // Location priority filter
        if (
          selectedLocationPriority !== 'all' &&
          job.locationPriority !== selectedLocationPriority
        ) {
          return false;
        }

        // Posting status filter (fresh vs repost)
        if (filterPostingStatus !== 'all' && job.postingStatus !== filterPostingStatus) {
          return false;
        }

        // Pipeline filter
        const currentStatus = pipelineMap[job.id] || 'untracked';
        if (activeView === 'pipeline') {
          if (currentStatus === 'untracked') return false;
        }
        if (filterPipeline !== 'all' && currentStatus !== filterPipeline) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fit') {
          return a.rank - b.rank; // Ranked 1 to 50
        }
        if (sortBy === 'recency') {
          return new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime();
        }
        if (sortBy === 'company') {
          return a.company.localeCompare(b.company);
        }
        return 0;
      });
  }, [
    rankedJobs,
    searchQuery,
    selectedDomain,
    selectedLocationPriority,
    sortBy,
    filterPipeline,
    pipelineMap,
    activeView,
  ]);

  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = { all: rankedJobs.length };
    rankedJobs.forEach((j) => {
      counts[j.domain] = (counts[j.domain] || 0) + 1;
    });
    return counts;
  }, [rankedJobs]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white pb-16">
      {/* 3-Zone Header Contract with Profile & Schedule Triggers */}
      <Header
        activeProfile={activeProfile}
        schedule={schedule}
        activeView={activeView}
        setActiveView={setActiveView}
        savedCount={stats.saved}
        appliedCount={stats.applied}
        additionalLanguagesCount={additionalLanguageJobs.length}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenSendMessage={() => setIsSendMessageOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Active Profile & Schedule Status Banner */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-neutral-600">
            <span className="font-semibold text-neutral-900 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-neutral-700" />
              Active Profile: {activeProfile.name}
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{activeProfile.targetRole}</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>{activeProfile.experienceYears}+ Yrs</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-500 font-medium">1. {activeProfile.locationPreferences.priority1}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>
                Schedule:{' '}
                <span className="font-medium text-neutral-900">
                  {schedule.enabled ? `${schedule.runTime} ${schedule.frequency}` : 'Paused'}
                </span>
              </span>
            </div>

            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
            >
              Configure Schedule
            </button>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2"
            >
              Switch Profile
            </button>
          </div>
        </div>

        {/* View 1: Top 50 Ranked Feed */}
        {activeView === 'ranked' && (
          <>
            {/* 1. Candidate Context Collapsible Briefing Widget with internal element to view full profile */}
            <ProfileBriefing
              profile={activeProfile}
              onOpenProfileModal={() => setIsProfileModalOpen(true)}
            />

            {/* 2. Unified Executive Intelligence Cockpit: Executive Summary and Summary Dashboard Numbers in a Single Element */}
            <ExecutiveIntelligenceCockpit
              patterns={dynamicPatterns}
              stats={stats}
              candidateName={activeProfile.name}
              onFilterCompany={(company: string) => setSearchQuery(company)}
            />

            {/* Top 50 English-Only Quality Invariant & Segregated Language Alert Banner */}
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-start sm:items-center gap-2.5 text-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-semibold text-emerald-950">Top 50 English-Only Invariant Enforced:</span>{' '}
                  <span className="text-neutral-700">All 50 ranked roles below operate 100% in English. {additionalLanguageJobs.length} roles requiring mandatory French (including Pennylane, PayFit, and Swile) have been segregated to the <strong>Additional Language Requirements</strong> tab.</span>
                </div>
              </div>

              <button
                onClick={() => setActiveView('additional-languages')}
                className="inline-flex items-center gap-1.5 font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200/90 border border-amber-300/80 px-3 py-1.5 rounded-lg transition-colors shrink-0 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <Languages className="w-3.5 h-3.5 text-amber-700" />
                <span>View Additional Language Roles ({additionalLanguageJobs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter & Controls Toolbar */}
            <div className="bg-white rounded-xl p-4 sm:p-5 border border-neutral-200 shadow-xs space-y-4">
              {/* Search & sorting row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search 50 roles for ${activeProfile.name} by company, domain, or title...`}
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

                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  {/* Posting Status Filter (Fresh vs Repost) */}
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={filterPostingStatus}
                      onChange={(e) => setFilterPostingStatus(e.target.value as 'all' | 'fresh' | 'repost')}
                      className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                    >
                      <option value="all">All Posting Statuses</option>
                      <option value="fresh">Fresh Original Posts</option>
                      <option value="repost">Reposted / Refreshed</option>
                    </select>
                  </div>

                  {/* Location Priority Filter */}
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={selectedLocationPriority}
                      onChange={(e) =>
                        setSelectedLocationPriority(
                          e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10)
                        )
                      }
                      className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                    >
                      <option value="all">All Location Priorities</option>
                      <option value="1">Priority 1 · {activeProfile.locationPreferences.priority1} ({stats.remoteEmea})</option>
                      <option value="2">Priority 2 · {activeProfile.locationPreferences.priority2} ({stats.remoteGlobal})</option>
                      <option value="3">Priority 3 · {activeProfile.locationPreferences.priority3} ({stats.parisHub})</option>
                    </select>
                  </div>

                  {/* Sort Selector */}
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'fit' | 'recency' | 'company')}
                      className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-neutral-400 cursor-pointer"
                    >
                      <option value="fit">Ranked Relevancy (#1 to #50)</option>
                      <option value="recency">Posting Recency (Newest First)</option>
                      <option value="company">Company Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Domain Segmented Filter Tabs */}
              <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'all', label: 'All Sectors', count: domainCounts['all'] || 50 },
                  { id: 'Conversational AI & CX', label: 'Conversational AI & CX', count: domainCounts['Conversational AI & CX'] || 0 },
                  { id: 'AI & GenAI Products', label: 'AI & GenAI Products', count: domainCounts['AI & GenAI Products'] || 0 },
                  { id: 'Operational Automation', label: 'Operational Automation', count: domainCounts['Operational Automation'] || 0 },
                  { id: 'B2B SaaS (ERP / CRM / Marketing)', label: 'B2B SaaS & ERP/CRM', count: domainCounts['B2B SaaS (ERP / CRM / Marketing)'] || 0 },
                  { id: 'E-Commerce', label: 'E-Commerce', count: domainCounts['E-Commerce'] || 0 },
                  { id: 'Supply Chain & Logistics', label: 'Supply Chain & Logistics', count: domainCounts['Supply Chain & Logistics'] || 0 },
                ].map((item) => {
                  const isActive = selectedDomain === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedDomain(item.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-100/80 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`text-[11px] font-mono tabular-nums ${isActive ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {item.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results Counter */}
            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <div>
                Showing <span className="font-semibold text-neutral-900 font-mono tabular-nums">{filteredJobs.length}</span> of 50 curated executive roles for {activeProfile.name}
                {searchQuery && (
                  <span> matching "<span className="font-medium text-neutral-800">{searchQuery}</span>"</span>
                )}
              </div>

              {(searchQuery || selectedDomain !== 'all' || selectedLocationPriority !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDomain('all');
                    setSelectedLocationPriority('all');
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-medium underline underline-offset-2"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Top 50 Ranked Jobs List */}
            <div className="space-y-3">
              {filteredJobs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 space-y-3">
                  <div className="text-base font-semibold text-neutral-900">
                    No matching roles found
                  </div>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try clearing your search query or selecting "All Sectors" to view the full top 50 ranked list.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedDomain('all');
                      setSelectedLocationPriority('all');
                    }}
                    className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    View All 50 Roles
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    pipelineStatus={pipelineMap[job.id] || 'untracked'}
                    onUpdateStatus={updateJobStatus}
                    onSelectJob={(j) => setSelectedJob(j)}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* View 2: Roles with Mandatory Additional Language Requirements (Pennylane, PayFit, Swile, etc.) */}
        {activeView === 'additional-languages' && (
          <AdditionalLanguageView
            jobs={additionalLanguageJobs}
            candidateName={activeProfile.name}
            pipelineMap={pipelineMap}
            onUpdateStatus={updateJobStatus}
            onSelectJob={(j) => setSelectedJob(j)}
            onSwitchToRanked={() => setActiveView('ranked')}
          />
        )}

        {/* View 3: Hiring Patterns Detailed View */}
        {activeView === 'patterns' && (
          <div className="space-y-6">
            <ExecutiveIntelligenceCockpit
              patterns={dynamicPatterns}
              stats={stats}
              candidateName={activeProfile.name}
              onFilterCompany={(company: string) => {
                setSearchQuery(company);
                setActiveView('ranked');
              }}
            />

            <div className="bg-white rounded-xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-6">
              <h3 className="text-lg font-bold text-neutral-900">
                Executive Hiring Dynamics for {activeProfile.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900">
                    Domain Synergy & Alignment
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Based on your targeted domains ({activeProfile.targetSectors.slice(0, 3).join(', ')}) and previous tenure at {activeProfile.previousCompanies.map((c) => c.name).join(', ')}, hiring committees seek leaders who bridge operational scale with agentic AI workflows.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                  <h4 className="text-sm font-semibold text-neutral-900">
                    Location & Seniority Matching
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Over {Math.round((stats.remoteEmea / 50) * 100)}% of matched positions allow remote work within EMEA, enabling full executive compensation packages with zero relocation friction.
                  </p>
                </div>
              </div>

              {/* Multi-hire company breakdowns */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <h4 className="text-sm font-semibold text-neutral-900">
                  Target Companies Actively Hiring Multiple Roles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dynamicPatterns.topHiringCompanies.map((c) => (
                    <div
                      key={c.company}
                      className="p-4 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900">{c.company}</span>
                        <span className="text-xs font-mono text-neutral-500 tabular-nums">
                          {c.count} openings
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600">{c.note}</p>
                      <button
                        onClick={() => {
                          setSearchQuery(c.company);
                          setActiveView('ranked');
                        }}
                        className="text-xs font-medium text-neutral-900 hover:underline pt-1 inline-block"
                      >
                        View {c.company} Roles →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Application Pipeline Tracker */}
        {activeView === 'pipeline' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {activeProfile.name}’s Application Pipeline
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Track saved roles, submitted applications, interview stages, and personalized pitches.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterPipeline}
                  onChange={(e) => setFilterPipeline(e.target.value)}
                  className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 text-neutral-800 font-medium"
                >
                  <option value="all">All Pipeline Stages</option>
                  <option value="saved">Saved ({stats.saved})</option>
                  <option value="applied">Applied ({stats.applied})</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offer">Offer Received</option>
                </select>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-neutral-200 space-y-3">
                <div className="text-base font-semibold text-neutral-900">
                  No roles in this pipeline stage yet
                </div>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Click the bookmark icon or update the status on any of the top 50 ranked roles to track them here.
                </p>
                <button
                  onClick={() => setActiveView('ranked')}
                  className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Browse Top 50 Ranked Feed
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    pipelineStatus={pipelineMap[job.id] || 'untracked'}
                    onUpdateStatus={updateJobStatus}
                    onSelectJob={(j) => setSelectedJob(j)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 4: Full Profile Fit Briefing */}
        {activeView === 'profile' && (
          <div className="space-y-6">
            <ProfileBriefing
              profile={activeProfile}
              onEditProfile={() => setIsProfileModalOpen(true)}
            />

            <div className="bg-white rounded-xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-neutral-900">
                  Dynamic Relevancy & Recency Ranking Weights
                </h3>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Edit Profile Criteria
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-semibold text-neutral-900">40% · Sector Synergy</div>
                  <p className="text-neutral-600">
                    Direct overlap with {activeProfile.targetSectors.slice(0, 3).join(', ')} and past company domains.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-semibold text-neutral-900">30% · Location Hierarchy</div>
                  <p className="text-neutral-600">
                    Priority 1: {activeProfile.locationPreferences.priority1} &gt; Priority 2: {activeProfile.locationPreferences.priority2} &gt; Priority 3: {activeProfile.locationPreferences.priority3}.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-semibold text-neutral-900">20% · Seniority Match</div>
                  <p className="text-neutral-600">
                    Calibrated specifically for {activeProfile.experienceYears}+ years experience without junior dilution.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-1">
                  <div className="font-semibold text-neutral-900">10% · Recency & Language</div>
                  <p className="text-neutral-600">
                    Heavy recency boost for roles posted in the last 7 days + English-first validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Detail & Tailored Pitch Modal */}
      <JobDetailModal
        job={selectedJob}
        activeProfile={activeProfile}
        onClose={() => setSelectedJob(null)}
        pipelineStatus={selectedJob ? pipelineMap[selectedJob.id] || 'untracked' : 'untracked'}
        onUpdateStatus={updateJobStatus}
      />

      {/* Send User Message & Deliver List Modal */}
      {isSendMessageOpen && (
        <SendMessageModal
          jobs={rankedJobs}
          additionalLanguageJobs={additionalLanguageJobs}
          patterns={dynamicPatterns}
          activeProfile={activeProfile}
          onClose={() => setIsSendMessageOpen(false)}
        />
      )}

      {/* Profile & Criteria Manager Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          currentProfile={activeProfile}
          allProfiles={allProfiles}
          onSelectProfile={handleSelectProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* Schedule Automation Modal */}
      {isScheduleModalOpen && (
        <ScheduleModal
          schedule={schedule}
          activeProfile={activeProfile}
          runLogs={runLogs}
          onSaveSchedule={handleSaveSchedule}
          onTriggerNow={handleTriggerScheduledRun}
          onClose={() => setIsScheduleModalOpen(false)}
        />
      )}
    </div>
  );
}
