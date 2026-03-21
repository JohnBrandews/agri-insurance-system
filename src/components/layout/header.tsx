import { Bell, Search, User } from "lucide-react"

export default function Header({ title }: { title: string }) {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search insights..." 
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-white/50 border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm shadow-sm placeholder:text-slate-400"
          />
        </div>
        
        <button className="relative text-slate-500 hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          <User className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    </header>
  )
}
