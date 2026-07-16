export interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  websiteUrl?: string | null;
  linkedinUrl?: string | null;
  industry?: string | null;
  headquarters?: string | null;
  isFeatured: boolean;
  _count?: {
    jobs: number;
  };
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    jobs: number;
  };
}

export interface SkillSummary {
  id: string;
  name: string;
  slug: string;
  _count?: {
    jobs: number;
  };
}

export interface LocationSummary {
  id: string;
  country: string;
  state?: string | null;
  city?: string | null;
  workplaceType: "ONSITE" | "REMOTE" | "HYBRID";
  _count?: {
    jobs: number;
  };
}

export interface JobSummary {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[] | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryCurrency: string;
  experienceMinYears?: number | null;
  experienceMaxYears?: number | null;
  employmentType: string;
  workplaceType: string;
  isRemote: boolean;
  applyUrl: string;
  recruiterName?: string | null;
  recruiterEmail?: string | null;
  recruiterLinkedinUrl?: string | null;
  referralAvailable: boolean;
  isFeatured: boolean;
  status: string;
  createdAt: string;
  publishedAt?: string | null;
  expiresAt?: string | null;
  company: CompanySummary;
  category: CategorySummary;
  location: LocationSummary;
  skills: Array<{
    skill: SkillSummary;
  }>;
  _count?: {
    bookmarks: number;
    shares: number;
    views: number;
  };
}

export interface DashboardSummary {
  totalJobs: number;
  totalCompanies: number;
  totalUsers: number;
  totalViews: number;
  totalShares: number;
  totalBookmarks: number;
  todaysJobs: number;
  recentJobs: JobSummary[];
}
