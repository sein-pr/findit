"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building,
  MapPin,
  Phone,
  Mail,
  FileText,
  Tags,
  Upload,
  X,
  ChevronLeft,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { categories, locations } from "@/lib/data"

export default function AddListingPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentService, setCurrentService] = useState("")
  const [formData, setFormData] = useState({
    businessName: "",
    category: "",
    shortDescription: "",
    description: "",
    location: "",
    coverageArea: "",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    services: [] as string[],
    logo: null as File | null,
    images: [] as File[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addService = () => {
    if (currentService.trim() && !formData.services.includes(currentService.trim())) {
      setFormData({
        ...formData,
        services: [...formData.services, currentService.trim()],
      })
      setCurrentService("")
    }
  }

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services.filter((s) => s !== service),
    })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData({
      ...formData,
      logo: file,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).slice(0, 5 - formData.images.length)
      setFormData({
        ...formData,
        images: [...formData.images, ...newImages],
      })
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required"
    }
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    if (!formData.shortDescription.trim() || formData.shortDescription.length < 20) {
      newErrors.shortDescription = "Short description must be at least 20 characters"
    }
    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters"
    }
    if (!formData.location) {
      newErrors.location = "Please select a location"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      newErrors.email = "Valid email is required"
    }
    if (formData.services.length === 0) {
      newErrors.services = "Add at least one service"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          category: formData.category,
          shortDescription: formData.shortDescription,
          description: formData.description,
          location: formData.location,
          coverageArea: formData.coverageArea,
          address: formData.address,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          logoUrl: formData.logo ? `/uploads/${formData.logo.name}` : "",
          services: formData.services,
          images: formData.images.map((image) => `/uploads/${image.name}`),
        }),
      })
      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        setErrors({ submit: data.message || "Could not create listing" })
        return
      }
      router.push("/dashboard?success=listing-created")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Add New Listing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to create your service listing
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Information */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Building className="h-5 w-5 text-primary" />
              Business Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="e.g., John's Plumbing Services"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className={errors.businessName ? "border-destructive" : ""}
                />
                {errors.businessName && (
                  <p className="text-sm text-destructive">{errors.businessName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger
                    className={errors.category ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                placeholder="A short summary shown in cards and search results..."
                rows={2}
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                className={errors.shortDescription ? "border-destructive" : ""}
              />
              {errors.shortDescription && (
                <p className="text-sm text-destructive">{errors.shortDescription}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, experience, and what makes you stand out..."
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={errors.description ? "border-destructive" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/500 characters (minimum 50)
              </p>
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">City/Area *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(value) =>
                    setFormData({ ...formData, location: value })
                  }
                >
                  <SelectTrigger
                    className={errors.location ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverageArea">Service Area</Label>
                <Input
                  id="coverageArea"
                  placeholder="e.g. Windhoek and surrounding areas"
                  value={formData.coverageArea}
                  onChange={(e) =>
                    setFormData({ ...formData, coverageArea: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Street Address (Optional)</Label>
                <Input
                  id="address"
                  placeholder="123 Independence Avenue"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+264 81 123 4567"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (Optional)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+264 81 123 4567"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use phone number
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.na"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Tags className="h-5 w-5 text-primary" />
              Services Offered
            </h2>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Pipe Repairs"
                  value={currentService}
                  onChange={(e) => setCurrentService(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addService()
                    }
                  }}
                  className={errors.services ? "border-destructive" : ""}
                />
                <Button type="button" onClick={addService} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.services && (
                <p className="text-sm text-destructive">{errors.services}</p>
              )}

              {formData.services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.services.map((service) => (
                    <Badge
                      key={service}
                      variant="secondary"
                      className="gap-1 px-3 py-1"
                    >
                      {service}
                      <button
                        type="button"
                        onClick={() => removeService(service)}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <Upload className="h-5 w-5 text-primary" />
              Media Uploads
            </h2>

            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <Label htmlFor="logo" className="mb-2 block">Business Logo</Label>
                <input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                {formData.logo && (
                  <p className="mt-2 text-xs text-muted-foreground">{formData.logo.name}</p>
                )}
              </div>

              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="images"
                  disabled={formData.images.length >= 5}
                />
                <label
                  htmlFor="images"
                  className={`cursor-pointer ${
                    formData.images.length >= 5 ? "opacity-50" : ""
                  }`}
                >
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images (max 5)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 5MB each
                  </p>
                </label>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {formData.images.map((image, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}

          {/* Submit */}
          <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-end">
            <Link href="/dashboard">
              <Button type="button" variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Listing"}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            <FileText className="mr-1 inline h-4 w-4" />
            Your listing will be reviewed by our team before being published.
          </p>
        </form>
      </div>
    </div>
  )
}
