import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Phone, ArrowUpRight, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/Map"), { ssr: false })

export default async function InsurerFarmersPage() {
  const session = await requireRole(["INSURER"])
  const companyId = session.companyId!

  const agents = await prisma.agent.findMany({
    where: { companyId },
    include: {
      farmersRegistered: {
        include: {
          user: true,
          farms: true,
          enrollments: { include: { policy: true } }
        }
      }
    }
  })

  const allFarmers = agents.flatMap(a => a.farmersRegistered)
  const allFarms = allFarmers.flatMap(f => f.farms)

  // Prepare map markers for farms
  const farmMarkers = allFarmers.flatMap(farmer => 
    (farmer as any).farms.map((f: any) => {
      try {
        const coords = JSON.parse(f.polygonCoordinates)
        if (Array.isArray(coords) && coords.length > 0) {
          const first = coords[0]
          const pos = (first.lat !== undefined) ? [first.lat, first.lng] : first
          return {
            position: pos as [number, number],
            label: `${(farmer as any).user.name}'s ${f.cropType} farm`
          }
        }
      } catch (e) {}
      return null
    })
  ).filter(Boolean) as any[]

  const mapCenter = farmMarkers.length > 0 ? farmMarkers[0].position : [-1.286389, 36.817223]

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Farmers Network</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all farmers registered by your field agents</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search farmers..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{allFarmers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Acreage Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {allFarms.reduce((sum, f) => sum + f.acreage, 0).toFixed(1)} <small className="text-slate-400 font-normal">acres</small>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Active Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {allFarmers.reduce((sum, f) => sum + f.enrollments.filter(e => e.status === "ACTIVE").length, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map View */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Farm Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px]">
              <Map markers={farmMarkers} center={mapCenter} zoom={farmMarkers.length > 0 ? 12 : 6} />
            </div>
          </CardContent>
        </Card>

        {/* Farmers List */}
        <div className="space-y-4">
          {allFarmers.length === 0 ? (
            <Card className="py-12 text-center text-slate-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No farmers registered yet.</p>
            </Card>
          ) : (
            allFarmers.map(farmer => (
              <Card key={farmer.id} className="hover:shadow-md transition-shadow group">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                      {farmer.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {farmer.user.name}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-slate-500 mt-0.5">
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" /> {farmer.phone || 'No phone'}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" /> {farmer.farms.length} Farm(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div className="mr-4">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Acreage</p>
                      <p className="font-bold text-slate-700">{farmer.farms.reduce((sum, f) => sum + f.acreage, 0).toFixed(1)} ac</p>
                    </div>
                    <Badge className={farmer.enrollments.some(e => e.status === "ACTIVE") ? "bg-emerald-500 text-white border-none" : "border-slate-200"}>
                      {farmer.enrollments.some(e => e.status === "ACTIVE") ? "INSURED" : "UNINSURED"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
