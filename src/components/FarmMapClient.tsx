"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

type FarmData = {
  id: string
  locationName: string
  acreage: number
  cropType: string
  status: string
  coordinates: { lat: number, lng: number }[]
  farmerName: string
}

export function FarmMapClient({ farms }: { farms: FarmData[] }) {
  const [selectedFarm, setSelectedFarm] = useState<FarmData | null>(null)

  // MVP Mock Map using a relative positioning grid based on lat/lng ranges
  // Assuming coords in our DB are around lat: -1 to 1, lng: 35 to 37 (Kenya roughly)
  return (
    <div className="flex flex-col md:flex-row h-[400px] border border-slate-200 rounded-xl overflow-hidden bg-emerald-50 relative">
      <div className="w-full md:w-2/3 relative h-full bg-blue-50/50 p-4">
        {/* Fake Map Background Lines */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-20 pointer-events-none">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="border border-slate-400"></div>
          ))}
        </div>
        <p className="absolute bottom-2 right-2 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Simulated GPS Region</p>
        
        {/* Plotting farms */}
        {farms.map((farm) => {
          // Normalize lat (-0.5 to 0.5) and lng (35.5 to 36.5) to a 10-90% range for standard MVP bounds
          // To prevent off-screen, we just hash the ID to random positions if parsing fails
          let top = 50
          let left = 50
          try {
            if (farm.coordinates.length > 0) {
              const boundsLat = (farm.coordinates[0].lat + 1) * 50
              const boundsLng = (farm.coordinates[0].lng - 35) * 50
              top = Math.max(10, Math.min(90, boundsLat))
              left = Math.max(10, Math.min(90, boundsLng))
            }
          } catch(e) {}

          const colorClass = 
            farm.status === 'HEALTHY' ? 'bg-emerald-500 shadow-emerald-400/50' :
            farm.status === 'RISK' ? 'bg-amber-500 shadow-amber-400/50' : 
            'bg-red-500 shadow-red-400/50 animate-pulse'

          return (
            <div 
              key={farm.id}
              onClick={() => setSelectedFarm(farm)}
              className={`absolute w-6 h-6 -ml-3 -mt-3 rounded-full cursor-pointer transition-transform hover:scale-125 shadow-lg border-2 border-white z-10 ${colorClass}`}
              style={{ top: `${top}%`, left: `${left}%` }}
              title={farm.locationName}
            />
          )
        })}
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
              <Badge variant={selectedFarm.status === 'HEALTHY' ? "default" : selectedFarm.status === 'RISK' ? "warning" : "danger"}>
                {selectedFarm.status}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50 pb-12">
            <div className="w-12 h-12 border-2 border-dashed border-slate-300 rounded-full mb-3"></div>
            <p className="text-sm text-slate-500">Click a marker on the map to view farm monitor details.</p>
          </div>
        )}
      </div>
    </div>
  )
}
