"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Grid, List, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SearchBar from "@/components/SearchBar"
import Sidebar from "@/components/Sidebar"
import ServiceCard from "@/components/ServiceCard"
import { searchProviders, type ServiceProvider } from "@/lib/data"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || searchParams.get("keyword") || ""
  const initialCategory = searchParams.get("category") || ""
  const initialLocation = searchParams.get("location") || ""

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<string>("relevance")
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  )
  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    initialLocation ? [initialLocation] : []
  )
  const [minRating, setMinRating] = useState(0)
  const [results, setResults] = useState<ServiceProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    // Simulate loading
    const timer = setTimeout(() => {
      let filtered = searchProviders(initialQuery, {
        category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        location: selectedLocations.length === 1 ? selectedLocations[0] : undefined,
        minRating,
      })

      // Filter by multiple categories
      if (selectedCategories.length > 1) {
        filtered = filtered.filter((p) => selectedCategories.includes(p.category))
      }

      // Filter by multiple locations
      if (selectedLocations.length > 1) {
        filtered = filtered.filter((p) =>
          selectedLocations.some((loc) =>
            p.location.toLowerCase().includes(loc.toLowerCase())
          )
        )
      }

      // Sort results
      switch (sortBy) {
        case "rating":
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case "reviews":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        case "name":
          filtered.sort((a, b) => a.businessName.localeCompare(b.businessName))
          break
        default:
          // Relevance - featured first
          filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }

      setResults(filtered)
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [initialQuery, selectedCategories, selectedLocations, minRating, sortBy])

  const handleClearFilters = () => {
    setSelectedCategories([])
    setSelectedLocations([])
    setMinRating(0)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar
          variant="compact"
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          initialLocation={initialLocation}
        />
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <Sidebar
          selectedCategories={selectedCategories}
          selectedLocations={selectedLocations}
          minRating={minRating}
          onCategoryChange={setSelectedCategories}
          onLocationChange={setSelectedLocations}
          onRatingChange={setMinRating}
          onClearFilters={handleClearFilters}
        />

        {/* Results */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {initialQuery
                  ? `Search results for "${initialQuery}"`
                  : "All Service Providers"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Searching..." : `${results.length} providers found`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("relevance")}>
                    Relevance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("rating")}>
                    Highest Rated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("reviews")}>
                    Most Reviews
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="hidden items-center rounded-lg border border-border sm:flex">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-xl border border-border bg-card"
                >
                  <div className="h-40 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                    <div className="h-4 w-full rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <List className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No providers found
              </h3>
              <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          )}

          {/* Results Grid/List */}
          {!isLoading && results.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {results.map((provider) => (
                <ServiceCard
                  key={provider.id}
                  provider={provider}
                  variant={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
