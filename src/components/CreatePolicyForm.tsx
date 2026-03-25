"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Plus, Info, CloudRain, DollarSign, Percent, MapPin, Sprout, Calendar } from "lucide-react"
import { createPolicy } from "@/app/insurer/actions"

export function CreatePolicyForm() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      cropType: formData.get("cropType") as string,
      region: formData.get("region") as string,
      rainfallThreshold: parseFloat(formData.get("rainfallThreshold") as string),
      premiumRate: parseFloat(formData.get("premiumRate") as string) / 100,
      payoutRate: parseFloat(formData.get("payoutRate") as string),
      seasonStart: formData.get("seasonStart") as string,
      seasonEnd: formData.get("seasonEnd") as string,
    }

    try {
      await createPolicy(data)
      setOpen(false)
    } catch (error) {
      console.error(error)
      alert("Failed to create policy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#46A316] hover:bg-green-700 shadow-lg shadow-green-500/20 text-white font-bold rounded-xl px-6">
          <Plus className="w-5 h-5 mr-2" />
          Create New Policy
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none rounded-3xl shadow-2xl">
        <div className="bg-emerald-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black flex items-center">
              <Sprout className="w-6 h-6 mr-3 text-emerald-200" />
              New Weather Index Policy
            </DialogTitle>
            <p className="text-emerald-100/80 text-sm font-medium mt-1">Define protected thresholds and payout structures for farmers.</p>
          </DialogHeader>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">General Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-slate-600 font-bold ml-1">Policy Name</Label>
                <Input id="name" name="name" placeholder="e.g. Drought Shield 2024" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cropType" className="text-slate-600 font-bold ml-1">Applicable Crop</Label>
                <Input id="cropType" name="cropType" placeholder="e.g. Maize / Coffee" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="region" className="text-slate-600 font-bold ml-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> Targeted Region
              </Label>
              <Input id="region" name="region" placeholder="e.g. Rift Valley / Nairobi County" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11" required />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Index & Payout Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rainfallThreshold" className="text-slate-600 font-bold ml-1 flex items-center truncate">
                  <CloudRain className="w-3.5 h-3.5 mr-1 text-blue-500" /> Limit (mm)
                </Label>
                <Input id="rainfallThreshold" name="rainfallThreshold" type="number" step="0.1" placeholder="300" className="rounded-xl border-slate-200 focus:ring-blue-500 h-11" required />
                <p className="text-[10px] text-slate-400 px-1">Payout trigger point</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="premiumRate" className="text-slate-600 font-bold ml-1 flex items-center">
                  <Percent className="w-3.5 h-3.5 mr-1 text-violet-500" /> Premium
                </Label>
                <Input id="premiumRate" name="premiumRate" type="number" step="0.1" placeholder="5%" className="rounded-xl border-slate-200 focus:ring-violet-500 h-11" required />
                <p className="text-[10px] text-slate-400 px-1">% of insured value</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="payoutRate" className="text-slate-600 font-bold ml-1 flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Payout
                </Label>
                <Input id="payoutRate" name="payoutRate" type="number" step="0.1" placeholder="100" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11" required />
                <p className="text-[10px] text-slate-400 px-1">$ per acre deficit</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center">
              <Calendar className="w-3 h-3 mr-1" /> Coverage Duration
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="seasonStart" className="text-slate-600 font-bold ml-1">Effective Date</Label>
                <Input id="seasonStart" name="seasonStart" type="date" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11 font-medium bg-slate-50/50" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seasonEnd" className="text-slate-600 font-bold ml-1">Expiry Date</Label>
                <Input id="seasonEnd" name="seasonEnd" type="date" className="rounded-xl border-slate-200 focus:ring-emerald-500 h-11 font-medium bg-slate-50/50" required />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black py-7 rounded-2xl text-lg font-black text-emerald-400 shadow-xl shadow-slate-200 transition-all active:scale-[0.98]">
              {loading ? "Calculating..." : "Launch Insurance Policy"}
            </Button>
            <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center">
              <Info className="w-3 h-3 mr-1" /> Farmers in the targeted region will immediately see this offer.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
