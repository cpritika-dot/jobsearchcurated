import React from 'react';
import { RefreshCw, Send, BookmarkCheck, Sparkles, User, Clock } from 'lucide-react';
import { CandidateProfile, ScheduleConfig } from '../types/job';

interface HeaderProps {
  activeProfile: CandidateProfile;
  schedule: ScheduleConfig;
  activeView: 'ranked' | 'patterns' | 'pipeline' | 'profile';
  setActiveView: (view: 'ranked' | 'patterns' | 'pipeline' | 'profile') => void;
  savedCount: number;
  appliedCount: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenSendMessage: () => void;
  onOpenProfileModal: () => void;
  onOpenScheduleModal: () => void;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeProfile,
  schedule,
  activeView,
  setActiveView,
  savedCount,
  appliedCount,
  isRefreshing,
  onRefresh,
  onOpenSendMessage,
  onOpenProfileModal,
  onOpenScheduleModal,
  lastUpdated,
}) => {
  const formattedTime = new Date(lastUpdated).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('ranked')}
            className="text-lg font-semibold tracking-tight text-neutral-900 hover:text-neutral-700 transition-colors text-left"
          >
            Dispatch <span className="text-neutral-400 font-normal">/</span> {activeProfile.name}
          </button>
          <span className="hidden lg:inline text-xs text-neutral-400 tabular-nums">
            Updated {formattedTime}
          </span>
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveView('ranked')}
            className={`transition-colors pb-0.5 ${
              activeView === 'ranked'
                ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            Top 50 Ranked Feed
          </button>

          <button
            onClick={() => setActiveView('patterns')}
            className={`transition-colors pb-0.5 flex items-center gap-1.5 ${
              activeView === 'patterns'
                ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            Hiring Patterns
          </button>

          <button
            onClick={() => setActiveView('pipeline')}
            className={`transition-colors pb-0.5 flex items-center gap-1.5 ${
              activeView === 'pipeline'
                ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            Pipeline
            {(savedCount > 0 || appliedCount > 0) && (
              <span className="text-xs bg-neutral-100 text-neutral-700 px-1.5 py-0.2 rounded font-mono tabular-nums">
                {savedCount + appliedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`transition-colors pb-0.5 ${
              activeView === 'profile'
                ? 'text-neutral-900 border-b-2 border-neutral-900 font-semibold'
                : 'hover:text-neutral-900'
            }`}
          >
            Profile Fit
          </button>
        </nav>

        {/* Zone 3: Profile, Schedule & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Profile Switcher Trigger */}
          <button
            onClick={onOpenProfileModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
            title="Switch or customize executive profile criteria"
          >
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline font-semibold">{activeProfile.name}</span>
          </button>

          {/* Schedule Automation Trigger */}
          <button
            onClick={onOpenScheduleModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors"
            title="Configure scheduled daily job run"
          >
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">
              {schedule.enabled ? schedule.runTime : 'Schedule'}
            </span>
            {schedule.enabled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          {/* Daily Scan / Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
            title="Scan & re-evaluate daily job listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xl:inline">{isRefreshing ? 'Scanning...' : 'Scan'}</span>
          </button>

          {/* Share Ranked List */}
          <button
            onClick={onOpenSendMessage}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Ranked List</span>
          </button>
        </div>
      </div>
    </header>
  );
};
