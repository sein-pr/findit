import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { deleteProviderById } from "@/lib/server/providers"

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await deleteProviderById(id)
  return NextResponse.json({ ok: true })
}
