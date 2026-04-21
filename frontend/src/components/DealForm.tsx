"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CreateDeal } from "@/types"
import { DealStatus } from "@/types"
import { useForm } from "react-hook-form"

interface DealFormProps {
  onSubmit: (data: CreateDeal) => void
  submitButtonText: string
  submitButtonIcon?: React.ReactNode
  isSubmitting?: boolean
  initialValues?: Partial<CreateDeal>
}

const dealStatuses: DealStatus[] = [DealStatus.NEW, DealStatus.IN_PROGRESS, DealStatus.WON, DealStatus.LOST]

export function DealForm({
  onSubmit,
  submitButtonText,
  submitButtonIcon,
  isSubmitting = false,
  initialValues,
}: DealFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateDeal>({
    defaultValues: {
      title: initialValues?.title || "",
      amount: initialValues?.amount || 0,
      status: initialValues?.status || DealStatus.NEW,
      clientId: initialValues?.clientId || "",
    },
  })

  const selectedClientId = watch("clientId")

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
            placeholder="Enter deal title"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0, message: "Amount must be positive" }
            })}
            placeholder="Enter deal amount"
            disabled={isSubmitting}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as DealStatus)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select deal status" />
            </SelectTrigger>
            <SelectContent>
              {dealStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="clientId">Client ID</Label>
          <Input
            id="clientId"
            {...register("clientId", { required: "Client ID is required" })}
            placeholder="Enter client ID"
            disabled={isSubmitting}
            readOnly
          />
          {errors.clientId && (
            <p className="text-sm text-red-500">{errors.clientId.message}</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting || !selectedClientId}
      >
        {submitButtonIcon}
        {submitButtonText}
      </Button>
    </form>
  )
}
