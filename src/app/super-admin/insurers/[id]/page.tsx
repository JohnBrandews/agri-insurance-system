import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false })

export default async function InsurerDetailsPage({ params }: { params: { id: string } }) {
  await requireRole(["SUPER_ADMIN"])

  const insurer = await prisma.insuranceCompany.findUnique({
    where: { id: params.id },
    include: {
      users: true,
      policies: {
        include: { _count: { select: { enrollments: true } } }
      },
      agents: {
        include: { 
          user: true, 
          farmersRegistered: { 
            include: { user: true, farms: true, enrollments: true } 
          } 
        }
      }
    }
  })

  if (!insurer) return <div>Insurer not found</div>

  const allFarmers = insurer.agents.flatMap(a => a.farmersRegistered)
  type FarmerRecord = (typeof allFarmers)[number]
  type PolicyRecord = (typeof insurer.policies)[number]
  
  // Prepare map data for LeafletMap
  const mapFarms = allFarmers.flatMap(farmer => 
    farmer.farms.map(farm => {
      let coordinates: { lat: number; lng: number }[] = []
      try {
        const parsed = JSON.parse(farm.polygonCoordinates)
        coordinates = Array.isArray(parsed) ? parsed : [parsed]
      } catch (e) {
        console.error("Error parsing coordinates for farm:", farm.id, e)
      }

      return {
        id: farm.id,
        locationName: farm.locationName,
        acreage: farm.acreage,
        cropType: farm.cropType,
        status: farm.status,
        coordinates,
        farmerName: farmer.user.name
      }
    })
  )

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/super-admin/insurers">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900">{insurer.name} Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Policies Section */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Policies
            </CardTitle>
            <Badge variant="outline">{insurer.policies.length} Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Policy Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Crop Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {insurer.policies.map((p: PolicyRecord) => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4">{p.cropType}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{p._count.enrollments} Farmers</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Agents Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-violet-500" />
              Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insurer.agents.map(a => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-slate-800">{a.user.name}</p>
                    <p className="text-xs text-slate-500">{a.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-700">{a.farmersRegistered.length}</p>
                    <p className="text-[10px] text-slate-400 uppercase">Farmers</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Farmers Section */}
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-emerald-500" />
              Registered Farmers & Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[400px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                <LeafletMap 
                  farms={mapFarms}
                  onSelectFarm={(farm: (typeof mapFarms)[number]) => console.log("Selected farm:", farm)} 
                />
              </div>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-bold text-slate-600">Farmer Name</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-600">Total Acreage</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-600">Enrollments</th>
                      <th className="text-left py-3 px-4 font-bold text-slate-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allFarmers.map((f: FarmerRecord) => (
                      <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-800">{f.user.name}</td>
                        <td className="py-3 px-4">{f.farms.reduce((sum, farm) => sum + farm.acreage, 0)} acres</td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{f.enrollments.length} Policies</td>
                        <td className="py-3 px-4">
                          <Badge className="bg-emerald-500 text-white border-none">ACTIVE</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
