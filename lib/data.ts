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
  "Ondangwa",
]
