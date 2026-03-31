import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Droplets, MapPin, Receipt, TrendingUp, AlertTriangle, CloudRain, UserPlus, FilePlus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { FarmMapClient } from "@/components/FarmMapClient"
import { AddAgentForm } from "@/components/AddAgentForm"
import Link from "next/link"
import { resolveFarmCoordinates } from "@/lib/kenya-locations"

export default async function InsurerDashboard() {
  const session = await requireRole(["INSURER"])
  const companyId = session.companyId!

  // 1. Fetch Company Policies
  const policies = await prisma.policy.findMany({
    where: { companyId },
    include: { enrollments: { include: { farm: true, farmer: { include: { user: true, agent: true } } } } }
  })

  // 2. Aggregate Metrics
  let totalFarmers = 0
  let totalAcreage = 0
  let totalPremiums = 0
  let totalPayouts = 0

  const allFarms: any[] = []

  policies.forEach(policy => {
    totalFarmers += policy.enrollments.length
    policy.enrollments.forEach(enroll => {
      totalAcreage += enroll.farm.acreage
      totalPremiums += (policy.premiumRate * enroll.farm.acreage * 1000)

        allFarms.push({
          id: enroll.farm.id,
          locationName: enroll.farm.locationName,
          acreage: enroll.farm.acreage,
          cropType: enroll.farm.cropType,
          status: enroll.farm.status,
          coordinates: resolveFarmCoordinates(
            enroll.farm.polygonCoordinates || "[]",
            enroll.farmer.agent?.region,
            `${enroll.farmer.id}-${enroll.farm.id}`
          ),
          farmerName: enroll.farmer.user.name
        })
    })
  })

  // 3. Active Triggers
  const activeTriggers = await prisma.triggerEvent.findMany({
    where: { policyId: { in: policies.map(p => p.id) } },
    orderBy: { dateTriggered: 'desc' },
    take: 5
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="hover:-translate-y-1 transition-transform cursor-pointer border-t-[3px] border-emerald-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Enrolled Farmers</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalFarmers}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
              Active Coverage
            </p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform cursor-pointer border-t-[3px] border-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Active Policies</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-primary flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{policies.length}</div>
            <p className="text-xs text-primary font-medium mt-1 flex items-center">
              Market products
            </p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform cursor-pointer border-t-[3px] border-amber-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Acreage Covered</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalAcreage.toLocaleString()} <span className="text-base text-slate-500 font-medium">Acres</span></div>
            <p className="text-xs text-amber-500 font-medium mt-1 flex items-center">
              Total insured risk
            </p>
          </CardContent>
        </Card>

        <Card className="hover:-translate-y-1 transition-transform cursor-pointer border-t-[3px] border-red-400">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Active Triggers</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{activeTriggers.length}</div>
            <p className="text-xs text-red-500 font-medium mt-1 flex items-center">
              Requires immediate review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Farm Monitoring Map */}
        <Card className="col-span-2 shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Global Farm Monitoring Map</CardTitle>
              <p className="text-sm text-slate-500 mt-1">Interactive monitoring of client crop health via Open-Meteo index.</p>
            </div>
          </CardHeader>
          <CardContent>
            <FarmMapClient farms={allFarms as any} />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <UserPlus className="w-4 h-4 mr-2 text-blue-500" />
                Add Field Agent
              </h4>
              <AddAgentForm companyId={companyId} />
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center">
                <FilePlus className="w-4 h-4 mr-2 text-emerald-500" />
                Create New Policy
              </h4>
              <Link href="/insurer/policies">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Create Insurance Policy</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Policies Section */}
      <div className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Insurance Policies</CardTitle>
            <Badge className="border-slate-200">{policies.length} Active</Badge>
          </CardHeader>
          <CardContent>
            {policies.length === 0 ? (
              <div className="text-sm text-slate-500 italic p-8 text-center border rounded-xl bg-slate-50">
                <Receipt className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No policies created yet.</p>
                <p className="text-xs mt-1">Create your first policy to start enrolling farmers.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policies.map((policy) => {
                  const enrolledCount = policy.enrollments.length
                  return (
                    <div key={policy.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-800">{policy.name}</h4>
                          <p className="text-xs text-slate-500">{policy.cropType} • {policy.region}</p>
                        </div>
                        <Badge className={`${policy.status === "ACTIVE" ? "bg-emerald-500 text-white border-none" : "border-slate-200"} text-xs`}>
                          {policy.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Rainfall Threshold</span>
                          <span className="font-medium text-slate-700">{policy.rainfallThreshold}mm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Premium Rate</span>
                          <span className="font-medium text-slate-700">{(policy.premiumRate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Enrolled Farmers</span>
                          <span className="font-medium text-emerald-600">{enrolledCount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
