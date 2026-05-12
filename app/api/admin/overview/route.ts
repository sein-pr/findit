import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { getDbPool } from "@/lib/server/db"
import { getAllUsers } from "@/lib/server/users"
import { getProvidersFromBackend } from "@/lib/server/providers"

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  const users = await getAllUsers()
  const listings = await getProvidersFromBackend({ includePending: true })
  const pool = getDbPool()
  const reviewCount = pool
    ? Number((await pool.query("SELECT COUNT(*)::int AS count FROM reviews")).rows[0].count)
    : 0

  return NextResponse.json({
    users,
    listings,
    stats: {
      totalUsers: users.length,
      totalListings: listings.length,
      pendingListings: listings.filter((listing) => listing.status === "pending").length,
      totalReviews: reviewCount,
      flaggedReviews: 0,
    },
  })
}
