export interface ServiceProvider {
  id: string
  businessName: string
  category: string
  description: string
  location: string
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
  status: "approved" | "pending" | "rejected"
}

export interface Review {
  id: string
  listingId: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "provider" | "admin"
  avatar?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}

export const categories: Category[] = [
  { id: "plumbing", name: "Plumbing", icon: "Droplets", count: 45 },
  { id: "electrical", name: "Electrical", icon: "Zap", count: 38 },
  { id: "mechanics", name: "Mechanics", icon: "Wrench", count: 52 },
  { id: "painting", name: "Painting", icon: "PaintBucket", count: 29 },
  { id: "cleaning", name: "Cleaning", icon: "SprayCan", count: 67 },
  { id: "tutoring", name: "Tutoring", icon: "GraduationCap", count: 41 },
  { id: "beauty", name: "Beauty & Wellness", icon: "Sparkles", count: 55 },
  { id: "construction", name: "Construction", icon: "HardHat", count: 33 },
  { id: "gardening", name: "Gardening", icon: "TreeDeciduous", count: 24 },
  { id: "catering", name: "Catering", icon: "ChefHat", count: 36 },
  { id: "transport", name: "Transport", icon: "Truck", count: 48 },
  { id: "it-services", name: "IT Services", icon: "Monitor", count: 31 },
]

