import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, Mail, MapPin, CheckCircle2, XCircle, UserCheck } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { AddAgentForm } from "@/components/AddAgentForm"

export default async function AgentsPage() {
  const session = await requireRole(["INSURER"])
  const companyId = session.companyId!

  const agents = await prisma.agent.findMany({
    where: { companyId },
    include: {
      user: true,
      farmersRegistered: { include: { user: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  const activeAgents = agents.filter(a => a.status === "ACTIVE")
  const suspendedAgents = agents.filter(a => a.status === "SUSPENDED")

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Field Agents</h2>
          <p className="text-sm text-slate-500 mt-1">Manage your field agent network</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{agents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{activeAgents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{suspendedAgents.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Farmers Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{agents.reduce((sum, a) => sum + a.farmersRegistered.length, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Agent Form */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Invite New Agent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddAgentForm companyId={companyId} />
          </CardContent>
        </Card>

        {/* Agents List */}
        <div className="lg:col-span-2 space-y-4">
          {agents.length === 0 ? (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">No agents yet</h3>
                  <p className="text-sm text-slate-500 mb-6">Invite your first field agent to start registering farmers.</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                        {agent.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800">{agent.user.name}</h4>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {agent.user.email}
                        </p>
                        <p className="text-sm text-slate-500 flex items-center mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {agent.region}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{agent.farmersRegistered.length}</p>
                        <p className="text-xs text-slate-500">Farmers</p>
                      </div>
                      <Badge variant={agent.status === "ACTIVE" ? "success" : "warning"}>
                        {agent.status}
                      </Badge>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-emerald-500 hover:bg-emerald-50">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
