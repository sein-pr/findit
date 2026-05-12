import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { getFavorites, toggleFavorite } from "@/lib/server/users"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const favorites = await getFavorites(user.id)
  return NextResponse.json({ favorites })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const body = (await request.json()) as { listingId?: string }
  if (!body.listingId) return NextResponse.json({ message: "listingId is required" }, { status: 400 })
  const favorite = await toggleFavorite(user.id, body.listingId)
  return NextResponse.json({ favorite })
}
