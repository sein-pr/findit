import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">About FindIt Namibia</h1>
      <p className="mb-6 text-muted-foreground">
        FindIt Namibia connects people with trusted local service providers, making it easier to discover,
        compare, and contact professionals for everyday needs.
      </p>

      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground">How It Works</h2>
        <p className="text-muted-foreground">
          Search by keyword, category, or location, review provider profiles and ratings, then contact providers
          directly by phone or WhatsApp.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/search">
          <Button>Explore Services</Button>
        </Link>
      </div>
    </div>
  )
}
