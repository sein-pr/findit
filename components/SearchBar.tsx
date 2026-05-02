"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { categories, locations } from "@/lib/data"

interface SearchBarProps {
  variant?: "hero" | "compact"
  initialQuery?: string
  initialCategory?: string
  initialLocation?: string
}

export default function SearchBar({
  variant = "hero",
  initialQuery = "",
  initialCategory = "",
  initialLocation = "",
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [location, setLocation] = useState(initialLocation)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    if (location) params.set("location", location)
    router.push(`/search?${params.toString()}`)
  }

  const selectedCategory = categories.find((c) => c.id === category)
  const isHero = variant === "hero"

  return (
    <form
      onSubmit={handleSearch}
      className={`flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-lg md:flex-row md:items-center ${
        isHero ? "md:rounded-full md:p-2" : ""
      }`}
    >
      {/* Category Dropdown */}
      <div className={`relative ${isHero ? "md:border-r md:border-border md:pr-4" : ""}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/80 md:w-44"
            >
              <span className={selectedCategory ? "text-foreground" : "text-muted-foreground"}>
                {selectedCategory?.name || "All Categories"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-64 w-56 overflow-y-auto">
            <DropdownMenuItem onClick={() => setCategory("")}>
              All Categories
            </DropdownMenuItem>
            {categories.map((cat) => (
              <DropdownMenuItem key={cat.id} onClick={() => setCategory(cat.id)}>
                {cat.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg bg-muted py-3 pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Location Dropdown */}
      <div className={`relative ${isHero ? "md:border-l md:border-border md:pl-4" : ""}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/80 md:w-44"
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className={location ? "text-foreground" : "text-muted-foreground"}>
                  {location || "All Locations"}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-64 w-56 overflow-y-auto">
            <DropdownMenuItem onClick={() => setLocation("")}>
              All Locations
            </DropdownMenuItem>
            {locations.map((loc) => (
              <DropdownMenuItem key={loc} onClick={() => setLocation(loc)}>
                {loc}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Button */}
      <Button
        type="submit"
        size="lg"
        className={`bg-primary text-primary-foreground hover:bg-primary/90 ${
          isHero ? "md:rounded-full md:px-8" : ""
        }`}
      >
        <Search className="mr-2 h-4 w-4 md:hidden" />
        Search
      </Button>
    </form>
  )
}
