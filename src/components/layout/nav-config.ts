import type { ComponentType } from "react"
import {
  CloudRain,
  FileText,
  LayoutDashboard,
  Map,
  Settings,
  Users,
} from "lucide-react"

export type AppRole = "SUPER_ADMIN" | "INSURER" | "AGENT" | "FARMER"

export const navItemsByRole = {
  SUPER_ADMIN: [
    { name: "Overview", href: "/super-admin", icon: LayoutDashboard },
    { name: "Insurers", href: "/super-admin/insurers", icon: FileText },
    { name: "Global Analytics", href: "/super-admin/analytics", icon: CloudRain },
    { name: "Settings", href: "/super-admin/settings", icon: Settings },
  ],
  INSURER: [
    { name: "Dashboard", href: "/insurer", icon: LayoutDashboard },
    { name: "Policies", href: "/insurer/policies", icon: FileText },
    { name: "Agents", href: "/insurer/agents", icon: Users },
    { name: "Farm Map", href: "/insurer/map", icon: Map },
    { name: "Triggers & Payouts", href: "/insurer/payouts", icon: CloudRain },
  ],
  AGENT: [
    { name: "Home", href: "/agent", icon: LayoutDashboard },
    { name: "My Farmers", href: "/agent/farmers", icon: Users },
    { name: "Register Farm", href: "/agent/register", icon: Map },
  ],
  FARMER: [
    { name: "My Farm", href: "/farmer", icon: LayoutDashboard },
    { name: "Policy", href: "/farmer/policy", icon: FileText },
  ],
} satisfies Record<AppRole, Array<{ name: string; href: string; icon: ComponentType<{ className?: string }> }>>
