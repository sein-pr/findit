import { NextResponse } from "next/server"
import {
  createReviewInBackend,
  getReviewsByListingIdFromBackend,
} from "@/lib/server/reviews"
import { getCurrentUser } from "@/lib/server/auth"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const reviews = await getReviewsByListingIdFromBackend(id)
  return NextResponse.json(reviews)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = (await request.json()) as {
    userName?: string
    rating?: number
    comment?: string
  }

  const userName = body.userName?.trim()
  const comment = body.comment?.trim()
  const rating = Number(body.rating)
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: "You must be logged in to review" }, { status: 401 })
  }

  if (!userName || !comment || comment.length > 500 || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { message: "Invalid review payload" },
      { status: 400 }
    )
  }

  const review = await createReviewInBackend({
    listingId: id,
    userId: user.id,
    userName,
    rating,
    comment,
  })

  return NextResponse.json(review, { status: 201 })
}
