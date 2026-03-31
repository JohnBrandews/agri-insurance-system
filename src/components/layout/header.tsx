import { Bell, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import UserAvatarUploader from "./UserAvatarUploader"
import MobileSidebar from "./MobileSidebar"
import { type AppRole } from "./nav-config"

export default async function Header({ title, role }: { title: string; role: AppRole }) {
  const session = await getSession()
  const currentUser = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, profileImageUrl: true },
      })
    : null

  return (
    <header className="flex flex-col gap-4 bg-transparent px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <MobileSidebar role={role} />
          <div className="min-w-0">
            <h1 className="break-words text-lg font-bold tracking-tight text-slate-800 sm:text-2xl">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <button className="relative shrink-0 text-slate-500 transition-colors hover:text-primary">
            <Bell className="h-5 w-5" />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
          </button>

          {currentUser ? (
            <UserAvatarUploader name={currentUser.name} imageUrl={currentUser.profileImageUrl} />
          ) : null}
        </div>
      </div>

      <div className="relative min-w-0 sm:hidden">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search insights..."
          className="w-full max-w-full rounded-full border border-slate-200/60 bg-white/80 py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 sm:w-72"
        />
      </div>
      <div className="hidden items-center justify-end gap-6 sm:flex">
        <div className="relative min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search insights..."
            className="w-64 max-w-full rounded-full border border-slate-200/60 bg-white/80 py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </header>
  )
}
