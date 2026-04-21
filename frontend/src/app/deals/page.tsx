"use client"

import { useGetClientsQuery } from "@/api/clientsApiSlice"
import { useDeleteDealMutation, useGetDealsQuery } from "@/api/dealsApiSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UpdateDealDialog } from "@/components/UpdateDealDialog"
import showToast from "@/services/toast"
import type { Deal, DealStatus } from "@/types"
import { getErrorMessage } from "@/utils/getErrorMessage"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Edit,
  Filter,
  Trash2,
  X,
} from "lucide-react"
import { useState } from "react"

export default function DealsPage() {
  const [page, setPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [clientIdFilter, setClientIdFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<DealStatus | null>(null)

  const {
    data: dealsData,
    isLoading,
    error,
  } = useGetDealsQuery({
    page,
    clientId: clientIdFilter || undefined,
    status: statusFilter || undefined,
  })
  const { data: clientsData } = useGetClientsQuery({})
  const [deleteDeal] = useDeleteDealMutation()

  const handleDeleteDeal = async (deal: Deal) => {
    if (confirm("Are you sure you want to delete this deal?")) {
      try {
        await deleteDeal({ id: deal.id, clientId: deal.clientId }).unwrap()
      } catch (error) {
        showToast.error(getErrorMessage(error))
      }
    }
  }

  const openEditDialog = (deal: Deal) => {
    setSelectedDeal(deal)
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getStatusVariant = (status: DealStatus) => {
    switch (status) {
      case "WON":
        return "default"
      case "LOST":
        return "destructive"
      case "IN_PROGRESS":
        return "secondary"
      default:
        return "outline"
    }
  }

  const deals = dealsData?.data || []

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">
              Manage your deals and track their progress
            </p>
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-12 w-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">
              Manage your deals and track their progress
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Error loading deals</h3>
                <p className="text-muted-foreground">Please try again later.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Deals
          </h1>
          <p className="text-muted-foreground">
            Manage your deals and track their progress
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
          <CardDescription>
            Filter deals by client ID and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Select value={clientIdFilter} onValueChange={(value) => setClientIdFilter(value || "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Clients</SelectItem>
                  {clientsData?.data?.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={statusFilter || ""}
                onValueChange={value =>
                  setStatusFilter(value === "" ? null : value as DealStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="IN_PROGRESS">
                    In Progress
                  </SelectItem>
                  <SelectItem value="WON">Won</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(clientIdFilter || statusFilter) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setClientIdFilter("")
                    setStatusFilter(null)
                  }}
                  className="w-auto"
                >
                  <X className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Deals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Deals</CardTitle>
          <CardDescription>
            A list of all your deals including their status and value.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold">No deals found</h3>
                      <p className="text-muted-foreground">
                        Get started by adding your first deal.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                deals.map(deal => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {formatCurrency(deal.amount)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(deal.status)}>
                        {deal.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm text-muted-foreground">
                        {deal.clientId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(deal.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(deal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDeal(deal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {dealsData?.meta && dealsData.meta.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {dealsData.meta.page} of {dealsData.meta.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= dealsData.meta.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <UpdateDealDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        deal={selectedDeal}
      />
    </div>
  )
}
