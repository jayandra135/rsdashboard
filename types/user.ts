export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    bookmarks: number;
    shares: number;
    jobViews: number;
  };
}
