import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle2, XCircle, Mail, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { AddInsurerForm } from "@/components/AddInsurerForm"

export default async function InsurersPage() {
  const allInsurers = await prisma.insuranceCompany.findMany({
    include: { users: true, subscriptions: true },
    orderBy: { createdAt: "desc" }
  })

  const approved = allInsurers.filter(i => i.status === "APPROVED")
  const pending = allInsurers.filter(i => i.status === "PENDING")
  const rejected = allInsurers.filter(i => i.status === "REJECTED")

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Insurance Companies</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all insurer onboarding and status</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Insurers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{allInsurers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{approved.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{pending.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{rejected.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Insurer Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-violet-500" />
              Invite New Insurer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddInsurerForm />
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pending.length === 0 ? (
              <p className="text-sm text-slate-500 italic p-4 text-center border rounded-xl bg-slate-50">
                No pending insurer applications.
              </p>
            ) : (
              <div className="space-y-3">
                {pending.map((insurer) => (
                  <div key={insurer.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">{insurer.name}</h4>
                      <p className="text-xs text-slate-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {insurer.createdAt.toLocaleDateString()}
                      </p>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Insurers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Insurance Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Company Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Users</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {allInsurers.map((insurer) => (
                  <tr key={insurer.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{insurer.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant={insurer.status === "APPROVED" ? "success" : insurer.status === "PENDING" ? "warning" : "danger"}>
                        {insurer.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{insurer.users.length}</td>
                    <td className="py-3 px-4 text-slate-500">{insurer.createdAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
