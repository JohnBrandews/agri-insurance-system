"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"

type FarmData = {
  id: string
  locationName: string
  acreage: number
  cropType: string
  status: string
  coordinates: { lat: number; lng: number }[]
  farmerName: string
}

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-l-xl flex items-center justify-center">
      <p className="text-slate-400 text-sm">Loading map...</p>
    </div>
  ),
})

export function FarmMapClient({ farms }: { farms: FarmData[] }) {
  const [selectedFarm, setSelectedFarm] = useState<FarmData | null>(null)

  return (
    <div className="flex flex-col md:flex-row h-[500px] border border-slate-200 rounded-xl overflow-hidden">
      
      {/* Real Map */}
      <div className="w-full md:w-2/3 h-full">
        <LeafletMap farms={farms} onSelectFarm={setSelectedFarm} />
      </div>

      {/* Detail Panel */}
      <div className="w-full md:w-1/3 bg-white h-full border-l border-slate-200 p-6 overflow-y-auto">
        <h3 className="font-bold text-slate-800 text-lg mb-4">Farm Details</h3>
        {selectedFarm ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Farmer</p>
              <p className="text-sm font-medium text-slate-900">{selectedFarm.farmerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Location</p>
              <p className="text-sm font-medium text-slate-900">{selectedFarm.locationName}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Crop</p>
                <p className="text-sm font-medium text-slate-900">{selectedFarm.cropType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Acreage</p>
                <p className="text-sm font-medium text-slate-900">{selectedFarm.acreage} acres</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Status</p>
              <Badge className={
                selectedFarm.status === 'HEALTHY' ? "bg-emerald-500 text-white" :
                selectedFarm.status === 'RISK' ? "bg-amber-500 text-white" : "bg-red-500 text-white"
              }>
                {selectedFarm.status}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-12">
            <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-full mb-3"></div>
            <p className="text-sm text-slate-500">Click a marker on the map to view farm details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
