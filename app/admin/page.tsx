"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Check,
  X,
  Eye,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  serviceProviders,
  pendingListings,
  reviews,
  users,
  categories,
} from "@/lib/data"

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: "approve" | "reject" | "delete" | null
    itemId: string | null
    itemType: "listing" | "review" | "user" | null
  }>({
    open: false,
    type: null,
    itemId: null,
    itemType: null,
  })

  const stats = {
    totalUsers: users.length + 150, // Mock additional users
    totalListings: serviceProviders.length,
    pendingListings: pendingListings.length,
    totalReviews: reviews.length,
  }

  const handleAction = () => {
    // Simulate action
    setActionDialog({ open: false, type: null, itemId: null, itemType: null })
  }

  const getDialogContent = () => {
    const { type, itemType } = actionDialog
    if (type === "approve") {
      return {
        title: `Approve ${itemType}`,
        description: `Are you sure you want to approve this ${itemType}? It will become visible to all users.`,
        confirmText: "Approve",
        variant: "default" as const,
      }
    }
    if (type === "reject") {
      return {
        title: `Reject ${itemType}`,
        description: `Are you sure you want to reject this ${itemType}? The owner will be notified.`,
        confirmText: "Reject",
        variant: "destructive" as const,
      }
    }
    return {
      title: `Delete ${itemType}`,
      description: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
      confirmText: "Delete",
      variant: "destructive" as const,
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage listings, users, and reviews
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +12 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Listings
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +5 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Approval
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.pendingListings}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reviews
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
              +8 this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Pending</span>
            {stats.pendingListings > 0 && (
              <Badge variant="destructive" className="ml-1">
                {stats.pendingListings}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="listings" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Listings</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Reviews</span>
          </TabsTrigger>
        </TabsList>

        {/* Pending Listings */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Listings</CardTitle>
              <CardDescription>
                Review and approve new service provider listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingListings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Check className="mb-4 h-12 w-12 text-green-500" />
                  <h3 className="text-lg font-semibold">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No pending listings to review
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingListings.map((listing) => {
                      const category = categories.find(
                        (c) => c.id === listing.category
                      )
                      return (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">
                            {listing.businessName}
                          </TableCell>
                          <TableCell>{category?.name}</TableCell>
                          <TableCell>{listing.location}</TableCell>
                          <TableCell>{listing.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  setActionDialog({
                                    open: true,
                                    type: "approve",
                                    itemId: listing.id,
                                    itemType: "listing",
                                  })
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setActionDialog({
                                    open: true,
                                    type: "reject",
                                    itemId: listing.id,
                                    itemType: "listing",
                                  })
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Listings */}
        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>All Listings</CardTitle>
                  <CardDescription>
                    Manage all service provider listings
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceProviders
                    .filter((p) =>
                      p.businessName
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((listing) => {
                      const category = categories.find(
                        (c) => c.id === listing.category
                      )
                      return (
                        <TableRow key={listing.id}>
                          <TableCell className="font-medium">
                            {listing.businessName}
                          </TableCell>
                          <TableCell>{category?.name}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                listing.status === "approved"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              }
                            >
                              {listing.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{listing.views}</TableCell>
                          <TableCell>{listing.rating}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/profile/${listing.id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setActionDialog({
                                    open: true,
                                    type: "delete",
                                    itemId: listing.id,
                                    itemType: "listing",
                                  })
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.role !== "admin" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setActionDialog({
                                  open: true,
                                  type: "delete",
                                  itemId: user.id,
                                  itemType: "user",
                                })
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>Moderate user reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Listing</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => {
                    const listing = serviceProviders.find(
                      (p) => p.id === review.listingId
                    )
                    return (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">
                          {review.userName}
                        </TableCell>
                        <TableCell>{listing?.businessName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {review.rating}
                            <span className="text-amber-400">★</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {review.comment}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setActionDialog({
                                open: true,
                                type: "delete",
                                itemId: review.id,
                                itemType: "review",
                              })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) =>
          setActionDialog({ ...actionDialog, open })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === "delete" && (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              )}
              {getDialogContent().title}
            </DialogTitle>
            <DialogDescription>
              {getDialogContent().description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setActionDialog({
                  open: false,
                  type: null,
                  itemId: null,
                  itemType: null,
                })
              }
            >
              Cancel
            </Button>
            <Button
              variant={getDialogContent().variant}
              onClick={handleAction}
              className={
                getDialogContent().variant === "default"
                  ? "bg-green-600 hover:bg-green-700"
                  : ""
              }
            >
              {getDialogContent().confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