export const serviceProviders: ServiceProvider[] = [
  {
    id: "1",
    businessName: "John's Plumbing Services",
    category: "plumbing",
    description: "Professional plumbing services in Windhoek and surrounding areas. We specialize in residential and commercial plumbing, including repairs, installations, and emergency services. With over 15 years of experience, we guarantee quality workmanship and reliable service.",
    location: "Windhoek, Namibia",
    phone: "+264 81 234 5678",
    whatsapp: "+264 81 234 5678",
    email: "john@plumbing.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.8,
    reviewCount: 127,
    services: ["Pipe Repairs", "Drain Cleaning", "Water Heater Installation", "Leak Detection", "Bathroom Renovations"],
    featured: true,
    verified: true,
    createdAt: "2024-01-15",
    views: 1523,
    clicks: 342,
    status: "approved"
  },
  {
    id: "2",
    businessName: "Elite Electrical CC",
    category: "electrical",
    description: "Certified electrical contractors providing comprehensive electrical services. From new installations to maintenance and repairs, we handle all your electrical needs with precision and safety compliance.",
    location: "Klein Windhoek, Namibia",
    phone: "+264 81 345 6789",
    whatsapp: "+264 81 345 6789",
    email: "info@eliteelectrical.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.9,
    reviewCount: 89,
    services: ["Electrical Installations", "Wiring", "Solar Panel Installation", "Generator Services", "Emergency Repairs"],
    featured: true,
    verified: true,
    createdAt: "2024-02-10",
    views: 982,
    clicks: 215,
    status: "approved"
  },
  {
    id: "3",
    businessName: "Namibia Auto Care",
    category: "mechanics",
    description: "Full-service auto repair and maintenance center. Our skilled mechanics handle everything from routine maintenance to complex repairs. We work on all vehicle makes and models.",
    location: "Katutura, Windhoek",
    phone: "+264 81 456 7890",
    whatsapp: "+264 81 456 7890",
    email: "service@namibiaautocare.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.6,
    reviewCount: 156,
    services: ["Engine Repairs", "Brake Services", "Oil Changes", "Transmission Repairs", "Vehicle Diagnostics"],
    featured: true,
    verified: true,
    createdAt: "2023-11-20",
    views: 2341,
    clicks: 567,
    status: "approved"
  },
  {
    id: "4",
    businessName: "Perfect Paint Solutions",
    category: "painting",
    description: "Transform your space with our professional painting services. We offer interior and exterior painting, wallpaper installation, and decorative finishes for homes and businesses.",
    location: "Olympia, Windhoek",
    phone: "+264 81 567 8901",
    whatsapp: "+264 81 567 8901",
    email: "info@perfectpaint.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.7,
    reviewCount: 73,
    services: ["Interior Painting", "Exterior Painting", "Wallpaper Installation", "Texture Coating", "Waterproofing"],
    featured: false,
    verified: true,
    createdAt: "2024-03-05",
    views: 654,
    clicks: 145,
    status: "approved"
  },
  {
    id: "5",
    businessName: "Sparkle Clean Services",
    category: "cleaning",
    description: "Professional cleaning services for homes, offices, and commercial spaces. We use eco-friendly products and guarantee spotless results every time.",
    location: "Eros, Windhoek",
    phone: "+264 81 678 9012",
    whatsapp: "+264 81 678 9012",
    email: "book@sparkleclean.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.5,
    reviewCount: 201,
    services: ["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Carpet Cleaning", "Window Cleaning"],
    featured: true,
    verified: true,
    createdAt: "2024-01-28",
    views: 1876,
    clicks: 423,
    status: "approved"
  },
  {
    id: "6",
    businessName: "Academic Excellence Tutors",
    category: "tutoring",
    description: "Expert tutoring services for primary, secondary, and university students. Our qualified tutors help students excel in Mathematics, Science, English, and more.",
    location: "Windhoek Central",
    phone: "+264 81 789 0123",
    whatsapp: "+264 81 789 0123",
    email: "learn@academicexcellence.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.9,
    reviewCount: 112,
    services: ["Mathematics Tutoring", "Science Tutoring", "English Tutoring", "Exam Preparation", "Online Classes"],
    featured: false,
    verified: true,
    createdAt: "2024-02-18",
    views: 892,
    clicks: 198,
    status: "approved"
  },
  {
    id: "7",
    businessName: "Glow Beauty Salon",
    category: "beauty",
    description: "Full-service beauty salon offering hair, nails, makeup, and skincare services. Our experienced beauticians help you look and feel your best.",
    location: "Maerua Mall, Windhoek",
    phone: "+264 81 890 1234",
    whatsapp: "+264 81 890 1234",
    email: "appointments@glowbeauty.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.8,
    reviewCount: 234,
    services: ["Hair Styling", "Manicure & Pedicure", "Makeup", "Facial Treatments", "Waxing"],
    featured: true,
    verified: true,
    createdAt: "2023-12-10",
    views: 2156,
    clicks: 534,
    status: "approved"
  },
  {
    id: "8",
    businessName: "BuildRight Construction",
    category: "construction",
    description: "Reliable construction company specializing in residential and commercial projects. From renovations to new builds, we deliver quality construction on time and within budget.",
    location: "Prosperita, Windhoek",
    phone: "+264 81 901 2345",
    whatsapp: "+264 81 901 2345",
    email: "projects@buildright.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.4,
    reviewCount: 67,
    services: ["Home Construction", "Renovations", "Commercial Buildings", "Roofing", "Paving"],
    featured: false,
    verified: true,
    createdAt: "2024-01-05",
    views: 543,
    clicks: 121,
    status: "approved"
  },
  {
    id: "9",
    businessName: "Green Gardens Landscaping",
    category: "gardening",
    description: "Create your dream outdoor space with our professional landscaping services. We design, install, and maintain beautiful gardens for homes and businesses.",
    location: "Ludwigsdorf, Windhoek",
    phone: "+264 81 012 3456",
    whatsapp: "+264 81 012 3456",
    email: "design@greengardens.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.6,
    reviewCount: 45,
    services: ["Garden Design", "Lawn Care", "Tree Trimming", "Irrigation Systems", "Garden Maintenance"],
    featured: false,
    verified: true,
    createdAt: "2024-03-12",
    views: 387,
    clicks: 89,
    status: "approved"
  },
  {
    id: "10",
    businessName: "Taste of Namibia Catering",
    category: "catering",
    description: "Premium catering services for weddings, corporate events, and private parties. We create memorable dining experiences with our diverse menu options.",
    location: "Windhoek West",
    phone: "+264 81 123 4567",
    whatsapp: "+264 81 123 4567",
    email: "events@tasteofnamibia.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.7,
    reviewCount: 89,
    services: ["Wedding Catering", "Corporate Events", "Private Parties", "Buffet Services", "Custom Menus"],
    featured: true,
    verified: true,
    createdAt: "2024-02-01",
    views: 756,
    clicks: 167,
    status: "approved"
  },
  {
    id: "11",
    businessName: "Swift Logistics Namibia",
    category: "transport",
    description: "Reliable transport and logistics services across Namibia. We offer furniture moving, delivery services, and long-distance transport solutions.",
    location: "Northern Industrial, Windhoek",
    phone: "+264 81 234 5670",
    whatsapp: "+264 81 234 5670",
    email: "logistics@swiftnamibia.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.5,
    reviewCount: 134,
    services: ["Furniture Moving", "Delivery Services", "Long-Distance Transport", "Storage Solutions", "Packing Services"],
    featured: false,
    verified: true,
    createdAt: "2024-01-22",
    views: 1123,
    clicks: 256,
    status: "approved"
  },
  {
    id: "12",
    businessName: "TechPro IT Solutions",
    category: "it-services",
    description: "Comprehensive IT services for businesses and individuals. We provide computer repairs, network setup, software installation, and IT consulting.",
    location: "CBD, Windhoek",
    phone: "+264 81 345 6780",
    whatsapp: "+264 81 345 6780",
    email: "support@techproit.na",
    images: ["/placeholder-business.jpg"],
    rating: 4.8,
    reviewCount: 78,
    services: ["Computer Repairs", "Network Setup", "Software Installation", "Data Recovery", "IT Consulting"],
    featured: true,
    verified: true,
    createdAt: "2024-02-25",
    views: 645,
    clicks: 143,
    status: "approved"
  },
]

