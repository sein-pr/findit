import { reviews } from "@/lib/data"
import { getDbPool } from "@/lib/server/db"
import type { Review } from "@/lib/types"

type ReviewRow = {
  id: string
  listing_id: string
  user_name: string
  rating: number
  comment: string
  created_at: Date
}

function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    listingId: row.listing_id,
    userName: row.user_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at.toISOString().split("T")[0],
  }
}

export async function getReviewsByListingIdFromBackend(listingId: string): Promise<Review[]> {
  const pool = getDbPool()
  if (!pool) {
    return reviews.filter((review) => review.listingId === listingId)
  }

  const result = await pool.query<ReviewRow>(
    "SELECT * FROM reviews WHERE listing_id = $1 ORDER BY created_at DESC",
    [listingId]
  )
  return result.rows.map(mapReviewRow)
}

export async function createReviewInBackend(input: {
  listingId: string
  userId?: string
  userName: string
  rating: number
  comment: string
}): Promise<Review> {
  const pool = getDbPool()
  if (!pool) {
    return {
      id: `r-${Date.now()}`,
      listingId: input.listingId,
      userName: input.userName,
      rating: input.rating,
      comment: input.comment,
      createdAt: new Date().toISOString().split("T")[0],
    }
  }

  let result: { rows: ReviewRow[] }
  if (input.userId) {
    result = await pool.query<ReviewRow>(
      `
        INSERT INTO reviews (id, listing_id, user_id, user_name, rating, comment)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (listing_id, user_id)
        DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, updated_at = NOW()
        RETURNING id, listing_id, user_name, rating, comment, created_at
      `,
      [`rev_${Date.now()}_${Math.random()}`, input.listingId, input.userId, input.userName, input.rating, input.comment]
    )
  } else {
    result = await pool.query<ReviewRow>(
      `
        INSERT INTO reviews (id, listing_id, user_name, rating, comment)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, listing_id, user_name, rating, comment, created_at
      `,
      [`rev_${Date.now()}_${Math.random()}`, input.listingId, input.userName, input.rating, input.comment]
    )
  }

  await pool.query(
    `
      UPDATE providers
      SET
        review_count = (
          SELECT COUNT(*)::int FROM reviews WHERE listing_id = $1
        ),
        rating = (
          SELECT COALESCE(AVG(rating), 0)::numeric(3,2) FROM reviews WHERE listing_id = $1
        )
      WHERE id = $1
    `,
    [input.listingId]
  )

  return mapReviewRow(result.rows[0])
}
