import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, FileCheck, MapPin, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"

export default async function AgentDashboard() {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({
    where: { userId: session.id },
    include: { farmersRegistered: { include: { user: true, farms: true } } }
  })

  if (!agent) return <div>Agent Profile NotFound</div>

  const farmers = agent.farmersRegistered || []

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Assigned Region</h2>
          <p className="text-sm text-slate-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" /> {agent.region}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-0 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-primary flex items-center justify-center mb-2">
              <Users className="w-6 h-6" />
            </div>
            <CardTitle className="text-slate-500 font-medium text-xs uppercase tracking-wider">Verified Farmers</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-center">
            <div className="text-2xl font-bold text-slate-800">{farmers.length}</div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="p-4 pb-0 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-2">
              <FileCheck className="w-6 h-6" />
            </div>
            <CardTitle className="text-slate-500 font-medium text-xs uppercase tracking-wider">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-1 text-center">
            <div className="text-2xl font-bold text-slate-800">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-4">
        <Link href="/agent/register">
          <Button className="w-full h-14 text-lg font-semibold shadow-md bg-gradient-to-r from-primary to-primary-light hover:scale-[1.02] transition-transform">
            <Plus className="w-6 h-6 mr-2" /> Register New Farmer
          </Button>
        </Link>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {farmers.length === 0 ? (
            <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 border rounded-xl">No farmers registered yet.</p>
          ) : (
            farmers.map((farmer, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <p className="font-semibold text-slate-800">{farmer.user?.name || "Unknown"}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {farmer.farms[0]?.cropType || "No crop"} • {farmer.farms[0]?.acreage || 0} Acres
                  </p>
                </div>
                <div className="text-xs font-medium text-slate-400">
                  Registered
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
