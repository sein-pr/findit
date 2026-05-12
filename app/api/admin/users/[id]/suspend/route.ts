import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server/auth"
import { setUserSuspended } from "@/lib/server/users"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 })
  }
  const body = (await request.json()) as { suspended?: boolean }
  const { id } = await params
  await setUserSuspended(id, !!body.suspended)
  return NextResponse.json({ ok: true })
}
