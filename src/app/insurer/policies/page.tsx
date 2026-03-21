import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Trash2, Edit, Users, MapPin, Droplets, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"

export default async function PoliciesPage() {
  const session = await requireRole(["INSURER"])
  const companyId = session.companyId!

  const policies = await prisma.policy.findMany({
    where: { companyId },
    include: {
      enrollments: {
        include: {
          farmer: { include: { user: true } },
          farm: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Insurance Policies</h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage weather index insurance policies</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-5 h-5 mr-2" />
          Create New Policy
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{policies.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{policies.filter(p => p.status === "ACTIVE").length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{policies.reduce((sum, p) => sum + p.enrollments.length, 0)}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Farmers Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{new Set(policies.flatMap(p => p.enrollments.map(e => e.farmerId))).size}</div>
          </CardContent>
        </Card>
      </div>

      {/* Policies Grid */}
      {policies.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No policies yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Create your first weather index insurance policy to start enrolling farmers and providing coverage.
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{policy.cropType}</p>
                  </div>
                  <Badge variant={policy.status === "ACTIVE" ? "success" : "outline"}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" /> Region
                    </span>
                    <span className="font-medium text-slate-700">{policy.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Droplets className="w-4 h-4 mr-2" /> Rainfall Threshold
                    </span>
                    <span className="font-medium text-slate-700">{policy.rainfallThreshold}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" /> Season
                    </span>
                    <span className="font-medium text-slate-700">
                      {policy.seasonStart.toLocaleDateString()} - {policy.seasonEnd.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Users className="w-4 h-4 mr-2" /> Enrolled
                    </span>
                    <span className="font-medium text-emerald-600">{policy.enrollments.length} farmers</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Premium Rate</p>
                    <p className="text-lg font-bold text-slate-800">{(policy.premiumRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
