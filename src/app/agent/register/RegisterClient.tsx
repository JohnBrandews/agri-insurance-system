"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Map, Camera, CheckCircle2, ChevronRight, ChevronLeft, MapPin } from "lucide-react"
import { registerFarmer } from "./actions"

export function RegisterClient({ policies }: { policies: any[] }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Form State
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [policyId, setPolicyId] = useState(policies[0]?.id || "")
  const [acreage, setAcreage] = useState("2.5")
  const [cropType, setCropType] = useState("Maize")

  // Mock GPS tracking state
  const [isMapping, setIsMapping] = useState(false)
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}[]>([])

  const handleStartMapping = () => {
    setIsMapping(true)
    // Simulate walking a polygon over 2 seconds
    setTimeout(() => {
      setCoordinates([
        { lat: -0.12, lng: 36.15 },
        { lat: -0.12, lng: 36.16 },
        { lat: -0.13, lng: 36.16 },
        { lat: -0.13, lng: 36.15 }
      ])
      setIsMapping(false)
    }, 2000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await registerFarmer({
        fullName,
        phone,
        idNumber,
        policyId,
        acreage: parseFloat(acreage),
        cropType,
        coordinates: coordinates.length > 0 ? coordinates : [{ lat: 0, lng: 0 }] // dummy fallback
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Expected Acreage</label>
              <input type="number" step="0.1" value={acreage} onChange={e => setAcreage(e.target.value)} className="w-full rounded-xl border-slate-200 px-4 py-3 bg-white/50 focus:ring-2 focus:ring-primary shadow-sm" placeholder="2.5" />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-slate-100 rounded-2xl h-64 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative overflow-hidden">
              {coordinates.length > 0 ? (
                <div className="absolute inset-0 bg-emerald-100/50 flex flex-col items-center justify-center text-emerald-700">
                  <CheckCircle2 className="w-12 h-12 mb-2" />
                  <p className="font-bold">GPS Area Mapped Successfully</p>
                  <p className="text-sm mt-1">{coordinates.length} points calculated</p>
                </div>
              ) : (
                <>
                  <MapPin className={`w-10 h-10 text-primary mb-2 ${isMapping ? 'animate-bounce' : 'opacity-50'}`} />
                  <p className="text-slate-500 font-medium text-sm text-center px-4">
                    {isMapping ? "Walking the perimeter... acquiring GPS" : "Walk the perimeter of the farm to map GPS polygon bounds."}
                  </p>
                  <Button onClick={handleStartMapping} disabled={isMapping} className="mt-4 absolute bottom-4 shadow-xl">
                    {isMapping ? "Tracking..." : "Start Tracking Bounds"}
                  </Button>
                </>
              )}
            </div>
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
            <p className="text-slate-500">The farmer data and GPS polygon have been synced securely to the platform.</p>
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
            <Button onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 3 && coordinates.length === 0}>
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
