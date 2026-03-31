"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix broken marker icons in Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })
}

interface MapProps {
  markers?: { position: [number, number]; label: string }[]
  center?: [number, number]
  zoom?: number
  className?: string
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

export default function Map({ 
  markers = [], 
  center = [-0.0236, 37.9062], 
  zoom = 6, 
  className = "h-full w-full" 
}: MapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`${className} bg-slate-100 animate-pulse rounded-lg flex items-center justify-center`}>
        <p className="text-slate-400 text-sm">Loading map viewport...</p>
      </div>
    )
  }

  return (
    <div className={`${className} rounded-lg overflow-hidden border border-slate-200`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ChangeView center={center} zoom={zoom} />

        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>
              <span className="text-sm font-medium">{marker.label}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
