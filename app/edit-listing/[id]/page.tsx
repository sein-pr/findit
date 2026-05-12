import Link from "next/link"

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold text-foreground">Edit Listing</h1>
      <p className="text-muted-foreground">
        Listing `{id}` can be edited from{" "}
        <Link href="/dashboard" className="text-primary underline">
          Dashboard
        </Link>
        .
      </p>
    </div>
  )
}
