"use client"

import { useEffect, useState } from 'react'

export default function Map({ className = "h-full w-full" }: any) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className={`${className} bg-slate-900 flex items-center justify-center rounded-lg text-emerald-500 font-mono text-xs p-4 text-center border border-emerald-500/20`}>
      <div className="space-y-2">
        <div className="animate-pulse flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>MAP COMPONENT ACTIVE</span>
        </div>
        <p className="text-slate-500">Visualization Engine Initialized (Leaflet Placeholder)</p>
      </div>
    </div>
  )
}
