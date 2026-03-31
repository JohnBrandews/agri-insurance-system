"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Phone, User, MapPin, Mail, CreditCard } from "lucide-react"
import { COUNTY_NAMES, KENYA_LOCATIONS } from "@/lib/kenya-locations"

export function AddAgentForm({ companyId }: { companyId: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [county, setCounty] = useState("")
  const [constituency, setConstituency] = useState("")
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
        body: JSON.stringify({ 
          name, 
          email, 
          phone,
          idNumber,
          region: `${county}, ${constituency}`, 
          companyId 
        })
      })
      const data = await res.json()
      
      if (data.success) {
        setMessage("✅ Field Agent onboarded and invited!")
        setName("")
        setEmail("")
        setPhone("")
        setIdNumber("")
        setCounty("")
        setConstituency("")
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
    <div className="space-y-4 pt-4">
      {message && (
        <div className={`text-sm font-medium p-4 rounded-xl border ${message.includes('✅') ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleInvite} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <User className="w-3 h-3 mr-1" /> Agent Full Name
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. John Doe"
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <CreditCard className="w-3 h-3 mr-1" /> National ID / Passport
            </label>
            <input 
              type="text" 
              value={idNumber} 
              onChange={e => setIdNumber(e.target.value)} 
              placeholder="12345678"
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Mail className="w-3 h-3 mr-1" /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="agent@company.com"
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <Phone className="w-3 h-3 mr-1" /> Phone Number
            </label>
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="0712 345 678"
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> County
            </label>
            <select 
              value={county}
              onChange={e => { setCounty(e.target.value); setConstituency(""); }}
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
              required
            >
              <option value="">Select County</option>
              {COUNTY_NAMES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> Constituency
            </label>
            <select 
              value={constituency}
              onChange={e => setConstituency(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all disabled:opacity-50"
              required
              disabled={!county}
            >
              <option value="">Select Constituency</option>
              {county && KENYA_LOCATIONS[county]?.constituencies.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <Button 
          disabled={loading} 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 mt-2"
        >
          {loading ? "Activating Agent..." : "Onboard Field Agent"}
        </Button>
      </form>
    </div>
  )
}
