import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, CloudRain, Sun, Sprout, ReceiptText, Droplets, MapPin, Calendar } from "lucide-react"
import { requireRole } from "@/lib/session"
import { prisma } from "@/lib/prisma"

export default async function FarmerDashboard() {
  const session = await requireRole(["FARMER"])
  
  // Fetch farmer data
  const farmer = await prisma.farmer.findUnique({
    where: { userId: session.id },
    include: {
      farms: true,
      enrollments: {
        include: {
          policy: true,
          payouts: true
        }
      }
    }
  })

  if (!farmer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Farmer profile not found. Please contact support.</p>
      </div>
    )
  }

  const farm = farmer.farms[0]
  const enrollment = farmer.enrollments[0]
  const policy = enrollment?.policy
  
  // Get weather data for the farmer's region (mock for now)
  const recentRainfall = 42 // This would come from WeatherData table or API
  
  // Calculate total payouts
  const totalPayouts = enrollment?.payouts.reduce((sum, payout) => sum + payout.amount, 0) || 0

  return (
    <div className="space-y-6 max-w-lg mx-auto md:max-w-4xl">

      {/* Status Hero Card */}
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-premium border-none">
        <CardContent className="pt-6 pb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {enrollment ? "Your farm is fully protected" : "No active coverage"}
          </h2>
          {policy && (
            <>
              <p className="text-emerald-100 mb-6">{policy.name} ({policy.region})</p>
              <div className="flex space-x-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-3">
                  {enrollment?.status || "ACTIVE"}
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-1.5 px-3">
                  Ends: {policy.seasonEnd.toLocaleDateString()}
                </Badge>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rainfall & Weather Data */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Rainfall Tracker</CardTitle>
            <CloudRain className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="text-4xl font-bold text-slate-800">{recentRainfall}</span>
                <span className="text-slate-500 ml-1">mm</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-700">Threshold: {policy?.rainfallThreshold || 20}mm</p>
                <p className="text-xs text-slate-500">Status: {recentRainfall >= (policy?.rainfallThreshold || 20) ? "Healthy" : "Below threshold"}</p>
              </div>
            </div>

            {/* Simple visual indicator */}
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all" 
                style={{ width: `${Math.min((recentRainfall / (policy?.rainfallThreshold || 20)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">Last 30 days cumulative rainfall</p>
          </CardContent>
        </Card>

        {/* Farm Profile */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Farm Details</CardTitle>
            <Sprout className="w-5 h-5 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-4">
            {farm ? (
              <>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center"><MapPin className="w-4 h-4 mr-1" />Location</span>
                  <span className="font-semibold text-slate-700">{farm.locationName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Acreage</span>
                  <span className="font-semibold text-slate-700">{farm.acreage} Acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop Type</span>
                  <span className="font-semibold text-slate-700">{farm.cropType}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-500 italic p-4 text-center border rounded-xl bg-slate-50">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No farm registered yet.</p>
                <p className="text-xs mt-1">Contact your field agent to register your farm.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Payout History</CardTitle>
            <ReceiptText className="w-5 h-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            {totalPayouts > 0 ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div>
                    <p className="font-semibold text-emerald-800">Total Payouts Received</p>
                    <p className="text-xs text-emerald-600">All seasons combined</p>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600">
                    ${totalPayouts.toLocaleString()}
                  </div>
                </div>
                {enrollment?.payouts.map((payout) => (
                  <div key={payout.id} className="flex justify-between items-center p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="font-semibold text-slate-700">Payout #{payout.id.slice(-4)}</p>
                      <p className="text-xs text-slate-500">{payout.dateCalculated.toLocaleDateString()}</p>
                    </div>
                    <Badge className={payout.status === "PAID" ? "bg-emerald-500 text-white border-none" : "bg-amber-500 text-white border-none"}>
                      {payout.status} - ${payout.amount}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center">
                <Sun className="w-10 h-10 text-amber-400 mx-auto mb-3 opacity-50" />
                <h4 className="text-slate-700 font-semibold">No payouts currently</h4>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Your farm has not experienced any severe drought events triggering a payout under this policy.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
