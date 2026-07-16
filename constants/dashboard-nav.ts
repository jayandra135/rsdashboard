import {
  BriefcaseBusiness,
  Building2,
  FolderTree,
  LayoutDashboard,
  MapPin,
  Settings,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";

export const dashboardNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: BriefcaseBusiness },
  { href: "/dashboard/companies", label: "Companies", icon: Building2 },
  { href: "/dashboard/categories", label: "Categories", icon: FolderTree },
  { href: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { href: "/dashboard/locations", label: "Locations", icon: MapPin },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
] as const;
