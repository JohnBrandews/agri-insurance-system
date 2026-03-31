import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, ChevronLeft, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AgentFarmersPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireRole(["INSURER"])
  const { id } = await params
  
  const agent = await prisma.agent.findUnique({
    where: { 
      id: id
    },
    include: {
      user: true,
      farmersRegistered: {
        include: { 
          user: true, 
          farms: true, 
          enrollments: { include: { policy: true } } 
        }
      }
    }
  }) as any

  if (!agent || agent.companyId !== session.companyId) {
    return <div>Agent not found or access denied.</div>
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center space-x-4">
        <Link href="/insurer/agents">
          <Button variant="ghost" size="sm" className="rounded-xl">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Agents
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Farmers registered by {agent.user.name}</h2>
          <p className="text-sm text-slate-500">Region: {agent.region}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-premium ring-1 ring-slate-100 overflow-hidden">
          <CardHeader className="bg-slate-50/50">
            <CardTitle className="flex items-center text-lg">
              <Users className="w-5 h-5 mr-2 text-blue-500" />
              Registered Farmers ({agent.farmersRegistered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="text-left py-4 px-6 font-bold text-slate-500 uppercase tracking-wider">Farmer Details</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-500 uppercase tracking-wider">Acreage</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-500 uppercase tracking-wider">Active Enrollments</th>
                    <th className="text-left py-4 px-6 font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {agent.farmersRegistered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No farmers registered by this agent yet.
                      </td>
                    </tr>
                  ) : (
                    agent.farmersRegistered.map((farmer: any) => (
                      <tr key={farmer.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900">{farmer.user.name}</div>
                          <div className="text-xs text-slate-400">ID: {farmer.id || "N/A"}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center text-slate-600">
                            <Phone className="w-3 h-3 mr-1.5 text-slate-400" />
                            {farmer.phone || "---"}
                          </div>
                          <div className="text-xs font-medium text-slate-400 mt-0.5">{farmer.user.email}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-700">
                          {farmer.farms.reduce((sum: number, f: any) => sum + (f.acreage || 0), 0).toFixed(1)} acres
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1">
                            {farmer.enrollments.map((e: any) => (
                              <Badge key={e.id} className="bg-blue-50 text-blue-700 border-blue-100">
                                {e.policy.name}
                              </Badge>
                            ))}
                            {farmer.enrollments.length === 0 && (
                              <span className="text-slate-400 text-xs italic">No active policies</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge className="bg-emerald-500 text-white border-none">ACTIVE</Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
