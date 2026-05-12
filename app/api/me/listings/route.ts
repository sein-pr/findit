import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { getProvidersByOwner } from "@/lib/server/providers"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const listings = await getProvidersByOwner(user.id)
  return NextResponse.json(listings)
}
