import { CandidateProfile } from '../types/job';

export const LILLY_PROFILE: CandidateProfile = {
  id: 'profile-lilly',
  name: 'Lilly',
  targetRole: 'Senior Product Manager / Lead PM',
  experienceYears: 7,
  experienceRangeMin: 7,
  experienceRangeMax: 10,
  currentLocation: 'Paris, France',
  locationPreferences: {
    priority1: 'Remote within EMEA',
    priority2: 'Remote Global',
    priority3: 'Paris (Hybrid / Onsite)'
  },
  languages: {
    primary: 'English (Fluent / Native-level professional proficiency)',
    secondary: 'French (Learning - English-first roles required)',
    mustBeEnglishFirst: true
  },
  targetSectors: [
    'Conversational AI & CX',
    'AI & GenAI Products',
    'Operational Automation',
    'B2B SaaS (ERP / CRM / Marketing)',
    'E-Commerce',
    'Supply Chain & Logistics'
  ],
  previousCompanies: [
    {
      name: 'Flipkart',
      domain: 'Large-scale E-Commerce & Marketplace',
      highlights: 'High-volume checkout funnels, marketplace seller tools, order fulfillment at massive consumer scale'
    },
    {
      name: 'SAP Labs',
      domain: 'Enterprise Software & ERP',
      highlights: 'Complex business workflows, ERP architecture, supply chain integrations, multi-system enterprise logic'
    },
    {
      name: 'Factoreal',
      domain: 'B2B SaaS & Omnichannel Marketing',
      highlights: 'Customer journey automation, conversational CRM chatbots, campaign orchestration, self-serve PLG expansion'
    }
  ],
  education: [
    {
      institution: 'IIM Bangalore',
      degree: 'Master of Business Administration (MBA)'
    },
    {
      institution: 'NIT Tiruchirappalli',
      degree: 'Bachelor of Engineering (B.E.)'
    }
  ],
  honors: [
    'Franz Edelman Award Finalist (2025) - World’s premier recognition for applied analytics and operations research'
  ],
  criteriaExclusions: [
    'Skip Associate / Junior Product Manager roles',
    'Skip Project Manager and technical delivery scrum masters',
    'Exclude positions requiring fluent or native French (must be English-first)'
  ],
  emailNotification: 'lilly.pm.paris@gmail.com',
  createdAt: '2026-09-28T08:00:00Z',
  updatedAt: '2026-09-29T08:00:00Z'
};

export const ALEX_AI_PROFILE: CandidateProfile = {
  id: 'profile-alex',
  name: 'Alex Rivera',
  targetRole: 'Lead / Principal AI Product Manager',
  experienceYears: 9,
  experienceRangeMin: 8,
  experienceRangeMax: 12,
  currentLocation: 'London, UK / Paris',
  locationPreferences: {
    priority1: 'Remote within EMEA',
    priority2: 'Remote Global',
    priority3: 'Paris (Hybrid / Onsite)'
  },
  languages: {
    primary: 'English (Native)',
    secondary: 'French (Basic)',
    mustBeEnglishFirst: true
  },
  targetSectors: [
    'AI & GenAI Products',
    'Conversational AI & CX',
    'Operational Automation'
  ],
  previousCompanies: [
    {
      name: 'DeepMind Ecosystem',
      domain: 'Applied Foundational AI',
      highlights: 'Model fine-tuning platforms, multimodal context windows, agent tooling'
    },
    {
      name: 'Datadog',
      domain: 'Observability & Cloud Platform',
      highlights: 'LLM monitoring, high-throughput telemetry, developer tooling'
    }
  ],
  education: [
    {
      institution: 'Imperial College London',
      degree: 'M.Sc. Artificial Intelligence & Computing'
    }
  ],
  honors: [
    'NeurIPS Industry Track Co-Author 2024'
  ],
  criteriaExclusions: [
    'Skip Junior and Non-Technical PM roles',
    'Exclude non-AI domain positions'
  ],
  emailNotification: 'alex.rivera.pm@gmail.com',
  createdAt: '2026-09-20T08:00:00Z',
  updatedAt: '2026-09-29T08:00:00Z'
};

export const MARCUS_FINTECH_PROFILE: CandidateProfile = {
  id: 'profile-marcus',
  name: 'Marcus Vance',
  targetRole: 'VP of Product / Group PM',
  experienceYears: 11,
  experienceRangeMin: 10,
  experienceRangeMax: 14,
  currentLocation: 'Amsterdam / Paris',
  locationPreferences: {
    priority1: 'Remote within EMEA',
    priority2: 'Remote Global',
    priority3: 'Paris (Hybrid / Onsite)'
  },
  languages: {
    primary: 'English (Fluent)',
    secondary: 'German / French',
    mustBeEnglishFirst: true
  },
  targetSectors: [
    'B2B SaaS (ERP / CRM / Marketing)',
    'Operational Automation',
    'E-Commerce'
  ],
  previousCompanies: [
    {
      name: 'Stripe',
      domain: 'Fintech Infrastructure',
      highlights: 'Global payments orchestration, subscription billing engine, enterprise ERP connectors'
    },
    {
      name: 'Revolut Business',
      domain: 'Corporate Banking & Treasury SaaS',
      highlights: 'Multi-currency corporate accounts, automated tax accounting, expense compliance'
    }
  ],
  education: [
    {
      institution: 'INSEAD',
      degree: 'MBA'
    }
  ],
  honors: [
    'FinTech 50 Product Innovator 2024'
  ],
  criteriaExclusions: [
    'Skip non-executive IC roles below Group/Staff level'
  ],
  emailNotification: 'marcus.vance@fintech-exec.eu',
  createdAt: '2026-09-15T08:00:00Z',
  updatedAt: '2026-09-29T08:00:00Z'
};

export const INITIAL_PROFILES: CandidateProfile[] = [
  LILLY_PROFILE,
  ALEX_AI_PROFILE,
  MARCUS_FINTECH_PROFILE
];
