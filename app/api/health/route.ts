import { NextResponse } from "next/server"
import { getDbPool } from "@/lib/server/db"

export async function GET() {
  const pool = getDbPool()
  if (!pool) {
    return NextResponse.json({
      status: "ok",
      database: "not-configured",
    })
  }

  try {
    await pool.query("SELECT 1")
    return NextResponse.json({
      status: "ok",
      database: "connected",
    })
  } catch {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
      },
      { status: 500 }
    )
  }
}
