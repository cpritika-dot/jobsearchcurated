import React, { useState } from 'react';
import { ScheduleConfig, ScheduleRunLog, CandidateProfile } from '../types/job';
import {
  X,
  Clock,
  Calendar,
  Play,
  CheckCircle2,
  AlertCircle,
  Bell,
  Mail,
  Zap,
  History,
  RotateCw,
} from 'lucide-react';

interface ScheduleModalProps {
  schedule: ScheduleConfig;
  activeProfile: CandidateProfile;
  runLogs: ScheduleRunLog[];
  onSaveSchedule: (config: ScheduleConfig) => void;
  onTriggerNow: () => Promise<void>;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  schedule,
  activeProfile,
  runLogs,
  onSaveSchedule,
  onTriggerNow,
  onClose,
}) => {
  const [config, setConfig] = useState<ScheduleConfig>({ ...schedule });
  const [isRunning, setIsRunning] = useState(false);
  const [justRan, setJustRan] = useState(false);

  const handleToggle = () => {
    setConfig((prev) => ({
      ...prev,
      enabled: !prev.enabled,
      status: !prev.enabled ? 'active' : 'paused',
    }));
  };

  const handleSave = () => {
    onSaveSchedule(config);
    onClose();
  };

  const handleRunImmediately = async () => {
    setIsRunning(true);
    try {
      await onTriggerNow();
      setJustRan(true);
      setTimeout(() => setJustRan(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-neutral-800" />
              Automated Job Dispatch Scheduler
            </h2>
            <p className="text-xs text-neutral-500">
              Configure automated daily scans and delivery at designated times for{' '}
              <span className="font-semibold text-neutral-800">{activeProfile.name}</span>.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-neutral-700">
          {/* Active Schedule Toggle Banner */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-sm text-neutral-900 flex items-center gap-2">
                <span>Scheduler Automation</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                    config.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {config.enabled ? 'ACTIVE' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Automatically scans sources, matches top 50 roles, and delivers ranked executive report.
              </p>
            </div>

            <button
              onClick={handleToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                config.enabled
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {config.enabled ? 'Pause Schedule' : 'Enable Schedule'}
            </button>
          </div>

          {/* Schedule Configuration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Recurrence Frequency
              </label>
              <select
                value={config.frequency}
                onChange={(e) =>
                  setConfig((p) => ({
                    ...p,
                    frequency: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="daily">Daily (7 days / week)</option>
                <option value="weekdays">Weekdays (Monday - Friday)</option>
                <option value="every-12h">Twice Daily (Every 12 Hours)</option>
                <option value="weekly">Weekly (Monday Mornings)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Designated Run Time
              </label>
              <input
                type="time"
                value={config.runTime}
                onChange={(e) => setConfig((p) => ({ ...p, runTime: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Timezone
              </label>
              <select
                value={config.timezone}
                onChange={(e) => setConfig((p) => ({ ...p, timezone: e.target.value }))}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
              >
                <option value="Europe/Paris">Europe/Paris (CET · UTC+1 / CEST · UTC+2)</option>
                <option value="Europe/London">Europe/London (GMT / BST)</option>
                <option value="America/New_York">America/New_York (EST / EDT)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-700 font-semibold mb-1">
                Target Email for Daily Report
              </label>
              <input
                type="email"
                value={config.targetEmail}
                onChange={(e) => setConfig((p) => ({ ...p, targetEmail: e.target.value }))}
                placeholder="e.g. lilly.pm.paris@gmail.com"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          {/* Manual Run Now Action */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Immediate Test Execution
              </div>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Trigger a scan right now for <span className="font-medium text-neutral-800">{activeProfile.name}</span> to verify matching rules.
              </p>
            </div>

            <button
              onClick={handleRunImmediately}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors disabled:opacity-50 whitespace-nowrap self-end sm:self-auto"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Running Scan...' : justRan ? 'Completed!' : 'Run Scheduled Job Now'}</span>
            </button>
          </div>

          {/* Past Execution History Log */}
          <div className="space-y-2.5 pt-2">
            <div className="font-semibold text-neutral-900 flex items-center gap-1.5 text-xs">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              Recent Scheduled Run History & Deliveries
            </div>

            <div className="space-y-2">
              {runLogs.length === 0 ? (
                <div className="p-4 rounded-lg border border-neutral-200 bg-neutral-50 text-center text-neutral-400">
                  No automated execution records yet. Click "Run Scheduled Job Now" above to trigger a test run.
                </div>
              ) : (
                runLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold text-neutral-900">
                          {log.profileName} Dispatch
                        </span>
                        <span className="text-neutral-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {log.digestSummary} · Delivered to {log.deliveredTo}
                      </div>
                    </div>

                    <div className="text-right text-[11px] font-mono tabular-nums text-neutral-600">
                      Top Match: <span className="font-bold text-emerald-700">{log.topFitScore}%</span> · 50 Roles Ranked
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="text-[11px] text-neutral-500">
            Next scan: <span className="font-semibold text-neutral-800">{config.enabled ? `${config.runTime} (${config.timezone.split('/')[1]})` : 'Paused'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs"
            >
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
