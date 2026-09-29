export interface JobPosting {
  id: string;
  rank: number;
  title: string;
  company: string;
  companyDomain?: string;
  location: string;
  locationType: 'remote-emea' | 'remote-global' | 'hybrid-paris' | 'onsite-paris' | 'remote-us' | 'hybrid-other';
  locationPriority: 1 | 2 | 3; // 1: Highest priority match, 2: Secondary match, 3: Tertiary match
  postingDate: string; // e.g. "2026-09-28"
  postedRelative: string; // e.g. "Today", "Yesterday", "2d ago"
  isOlder: boolean; // if older than 7 days
  domain: 
    | 'Conversational AI & CX'
    | 'AI & GenAI Products'
    | 'Operational Automation'
    | 'B2B SaaS (ERP / CRM / Marketing)'
    | 'E-Commerce'
    | 'Supply Chain & Logistics';
  fitScore: number; // 0 - 100
  fitReason: string; // One-line reason why it fits the profile
  experienceBar: string; // e.g. "7+ years", "7-10 years"
  languageRequirement: string; // "English-first (verified)", etc.
  directUrl: string;
  source: 'Greenhouse' | 'Lever' | 'Ashby' | 'Welcome to the Jungle' | 'LinkedIn' | 'Company Direct';
  verified: boolean; // Verified via career site / search snippet
  verificationSources?: string[]; // List of sources verified across (e.g. ['Greenhouse Careers', 'LinkedIn Jobs', 'Welcome to the Jungle'])
  industry?: string; // Industry of the company (e.g. 'E-Commerce & Retail Tech', 'Enterprise Cloud & AI')
  area?: string; // Specific area/district/arrondissement (e.g. 'Paris - 2nd Arr. (Sentier)', 'EMEA Remote (Europe Timezone)')
  postingStatus?: 'fresh' | 'repost'; // Whether it is fresh original posting or a reposted/refreshed role
  tags: string[];
  department?: string;
  salaryRange?: string;
  keyResponsibilities?: string[];
  backgroundMatch: {
    flipkartEcommerce?: boolean;
    sapEnterpriseErp?: boolean;
    factorealB2bSaas?: boolean;
    edelmanAnalytics?: boolean;
    iimBangaloreMba?: boolean;
    domainMatchRate?: number;
    locationMatchRate?: number;
  };
}

export interface CandidateProfile {
  id: string;
  name: string;
  targetRole: string; // e.g. "Senior Product Manager", "Lead PM / Group PM", "VP of Product"
  experienceYears: number; // e.g. 7
  experienceRangeMin?: number;
  experienceRangeMax?: number;
  currentLocation: string; // e.g. "Paris, France"
  locationPreferences: {
    priority1: string; // e.g. "Remote within EMEA"
    priority2: string; // e.g. "Remote Global"
    priority3: string; // e.g. "Paris (Hybrid / Onsite)"
  };
  languages: {
    primary: string; // e.g. "English (Fluent/Native)"
    secondary?: string; // e.g. "French (Learning - English-first only)"
    mustBeEnglishFirst: boolean;
  };
  targetSectors: string[]; // Selected domains
  previousCompanies: {
    name: string;
    domain: string;
    highlights: string;
  }[];
  education: {
    institution: string;
    degree: string;
  }[];
  honors: string[];
  criteriaExclusions: string[]; // e.g. "Skip Associate/Junior PM", "Skip Project Manager", "Exclude fluent French requirement"
  emailNotification?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleConfig {
  id: string;
  profileId: string;
  enabled: boolean;
  frequency: 'daily' | 'weekdays' | 'every-12h' | 'weekly';
  runTime: string; // e.g. "08:30" (24h format)
  timezone: string; // e.g. "Europe/Paris"
  targetEmail: string;
  channels: {
    email: boolean;
    dashboardNotification: boolean;
    webhook: boolean;
  };
  webhookUrl?: string;
  lastRunTimestamp?: string;
  nextRunTimestamp?: string;
  status: 'active' | 'paused' | 'running' | 'completed';
}

export interface ScheduleRunLog {
  id: string;
  scheduleId: string;
  profileId: string;
  profileName: string;
  timestamp: string;
  status: 'success' | 'failed';
  jobsScanned: number;
  topFitScore: number;
  deliveredTo: string;
  digestSummary: string;
}

export interface NotablePatterns {
  headline: string;
  keyPoints: string[];
  topHiringCompanies: { company: string; count: number; note: string }[];
  marketTakeaway: string;
}

export type ApplicationStatus = 'untracked' | 'saved' | 'applied' | 'interviewing' | 'offer' | 'passed';

// Backward compatibility alias
export type LillyProfile = CandidateProfile;
