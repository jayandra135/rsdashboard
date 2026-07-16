import type { ApiResponse, PaginatedResult } from "@/types/api";
import type {
  CategorySummary,
  CompanySummary,
  JobSummary,
  LocationSummary,
  SkillSummary,
} from "@/types/job";

import { apiClient } from "./http";

export interface JobSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  companySlug?: string;
  categorySlug?: string;
  location?: string;
  skillSlugs?: string[];
  sortBy?: "newest" | "oldest" | "salary" | "experience";
}

export async function getJobs(params: JobSearchParams = {}): Promise<PaginatedResult<JobSummary>> {
  const response = await apiClient.get<ApiResponse<PaginatedResult<JobSummary>>>("/jobs", {
    params: {
      ...params,
      skillSlugs: params.skillSlugs?.join(","),
    },
  });

  return response.data.data;
}

export async function getJob(slug: string): Promise<JobSummary> {
  const response = await apiClient.get<ApiResponse<JobSummary>>(`/jobs/${slug}`);

  return response.data.data;
}

export async function getCompanies(): Promise<CompanySummary[]> {
  const response = await apiClient.get<ApiResponse<CompanySummary[]>>("/companies");

  return response.data.data;
}

export async function getCategories(): Promise<CategorySummary[]> {
  const response = await apiClient.get<ApiResponse<CategorySummary[]>>("/categories");

  return response.data.data;
}

export async function getSkills(): Promise<SkillSummary[]> {
  const response = await apiClient.get<ApiResponse<SkillSummary[]>>("/skills");

  return response.data.data;
}

export async function getLocations(): Promise<LocationSummary[]> {
  const response = await apiClient.get<ApiResponse<LocationSummary[]>>("/locations");

  return response.data.data;
}

export async function getAllPublishedJobs(): Promise<JobSummary[]> {
  const jobs: JobSummary[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const result = await getJobs({ page, limit: 100, sortBy: "newest" });
    jobs.push(...result.items);
    totalPages = result.totalPages;
    page += 1;
  } while (page <= totalPages);

  return jobs;
}
