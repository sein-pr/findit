"use client"

import { useState } from "react"
import { useEffect } from "react"
import Link from "next/link"
import {
  Eye,
  MousePointer,
  Star,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { categories } from "@/lib/data"
import type { ServiceProvider } from "@/lib/types"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [myListings, setMyListings] = useState<ServiceProvider[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/me/listings")
      if (!response.ok) return
      const data = (await response.json()) as ServiceProvider[]
      setMyListings(data)
    }
    load()
  }, [])

  const stats = {
    totalViews: myListings.reduce((sum, p) => sum + p.views, 0),
    totalClicks: myListings.reduce((sum, p) => sum + p.clicks, 0),
    averageRating: myListings.length
      ? (myListings.reduce((sum, p) => sum + p.rating, 0) / myListings.length).toFixed(1)
      : "0.0",
    totalListings: myListings.length,
  }

  const handleDelete = () => {
    if (!selectedListing) return
    fetch(`/api/listings/${selectedListing}`, { method: "DELETE" }).then(() => {
      setMyListings((prev) => prev.filter((listing) => listing.id !== selectedListing))
    })
    setDeleteDialogOpen(false)
    setSelectedListing(null)
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "listings", label: "My Listings", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your listings and track performance
          </p>
        </div>
        <Link href="/add-listing">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Contact Clicks
                </CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="mr-1 inline h-3 w-3 text-green-500" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-2xl font-bold">
                  {stats.averageRating}
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on {myListings.reduce((sum, p) => sum + p.reviewCount, 0)} reviews
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
                  All listings active
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your listings performance this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myListings.map((listing) => {
                  const category = categories.find((c) => c.id === listing.category)
                  return (
                    <div
                      key={listing.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 font-semibold text-primary">
                          {listing.businessName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">
                            {listing.businessName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {category?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-foreground">{listing.views}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-foreground">{listing.clicks}</p>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{listing.rating}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Listings Tab */}
      {activeTab === "listings" && (
        <Card>
          <CardHeader>
            <CardTitle>My Listings</CardTitle>
            <CardDescription>
              Manage and edit your service listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myListings.map((listing) => {
                  const category = categories.find((c) => c.id === listing.category)
                  return (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium">
                        {listing.businessName}
                      </TableCell>
                      <TableCell>{category?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={listing.status === "approved" ? "default" : "secondary"}
                          className={
                            listing.status === "approved"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                          }
                        >
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{listing.views}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          {listing.rating}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/profile/${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/edit-listing/${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedListing(listing.id)
                              setDeleteDialogOpen(true)
                            }}
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
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                  J
                </div>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-muted-foreground">provider@example.na</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">Free Plan</span>
                  <Badge>Current</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Basic listing features included
                </p>
              </div>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Configure how you receive updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: "Email notifications", enabled: true },
                  { label: "SMS notifications", enabled: false },
                  { label: "New review alerts", enabled: true },
                  { label: "Weekly analytics report", enabled: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    <div
                      className={`h-6 w-11 rounded-full ${
                        item.enabled ? "bg-primary" : "bg-muted"
                      } relative cursor-pointer`}
                    >
                      <div
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                          item.enabled ? "left-6" : "left-1"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible account actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
