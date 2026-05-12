import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { updateProviderStatus } from "@/lib/server/providers"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  const body = (await request.json()) as { status?: "approved" | "rejected" | "suspended" }
  if (!body.status) return NextResponse.json({ message: "Status required" }, { status: 400 })
  const { id } = await params
  await updateProviderStatus(id, body.status)
  return NextResponse.json({ ok: true })
}
