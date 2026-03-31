"use client"

import { useEffect, useRef, useState } from "react"

type Coordinate = { lat: number; lng: number }

type FarmBoundaryTrackerProps = {
  onBoundaryComplete: (coordinates: Coordinate[], acreage: number) => void
}

function calculateDistance(coord1: Coordinate, coord2: Coordinate) {
  const earthRadius = 6371000
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calculateAcreage(coords: Coordinate[]) {
  if (coords.length < 3) return 0

  let area = 0
  for (let index = 0; index < coords.length; index++) {
    const nextIndex = (index + 1) % coords.length
    area += coords[index].lat * coords[nextIndex].lng
    area -= coords[nextIndex].lat * coords[index].lng
  }

  const areaInSquareDegrees = Math.abs(area) / 2
  const areaInSquareMeters = areaInSquareDegrees * 111320 * 111320
  return Number((areaInSquareMeters / 4047).toFixed(2))
}

export function FarmBoundaryTracker({ onBoundaryComplete }: FarmBoundaryTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [currentPosition, setCurrentPosition] = useState<Coordinate | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [distanceCovered, setDistanceCovered] = useState(0)
  const watchIdRef = useRef<number | null>(null)

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("GPS is not supported on this device.")
      return
    }

    setCoordinates([])
    setDistanceCovered(0)
    setError(null)
    setCurrentPosition(null)
    setAccuracy(null)
    setIsTracking(true)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextCoordinate = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        setCurrentPosition(nextCoordinate)
        setAccuracy(Math.round(position.coords.accuracy))

        setCoordinates((previousCoordinates) => {
          if (previousCoordinates.length > 0) {
            const lastCoordinate = previousCoordinates[previousCoordinates.length - 1]
            const distance = calculateDistance(lastCoordinate, nextCoordinate)

            if (distance < 3) {
              return previousCoordinates
            }

            setDistanceCovered((currentDistance) => currentDistance + distance)
          }

          return [...previousCoordinates, nextCoordinate]
        })
      },
      (geoError) => {
        setError(`GPS error: ${geoError.message}`)
        setIsTracking(false)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    )
  }

  const stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setIsTracking(false)

    if (coordinates.length >= 3) {
      onBoundaryComplete(coordinates, calculateAcreage(coordinates))
      return
    }

    setError("Not enough points recorded. Walk the full farm boundary before saving.")
  }

  const resetTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }

    setCoordinates([])
    setDistanceCovered(0)
    setCurrentPosition(null)
    setAccuracy(null)
    setError(null)
    setIsTracking(false)
  }

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [])

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-white">
      <div>
        <h3 className="font-semibold text-slate-800">Farm Boundary Tracking</h3>
        <p className="text-xs text-slate-500 mt-1">
          Walk to the first corner, tap start, then move around the full perimeter before stopping.
        </p>
      </div>

      {currentPosition && (
        <div
          className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${
            accuracy !== null && accuracy < 10
              ? "bg-emerald-50 text-emerald-700"
              : accuracy !== null && accuracy < 30
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              accuracy !== null && accuracy < 10
                ? "bg-emerald-500"
                : accuracy !== null && accuracy < 30
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
          />
          <span>
            GPS accuracy: +/-{accuracy ?? "?"}m
          </span>
        </div>
      )}

      {isTracking && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-lg font-bold text-emerald-600">{coordinates.length}</p>
            <p className="text-xs text-slate-500">Points</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-lg font-bold text-emerald-600">{distanceCovered.toFixed(0)}m</p>
            <p className="text-xs text-slate-500">Perimeter</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2">
            <p className="text-lg font-bold text-emerald-600">
              {coordinates.length >= 3 ? calculateAcreage(coordinates).toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-slate-500">Acres</p>
          </div>
        </div>
      )}

      {!isTracking && coordinates.length >= 3 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-emerald-800">Boundary recorded</p>
          <p className="text-xs text-emerald-700 mt-1">
            {coordinates.length} GPS points, about {calculateAcreage(coordinates).toFixed(2)} acres, {distanceCovered.toFixed(0)}m perimeter
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        {!isTracking ? (
          <>
            <button
              type="button"
              onClick={startTracking}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {coordinates.length > 0 ? "Retrace Boundary" : "Start Tracking"}
            </button>
            {coordinates.length >= 3 && (
              <button
                type="button"
                onClick={resetTracking}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={stopTracking}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors animate-pulse"
          >
            Stop and Save Boundary
          </button>
        )}
      </div>
    </div>
  )
}
