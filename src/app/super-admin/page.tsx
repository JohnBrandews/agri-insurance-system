import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Server, Globe2, ShieldCheck, CheckCircle2, XCircle, UserPlus } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { updateInsurerStatus } from "./actions"
import { AddInsurerForm } from "@/components/AddInsurerForm"

export default async function SuperAdminDashboard() {
  // Fetch real metrics
  const totalInsurers = await prisma.insuranceCompany.count()
  const pendingInsurersCount = await prisma.insuranceCompany.count({
    where: { status: "PENDING" }
  })
  
  const pendingInsurers = await prisma.insuranceCompany.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" }
  })

  // Global Coverage (Total acreage)
  const allFarms = await prisma.farm.findMany({ select: { acreage: true } })
  const globalCoverage = allFarms.reduce((sum, farm) => sum + farm.acreage, 0)

  // Platform Revenue (Total premiums collected from enrollments)
  // For MVP: Count enrollments * average premium just as a mock, or calculate exactly if policies have premiumRate
  const enrollments = await prisma.enrollment.findMany({
    include: { policy: true, farm: true }
  })
  
  let totalRevenue = 0
  enrollments.forEach(enroll => {
    // Dummy calc: premiumRate * acreage * 1000 (base value per acre)
    totalRevenue += (enroll.policy.premiumRate * enroll.farm.acreage * 1000)
  })

  const formattedCoverage = globalCoverage.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full min-w-0">
      {/* Platform Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card className="border-t-[3px] border-violet-500 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Insurers</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">{totalInsurers}</div>
            <p className="text-xs text-slate-500 mt-1">{pendingInsurersCount} pending approval</p>
          </CardContent>
        </Card>

        <Card className="border-t-[3px] border-blue-500 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Platform Revenue</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 break-words">${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-xs text-blue-500 mt-1 font-medium">Estimated Premium Volume</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-[3px] border-emerald-500 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Global Coverage</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-800 break-all">{formattedCoverage}</span>
              <span className="text-base sm:text-lg font-medium text-slate-500">Acres</span>
            </div>
            <p className="text-xs text-emerald-500 mt-1 font-medium">Active registered farms</p>
          </CardContent>
        </Card>

        <Card className="border-t-[3px] border-amber-500 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <CardHeader className="flex flex-row items-center justify-between pb-2 mb-0">
            <CardTitle className="text-sm font-semibold text-slate-500">Weather API Status</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="min-w-0">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-500">100%</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse" /> Syncing Normal
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {/* Pending Insurer Approvals */}
        <Card className="shadow-premium lg:col-span-2">
          <CardHeader>
            <CardTitle>Insurer Onboarding Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingInsurers.length === 0 ? (
                <div className="text-sm text-slate-500 italic p-4 text-center border rounded-xl bg-slate-50">
                  No pending insurer applications.
                </div>
              ) : (
                pendingInsurers.map((insurer) => (
                  <div key={insurer.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between hover:bg-white transition-colors cursor-pointer">
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-800 break-words">{insurer.name}</h4>
                      <p className="text-xs text-slate-500">Applied {insurer.createdAt.toLocaleDateString()}</p>
                    </div>
                    <div className="flex space-x-2 self-end sm:self-auto">
                      <form action={updateInsurerStatus.bind(null, insurer.id, "REJECTED")}>
                        <Button type="submit" variant="outline" size="sm" className="w-10 px-0 h-10 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                          <XCircle className="w-5 h-5" />
                        </Button>
                      </form>

                      <form action={updateInsurerStatus.bind(null, insurer.id, "APPROVED")}>
                        <Button type="submit" size="sm" className="w-10 px-0 h-10 bg-emerald-500 hover:bg-emerald-600 shadow-sm text-white border-0">
                          <CheckCircle2 className="w-5 h-5" />
                        </Button>
                      </form>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">View All Applications</Button>
          </CardContent>
        </Card>

        {/* Quick Actions - Add Insurer */}
        <Card className="shadow-premium">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <CardTitle>Quick Actions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <AddInsurerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
