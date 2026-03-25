"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePolicy } from "@/app/insurer/actions"

interface PolicyDeleteButtonProps {
  policyId: string
  policyName: string
}

export function PolicyDeleteButton({ policyId, policyName }: PolicyDeleteButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the policy "${policyName}"? This will notify all affected agents and admins.`)) {
      return
    }

    setLoading(true)
    try {
      await deletePolicy(policyId)
    } catch (err) {
      console.error(err)
      alert("Failed to delete policy")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={loading}
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
