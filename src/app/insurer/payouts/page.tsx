import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, CheckCircle2, XCircle, Clock, AlertTriangle, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"

export default async function PayoutsPage() {
  const session = await requireRole(["INSURER"])
  const companyId = session.companyId!

  // Fetch company policies
  const policies = await prisma.policy.findMany({
    where: { companyId },
    include: {
      enrollments: {
        include: {
          payouts: true,
          farmer: { include: { user: true } },
          farm: true
        }
      }
    }
  })

  // Collect all payouts
  const allPayouts: any[] = []
  policies.forEach(policy => {
    policy.enrollments.forEach(enrollment => {
      enrollment.payouts.forEach(payout => {
        allPayouts.push({
          ...payout,
          enrollment,
          policy,
          farmer: enrollment.farmer,
          farm: enrollment.farm
        })
      })
    })
  })

  // Calculate stats
  const totalPayouts = allPayouts.reduce((sum, p) => sum + p.amount, 0)
  const pendingPayouts = allPayouts.filter(p => p.status === "PENDING")
  const approvedPayouts = allPayouts.filter(p => p.status === "APPROVED")
  const paidPayouts = allPayouts.filter(p => p.status === "PAID")
  const rejectedPayouts = allPayouts.filter(p => p.status === "REJECTED")

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Triggers & Payouts</h2>
        <p className="text-sm text-slate-500 mt-1">Manage weather trigger events and farmer payouts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${totalPayouts.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pendingPayouts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{approvedPayouts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{paidPayouts.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejectedPayouts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payouts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-amber-500" />
            <CardTitle>Pending Payout Approvals</CardTitle>
          </div>
          <Badge className="bg-amber-500 text-white border-none">{pendingPayouts.length} Pending</Badge>
        </CardHeader>
        <CardContent>
          {pendingPayouts.length === 0 ? (
            <div className="text-sm text-slate-500 italic p-8 text-center border rounded-xl bg-slate-50">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-300" />
              <p>All payouts have been processed. No pending approvals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayouts.map((payout) => (
                <div key={payout.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{payout.farmer.user.name}</h4>
                        <p className="text-sm text-slate-500">{payout.farm.locationName} • {payout.farm.cropType}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Triggered: {payout.dateCalculated.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">${payout.amount.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Payout Amount</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
                          <XCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Payouts History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {allPayouts.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-8 text-center border rounded-xl bg-slate-50">
              No payout history available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Farmer</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Farm</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{payout.farmer.user.name}</td>
                      <td className="py-3 px-4 text-slate-600">{payout.farm.locationName}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">${payout.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{payout.dateCalculated.toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <Badge 
                          className={
                            payout.status === "PAID" ? "bg-emerald-500 text-white border-none" : 
                            payout.status === "APPROVED" ? "bg-blue-500 text-white border-none" : 
                            payout.status === "REJECTED" ? "bg-red-500 text-white border-none" : "bg-amber-500 text-white border-none"
                          }
                        >
                          {payout.status}
                        </Badge>
                      </td>
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
