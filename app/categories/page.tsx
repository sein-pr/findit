import CategoryCard from "@/components/CategoryCard"
import { categories } from "@/lib/data"

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
          Service Categories
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Browse all categories to find trusted service providers across Namibia.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}
