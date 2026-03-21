import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe2, TrendingUp, Users, CloudRain, MapPin, Droplets } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function AnalyticsPage() {
  // Fetch analytics data
  const totalFarms = await prisma.farm.count()
  const totalFarmers = await prisma.farmer.count()
  const totalAgents = await prisma.agent.count()
  const totalPolicies = await prisma.policy.count()
  const totalEnrollments = await prisma.enrollment.count()
  
  // Get all farms for acreage calculation
  const farms = await prisma.farm.findMany({ select: { acreage: true, cropType: true } })
  const totalAcreage = farms.reduce((sum, farm) => sum + farm.acreage, 0)
  
  // Crop type distribution
  const cropDistribution = farms.reduce((acc, farm) => {
    acc[farm.cropType] = (acc[farm.cropType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get weather data stats
  const weatherDataCount = await prisma.weatherData.count()
  const recentWeather = await prisma.weatherData.findMany({
    orderBy: { date: "desc" },
    take: 5
  })

  // Get trigger events
  const triggerEvents = await prisma.triggerEvent.findMany({
    orderBy: { dateTriggered: "desc" },
    take: 10
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Global Analytics</h2>
        <p className="text-sm text-slate-500 mt-1">Platform-wide insights and metrics</p>
      </div>

      {/* High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border-t-[3px] border-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <Users className="w-4 h-4 mr-1" /> Farmers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalFarmers}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> Farms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalFarms}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <Globe2 className="w-4 h-4 mr-1" /> Acres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalAcreage.toFixed(1)}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-violet-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <CloudRain className="w-4 h-4 mr-1" /> Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalAgents}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-pink-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalPolicies}</div>
          </CardContent>
        </Card>
        <Card className="border-t-[3px] border-cyan-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 flex items-center">
              <Droplets className="w-4 h-4 mr-1" /> Enrollments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(cropDistribution).map(([crop, count]) => {
                const percentage = (count / farms.length) * 100
                return (
                  <div key={crop}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{crop}</span>
                      <span className="text-slate-500">{count} farms ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Weather Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Weather Readings
              <Badge variant="outline">{weatherDataCount} Total Records</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentWeather.length === 0 ? (
              <p className="text-sm text-slate-500 italic p-4 text-center border rounded-xl bg-slate-50">
                No weather data recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentWeather.map((data) => (
                  <div key={data.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{data.region}</p>
                        <p className="text-xs text-slate-500">{data.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{data.rainfallMm}mm</p>
                      <p className="text-xs text-slate-500">Rainfall</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trigger Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Trigger Events
            <Badge variant="danger">{triggerEvents.length} Events</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {triggerEvents.length === 0 ? (
            <p className="text-sm text-slate-500 italic p-8 text-center border rounded-xl bg-slate-50">
              No trigger events recorded. All policies performing normally.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Policy ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Date Triggered</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Rainfall (mm)</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {triggerEvents.map((trigger) => (
                    <tr key={trigger.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-xs text-slate-600">{trigger.policyId.slice(-8)}</td>
                      <td className="py-3 px-4 text-slate-600">{trigger.dateTriggered.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{trigger.rainfallRecorded}mm</td>
                      <td className="py-3 px-4">
                        <Badge variant={trigger.severity === "SEVERE" ? "danger" : "warning"}>
                          {trigger.severity}
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
