export interface AdminProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
}

export interface AuthResponse {
  admin: AdminProfile;
  accessToken: string;
  refreshToken: string;
}
