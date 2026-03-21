import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Plus, MapPin, Phone, Mail, Sprout, Calendar } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/session"

export default async function FarmersPage() {
  const session = await requireRole(["AGENT"])

  const agent = await prisma.agent.findUnique({
    where: { userId: session.id },
    include: {
      farmersRegistered: {
        include: {
          user: true,
          farms: true,
          enrollments: { include: { policy: true } }
        }
      }
    }
  })

  if (!agent) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Agent profile not found.</p>
      </div>
    )
  }

  const farmers = agent.farmersRegistered

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Farmers</h2>
          <p className="text-sm text-slate-500 mt-1">Manage farmers registered in {agent.region}</p>
        </div>
        <Link href="/agent/register">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-5 h-5 mr-2" />
            Register New Farmer
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{farmers.length}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Farms Registered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{farmers.reduce((sum, f) => sum + f.farms.length, 0)}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Total Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{farmers.reduce((sum, f) => sum + f.enrollments.length, 0)}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-500">Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-slate-800 truncate">{agent.region}</div>
          </CardContent>
        </Card>
      </div>

      {/* Farmers List */}
      {farmers.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No farmers registered yet</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                Start registering farmers in your region to build your network and provide insurance coverage.
              </p>
              <Link href="/agent/register">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="w-5 h-5 mr-2" />
                  Register Your First Farmer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {farmer.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{farmer.user.name}</CardTitle>
                    {farmer.phone && (
                      <p className="text-sm text-slate-500 flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {farmer.phone}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  {farmer.farms.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center">
                        <Sprout className="w-4 h-4 mr-2" /> Farm
                      </span>
                      <span className="font-medium text-slate-700">
                        {farmer.farms[0].cropType} • {farmer.farms[0].acreage} acres
                      </span>
                    </div>
                  )}
                  {farmer.farms.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" /> Location
                      </span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">
                        {farmer.farms[0].locationName}
                      </span>
                    </div>
                  )}
                  {farmer.enrollments.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center">
                        <Badge variant="success" className="text-xs">Active</Badge>
                      </span>
                      <span className="font-medium text-emerald-600">
                        {farmer.enrollments[0].policy.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Registered {farmer.user.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
