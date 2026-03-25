"use client"

import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, CreditCard, RefreshCw, ShieldOff, UserCheck, ExternalLink, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import { updateAgentStatus, resendInvitation, removeAgent } from "@/app/insurer/actions"
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { EditAgentForm } from "./EditAgentForm"

interface AgentCardProps {
  agent: {
    id: string
    status: string
    region: string
    phone: string | null
    idNumber: string | null
    user: {
      name: string
      email: string
    }
    farmersRegistered: any[]
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  const [loading, setLoading] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleAction = async (action: () => Promise<any>) => {
    setLoading(true)
    try {
      await action()
    } catch (err) {
      console.error(err)
      alert("Action failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async () => {
    if (confirm(`Are you sure you want to remove ${agent.user.name}? This action cannot be undone.`)) {
      await handleAction(() => removeAgent(agent.id))
    }
  }

  const isSuspended = agent.status === "SUSPENDED"
  const isActive = agent.status === "ACTIVE"

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group relative">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">{agent.user.name}</CardTitle>
              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                <Mail className="w-3 h-3 mr-1" />
                {agent.user.email}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={isActive ? "success" : "warning"} className="text-[10px] uppercase tracking-wider">
              {agent.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
              <UserCheck className="w-3 h-3 mr-1 text-violet-500" /> Farmers
            </p>
            <p className="text-xl font-bold text-slate-800">{agent.farmersRegistered.length}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1 text-emerald-500" /> Region
            </p>
            <p className="text-sm font-bold text-slate-800">{agent.region}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-slate-400" />
            {agent.phone || "No phone"}
          </div>
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
            ID: {agent.idNumber || "N/A"}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/30 pt-4 flex items-center justify-between">
        <Link href={`/insurer/agents/${agent.id}/farmers`} className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 group/link">
          View Registered Farmers <ExternalLink className="w-3 h-3 ml-1 transition-transform group-hover/link:translate-x-0.5" />
        </Link>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            title="Resend Invitation"
            disabled={loading}
            onClick={() => handleAction(() => resendInvitation(agent.id))}
            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                title="Edit Agent Details"
                disabled={loading}
                className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <EditAgentForm agent={agent} onClose={() => setEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="sm" 
            title="Remove Agent"
            disabled={loading}
            onClick={handleRemove}
            className="h-8 w-8 p-0 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          
          {isSuspended ? (
            <Button 
              variant="outline" 
              size="sm"
              disabled={loading}
              onClick={() => handleAction(() => updateAgentStatus(agent.id, "ACTIVE"))}
              className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 rounded-lg font-bold px-4"
            >
              <UserCheck className="w-4 h-4 mr-2" /> Reinstate
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              disabled={loading}
              onClick={() => handleAction(() => updateAgentStatus(agent.id, "SUSPENDED"))}
              className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 rounded-lg font-bold px-4"
            >
              <ShieldOff className="w-4 h-4 mr-2" /> Suspend
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
