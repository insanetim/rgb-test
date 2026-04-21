"use client"

import { useCreateDealMutation } from "@/api/dealsApiSlice"
import { CreateDealForm } from "@/components/CreateDealForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import showToast from "@/services/toast"
import type { CreateDeal } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { DollarSign } from "lucide-react"
import { useForm } from "react-hook-form"

interface CreateDealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
}

export function CreateDealDialog({
  isOpen,
  onOpenChange,
  clientId,
}: CreateDealDialogProps) {
  const [createDeal, { isLoading }] = useCreateDealMutation()

  const form = useForm<CreateDeal>()

  const onSubmit = async (data: Omit<CreateDeal, "clientId">) => {
    try {
      await createDeal({ ...data, clientId }).unwrap()
      form.reset()
      onOpenChange(false)
    } catch (error) {
      showToast.error(getErrorMessage(error))
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
          <DialogDescription>
            Create a new deal to track your business opportunities.
          </DialogDescription>
        </DialogHeader>
        <CreateDealForm
          onSubmit={onSubmit}
          submitButtonText="Create Deal"
          submitButtonIcon={<DollarSign className="mr-2 h-4 w-4" />}
          isSubmitting={isLoading}
          clientId={clientId}
        />
      </DialogContent>
    </Dialog>
  )
}
