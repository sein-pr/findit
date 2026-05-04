import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle, Users, Shield, Clock, Search, Wrench, Zap, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CategoryCard from "@/components/CategoryCard"
import ServiceCard from "@/components/ServiceCard"
import { categories } from "@/lib/data"
import { getProvidersFromBackend } from "@/lib/server/providers"

export default async function HomePage() {
  const providers = await getProvidersFromBackend()
  const featuredProviders = providers.filter((provider) => provider.featured)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pb-8 pt-8 md:pt-16 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="relative inline-block">
                <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                  Find Trusted{" "}
                  <span className="text-primary">Service Providers</span> in Namibia
                </h1>
                {/* Decorative curved line */}
                <svg
                  className="absolute -right-4 top-8 hidden h-8 w-16 text-primary/40 lg:block"
                  viewBox="0 0 60 30"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 25 C 20 25, 30 5, 55 5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                Connect with over 500 verified plumbers, electricians, mechanics, tutors, 
                and more. Get the job done right with professionals you can trust.
              </p>

              {/* CTA Buttons */}
              <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                <Link href="/search">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link href="/search">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Explore Services
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative mx-auto h-80 w-full max-w-md md:h-[450px] lg:h-[500px]">
                <Image
                  src="/hero-person.jpg"
                  alt="Happy customer finding services"
                  fill
                  className="object-contain object-bottom"
                  priority
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute left-0 top-1/4 hidden animate-bounce rounded-full bg-amber-400 p-3 shadow-lg md:block">
                <Star className="h-5 w-5 text-white" />
              </div>
              <div className="absolute right-0 top-8 hidden animate-pulse rounded-xl bg-primary p-3 shadow-lg md:block">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div className="absolute bottom-1/3 left-4 hidden animate-bounce rounded-full bg-blue-500 p-3 shadow-lg md:block" style={{ animationDelay: "0.5s" }}>
                <Zap className="h-5 w-5 text-white" />
              </div>

              {/* Stats Card */}
              <div className="absolute bottom-16 right-0 hidden rounded-xl border border-border bg-card p-4 shadow-xl md:block">
                <p className="text-sm font-semibold text-foreground">500+ Service Providers</p>
                <p className="text-xs text-muted-foreground">Choose from a variety of professionals</p>
                <Link href="/search" className="mt-2 block">
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    Browse Listings
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Search Bar Section */}
          <div className="relative z-10 mx-auto -mb-8 mt-8 max-w-4xl lg:mt-0">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6">
              <form action="/search" method="get" className="flex flex-col gap-4 md:flex-row md:items-center">
                {/* Category Select */}
                <div className="flex flex-1 items-center gap-2 border-b border-border pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Select name="category">
                    <SelectTrigger className="w-full border-0 bg-transparent shadow-none focus:ring-0">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keyword Input */}
                <div className="flex flex-1 items-center gap-2 md:px-4">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    name="keyword"
                    placeholder="Service or Keyword"
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button type="reset" variant="ghost" className="text-muted-foreground">
                    Clear
                  </Button>
                  <Button type="submit" size="lg">
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="mt-16 border-t border-border bg-muted/30 py-8 md:mt-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              <span className="text-sm font-medium text-muted-foreground">Trusted by businesses across Namibia</span>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale">
                <span className="text-xl font-bold text-muted-foreground">Windhoek</span>
                <span className="text-xl font-bold text-muted-foreground">Walvis Bay</span>
                <span className="text-xl font-bold text-muted-foreground">Swakopmund</span>
                <span className="text-xl font-bold text-muted-foreground">Oshakati</span>
                <span className="text-xl font-bold text-muted-foreground">Rundu</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Browse by Category
            </h2>
            <p className="text-muted-foreground">
              Find the right professional for any job
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                Featured Service Providers
              </h2>
              <p className="text-muted-foreground">
                Top-rated professionals trusted by the community
              </p>
            </div>
            <Link href="/search" className="hidden sm:block">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredProviders.slice(0, 8).map((provider) => (
              <ServiceCard key={provider.id} provider={provider} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/search">
              <Button variant="outline">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Why Choose FindIt Namibia
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              We make finding reliable service providers simple, safe, and efficient
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Verified Providers</h3>
              <p className="text-sm text-muted-foreground">
                All service providers are verified for quality and reliability
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Real Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Read genuine reviews from real customers before hiring
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Safe & Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your information is protected with industry-standard security
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">Quick Contact</h3>
              <p className="text-sm text-muted-foreground">
                Connect instantly via WhatsApp or phone call
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground">
              Are You a Service Provider?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/90">
              Join thousands of professionals on FindIt Namibia. 
              Reach more customers and grow your business today.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                List Your Service
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
