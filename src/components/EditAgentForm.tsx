"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Phone, User, MapPin, Mail, CreditCard, X } from "lucide-react"
import { updateAgentDetails } from "@/app/insurer/actions"

const KENYAN_REGIONS: Record<string, string[]> = {
  "Nairobi": ["Westlands", "Dagoretti", "Kibra", "Roysambu", "Kasarani", "Embakasi"],
  "Mombasa": ["Changamwe", "Jomvu", "Kisauni", "Nyali", "Likoni", "Mvita"],
  "Kisumu": ["Kisumu Central", "Kisumu East", "Kisumu West", "Seme", "Nyando"],
  "Nakuru": ["Nakuru East", "Nakuru West", "Naivasha", "Gilgil", "Molo"],
  "Uasin Gishu": ["Eldoret East", "Eldoret West", "Eldoret South", "Turbo"],
  "Kiambu": ["Kiambu Town", "Thika Town", "Ruiru", "Juja", "Kikuyu"],
  "Meru": ["Imenti North", "Imenti South", "Tigania", "Igembe"],
  "Nyeri": ["Nyeri Town", "Othaya", "Mukurweini", "Tetu"],
  "Kakamega": ["Lurambi", "Mumias", "Butere", "Lugari"],
  "Murang'a": ["Kandara", "Kiharu", "Kangema", "Gatanga"],
  "Machakos": ["Machakos Town", "Mavoko", "Matungulu", "Kathiani"],
  "Kilifi": ["Malindi", "Magarini", "Ganze", "Kaloleni"]
}

interface EditAgentFormProps {
  agent: {
    id: string
    region: string
    phone: string | null
    idNumber: string | null
    user: {
      name: string
      email: string
    }
  }
  onClose: () => void
}

export function EditAgentForm({ agent, onClose }: EditAgentFormProps) {
  const [name, setName] = useState(agent.user.name)
  const [email, setEmail] = useState(agent.user.email)
  const [phone, setPhone] = useState(agent.phone || "")
  const [idNumber, setIdNumber] = useState(agent.idNumber || "")
  const [county, setCounty] = useState(agent.region.split(", ")[0] || "")
  const [constituency, setConstituency] = useState(agent.region.split(", ")[1] || "")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    
    try {
      await updateAgentDetails(agent.id, {
        name,
        email,
        phone: phone || undefined,
        idNumber: idNumber || undefined,
        region: `${county}, ${constituency}`
      })
      setMessage("✅ Agent details updated successfully!")
      router.refresh()
      setTimeout(onClose, 1500)
    } catch(err) {
      setMessage("❌ Failed to update agent details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Edit Agent Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {message && (
        <div className={`text-sm font-medium p-4 rounded-xl border ${message.includes('✅') ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
          {message}
        </div>
      )}
      
      <form onSubmit={handleUpdate} className="space-y-4">
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
              {Object.keys(KENYAN_REGIONS).map(countyName => (
                <option key={countyName} value={countyName}>{countyName}</option>
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
              className="w-full text-sm border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white transition-all"
              required
              disabled={!county}
            >
              <option value="">Select Constituency</option>
              {county && KENYAN_REGIONS[county]?.map(constName => (
                <option key={constName} value={constName}>{constName}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Updating..." : "Update Agent"}
          </Button>
        </div>
      </form>
    </div>
  )
}