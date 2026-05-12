import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { deleteUser } from "@/lib/server/users"

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  const { id } = await params
  await deleteUser(id)
  return NextResponse.json({ ok: true })
}
