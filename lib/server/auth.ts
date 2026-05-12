import crypto from "crypto"
import { cookies } from "next/headers"
import { getDbPool } from "@/lib/server/db"

const SESSION_COOKIE = "findit_session"

export type AppRole = "user" | "provider" | "admin"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: AppRole
}

function hashPassword(password: string, salt?: string) {
  const localSalt = salt ?? crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, localSalt, 64).toString("hex")
  return `${localSalt}:${hash}`
}

function verifyPassword(password: string, stored: string) {
  const [salt] = stored.split(":")
  return hashPassword(password, salt) === stored
}

function randomId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replaceAll("-", "")}`
}

export async function registerUser(input: {
  name: string
  email: string
  phone: string
  password: string
  role: AppRole
  businessName?: string
  primaryCategory?: string
}) {
  const pool = getDbPool()
  if (!pool) throw new Error("Database is not configured")

  const existing = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [
    input.email.toLowerCase(),
  ])
  if (existing.rowCount) {
    throw new Error("An account with this email already exists")
  }

  const userId = randomId("usr")
  const passwordHash = hashPassword(input.password)

  await pool.query(
    `
      INSERT INTO users (id, name, email, phone, password_hash, role)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [userId, input.name, input.email.toLowerCase(), input.phone, passwordHash, input.role]
  )

  if (input.role === "provider") {
    const providerId = randomId("prv")
    await pool.query(
      `
        INSERT INTO providers (
          id, owner_user_id, business_name, category, description, location, coverage_area,
          phone, whatsapp, email, images, rating, review_count, services, featured, verified,
          created_at, views, clicks, status
        )
        VALUES ($1, $2, $3, $4, '', '', '', $5, $5, $6, ARRAY[]::text[], 0, 0, ARRAY[]::text[], FALSE, FALSE, NOW(), 0, 0, 'pending')
      `,
      [
        providerId,
        userId,
        input.businessName || input.name,
        input.primaryCategory || "other",
        input.phone,
        input.email.toLowerCase(),
      ]
    )
  }

  return { id: userId, name: input.name, email: input.email.toLowerCase(), role: input.role }
}

export async function loginUser(email: string, password: string, rememberMe: boolean) {
  const pool = getDbPool()
  if (!pool) throw new Error("Database is not configured")

  const result = await pool.query<{
    id: string
    name: string
    email: string
    role: AppRole
    password_hash: string
  }>(
    "SELECT id, name, email, role, password_hash FROM users WHERE email = $1 LIMIT 1",
    [email.toLowerCase()]
  )

  if (!result.rowCount) throw new Error("Invalid email or password")
  const user = result.rows[0]
  if (!verifyPassword(password, user.password_hash)) throw new Error("Invalid email or password")

  const sessionToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 1))

  await pool.query(
    `
      INSERT INTO user_sessions (id, user_id, token, expires_at)
      VALUES ($1, $2, $3, $4)
    `,
    [randomId("ses"), user.id, sessionToken, expiresAt]
  )

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: expiresAt,
  })

  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  cookieStore.delete(SESSION_COOKIE)
  if (!token) return
  const pool = getDbPool()
  if (!pool) return
  await pool.query("DELETE FROM user_sessions WHERE token = $1", [token])
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  const pool = getDbPool()
  if (!pool) return null

  const result = await pool.query<{
    id: string
    name: string
    email: string
    role: AppRole
  }>(
    `
      SELECT u.id, u.name, u.email, u.role
      FROM user_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = $1 AND s.expires_at > NOW()
      LIMIT 1
    `,
    [token]
  )

  if (!result.rowCount) return null
  return result.rows[0]
}
