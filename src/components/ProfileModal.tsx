import React, { useState } from 'react';
import { CandidateProfile } from '../types/job';
import {
  X,
  User,
  Plus,
  Trash2,
  Check,
  CheckCircle2,
  Briefcase,
  MapPin,
  GraduationCap,
  Award,
  Languages,
  Sparkles,
} from 'lucide-react';

interface ProfileModalProps {
  currentProfile: CandidateProfile;
  allProfiles: CandidateProfile[];
  onSelectProfile: (profile: CandidateProfile) => void;
  onSaveProfile: (profile: CandidateProfile) => void;
  onClose: () => void;
}

const AVAILABLE_SECTORS = [
  'Conversational AI & CX',
  'AI & GenAI Products',
  'Operational Automation',
  'B2B SaaS (ERP / CRM / Marketing)',
  'E-Commerce',
  'Supply Chain & Logistics',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  currentProfile,
  allProfiles,
  onSelectProfile,
  onSaveProfile,
  onClose,
}) => {
  const [editingProfile, setEditingProfile] = useState<CandidateProfile>({
    ...currentProfile,
    previousCompanies: [...currentProfile.previousCompanies],
    education: [...currentProfile.education],
    honors: [...currentProfile.honors],
    targetSectors: [...currentProfile.targetSectors],
    criteriaExclusions: [...currentProfile.criteriaExclusions],
  });

  const [activeTab, setActiveTab] = useState<'switch' | 'edit'>('switch');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggleSector = (sector: string) => {
    setEditingProfile((prev) => {
      const exists = prev.targetSectors.includes(sector);
      return {
        ...prev,
        targetSectors: exists
          ? prev.targetSectors.filter((s) => s !== sector)
          : [...prev.targetSectors, sector],
      };
    });
  };

  const handleAddCompany = () => {
    setEditingProfile((prev) => ({
      ...prev,
      previousCompanies: [
        ...prev.previousCompanies,
        { name: '', domain: '', highlights: '' },
      ],
    }));
  };

  const handleRemoveCompany = (index: number) => {
    setEditingProfile((prev) => ({
      ...prev,
      previousCompanies: prev.previousCompanies.filter((_, i) => i !== index),
    }));
  };

  const handleCompanyChange = (
    index: number,
    field: 'name' | 'domain' | 'highlights',
    val: string
  ) => {
    setEditingProfile((prev) => {
      const updated = [...prev.previousCompanies];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, previousCompanies: updated };
    });
  };

  const handleSave = () => {
    const updated = {
      ...editingProfile,
      updatedAt: new Date().toISOString(),
    };
    onSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleCreateNew = () => {
    const newProfile: CandidateProfile = {
      id: `profile-${Date.now()}`,
      name: 'New Executive Profile',
      targetRole: 'Senior Product Manager',
      experienceYears: 7,
      currentLocation: 'Paris, France',
      locationPreferences: {
        priority1: 'Remote within EMEA',
        priority2: 'Remote Global',
        priority3: 'Paris (Hybrid / Onsite)',
      },
      languages: {
        primary: 'English (Fluent)',
        secondary: 'French (Basic)',
        mustBeEnglishFirst: true,
      },
      targetSectors: ['AI & GenAI Products', 'B2B SaaS (ERP / CRM / Marketing)'],
      previousCompanies: [
        {
          name: 'Tech Enterprise',
          domain: 'B2B Cloud SaaS',
          highlights: 'Product scaling and customer workflow automation',
        },
      ],
      education: [
        { institution: 'University', degree: 'Master of Science' },
      ],
      honors: [],
      criteriaExclusions: [
        'Skip Junior/Associate PM',
        'Exclude fluent non-English requirements',
      ],
      createdAt: new Date().toISOString(),
    };
    setEditingProfile(newProfile);
    setActiveTab('edit');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-800" />
              Executive Profile & Criteria Manager
            </h2>
            <p className="text-xs text-neutral-500">
              Customize candidate experience, target sectors, background pillars, and location priorities.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('switch')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'switch'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
              }`}
            >
              Saved Profiles ({allProfiles.length})
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'edit'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 bg-neutral-100'
              }`}
            >
              Edit Criteria: {editingProfile.name}
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Profile</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'switch' ? (
            <div className="space-y-4">
              <div className="text-xs text-neutral-500">
                Select an active profile to dynamically re-rank all 50 executive job postings and calibrate hiring intelligence:
              </div>

              <div className="grid grid-cols-1 gap-3">
                {allProfiles.map((p) => {
                  const isCurrent = p.id === currentProfile.id;
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isCurrent
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-sm'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${isCurrent ? 'text-white' : 'text-neutral-900'}`}>
                            {p.name}
                          </span>
                          <span
                            className={`text-xs ${
                              isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            · {p.targetRole} ({p.experienceYears}+ yrs)
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">
                              Active
                            </span>
                          )}
                        </div>

                        <div className={`text-xs ${isCurrent ? 'text-neutral-300' : 'text-neutral-600'}`}>
                          <span className="font-medium">Pillars:</span>{' '}
                          {p.previousCompanies.map((c) => c.name).join(', ')} ·{' '}
                          <span className="font-medium">Priority 1:</span> {p.locationPreferences.priority1}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                          {p.targetSectors.map((s) => (
                            <span
                              key={s}
                              className={`px-2 py-0.5 rounded ${
                                isCurrent
                                  ? 'bg-neutral-800 text-neutral-300'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={() => {
                            setEditingProfile(p);
                            setActiveTab('edit');
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                            isCurrent
                              ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                          }`}
                        >
                          Edit
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => {
                              onSelectProfile(p);
                              onClose();
                            }}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white transition-colors"
                          >
                            Set Active
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-xs">
              {/* Row 1: Name, Target Role, Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Candidate Name</label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) =>
                      setEditingProfile((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Target Role / Seniority</label>
                  <input
                    type="text"
                    value={editingProfile.targetRole}
                    onChange={(e) =>
                      setEditingProfile((p) => ({ ...p, targetRole: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Years of Experience</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={editingProfile.experienceYears}
                    onChange={(e) =>
                      setEditingProfile((p) => ({
                        ...p,
                        experienceYears: parseInt(e.target.value, 10) || 7,
                      }))
                    }
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Location Preferences */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 space-y-3">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                  Location Preference Hierarchy
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Priority 1 (Top Target)</label>
                    <input
                      type="text"
                      value={editingProfile.locationPreferences.priority1}
                      onChange={(e) =>
                        setEditingProfile((p) => ({
                          ...p,
                          locationPreferences: {
                            ...p.locationPreferences,
                            priority1: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg"
                      placeholder="e.g. Remote within EMEA"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Priority 2 (Secondary)</label>
                    <input
                      type="text"
                      value={editingProfile.locationPreferences.priority2}
                      onChange={(e) =>
                        setEditingProfile((p) => ({
                          ...p,
                          locationPreferences: {
                            ...p.locationPreferences,
                            priority2: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg"
                      placeholder="e.g. Remote Global"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-500 text-[11px] mb-1">Priority 3 (Local Hub)</label>
                    <input
                      type="text"
                      value={editingProfile.locationPreferences.priority3}
                      onChange={(e) =>
                        setEditingProfile((p) => ({
                          ...p,
                          locationPreferences: {
                            ...p.locationPreferences,
                            priority3: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-lg"
                      placeholder="e.g. Paris (Hybrid / Onsite)"
                    />
                  </div>
                </div>
              </div>

              {/* Target Sectors / Domains */}
              <div>
                <label className="block text-neutral-700 font-semibold mb-1.5">
                  Target Sectors & Product Domains
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SECTORS.map((sector) => {
                    const checked = editingProfile.targetSectors.includes(sector);
                    return (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => handleToggleSector(sector)}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors ${
                          checked
                            ? 'bg-neutral-900 border-neutral-900 text-white font-medium'
                            : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="truncate pr-1">{sector}</span>
                        {checked && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Past Companies & Background Pillars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-neutral-700 font-semibold">
                    Past Companies & Core Background Pillars
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCompany}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-700 hover:text-neutral-900"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Company</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {editingProfile.previousCompanies.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-neutral-200 bg-neutral-50/70 space-y-2 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveCompany(idx)}
                        className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => handleCompanyChange(idx, 'name', e.target.value)}
                          placeholder="Company name (e.g. Flipkart, SAP Labs)"
                          className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-md font-medium"
                        />
                        <input
                          type="text"
                          value={c.domain}
                          onChange={(e) => handleCompanyChange(idx, 'domain', e.target.value)}
                          placeholder="Domain (e.g. E-Commerce, Enterprise ERP)"
                          className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded-md"
                        />
                      </div>
                      <input
                        type="text"
                        value={c.highlights}
                        onChange={(e) => handleCompanyChange(idx, 'highlights', e.target.value)}
                        placeholder="Key scale & product highlights (e.g. high-volume checkout, fulfillment, B2B SaaS)"
                        className="w-full px-2.5 py-1.5 bg-white border border-neutral-200 rounded-md text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Honors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Education & Degrees
                  </label>
                  <input
                    type="text"
                    value={editingProfile.education.map((e) => `${e.institution} (${e.degree})`).join('; ')}
                    onChange={(e) => {
                      const items = e.target.value.split(';').map((str) => {
                        const trimmed = str.trim();
                        return { institution: trimmed, degree: 'Degree' };
                      });
                      setEditingProfile((p) => ({ ...p, education: items }));
                    }}
                    placeholder="e.g. IIM Bangalore (MBA); NIT Trichy (B.E.)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Honors & Distinctions
                  </label>
                  <input
                    type="text"
                    value={editingProfile.honors.join('; ')}
                    onChange={(e) =>
                      setEditingProfile((p) => ({
                        ...p,
                        honors: e.target.value.split(';').map((s) => s.trim()).filter(Boolean),
                      }))
                    }
                    placeholder="e.g. Franz Edelman Award Finalist (2025)"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <div className="text-xs text-neutral-500">
            Active: <span className="font-semibold text-neutral-900">{currentProfile.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50"
            >
              Cancel
            </button>
            {activeTab === 'edit' && (
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
