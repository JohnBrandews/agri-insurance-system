"use client"

import { useEffect, Fragment } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet"
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

type FarmData = {
  id: string
  locationName: string
  acreage: number
  cropType: string
  status: string
  coordinates: { lat: number; lng: number }[]
  farmerName: string
}

function getFarmCenter(coordinates: { lat: number; lng: number }[]) {
  const validCoordinates = coordinates.filter(
    (coordinate) => typeof coordinate.lat === "number" && typeof coordinate.lng === "number"
  )

  if (validCoordinates.length === 0) {
    return null
  }

  const totals = validCoordinates.reduce(
    (acc, coordinate) => {
      acc.lat += coordinate.lat
      acc.lng += coordinate.lng
      return acc
    },
    { lat: 0, lng: 0 }
  )

  return [totals.lat / validCoordinates.length, totals.lng / validCoordinates.length] as [number, number]
}

// Creates colored circle marker based on farm status
const createIcon = (status: string) => {
  const color =
    status === "HEALTHY" ? "#22c55e" :
    status === "RISK" ? "#f97316" : "#ef4444"

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 16px;
        height: 16px;
        background: ${color};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

// Auto fits map to show all farm markers
function FitBounds({ farms }: { farms: FarmData[] }) {
  const map = useMap()

  useEffect(() => {
    const points = farms
      .filter(f => f.coordinates?.length > 0)
      .flatMap(f => f.coordinates.map(coordinate => [coordinate.lat, coordinate.lng] as [number, number]))

    if (points.length > 0) {
      map.fitBounds(points, { padding: [50, 50] })
    }
  }, [farms, map])

  return null
}

export default function LeafletMap({
  farms,
  onSelectFarm,
}: {
  farms: FarmData[]
  onSelectFarm: (farm: FarmData) => void
}) {
  // Default center — Kenya
  const center: [number, number] = [-0.0236, 37.9062]

  return (
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      {/* Real OpenStreetMap tiles — free, no API key */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Auto fit map to show all farms */}
      <FitBounds farms={farms} />

      {farms.map((farm) => {
        if (!farm.coordinates?.length) return null

        const position = getFarmCenter(farm.coordinates)
        if (!position) return null

        // Farm boundary polygon if multiple coordinates exist
        const boundary =
          farm.coordinates.length > 2
            ? farm.coordinates.map(c => [c.lat, c.lng] as [number, number])
            : null

        const polygonColor =
          farm.status === "HEALTHY" ? "#22c55e" :
          farm.status === "RISK" ? "#f97316" : "#ef4444"

        return (
          <Fragment key={farm.id}>
            <Marker
              position={position}
              icon={createIcon(farm.status)}
              eventHandlers={{
                click: () => onSelectFarm(farm),
              }}
            >
              <Popup>
                <div className="text-sm space-y-1 min-w-[150px]">
                  <p className="font-bold text-slate-800">{farm.farmerName}</p>
                  <p className="text-slate-500">{farm.locationName}</p>
                  <p>Crop: <span className="font-medium">{farm.cropType}</span></p>
                  <p>Acreage: <span className="font-medium">{farm.acreage} acres</span></p>
                  <p>
                    Status:{" "}
                    <span style={{ color: polygonColor }} className="font-bold">
                      {farm.status}
                    </span>
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* Draw farm boundary polygon */}
            {boundary && (
              <Polygon
                positions={boundary}
                pathOptions={{
                  color: polygonColor,
                  fillColor: polygonColor,
                  fillOpacity: 0.15,
                  weight: 2,
                }}
              />
            )}
          </Fragment>
        )
      })}
    </MapContainer>
  )
}
