"use client"

import { useUpdateClientMutation } from "@/api/clientsApiSlice"
import { ClientForm } from "@/components/ClientForm"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import showToast from "@/services/toast"
import type { Client, CreateClient } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import { Edit } from "lucide-react"
import { useForm } from "react-hook-form"

interface UpdateClientDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  client: Client | null
}

export function UpdateClientDialog({
  isOpen,
  onOpenChange,
  client,
}: UpdateClientDialogProps) {
  const [updateClient] = useUpdateClientMutation()

  const form = useForm<CreateClient>()

  const onSubmit = async (data: CreateClient) => {
    if (!client) return
    try {
      await updateClient({ id: client.id, ...data }).unwrap()
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
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>
            Update the client&apos;s information.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          onSubmit={onSubmit}
          submitButtonText="Update Client"
          submitButtonIcon={<Edit className="mr-2 h-4 w-4" />}
          isSubmitting={form.formState.isSubmitting}
          initialValues={{
            name: client?.name || "",
            email: client?.email || "",
            phone: client?.phone || "",
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
