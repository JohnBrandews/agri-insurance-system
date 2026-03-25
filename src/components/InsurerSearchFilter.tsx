"use client"

import { Search, Filter, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function InsurerSearchFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")

  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (search) params.set("search", search)
    else params.delete("search")
    
    if (status) params.set("status", status)
    else params.delete("status")

    const delayDebounceFn = setTimeout(() => {
      router.push(`/super-admin/insurers?${params.toString()}`)
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, status, router, searchParams])

  return (
    <div className="flex flex-col md:flex-row items-center gap-3">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..." 
          className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm"
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white text-sm outline-none"
        >
          <option value="">All Statuses</option>
          <option value="APPROVED">Approved</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>
        
        {(search || status) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setSearch(""); setStatus(""); }}
            className="text-slate-500"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
