"use client"

import { useEffect, useRef, useState } from "react"

type Coordinate = { lat: number; lng: number }
type PositionSample = Coordinate & { accuracy: number }

const EARTH_RADIUS_METERS = 6371000
const MAX_ACCEPTABLE_ACCURACY_METERS = 20

type FarmBoundaryTrackerProps = {
  onBoundaryComplete: (coordinates: Coordinate[], acreage: number) => void
}

function calculateDistance(coord1: Coordinate, coord2: Coordinate) {
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180
  const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)

  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function calculateAcreage(coords: Coordinate[]) {
  if (coords.length < 3) return 0

  const averageLatRadians =
    (coords.reduce((total, coordinate) => total + coordinate.lat, 0) / coords.length) * (Math.PI / 180)

  const projectedCoordinates = coords.map((coordinate) => {
    const latRadians = (coordinate.lat * Math.PI) / 180
    const lngRadians = (coordinate.lng * Math.PI) / 180

    return {
      x: EARTH_RADIUS_METERS * lngRadians * Math.cos(averageLatRadians),
      y: EARTH_RADIUS_METERS * latRadians,
    }
  })

  let areaInSquareMeters = 0
  for (let index = 0; index < projectedCoordinates.length; index++) {
    const nextIndex = (index + 1) % projectedCoordinates.length
    areaInSquareMeters +=
      projectedCoordinates[index].x * projectedCoordinates[nextIndex].y -
      projectedCoordinates[nextIndex].x * projectedCoordinates[index].y
  }

  return Number((Math.abs(areaInSquareMeters) / 2 / 4047).toFixed(2))
}

function getMinimumMovementDistance(sampleAccuracy: number) {
  return Math.max(8, Math.min(20, sampleAccuracy * 0.9))
}

export function FarmBoundaryTracker({ onBoundaryComplete }: FarmBoundaryTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [currentPosition, setCurrentPosition] = useState<Coordinate | null>(null)
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [distanceCovered, setDistanceCovered] = useState(0)
  const [trackerHint, setTrackerHint] = useState<string | null>(null)
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
    setTrackerHint("Waiting for GPS accuracy to improve before recording boundary points.")
    setIsTracking(true)

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const nextCoordinate: PositionSample = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }

        setCurrentPosition({ lat: nextCoordinate.lat, lng: nextCoordinate.lng })
        setAccuracy(Math.round(nextCoordinate.accuracy))

        if (nextCoordinate.accuracy > MAX_ACCEPTABLE_ACCURACY_METERS) {
          setTrackerHint(
            `GPS accuracy is still weak at about ${Math.round(nextCoordinate.accuracy)}m. Move to an open area and wait a moment.`
          )
          return
        }

        setTrackerHint("GPS signal is stable. Keep walking the outer boundary of the farm.")
        setError(null)

        setCoordinates((previousCoordinates) => {
          if (previousCoordinates.length > 0) {
            const lastCoordinate = previousCoordinates[previousCoordinates.length - 1]
            const distance = calculateDistance(lastCoordinate, nextCoordinate)
            const minimumMovement = getMinimumMovementDistance(nextCoordinate.accuracy)

            if (distance < minimumMovement) {
              return previousCoordinates
            }

            setDistanceCovered((currentDistance) => currentDistance + distance)
          }

          return [...previousCoordinates, { lat: nextCoordinate.lat, lng: nextCoordinate.lng }]
        })
      },
      (geoError) => {
        setError(`GPS error: ${geoError.message}`)
        setTrackerHint(null)
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
    setTrackerHint(null)

    if (coordinates.length >= 3) {
      onBoundaryComplete(coordinates, calculateAcreage(coordinates))
      return
    }

    setError("Not enough stable GPS points were recorded. Walk the full farm boundary before saving.")
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
    setTrackerHint(null)
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
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <h3 className="font-semibold text-slate-800">Farm Boundary Tracking</h3>
        <p className="mt-1 text-xs text-slate-500">
          Walk to the first corner, tap start, then move around the full perimeter before stopping. Points are only recorded when GPS accuracy is strong enough.
        </p>
      </div>

      {currentPosition ? (
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${
            accuracy !== null && accuracy < 10
              ? "bg-emerald-50 text-emerald-700"
              : accuracy !== null && accuracy < MAX_ACCEPTABLE_ACCURACY_METERS
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          <div
            className={`h-2 w-2 rounded-full ${
              accuracy !== null && accuracy < 10
                ? "bg-emerald-500"
                : accuracy !== null && accuracy < MAX_ACCEPTABLE_ACCURACY_METERS
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
          />
          <span>GPS accuracy: +/-{accuracy ?? "?"}m</span>
        </div>
      ) : null}

      {trackerHint ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {trackerHint}
        </div>
      ) : null}

      {isTracking ? (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-lg font-bold text-emerald-600">{coordinates.length}</p>
            <p className="text-xs text-slate-500">Points</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-lg font-bold text-emerald-600">{distanceCovered.toFixed(0)}m</p>
            <p className="text-xs text-slate-500">Perimeter</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-2">
            <p className="text-lg font-bold text-emerald-600">
              {coordinates.length >= 3 ? calculateAcreage(coordinates).toFixed(2) : "0.00"}
            </p>
            <p className="text-xs text-slate-500">Acres</p>
          </div>
        </div>
      ) : null}

      {!isTracking && coordinates.length >= 3 ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <p className="text-sm font-semibold text-emerald-800">Boundary recorded</p>
          <p className="mt-1 text-xs text-emerald-700">
            {coordinates.length} GPS points, about {calculateAcreage(coordinates).toFixed(2)} acres, {distanceCovered.toFixed(0)}m perimeter
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      <div className="flex gap-2">
        {!isTracking ? (
          <>
            <button
              type="button"
              onClick={startTracking}
              className="flex-1 rounded-lg bg-emerald-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              {coordinates.length > 0 ? "Retrace Boundary" : "Start Tracking"}
            </button>
            {coordinates.length >= 3 ? (
              <button
                type="button"
                onClick={resetTracking}
                className="bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 rounded-lg"
              >
                Reset
              </button>
            ) : null}
          </>
        ) : (
          <button
            type="button"
            onClick={stopTracking}
            className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 animate-pulse"
          >
            Stop and Save Boundary
          </button>
        )}
      </div>
    </div>
  )
}
