import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { getDbPool } from "@/lib/server/db"

async function ensureProfileColumns() {
  const pool = getDbPool()
  if (!pool) return
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS business_name TEXT NOT NULL DEFAULT ''")
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS primary_category TEXT NOT NULL DEFAULT ''")
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const pool = getDbPool()
  if (!pool) return NextResponse.json({ message: "Database unavailable" }, { status: 500 })

  await ensureProfileColumns()

  const result = await pool.query<{
    id: string
    name: string
    email: string
    phone: string
    role: "user" | "provider" | "admin"
    avatar_url: string
    bio: string
    business_name: string
    primary_category: string
  }>(
    `
      SELECT id, name, email, phone, role, avatar_url, bio, business_name, primary_category
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [user.id]
  )

  if (!result.rowCount) return NextResponse.json({ message: "User not found" }, { status: 404 })
  return NextResponse.json(result.rows[0])
}

export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const pool = getDbPool()
  if (!pool) return NextResponse.json({ message: "Database unavailable" }, { status: 500 })

  await ensureProfileColumns()

  const body = (await request.json()) as {
    name?: string
    phone?: string
    avatar_url?: string
    bio?: string
    business_name?: string
    primary_category?: string
  }

  await pool.query(
    `
      UPDATE users
      SET
        name = COALESCE($2, name),
        phone = COALESCE($3, phone),
        avatar_url = COALESCE($4, avatar_url),
        bio = COALESCE($5, bio),
        business_name = COALESCE($6, business_name),
        primary_category = COALESCE($7, primary_category)
      WHERE id = $1
    `,
    [
      user.id,
      body.name?.trim() || null,
      body.phone?.trim() || null,
      body.avatar_url?.trim() || null,
      body.bio?.trim() || null,
      body.business_name?.trim() || null,
      body.primary_category?.trim() || null,
    ]
  )

  if (user.role === "provider" && body.business_name) {
    await pool.query(
      "UPDATE providers SET business_name = $2, category = COALESCE(NULLIF($3, ''), category) WHERE owner_user_id = $1",
      [user.id, body.business_name.trim(), (body.primary_category || "").trim()]
    )
  }

  return GET()
}
