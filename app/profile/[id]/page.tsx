"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  MapPin,
  Phone,
  Mail,
  Star,
  CheckCircle,
  Share2,
  Heart,
  ChevronLeft,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Rating from "@/components/Rating"
import { categories } from "@/lib/data"
import type { Review, ServiceProvider } from "@/lib/types"

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localReviews, setLocalReviews] = useState<Review[]>([])
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      const [providerResponse, reviewsResponse] = await Promise.all([
        fetch(`/api/providers/${id}`),
        fetch(`/api/providers/${id}/reviews`),
      ])

      if (!providerResponse.ok) {
        if (!cancelled) {
          setProvider(null)
          setLocalReviews([])
          setIsLoading(false)
        }
        return
      }

      const [providerData, reviewsData] = await Promise.all([
        providerResponse.json() as Promise<ServiceProvider>,
        reviewsResponse.json() as Promise<Review[]>,
      ])

      if (!cancelled) {
        setProvider(providerData)
        setLocalReviews(reviewsData)
        setIsLoading(false)
      }
    }

    load().catch(() => {
      if (!cancelled) {
        setProvider(null)
        setLocalReviews([])
        setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Provider Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The service provider you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/search">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.id === provider.category)
  const coverageArea = provider.coverageArea || `${provider.location} and nearby areas`
  const galleryImages =
    provider.images.length > 0
      ? provider.images
      : ["/placeholder.jpg", "/placeholder-user.jpg", "/hero-person.jpg"]

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)

    const response = await fetch(`/api/providers/${id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "You",
        rating: newRating,
        comment: newComment,
      }),
    })

    if (!response.ok) {
      setIsSubmitting(false)
      return
    }

    const newReview = (await response.json()) as Review

    setLocalReviews([newReview, ...localReviews])
    setNewComment("")
    setNewRating(5)
    setIsSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/search"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Search
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-8 overflow-hidden rounded-xl border border-border bg-card">
            {/* Cover Image */}
            <div className="relative h-48 w-full bg-gradient-to-br from-primary/30 to-accent/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl font-bold text-primary/30">
                  {provider.businessName.charAt(0)}
                </span>
              </div>
              {provider.featured && (
                <Badge className="absolute right-4 top-4 bg-amber-500 text-white hover:bg-amber-500">
                  Featured
                </Badge>
              )}
            </div>

            <div className="p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                      {provider.businessName}
                    </h1>
                    {provider.verified && (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary">{category?.name}</Badge>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {provider.location}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart
                      className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(provider.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium">{provider.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">
                  ({provider.reviewCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">About</h2>
            <p className="text-muted-foreground">{provider.description}</p>
          </div>

          {/* Services */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Services Offered
            </h2>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((service, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Service Coverage */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Service Coverage Area
            </h2>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {coverageArea}
            </p>
          </div>

          {/* Media Gallery */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Media Gallery
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.map((src, index) => (
                <div
                  key={`${provider.id}-gallery-${index}`}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <Image
                    src={src}
                    alt={`${provider.businessName} work sample ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-6 text-xl font-semibold text-foreground">
              Reviews ({localReviews.length})
            </h2>

            {/* Write Review */}
            <form onSubmit={handleSubmitReview} className="mb-8 border-b border-border pb-8">
              <h3 className="mb-4 font-medium text-foreground">Write a Review</h3>
              <div className="mb-4">
                <label className="mb-2 block text-sm text-muted-foreground">
                  Your Rating
                </label>
                <Rating value={newRating} onChange={setNewRating} size="lg" />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm text-muted-foreground">
                  Your Review
                </label>
                <Textarea
                  placeholder="Share your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>

            {/* Reviews List */}
            {localReviews.length === 0 ? (
              <div className="py-8 text-center">
                <MessageCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {localReviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Rating value={review.rating} readonly size="sm" />
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Contact Card */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Contact Information
              </h3>
              <div className="space-y-4">
                <a
                  href={`tel:${provider.phone}`}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-foreground">{provider.phone}</p>
                  </div>
                </a>
                <a
                  href={`mailto:${provider.email}`}
                  className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                >
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{provider.email}</p>
                  </div>
                </a>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp
                  </Button>
                </a>
                <a href={`tel:${provider.phone}`} className="block">
                  <Button variant="outline" className="w-full">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>

            {/* Business Hours (Mock) */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Business Hours
              </h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Monday", hours: "08:00 - 17:00" },
                  { day: "Tuesday", hours: "08:00 - 17:00" },
                  { day: "Wednesday", hours: "08:00 - 17:00" },
                  { day: "Thursday", hours: "08:00 - 17:00" },
                  { day: "Friday", hours: "08:00 - 17:00" },
                  { day: "Saturday", hours: "09:00 - 13:00" },
                  { day: "Sunday", hours: "Closed" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between">
                    <span className="text-muted-foreground">{day}</span>
                    <span className="font-medium text-foreground">{hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
