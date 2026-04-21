"use client"

import { useCreateClientMutation } from "@/api/clientsApiSlice"
import { ClientForm } from "@/components/ClientForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import showToast from "@/services/toast"
import type { CreateClient } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"

interface CreateClientDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateClientDialog({
  isOpen,
  onOpenChange,
}: CreateClientDialogProps) {
  const [createClient, { isLoading }] = useCreateClientMutation()

  const form = useForm<CreateClient>()

  const onSubmit = async (data: CreateClient) => {
    try {
      await createClient(data).unwrap()
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
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client to manage their information and deals.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSubmit={onSubmit}
          submitButtonText="Create Client"
          submitButtonIcon={<Plus className="mr-2 h-4 w-4" />}
          isSubmitting={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
