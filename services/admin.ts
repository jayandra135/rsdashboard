import type { ApiResponse, PaginatedResult } from "@/types/api";
import type { DashboardSummary, JobSummary } from "@/types/job";
import type { AdminUser } from "@/types/user";

import type { JobSearchParams } from "./jobs";
import { apiClient } from "./http";

export interface JobPayload {
  companyId: string;
  categoryId: string;
  locationId: string;
  title: string;
  slug: string;
  summary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits?: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  experienceLevel?: string;
  employmentType: string;
  workplaceType: string;
  isRemote?: boolean;
  applyUrl: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterLinkedinUrl?: string;
  referralAvailable?: boolean;
  isFeatured?: boolean;
  status?: string;
  skillIds?: string[];
}

export async function getAdminJobs(
  params: JobSearchParams = {},
): Promise<PaginatedResult<JobSummary>> {
  const response = await apiClient.get<ApiResponse<PaginatedResult<JobSummary>>>("/admin/jobs", {
    params,
  });

  return response.data.data;
}

export async function getAdminJob(id: string): Promise<JobSummary> {
  const response = await apiClient.get<ApiResponse<JobSummary>>(`/admin/jobs/${id}`);

  return response.data.data;
}

export async function createAdminJob(payload: JobPayload): Promise<JobSummary> {
  const response = await apiClient.post<ApiResponse<JobSummary>>("/admin/jobs", payload);

  return response.data.data;
}

export async function updateAdminJob(id: string, payload: Partial<JobPayload>): Promise<JobSummary> {
  const response = await apiClient.patch<ApiResponse<JobSummary>>(`/admin/jobs/${id}`, payload);

  return response.data.data;
}

export async function deleteAdminJob(id: string): Promise<void> {
  await apiClient.delete(`/admin/jobs/${id}`);
}

export async function getAdminUsers(page = 1, limit = 20): Promise<PaginatedResult<AdminUser>> {
  const response = await apiClient.get<ApiResponse<PaginatedResult<AdminUser>>>("/admin/users", {
    params: { page, limit },
  });

  return response.data.data;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiClient.get<ApiResponse<DashboardSummary>>("/admin/dashboard/summary");

  return response.data.data;
}
