"use client"

import { useEffect, useState } from "react"
import { User, Phone, Mail, Shield, Briefcase, Save, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { categories } from "@/lib/data"

type Profile = {
  id: string
  name: string
  email: string
  phone: string
  role: "user" | "provider" | "admin"
  avatar_url: string
  bio: string
  business_name: string
  primary_category: string
}

export default function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [avatarError, setAvatarError] = useState("")

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/me/profile")
      if (!response.ok) return
      setProfile((await response.json()) as Profile)
    }
    load()
  }, [])

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const roleLabel = profile.role === "provider" ? "Service Provider" : profile.role === "admin" ? "Administrator" : "Customer"

  const saveProfile = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/me/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!response.ok) {
        setMessage("Could not update your profile.")
        return
      }
      setProfile((await response.json()) as Profile)
      setMessage("Profile updated successfully.")
    } finally {
      setIsSaving(false)
    }
  }

  const onAvatarUpload = async (file?: File) => {
    if (!file) return

    setAvatarError("")

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    const maxBytes = 5 * 1024 * 1024
    if (!allowed.includes(file.type)) {
      setAvatarError("Please upload JPG, PNG, or WEBP.")
      return
    }
    if (file.size > maxBytes) {
      setAvatarError("Image is too large. Maximum upload size is 5MB.")
      return
    }

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject(new Error("Unable to read image"))
        img.src = String(reader.result)
      }
      reader.onerror = () => reject(new Error("Unable to read file"))
      reader.readAsDataURL(file)
    })

    const size = 320
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setAvatarError("Could not process image.")
      return
    }

    const srcSize = Math.min(image.width, image.height)
    const sx = (image.width - srcSize) / 2
    const sy = (image.height - srcSize) / 2

    ctx.drawImage(image, sx, sy, srcSize, srcSize, 0, 0, size, size)

    const compressed = canvas.toDataURL("image/jpeg", 0.78)
    setProfile((prev) => (prev ? { ...prev, avatar_url: compressed } : prev))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-md">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="h-24 w-24 rounded-full border-4 border-primary/20 object-cover" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-primary/20 bg-primary/10 text-3xl font-bold text-primary">
                {profile.name.charAt(0)}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 cursor-pointer rounded-full bg-primary p-2 text-white shadow">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onAvatarUpload(e.target.files?.[0])}
              />
            </label>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
            <p className="mt-1 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Shield className="mr-2 h-4 w-4" />
              {roleLabel}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Manage your account information and public identity.</p>
          </div>
        </div>
        {avatarError && <p className="mt-3 text-sm text-destructive">{avatarError}</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          Avatar uploads are auto-cropped to square and compressed for faster loading.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Full Name</Label>
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</Label>
          <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
          <Input value={profile.email} disabled />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Bio</Label>
          <Textarea rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>

        {profile.role === "provider" && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Business Name</Label>
              <Input value={profile.business_name} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Primary Category</Label>
              <select
                value={profile.primary_category}
                onChange={(e) => setProfile({ ...profile, primary_category: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Button onClick={saveProfile} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}
