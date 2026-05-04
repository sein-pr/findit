import { NextRequest, NextResponse } from "next/server"
import { getProvidersFromBackend } from "@/lib/server/providers"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") ?? undefined
  const category = searchParams.get("category") ?? undefined
  const location = searchParams.get("location") ?? undefined
  const minRatingParam = searchParams.get("minRating")
  const minRating = minRatingParam ? Number(minRatingParam) : undefined
  const onlyVerified = searchParams.get("onlyVerified") === "true"

  const providers = await getProvidersFromBackend({
    q,
    category,
    location,
    minRating: Number.isFinite(minRating) ? minRating : undefined,
    onlyVerified,
  })

  return NextResponse.json(providers)
}
