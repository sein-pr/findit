import { NextResponse } from "next/server"
import { getProviderByIdFromBackend } from "@/lib/server/providers"

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const provider = await getProviderByIdFromBackend(id)

  if (!provider) {
    return NextResponse.json({ message: "Provider not found" }, { status: 404 })
  }

  return NextResponse.json(provider)
}