export const reviews: Review[] = [
  {
    id: "r1",
    listingId: "1",
    userName: "Maria Shikongo",
    rating: 5,
    comment: "Excellent service! John fixed our burst pipe quickly and professionally. Highly recommend!",
    createdAt: "2024-04-15"
  },
  {
    id: "r2",
    listingId: "1",
    userName: "Peter Nghipondoka",
    rating: 5,
    comment: "Very reliable and honest. Fair pricing and quality work.",
    createdAt: "2024-04-10"
  },
  {
    id: "r3",
    listingId: "1",
    userName: "Susan van Wyk",
    rating: 4,
    comment: "Good service, arrived on time. Would use again.",
    createdAt: "2024-04-05"
  },
  {
    id: "r4",
    listingId: "2",
    userName: "Thomas Hamutenya",
    rating: 5,
    comment: "Installed our solar system perfectly. Very knowledgeable team!",
    createdAt: "2024-04-12"
  },
  {
    id: "r5",
    listingId: "2",
    userName: "Anna Kamati",
    rating: 5,
    comment: "Professional and efficient. Fixed our electrical issues same day.",
    createdAt: "2024-04-08"
  },
  {
    id: "r6",
    listingId: "3",
    userName: "David Shipanga",
    rating: 5,
    comment: "Best mechanics in Windhoek! They diagnosed and fixed my car's issue that other shops couldn't find.",
    createdAt: "2024-04-14"
  },
  {
    id: "r7",
    listingId: "3",
    userName: "Emma Hausiku",
    rating: 4,
    comment: "Good service and fair prices. My car runs perfectly now.",
    createdAt: "2024-04-09"
  },
  {
    id: "r8",
    listingId: "5",
    userName: "Grace Nangolo",
    rating: 5,
    comment: "My house has never been this clean! Amazing attention to detail.",
    createdAt: "2024-04-11"
  },
  {
    id: "r9",
    listingId: "7",
    userName: "Rebecca Iipinge",
    rating: 5,
    comment: "Love my new hairstyle! The staff is so friendly and talented.",
    createdAt: "2024-04-13"
  },
  {
    id: "r10",
    listingId: "10",
    userName: "Michael Amupolo",
    rating: 5,
    comment: "They catered our wedding and the food was absolutely incredible. All our guests loved it!",
    createdAt: "2024-04-07"
  },
]

export const pendingListings: ServiceProvider[] = [
  {
    id: "p1",
    businessName: "Quick Fix Handyman",
    category: "construction",
    description: "General handyman services for all your home repair needs.",
    location: "Khomasdal, Windhoek",
    phone: "+264 81 555 1234",
    whatsapp: "+264 81 555 1234",
    email: "quickfix@email.na",
    images: [],
    rating: 0,
    reviewCount: 0,
    services: ["Home Repairs", "Furniture Assembly", "Minor Plumbing", "Painting"],
    featured: false,
    verified: false,
    createdAt: "2024-04-20",
    views: 0,
    clicks: 0,
    status: "pending"
  },
  {
    id: "p2",
    businessName: "Bright Kids Daycare",
    category: "tutoring",
    description: "Quality childcare and early learning programs.",
    location: "Eros, Windhoek",
    phone: "+264 81 555 5678",
    whatsapp: "+264 81 555 5678",
    email: "brightkids@email.na",
    images: [],
    rating: 0,
    reviewCount: 0,
    services: ["Daycare", "Early Learning", "After School Care"],
    featured: false,
    verified: false,
    createdAt: "2024-04-19",
    views: 0,
    clicks: 0,
    status: "pending"
  },
]

export const users: User[] = [
  { id: "u1", name: "Admin User", email: "admin@finditnamibia.na", role: "admin" },
  { id: "u2", name: "John Smith", email: "john@plumbing.na", role: "provider" },
  { id: "u3", name: "Sarah Mbeki", email: "sarah@email.na", role: "user" },
]

export const locations = [
  "Windhoek",
  "Klein Windhoek",
  "Katutura",
  "Khomasdal",
  "Olympia",
  "Eros",
  "Ludwigsdorf",
  "Prosperita",
  "Maerua",
  "Windhoek West",
  "Windhoek North",
  "Academia",
  "Pionierspark",
  "Rocky Crest",
  "Swakopmund",
  "Walvis Bay",
  "Oshakati",
  "Rundu",
  "Ondangwa"
]

export function getProviderById(id: string): ServiceProvider | undefined {
  return serviceProviders.find(p => p.id === id)
}

export function getReviewsByListingId(listingId: string): Review[] {
  return reviews.filter(r => r.listingId === listingId)
}

export function getProvidersByCategory(category: string): ServiceProvider[] {
  return serviceProviders.filter(p => p.category === category && p.status === "approved")
}

export function getFeaturedProviders(): ServiceProvider[] {
  return serviceProviders.filter(p => p.featured && p.status === "approved")
}

export function searchProviders(query: string, filters?: {
  category?: string
  location?: string
  minRating?: number
}): ServiceProvider[] {
  let results = serviceProviders.filter(p => p.status === "approved")
  
  if (query) {
    const lowerQuery = query.toLowerCase()
    results = results.filter(p => 
      p.businessName.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.services.some(s => s.toLowerCase().includes(lowerQuery))
    )
  }
  
  if (filters?.category) {
    results = results.filter(p => p.category === filters.category)
  }
  
  if (filters?.location) {
    results = results.filter(p => p.location.toLowerCase().includes(filters.location!.toLowerCase()))
  }
  
  if (filters?.minRating) {
    results = results.filter(p => p.rating >= filters.minRating!)
  }
  
  return results
}
