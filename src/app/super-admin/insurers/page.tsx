import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Search, Filter } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { AddInsurerForm } from "@/components/AddInsurerForm"
import { InsurerCard } from "@/components/InsurerCard"
import { InsurerSearchFilter } from "@/components/InsurerSearchFilter"

export default async function InsurersPage({ 
  searchParams 
}: { 
  searchParams: { search?: string, status?: string } 
}) {
  const search = searchParams.search
  const status = searchParams.status

  const allInsurers = await prisma.insuranceCompany.findMany({
    where: {
      AND: [
        search ? {
          OR: [
            { name: { contains: search } },
            { users: { some: { email: { contains: search } } } }
          ]
        } : {},
        status ? { status } : {}
      ]
    },
    include: { 
      users: { select: { email: true, lastLogin: true, name: true } },
      _count: {
        select: { policies: true, agents: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Grouping for the UI sections
  const pending = allInsurers.filter(i => i.status === "PENDING")
  const active = allInsurers.filter(i => i.status === "APPROVED")
  const inactive = allInsurers.filter(i => i.status === "REJECTED")

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Insurance Network</h2>
          <p className="text-slate-500 mt-1 text-lg">Manage onboarding, performance, and compliance of insurance partners.</p>
        </div>
        <InsurerSearchFilter />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-none shadow-sm ring-1 ring-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-900">{allInsurers.length}</div>
            <p className="text-xs text-slate-400 mt-1">Registered Companies</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm ring-1 ring-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-600">{active.length}</div>
            <p className="text-xs text-emerald-600/60 mt-1">Fully Operational</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm ring-1 ring-amber-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-amber-600">{pending.length}</div>
            <p className="text-xs text-amber-600/60 mt-1">Awaiting Review</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm ring-1 ring-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-red-600 uppercase tracking-wider">Restricted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-red-600">{inactive.length}</div>
            <p className="text-xs text-red-600/60 mt-1">Suspended/Rejected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Onboarding Form */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-premium border-none ring-1 ring-slate-200 overflow-hidden">
            <div className="bg-violet-600 h-2 px-6" />
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Plus className="w-5 h-5 mr-2 text-violet-500" />
                Invite Partner
              </CardTitle>
              <p className="text-xs text-slate-500">Send an invitation link to a new insurance company admin.</p>
            </CardHeader>
            <CardContent>
              <AddInsurerForm />
            </CardContent>
          </Card>
        </div>

        {/* Insurers Grid */}
        <div className="lg:col-span-3 space-y-12">
          {/* Pending Section */}
          {pending.length > 0 && (
            <section>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-8 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-xl font-bold text-slate-800">New Applications</h3>
                <Badge variant="warning">{pending.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pending.map(insurer => (
                  <InsurerCard 
                    key={insurer.id} 
                    insurer={insurer} 
                  />
                ))}
              </div>
            </section>
          )}

          {/* All Insurers Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-8 w-1 bg-violet-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-800">All Partners</h3>
            </div>
            {allInsurers.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No insurance companies registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allInsurers.filter(i => i.status !== "PENDING").map(insurer => (
                  <InsurerCard 
                    key={insurer.id} 
                    insurer={insurer} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
