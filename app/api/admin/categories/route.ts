import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { getDbPool } from "@/lib/server/db"

export async function GET() {
  const pool = getDbPool()
  if (!pool) return NextResponse.json([])
  const result = await pool.query("SELECT id, name, icon, enabled FROM categories ORDER BY name")
  return NextResponse.json(result.rows)
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  const pool = getDbPool()
  if (!pool) return NextResponse.json({ message: "DB unavailable" }, { status: 500 })
  const body = (await request.json()) as { id?: string; name?: string; icon?: string; enabled?: boolean }
  if (!body.id || !body.name) return NextResponse.json({ message: "id and name required" }, { status: 400 })
  await pool.query(
    `
      INSERT INTO categories (id, name, icon, enabled)
      VALUES ($1,$2,$3,$4)
      ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, enabled = EXCLUDED.enabled
    `,
    [body.id, body.name, body.icon || "Tag", body.enabled ?? true]
  )
  return NextResponse.json({ ok: true })
}
