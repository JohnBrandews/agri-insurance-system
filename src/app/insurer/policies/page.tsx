import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Trash2, Edit, Users, MapPin, Droplets, Calendar, ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { CreatePolicyForm } from "@/components/CreatePolicyForm"
import Link from "next/link"
import { PolicyDeleteButton } from "@/components/PolicyDeleteButton"

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
  }) as any[]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Insurance Policies</h2>
          <p className="text-sm text-slate-500 mt-1">Create and manage weather index insurance policies</p>
        </div>
        <CreatePolicyForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{policies.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {policies.filter((p: any) => p.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {policies.reduce((sum: number, p: any) => sum + p.enrollments.length, 0)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Farmers Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">
              {new Set(policies.flatMap((p: any) => p.enrollments.map((e: any) => e.farmerId))).size}
            </div>
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
              <CreatePolicyForm />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy: any) => (
            <Card key={policy.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">{policy.cropType}</p>
                  </div>
                  <Badge className={policy.status === "ACTIVE" ? "bg-emerald-500 text-white border-none" : "border-slate-200"}>
                    {policy.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" /> Region
                    </span>
                    <span className="font-medium text-slate-700">{policy.region}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Droplets className="w-4 h-4 mr-2 text-blue-400" /> Rainfall Threshold
                    </span>
                    <span className="font-medium text-slate-700">{policy.rainfallThreshold}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-slate-400" /> Season
                    </span>
                    <span className="font-medium text-slate-700">
                      {policy.seasonStart ? new Date(policy.seasonStart).toLocaleDateString() : "N/A"} - {policy.seasonEnd ? new Date(policy.seasonEnd).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-violet-400" /> Enrolled
                    </span>
                    <span className="font-medium text-emerald-600">{policy.enrollments.length} farmers</span>
                  </div>
                </div>

                {policy.enrollments.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Recent Enrollments</p>
                    <div className="space-y-1">
                      {policy.enrollments.slice(0, 2).map((e: any) => (
                        <div key={e.id} className="text-xs flex items-center justify-between bg-slate-50 p-2 rounded">
                          <span className="text-slate-700 font-medium">{e.farmer.user.name}</span>
                          <span className="text-slate-400">{e.farm.acreage} acres</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Premium Rate</p>
                    <p className="text-lg font-bold text-slate-800">{(policy.premiumRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <PolicyDeleteButton policyId={policy.id} policyName={policy.name} />
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
