"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Camera, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react"
import { registerFarmer } from "./actions"
import { COUNTY_NAMES, KENYA_LOCATIONS } from "@/lib/kenya-locations"
import { FarmBoundaryTracker } from "@/components/FarmBoundaryTracker"

export function RegisterClient({
  policies,
  defaultCounty,
  defaultConstituency,
}: {
  policies: any[]
  defaultCounty: string
  defaultConstituency: string
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [policyId, setPolicyId] = useState(policies[0]?.id || "")
  const [county, setCounty] = useState(defaultCounty)
  const [constituency, setConstituency] = useState(defaultConstituency)
  const [acreage, setAcreage] = useState("2.5")
  const [cropType, setCropType] = useState("Maize")

  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}[]>([])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await registerFarmer({
        fullName,
        phone,
        idNumber,
        policyId,
        county,
        constituency,
        acreage: parseFloat(acreage),
        cropType,
        coordinates
      })
      setStep(5) // Success step
    } catch (err) {
      console.error(err)
      alert("Registration failed.")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm" placeholder="0700 000 000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">National ID</label>
              <input type="text" value={idNumber} onChange={e => setIdNumber(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm" placeholder="ID Number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">County</label>
              <select
                value={county}
                onChange={e => {
                  setCounty(e.target.value)
                  setConstituency("")
                  setCoordinates([])
                }}
                className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="">Select county</option>
                {COUNTY_NAMES.map((countyName) => (
                  <option key={countyName} value={countyName}>{countyName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Constituency</label>
              <select
                value={constituency}
                onChange={e => {
                  setConstituency(e.target.value)
                  setCoordinates([])
                }}
                disabled={!county}
                className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm disabled:opacity-50"
              >
                <option value="">Select constituency</option>
                {county && KENYA_LOCATIONS[county]?.constituencies.map((constituencyName) => (
                  <option key={constituencyName} value={constituencyName}>{constituencyName}</option>
                ))}
              </select>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Policy / Product</label>
              <select value={policyId} onChange={e => setPolicyId(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm">
                {policies.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.cropType}) - {p.region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Crop Type</label>
              <input type="text" value={cropType} onChange={e => setCropType(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm" placeholder="e.g. Maize" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Acreage</label>
              <input
                type="number"
                step="0.1"
                value={acreage}
                onChange={e => setAcreage(e.target.value)}
                className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm"
                placeholder="Auto-filled after GPS mapping"
              />
              <p className="text-xs text-slate-500 mt-1">
                This is updated automatically after the farm boundary is captured.
              </p>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <FarmBoundaryTracker
              onBoundaryComplete={(trackedCoordinates, trackedAcreage) => {
                setCoordinates(trackedCoordinates)
                if (trackedAcreage > 0) {
                  setAcreage(trackedAcreage.toFixed(2))
                }
              }}
            />
            <p className="text-xs text-slate-500 text-center">
              GPS boundary will be saved under {constituency || "constituency"}, {county || "county"}.
            </p>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <p className="text-sm text-center text-slate-500 mb-4">Taking photos is simulated for MVP. Tap submit to finish.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
                <Camera className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-xs font-semibold text-emerald-700 text-center">Farmer Photo Captured</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative">
                <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
                <Map className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-xs font-semibold text-emerald-700 text-center">Farm Photo Captured</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 text-center">
              Location will be saved as {constituency || "constituency"}, {county || "county"}.
            </p>
            <Button onClick={handleSubmit} disabled={loading} className="w-full mt-4 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg">
              {loading ? "Syncing to Blockchain..." : "Complete Registration"}
            </Button>
          </div>
        )
      case 5:
        return (
          <div className="space-y-6 text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Registration Complete</h3>
            <p className="text-slate-500">The farmer data and mapped farm area have been synced securely to the platform.</p>
          </div>
        )
      default:
        return null
    }
  }

  const steps = [
    "Personal Details",
    "Policy Selection",
    "Farm Mapped",
    "Review & Submit"
  ]

  return (
    <div className="max-w-md mx-auto h-full flex flex-col">
      <div className="mb-6 flex space-x-2">
        {steps.map((s, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${(step > 4 ? 4 : step) > i ? 'bg-primary' : 'bg-slate-200'}`} />
        ))}
      </div>

      <Card className="flex-1 shadow-premium border border-slate-100 relative pb-16">
        <CardHeader className="pb-4 border-b border-slate-100">
          <Badge className="w-fit mb-2 bg-primary/20 text-primary-dark">Step {Math.min(step, 4)} of 4</Badge>
          <CardTitle className="text-xl text-slate-800">{steps[Math.min(step, 4) - 1]}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
        {step < 4 && (
          <div className="absolute bottom-6 left-6 right-6 flex justify-between">
            <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={() => setStep(Math.min(4, step + 1))}
              disabled={(step === 1 && (!fullName || !phone || !idNumber || !county || !constituency)) || (step === 3 && coordinates.length === 0)}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
