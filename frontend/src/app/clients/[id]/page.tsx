"use client"

import {
  useDeleteClientMutation,
  useGetClientQuery,
} from "@/api/clientsApiSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UpdateClientDialog } from "@/components/UpdateClientDialog"
import showToast from "@/services/toast"
import { getErrorMessage } from "@/utils/getErrorMessage"
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Mail,
  Phone,
  Trash2,
  User,
} from "lucide-react"
import Link from "next/link"
import { notFound, useParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = params.id as string
  const router = useRouter()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: client, isLoading, error } = useGetClientQuery(clientId)
  const [deleteClient] = useDeleteClientMutation()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !client) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDeleteClient = async () => {
    if (
      confirm(
        "Are you sure you want to delete this client? This action cannot be undone."
      )
    ) {
      try {
        await deleteClient(clientId).unwrap()
        showToast.success("Client deleted successfully")
        router.push("/")
      } catch (error) {
        showToast.error(getErrorMessage(error))
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clients
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <CardDescription>
                  Client information and details
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteClient}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                    </div>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">
                          {client.phone}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Account Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Client Since</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(client.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Client ID</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {client.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals Section */}
      <Card>
        <CardHeader>
          <CardTitle>Deals</CardTitle>
          <CardDescription>
            All deals associated with this client
          </CardDescription>
        </CardHeader>
        <CardContent>
          {client.deals.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No deals found</h3>
              <p className="text-muted-foreground">
                This client doesn&apos;t have any deals yet.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {client.deals.map(deal => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        {deal.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deal.status === "WON"
                            ? "default"
                            : deal.status === "LOST"
                              ? "destructive"
                              : deal.status === "IN_PROGRESS"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {deal.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {formatDate(deal.createdAt)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UpdateClientDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={client}
      />
    </div>
  )
}
