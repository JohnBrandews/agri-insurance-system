import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, FileText, ChevronLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/Map"), { ssr: false })

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
            include: { user: true, farms: { include: { farmer: { include: { user: true } } } }, enrollments: true } 
          } 
        }
      }
    }
  })

  if (!insurer) return <div>Insurer not found</div>

  const allFarmers = insurer.agents.flatMap(a => a.farmersRegistered)
  const allFarms = allFarmers.flatMap(f => f.farms)
  
  // Prepare map markers for farms
  const farmMarkers = allFarms.map(f => {
    try {
      const coords = JSON.parse(f.polygonCoordinates)
      // Normalize to [lat, lng] array if it's an object {lat, lng}
      if (Array.isArray(coords) && coords.length > 0) {
        const first = coords[0]
        const pos = (first.lat !== undefined) ? [first.lat, first.lng] : first
        return {
          position: pos as [number, number],
          label: `${f.farmer.user.name}'s ${f.cropType} farm`
        }
      }
    } catch (e) {}
    return null
  }).filter(Boolean) as any[]

  // Calculate center based on first marker or default to Kenya central
  const mapCenter = farmMarkers.length > 0 ? farmMarkers[0].position : [-1.286389, 36.817223]

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
                  {insurer.policies.map(p => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4">{p.cropType}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">{(p as any)._count.enrollments} Farmers</td>
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
                    <p className="text-sm font-bold text-slate-700">{(a as any).farmersRegistered.length}</p>
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
              <div className="h-[400px] rounded-xl overflow-hidden border border-slate-200">
                <Map markers={farmMarkers} center={mapCenter} zoom={farmMarkers.length > 0 ? 12 : 6} />
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
                    {allFarmers.map(f => (
                      <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-800">{(f as any).user.name}</td>
                        <td className="py-3 px-4">{(f as any).farms.reduce((sum: number, farm: any) => sum + farm.acreage, 0)} acres</td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{(f as any).enrollments.length} Policies</td>
                        <td className="py-3 px-4">
                          <Badge variant="success">ACTIVE</Badge>
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
