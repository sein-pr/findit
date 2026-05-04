import Link from "next/link"
import { Star, MapPin, Phone, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ServiceProvider } from "@/lib/types"
import { categories } from "@/lib/data"

interface ServiceCardProps {
  provider: ServiceProvider
  variant?: "grid" | "list"
}

export default function ServiceCard({ provider, variant = "grid" }: ServiceCardProps) {
  const category = categories.find((c) => c.id === provider.category)

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.floor(rating)
                ? "fill-amber-400 text-amber-400"
                : star <= rating
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-muted text-muted"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-foreground">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
        <div className="flex flex-col gap-4 p-5 sm:flex-row">
          {/* Image */}
          <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-36 sm:w-36">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
              <span className="text-4xl font-bold text-primary/40">
                {provider.businessName.charAt(0)}
              </span>
            </div>
            {provider.featured && (
              <Badge className="absolute left-2 top-2 bg-amber-500 text-white hover:bg-amber-500">
                Featured
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Link href={`/profile/${provider.id}`}>
                  <h3 className="text-lg font-semibold text-foreground transition-colors hover:text-primary">
                    {provider.businessName}
                  </h3>
                </Link>
                {provider.verified && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <Badge variant="secondary">{category?.name}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {provider.location}
                </span>
              </div>
              <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                {provider.description}
              </p>
              {renderStars(provider.rating)}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Link href={`/profile/${provider.id}`} className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Profile
                </Button>
              </Link>
              <a
                href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none"
              >
                <Button className="w-full bg-green-600 text-white hover:bg-green-700 sm:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 transition-transform group-hover:scale-105">
          <span className="text-5xl font-bold text-primary/40">
            {provider.businessName.charAt(0)}
          </span>
        </div>
        {provider.featured && (
          <Badge className="absolute left-3 top-3 bg-amber-500 text-white hover:bg-amber-500">
            Featured
          </Badge>
        )}
        <Badge variant="secondary" className="absolute bottom-3 left-3">
          {category?.name}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Link href={`/profile/${provider.id}`}>
            <h3 className="font-semibold text-foreground transition-colors hover:text-primary">
              {provider.businessName}
            </h3>
          </Link>
          {provider.verified && (
            <CheckCircle className="h-4 w-4 text-primary" />
          )}
        </div>

        <p className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {provider.location}
        </p>

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {provider.description}
        </p>

        {renderStars(provider.rating)}

        <div className="mt-4 flex gap-2">
          <Link href={`/profile/${provider.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View
            </Button>
          </Link>
          <a
            href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button size="sm" className="w-full bg-green-600 text-white hover:bg-green-700">
              <Phone className="mr-1 h-3 w-3" />
              Contact
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
