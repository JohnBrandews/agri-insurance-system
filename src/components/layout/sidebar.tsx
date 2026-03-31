import Link from "next/link"
import { LayoutDashboard, Users, FileText, Settings, LogOut, CloudRain, Map } from "lucide-react"
import LogoutButton from "./LogoutButton"

export default function Sidebar({ role }: { role: "SUPER_ADMIN" | "INSURER" | "AGENT" | "FARMER" }) {
  const navItems = {
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
  }

  const items = navItems[role]

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen glass-panel bg-white/60 m-4 shadow-premium rounded-3xl border border-white/40 z-10 hidden lg:flex">
      <div className="p-6 pb-2">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Agri<span className="text-primary">Insure</span></span>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-white/80 rounded-xl transition-all font-medium"
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-100/50">
        <LogoutButton className="flex w-full items-center space-x-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all font-medium text-left">
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </LogoutButton>
      </div>
    </aside>
  )
}
