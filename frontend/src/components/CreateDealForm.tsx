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

interface CreateDealFormProps {
  onSubmit: (data: Omit<CreateDeal, "clientId">) => void
  submitButtonText: string
  submitButtonIcon?: React.ReactNode
  isSubmitting?: boolean
  initialValues?: Partial<CreateDeal>
  clientId: string
}

const dealStatuses: DealStatus[] = [DealStatus.NEW, DealStatus.IN_PROGRESS, DealStatus.WON, DealStatus.LOST]

export function CreateDealForm({
  onSubmit,
  submitButtonText,
  submitButtonIcon,
  isSubmitting = false,
  initialValues,
  clientId,
}: CreateDealFormProps) {
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
      clientId: clientId,
    },
  })

  const handleFormSubmit = (data: CreateDeal) => {
    // Exclude clientId from the submitted data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clientId, ...dataWithoutClientId } = data
    onSubmit(dataWithoutClientId)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
          <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground font-mono">{clientId}</span>
          </div>
          <p className="text-xs text-muted-foreground">Client ID automatically assigned</p>
        </div>
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {submitButtonIcon}
        {submitButtonText}
      </Button>
    </form>
  )
}
