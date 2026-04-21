"use client"

import { useUpdateDealMutation } from "@/api/dealsApiSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import showToast from "@/services/toast"
import type { CreateDeal, Deal } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Edit } from "lucide-react"
import { useForm } from "react-hook-form"
import { UpdateDealForm } from "./UpdateDealForm"

interface UpdateDealDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  deal: Deal | null
}

export function UpdateDealDialog({
  isOpen,
  onOpenChange,
  deal,
}: UpdateDealDialogProps) {
  const [updateDeal] = useUpdateDealMutation()

  const form = useForm<CreateDeal>()

  const onSubmit = async (data: Omit<CreateDeal, "clientId">) => {
    if (!deal) return
    try {
      await updateDeal({
        id: deal.id,
        clientId: deal.clientId,
        ...data,
      }).unwrap()
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
          <DialogTitle>Edit Deal</DialogTitle>
          <DialogDescription>
            Update the deal&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <UpdateDealForm
          onSubmit={onSubmit}
          submitButtonText="Update Deal"
          submitButtonIcon={<Edit className="mr-2 h-4 w-4" />}
          isSubmitting={form.formState.isSubmitting}
          initialValues={{
            title: deal?.title || "",
            amount: deal?.amount || 0,
            status: deal?.status,
          }}
          clientId={deal?.clientId || ""}
        />
      </DialogContent>
    </Dialog>
  )
}
