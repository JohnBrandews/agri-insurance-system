"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AddInsurerForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    
    try {
      const res = await fetch("/api/companies/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      })
      const data = await res.json()
      
      if (data.success) {
        setMessage("✅ Email invitation sent successfully!")
        setName("")
        setEmail("")
        router.refresh() // Refresh page to update metrics
      } else {
        setMessage(`❌ Error: ${data.error}`)
      }
    } catch(err) {
      setMessage("❌ Failed to send invite.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleInvite} className="space-y-4 pt-2">
      {message && <div className="text-sm font-medium p-3 rounded-md bg-slate-50 border">{message}</div>}
      
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Company Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          placeholder="e.g. Acre Africa"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-none"
          required
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Admin Email Address</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="admin@acre.co.ke"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-emerald-500 outline-none"
          required
        />
      </div>
      
      <Button disabled={loading} type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
        {loading ? "Sending Invite..." : "Invite Insurance Company"}
      </Button>
    </form>
  )
}
