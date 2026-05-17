import type { ServiceProvider } from "@/lib/types"
import { getDbPool } from "@/lib/server/db"
import crypto from "crypto"

type ProviderRow = {
  id: string
  owner_user_id: string | null
  business_name: string
  category: string
  description: string
  short_description: string
  location: string
  coverage_area: string | null
  address: string
  phone: string
  whatsapp: string
  email: string
  logo_url: string
  images: string[]
  rating: number
  review_count: number
  services: string[]
  featured: boolean
  verified: boolean
  created_at: Date
  views: number
  clicks: number
  status: "approved" | "pending" | "rejected" | "suspended"
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
  includePending?: boolean
}): Promise<ServiceProvider[]> {
  const pool = getDbPool()
  if (!pool) {
    return []
  }

  const params: Array<string | number | boolean> = []
  const conditions = [filters?.includePending ? "status IN ('approved','pending','rejected','suspended')" : `status = 'approved'`]

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
    return null
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

export async function getProvidersByOwner(userId: string): Promise<ServiceProvider[]> {
  const pool = getDbPool()
  if (!pool) return []
  const result = await pool.query<ProviderRow>(
    "SELECT * FROM providers WHERE owner_user_id = $1 ORDER BY created_at DESC",
    [userId]
  )
  return result.rows.map(mapProviderRow)
}

export async function createProvider(input: {
  ownerUserId: string
  businessName: string
  category: string
  shortDescription: string
  description: string
  location: string
  coverageArea?: string
  address?: string
  phone: string
  whatsapp: string
  email: string
  logoUrl?: string
  services: string[]
  images: string[]
}) {
  const pool = getDbPool()
  if (!pool) throw new Error("Database is not configured")
  const id = `prv_${crypto.randomUUID().replaceAll("-", "")}`
  await pool.query(
    `
      INSERT INTO providers (
        id, owner_user_id, business_name, category, description, short_description, location, coverage_area, address,
        phone, whatsapp, email, logo_url, images, services, status, featured, verified, sponsored, views, clicks
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'pending',FALSE,FALSE,FALSE,0,0)
    `,
    [
      id,
      input.ownerUserId,
      input.businessName,
      input.category,
      input.description,
      input.shortDescription,
      input.location,
      input.coverageArea || "",
      input.address || "",
      input.phone,
      input.whatsapp,
      input.email,
      input.logoUrl || "",
      input.images,
      input.services,
    ]
  )
  return getProviderByIdFromBackend(id)
}

export async function updateProviderStatus(id: string, status: "approved" | "rejected" | "suspended") {
  const pool = getDbPool()
  if (!pool) throw new Error("Database is not configured")
  await pool.query("UPDATE providers SET status = $2 WHERE id = $1", [id, status])
}

export async function deleteProviderById(id: string) {
  const pool = getDbPool()
  if (!pool) throw new Error("Database is not configured")
  await pool.query("DELETE FROM providers WHERE id = $1", [id])
}

export async function getProviderOwnerUserId(id: string): Promise<string | null> {
  const pool = getDbPool()
  if (!pool) return null

  const result = await pool.query<{ owner_user_id: string | null }>(
    "SELECT owner_user_id FROM providers WHERE id = $1 LIMIT 1",
    [id]
  )

  if (!result.rowCount) return null
  return result.rows[0].owner_user_id
}
