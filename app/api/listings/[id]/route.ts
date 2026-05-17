import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { deleteProviderById, getProviderOwnerUserId } from "@/lib/server/providers"

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const ownerUserId = await getProviderOwnerUserId(id)

  if (!ownerUserId) {
    return NextResponse.json({ message: "Listing not found" }, { status: 404 })
  }

  if (user.role !== "admin" && ownerUserId !== user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }

  await deleteProviderById(id)
  return NextResponse.json({ ok: true })
}
