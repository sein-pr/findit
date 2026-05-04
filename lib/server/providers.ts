import { serviceProviders } from "@/lib/data"
import type { ServiceProvider } from "@/lib/types"
import { getDbPool } from "@/lib/server/db"

type ProviderRow = {
  id: string
  business_name: string
  category: string
  description: string
  location: string
  coverage_area: string | null
  phone: string
  whatsapp: string
  email: string
  images: string[]
  rating: number
  review_count: number
  services: string[]
  featured: boolean
  verified: boolean
  created_at: Date
  views: number
  clicks: number
  status: "approved" | "pending" | "rejected"
}

function mapProviderRow(row: ProviderRow): ServiceProvider {
  return {
    id: row.id,
    businessName: row.business_name,
    category: row.category,
    description: row.description,
    location: row.location,
    coverageArea: row.coverage_area || undefined,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    images: row.images ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    services: row.services ?? [],
    featured: row.featured,
    verified: row.verified,
    createdAt: row.created_at.toISOString().split("T")[0],
    views: row.views ?? 0,
    clicks: row.clicks ?? 0,
    status: row.status,
  }
}

export async function getProvidersFromBackend(filters?: {
  q?: string
  category?: string
  location?: string
  minRating?: number
  onlyVerified?: boolean
}): Promise<ServiceProvider[]> {
  const pool = getDbPool()
  if (!pool) {
    return serviceProviders
  }

  const params: Array<string | number | boolean> = []
  const conditions = [`status = 'approved'`]

  if (filters?.q) {
    params.push(`%${filters.q}%`)
    const i = params.length
    conditions.push(
      `(business_name ILIKE $${i} OR description ILIKE $${i} OR EXISTS (SELECT 1 FROM unnest(services) s WHERE s ILIKE $${i}))`
    )
  }

  if (filters?.category) {
    params.push(filters.category)
    conditions.push(`category = $${params.length}`)
  }

  if (filters?.location) {
    params.push(`%${filters.location}%`)
    conditions.push(`location ILIKE $${params.length}`)
  }

  if (typeof filters?.minRating === "number" && filters.minRating > 0) {
    params.push(filters.minRating)
    conditions.push(`rating >= $${params.length}`)
  }

  if (filters?.onlyVerified) {
    params.push(true)
    conditions.push(`verified = $${params.length}`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""
  const query = `
    SELECT *
    FROM providers
    ${whereClause}
  `

  const result = await pool.query<ProviderRow>(query, params)
  return result.rows.map(mapProviderRow)
}

export async function getProviderByIdFromBackend(id: string): Promise<ServiceProvider | null> {
  const pool = getDbPool()
  if (!pool) {
    return serviceProviders.find((provider) => provider.id === id) ?? null
  }

  const result = await pool.query<ProviderRow>(
    "SELECT * FROM providers WHERE id = $1 LIMIT 1",
    [id]
  )
  if (result.rowCount === 0) {
    return null
  }

  return mapProviderRow(result.rows[0])
}
