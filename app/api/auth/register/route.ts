import { NextResponse } from "next/server"
import { registerUser } from "@/lib/server/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
      password?: string
      role?: "user" | "provider"
      businessName?: string
      primaryCategory?: string
    }

    if (!body.name || !body.email || !body.phone || !body.password || !body.role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (body.password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const user = await registerUser({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      password: body.password,
      role: body.role,
      businessName: body.businessName?.trim(),
      primaryCategory: body.primaryCategory?.trim(),
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ message }, { status: 400 })
  }
}
