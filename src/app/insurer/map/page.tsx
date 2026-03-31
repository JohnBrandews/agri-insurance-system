import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sprout, Users, TrendingUp } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { FarmMapClient } from "@/components/FarmMapClient"
import { resolveFarmCoordinates } from "@/lib/kenya-locations"

export default async function MapPage() {
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

  // Collect all farms
  const allFarms: any[] = []
  agents.forEach(agent => {
    agent.farmersRegistered.forEach(farmer => {
      farmer.farms.forEach(farm => {
        allFarms.push({
          id: farm.id,
          locationName: farm.locationName,
          acreage: farm.acreage,
          cropType: farm.cropType,
          status: farm.status,
          coordinates: resolveFarmCoordinates(farm.polygonCoordinates || "[]", agent.region, `${farmer.id}-${farm.id}`),
          farmerName: farmer.user.name,
          policyName: farmer.enrollments[0]?.policy?.name || "No Policy"
        })
      })
    })
  })

  // Calculate stats
  const totalAcreage = allFarms.reduce((sum, farm) => sum + farm.acreage, 0)
  const healthyFarms = allFarms.filter(f => f.status === "HEALTHY").length
  const riskFarms = allFarms.filter(f => f.status === "RISK").length
  const triggeredFarms = allFarms.filter(f => f.status === "TRIGGERED").length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Farm Monitoring Map</h2>
        <p className="text-sm text-slate-500 mt-1">Geospatial view of all insured farms</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> Total Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{allFarms.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center">
              <Sprout className="w-4 h-4 mr-1" /> Total Acres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalAcreage.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-emerald-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{healthyFarms}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-red-400">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500 flex items-center">
              <Users className="w-4 h-4 mr-1" /> At Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{riskFarms + triggeredFarms}</div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className="shadow-premium">
        <CardHeader>
          <CardTitle>Interactive Farm Map</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Click on farms to view details. Color-coded by health status.
          </p>
        </CardHeader>
        <CardContent>
          {allFarms.length === 0 ? (
            <div className="h-96 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-center">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No farms to display</h3>
                <p className="text-sm text-slate-500">Farms will appear here once agents register them.</p>
              </div>
            </div>
          ) : (
            <FarmMapClient farms={allFarms} />
          )}
        </CardContent>
      </Card>

      {/* Farms List */}
      <Card>
        <CardHeader>
          <CardTitle>All Registered Farms</CardTitle>
        </CardHeader>
        <CardContent>
          {allFarms.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-8 text-center border rounded-xl bg-slate-50">
              No farms registered yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Farm Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Farmer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Crop</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Acres</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {allFarms.map((farm) => (
                    <tr key={farm.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{farm.locationName}</td>
                      <td className="py-3 px-4 text-slate-600">{farm.farmerName}</td>
                      <td className="py-3 px-4 text-slate-600">{farm.cropType}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{farm.acreage}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            farm.status === "HEALTHY" ? "bg-emerald-500 text-white border-none" : 
                            farm.status === "RISK" ? "bg-amber-500 text-white border-none" : "bg-red-500 text-white border-none"
                          }
                        >
                          {farm.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{farm.policyName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
