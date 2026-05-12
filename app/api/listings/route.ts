import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { createProvider } from "@/lib/server/providers"

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || (user.role !== "provider" && user.role !== "admin")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as {
    businessName: string
    category: string
    shortDescription: string
    description: string
    location: string
    coverageArea?: string
    address?: string
    phone: string
    whatsapp: string
    email: string
    logoUrl?: string
    services: string[]
    images?: string[]
  }

  const provider = await createProvider({
    ownerUserId: user.id,
    businessName: body.businessName,
    category: body.category,
    shortDescription: body.shortDescription,
    description: body.description,
    location: body.location,
    coverageArea: body.coverageArea,
    address: body.address,
    phone: body.phone,
    whatsapp: body.whatsapp,
    email: body.email,
    logoUrl: body.logoUrl,
    services: body.services || [],
    images: body.images || [],
  })

  return NextResponse.json(provider, { status: 201 })
}
