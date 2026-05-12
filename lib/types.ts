export interface ServiceProvider {
  id: string
  businessName: string
  category: string
  description: string
  location: string
  coverageArea?: string
  phone: string
  whatsapp: string
  email: string
  images: string[]
  rating: number
  reviewCount: number
  services: string[]
  featured: boolean
  verified: boolean
  createdAt: string
  views: number
  clicks: number
  status: "approved" | "pending" | "rejected" | "suspended"
}

export interface Review {
  id: string
  listingId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}
