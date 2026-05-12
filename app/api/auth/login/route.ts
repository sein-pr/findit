import { NextResponse } from "next/server"
import { loginUser } from "@/lib/server/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      password?: string
      remember?: boolean
    }
    if (!body.email || !body.password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = await loginUser(body.email, body.password, !!body.remember)
    return NextResponse.json(user)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ message }, { status: 401 })
  }
}
