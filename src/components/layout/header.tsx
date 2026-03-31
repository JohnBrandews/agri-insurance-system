import { Bell, Search } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session"
import UserAvatarUploader from "./UserAvatarUploader"

export default async function Header({ title }: { title: string }) {
  const session = await getSession()
  const currentUser = session
    ? await prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, profileImageUrl: true },
      })
    : null

  return (
    <header className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 sm:py-5 bg-transparent sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight break-words">{title}</h1>
      </div>
      
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end sm:gap-6">
        <div className="relative min-w-0 flex-1 sm:flex-none">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search insights..." 
            className="pl-10 pr-4 py-2 w-full sm:w-64 max-w-full rounded-full bg-white/50 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm placeholder:text-slate-400"
          />
        </div>
        
        <button className="relative text-slate-500 hover:text-primary transition-colors shrink-0">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        {currentUser ? (
          <UserAvatarUploader name={currentUser.name} imageUrl={currentUser.profileImageUrl} />
        ) : null}
      </div>
    </header>
  )
}
