import type { ApiResponse } from "@/types/api";
import type { AdminProfile, AuthResponse } from "@/types/auth";

import { apiClient } from "./http";

export async function loginAdmin(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>("/auth/admin/login", payload);

  return response.data.data;
}

export async function getAdminProfile(): Promise<AdminProfile> {
  const response = await apiClient.get<ApiResponse<AdminProfile>>("/auth/admin/me");

  return response.data.data;
}

export async function logoutAdmin(): Promise<void> {
  await apiClient.post("/auth/admin/logout");
}

export async function forgotAdminPassword(email: string): Promise<void> {
  await apiClient.post("/auth/admin/forgot-password", { email });
}
