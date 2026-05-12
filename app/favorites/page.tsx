"use client"

import { useEffect, useState } from "react"
import ServiceCard from "@/components/ServiceCard"
import type { ServiceProvider } from "@/lib/types"

export default function FavoritesPage() {
  const [items, setItems] = useState<ServiceProvider[]>([])

  useEffect(() => {
    const load = async () => {
      const favResponse = await fetch("/api/me/favorites")
      if (!favResponse.ok) return
      const favData = (await favResponse.json()) as { favorites: string[] }
      if (!favData.favorites.length) {
        setItems([])
        return
      }
      const allResponse = await fetch("/api/providers")
      const all = (await allResponse.json()) as ServiceProvider[]
      setItems(all.filter((provider) => favData.favorites.includes(provider.id)))
    }
    load()
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold text-foreground">Favorites</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No favorites yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((provider) => (
            <ServiceCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}
