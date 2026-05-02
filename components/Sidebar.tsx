"use client"

import { useState } from "react"
import { Star, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { categories, locations } from "@/lib/data"

interface SidebarProps {
  selectedCategories: string[]
  selectedLocations: string[]
  minRating: number
  onlyVerified: boolean
  onCategoryChange: (categories: string[]) => void
  onLocationChange: (locations: string[]) => void
  onRatingChange: (rating: number) => void
  onVerifiedChange: (verified: boolean) => void
  onClearFilters: () => void
}

export default function Sidebar({
  selectedCategories,
  selectedLocations,
  minRating,
  onlyVerified,
  onCategoryChange,
  onLocationChange,
  onRatingChange,
  onVerifiedChange,
  onClearFilters,
}: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId))
    } else {
      onCategoryChange([...selectedCategories, categoryId])
    }
  }

  const handleLocationToggle = (location: string) => {
    if (selectedLocations.includes(location)) {
      onLocationChange(selectedLocations.filter((l) => l !== location))
    } else {
      onLocationChange([...selectedLocations, location])
    }
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedLocations.length > 0 ||
    minRating > 0 ||
    onlyVerified

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="flex-1 cursor-pointer text-sm text-muted-foreground"
              >
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground">({category.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1, 0].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                minRating === rating
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span>{rating > 0 ? `${rating}+ stars` : "Any rating"}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Verification</h3>
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified-only"
            checked={onlyVerified}
            onCheckedChange={(checked) => onVerifiedChange(!!checked)}
          />
          <Label
            htmlFor="verified-only"
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Verified providers only
          </Label>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="mb-3 font-semibold text-foreground">Location</h3>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {locations.slice(0, 10).map((location) => (
            <div key={location} className="flex items-center gap-2">
              <Checkbox
                id={`location-${location}`}
                checked={selectedLocations.includes(location)}
                onCheckedChange={() => handleLocationToggle(location)}
              />
              <Label
                htmlFor={`location-${location}`}
                className="cursor-pointer text-sm text-muted-foreground"
              >
                {location}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="mb-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsMobileOpen(true)}
          className="w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {selectedCategories.length +
                selectedLocations.length +
                (minRating > 0 ? 1 : 0) +
                (onlyVerified ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterContent />
            <Button
              className="mt-6 w-full bg-primary text-primary-foreground"
              onClick={() => setIsMobileOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 rounded-xl border border-border bg-card p-5 lg:block">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        <FilterContent />
      </aside>
    </>
  )
}
