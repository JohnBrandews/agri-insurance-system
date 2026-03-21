"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AddAgentForm({ companyId }: { companyId: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [region, setRegion] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    
    try {
      const res = await fetch("/api/agents/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, region, companyId })
      })
      const data = await res.json()
      
      if (data.success) {
        setMessage("✅ Field Agent invited via Email!")
        setName("")
        setEmail("")
        setRegion("")
        router.refresh()
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
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Agent Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="e.g. John Doe"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1">Assigned Region</label>
          <input 
            type="text" 
            value={region} 
            onChange={e => setRegion(e.target.value)} 
            placeholder="e.g. Rift Valley"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1">Agent Email Address</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="agent@example.com"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
          required
        />
      </div>
      
      <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        {loading ? "Sending Invite..." : "Onboard Field Agent"}
      </Button>
    </form>
  )
}
