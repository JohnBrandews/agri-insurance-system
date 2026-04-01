"use client"

import { useState } from "react"
import { Trash2, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteFarmer } from "@/app/agent/farmers/actions"
import { toast } from "sonner"

type FarmerDeleteButtonProps = {
  farmerId: string
  farmerName: string
}

export function FarmerDeleteButton({ farmerId, farmerName }: FarmerDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteFarmer(farmerId)
      if (result.success) {
        toast.success(`Farmer ${farmerName} deleted successfully.`)
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete farmer.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-slate-800">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Delete Farmer?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500">
            This will permanently remove <strong>{farmerName}</strong>, their farm boundaries, and all active insurance enrollments. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-2xl border-slate-200">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="rounded-2xl bg-red-600 text-white hover:bg-red-700 font-bold"
          >
            Confirm Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
