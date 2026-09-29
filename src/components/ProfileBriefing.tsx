import React, { useState } from 'react';
import { CandidateProfile } from '../types/job';
import {
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Languages,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  User,
  ExternalLink,
} from 'lucide-react';

interface ProfileBriefingProps {
  profile: CandidateProfile;
  onOpenProfileModal?: () => void;
  onEditProfile?: () => void;
}

export const ProfileBriefing: React.FC<ProfileBriefingProps> = ({
  profile,
  onOpenProfileModal,
  onEditProfile,
}) => {
  const handleOpenProfile = onOpenProfileModal || onEditProfile || (() => {});
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs transition-all duration-200 overflow-hidden">
      {/* Collapsible Header Summary Row */}
      <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Active Candidate Match Profile
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-xs text-neutral-500 font-medium">
              Strict Quality Criteria Applied
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h3 className="text-lg font-bold text-neutral-900">
              {profile.name}
            </h3>
            <span className="text-sm text-neutral-600 font-medium">
              {profile.targetRole} ({profile.experienceYears}+ Years Experience)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-500 pt-0.5">
            <span className="flex items-center gap-1 text-neutral-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {profile.currentLocation}
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-neutral-400" />
              {profile.languages.primary}
            </span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span className="text-neutral-600">
              Top Location: <strong className="font-medium text-neutral-800">{profile.locationPreferences.priority1}</strong>
            </span>
            {profile.honors && profile.honors.length > 0 && (
              <>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {profile.honors[0]}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Elements within Profile Widget */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          {/* Element to see the profile in full if required */}
          <button
            onClick={handleOpenProfile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors cursor-pointer"
            title="Inspect full candidate parameters, add criteria, or switch profile"
          >
            <User className="w-3.5 h-3.5 text-neutral-500" />
            <span>View Full Profile</span>
          </button>

          {/* Toggle Expand / Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100/80 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Content Area */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-neutral-100 space-y-5 bg-neutral-50/40 animate-in fade-in duration-150">
          {/* Core Background Pillars */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Candidate Background Pillars & Match Criteria
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.previousCompanies.map((c, index) => (
                <div key={index} className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                    Pillar 0{index + 1} · {c.domain}
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900">{c.name}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {c.highlights}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education, Target Sectors & Location Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Education & Degrees
              </div>
              <div className="space-y-1 text-neutral-700">
                {profile.education.map((edu, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{edu.institution} ({edu.degree})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Location Preference Hierarchy
              </div>
              <div className="space-y-1 text-neutral-600 text-[11px]">
                <div>
                  <strong className="text-neutral-900 font-medium">Priority 1:</strong> {profile.locationPreferences.priority1}
                </div>
                <div>
                  <strong className="text-neutral-900 font-medium">Priority 2:</strong> {profile.locationPreferences.priority2}
                </div>
                <div>
                  <strong className="text-neutral-900 font-medium">Priority 3:</strong> {profile.locationPreferences.priority3}
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                Quality Criteria & Invariants
              </div>
              <div className="space-y-1 text-neutral-600 text-[11px]">
                <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% English-first verified</span>
                </div>
                <div className="text-neutral-600">
                  Excludes junior roles and non-English requirements.
                </div>
              </div>
            </div>
          </div>

          {/* Next Element within the profile widget: Action Bar */}
          <div className="pt-2 flex items-center justify-between text-xs text-neutral-500">
            <div>
              Target Sectors:{' '}
              <span className="font-medium text-neutral-800">
                {profile.targetSectors.join(', ')}
              </span>
            </div>

            <button
              onClick={handleOpenProfile}
              className="inline-flex items-center gap-1 font-medium text-neutral-900 hover:underline"
            >
              <span>Inspect Full Profile & Exclusions</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
