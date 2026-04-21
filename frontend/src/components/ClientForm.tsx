"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CreateClient } from "@/types"
import { useForm } from "react-hook-form"

interface ClientFormProps {
  onSubmit: (data: CreateClient) => void
  submitButtonText: string
  submitButtonIcon?: React.ReactNode
  isSubmitting?: boolean
  initialValues?: CreateClient
}

export function ClientForm({
  onSubmit,
  submitButtonText,
  submitButtonIcon,
  isSubmitting = false,
  initialValues,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClient>({
    defaultValues: {
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      phone: initialValues?.phone || "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...register("name", { required: "Name is required" })}
            placeholder="Enter client name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            placeholder="Enter client email"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            {...register("phone")}
            placeholder="Enter client phone"
            disabled={isSubmitting}
          />
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
