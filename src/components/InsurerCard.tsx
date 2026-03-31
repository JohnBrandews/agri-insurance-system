"use client"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Users, FileText, Calendar, Mail, ExternalLink, ShieldCheck, ShieldAlert, MoreVertical } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { updateInsurerStatus, deleteInsurer, updateInsurer } from "@/app/super-admin/actions"
import { useTransition } from "react"

interface InsurerCardProps {
  insurer: {
    id: string
    name: string
    status: string
    createdAt: Date
    users: { email: string; lastLogin: Date | null }[]
    _count?: {
      policies: number
      agents: number
    }
  }
}

export function InsurerCard({ insurer }: InsurerCardProps) {
  const [isPendingAction, startTransition] = useTransition()
  
  const isApproved = insurer.status === "APPROVED"
  const isPending = insurer.status === "PENDING"
  const isRejected = insurer.status === "REJECTED"

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-slate-200 group relative">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800">{insurer.name}</CardTitle>
              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                <Calendar className="w-3 h-3 mr-1" />
                Joined {format(new Date(insurer.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={isApproved ? "bg-emerald-500 text-white" : isPending ? "bg-amber-500 text-white" : "bg-red-500 text-white"}>
              {insurer.status}
            </Badge>
            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
               <Button 
                variant="ghost" 
                size="sm" 
                disabled={isPendingAction}
                className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600"
                onClick={() => {
                  const newName = window.prompt("Enter new company name:", insurer.name)
                  if (newName) {
                    startTransition(async () => {
                      await updateInsurer(insurer.id, { name: newName })
                    })
                  }
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={isPendingAction}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-600"
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this insurer? This will terminate all associated agent and admin accounts.")) {
                    startTransition(async () => {
                      await deleteInsurer(insurer.id)
                    })
                  }
                }}
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
              <FileText className="w-3 h-3 mr-1 text-blue-500" /> Policies
            </p>
            <p className="text-xl font-bold text-slate-800">{insurer._count?.policies || 0}</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-500 font-medium mb-1 flex items-center">
              <Users className="w-3 h-3 mr-1 text-violet-500" /> Agents
            </p>
            <p className="text-xl font-bold text-slate-800">{insurer._count?.agents || 0}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Admin</p>
            {insurer.users[0]?.lastLogin ? (
              <Badge variant="success" className="text-[10px] px-1.5 py-0 h-4 uppercase">Signed In</Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 uppercase">Invited</Badge>
            ) }
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50/50 p-2 rounded-lg border border-slate-100/50">
            <div className="flex items-center">
              <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
              {insurer.users[0]?.email || "No admin assigned"}
            </div>
            {insurer.users[0]?.lastLogin && (
              <span className="text-[10px] text-slate-400">
                {format(new Date(insurer.users[0].lastLogin), "MMM d")}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-slate-50/30 border-t border-slate-100 gap-2 pt-4">
        {isPending ? (
          <>
            <Button 
              variant="outline" 
              disabled={isPendingAction}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => {
                startTransition(async () => {
                  await updateInsurerStatus(insurer.id, "REJECTED")
                })
              }}
            >
              <ShieldAlert className="w-4 h-4 mr-2" /> Reject
            </Button>
            <Button 
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isPendingAction}
              onClick={() => {
                startTransition(async () => {
                  await updateInsurerStatus(insurer.id, "APPROVED")
                })
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Approve
            </Button>
          </>
        ) : (
          <div className="w-full flex space-x-2">
            <Link href={`/super-admin/insurers/${insurer.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" /> View Details
              </Button>
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
