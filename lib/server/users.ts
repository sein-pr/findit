import { getDbPool } from "@/lib/server/db"
import type { AppRole } from "@/lib/server/auth"

export type UserRecord = {
  id: string
  name: string
  email: string
  role: AppRole
  suspended: boolean
  createdAt: string
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const pool = getDbPool()
  if (!pool) return []
  const result = await pool.query<{
    id: string
    name: string
    email: string
    role: AppRole
    suspended: boolean
    created_at: Date
  }>("SELECT id, name, email, role, suspended, created_at FROM users ORDER BY created_at DESC")
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    suspended: row.suspended,
    createdAt: row.created_at.toISOString(),
  }))
}

export async function setUserSuspended(id: string, suspended: boolean) {
  const pool = getDbPool()
  if (!pool) return
  await pool.query("UPDATE users SET suspended = $2 WHERE id = $1", [id, suspended])
}

export async function deleteUser(id: string) {
  const pool = getDbPool()
  if (!pool) return
  await pool.query("DELETE FROM users WHERE id = $1", [id])
}

export async function getFavorites(userId: string) {
  const pool = getDbPool()
  if (!pool) return []
  const result = await pool.query<{ listing_id: string }>(
    "SELECT listing_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  )
  return result.rows.map((row) => row.listing_id)
}

export async function toggleFavorite(userId: string, listingId: string) {
  const pool = getDbPool()
  if (!pool) return false
  const existing = await pool.query(
    "SELECT id FROM favorites WHERE user_id = $1 AND listing_id = $2 LIMIT 1",
    [userId, listingId]
  )
  if (existing.rowCount) {
    await pool.query("DELETE FROM favorites WHERE user_id = $1 AND listing_id = $2", [userId, listingId])
    return false
  }
  await pool.query(
    "INSERT INTO favorites (id, user_id, listing_id) VALUES ($1, $2, $3)",
    [`fav_${Date.now()}_${Math.random()}`, userId, listingId]
  )
  return true
}
