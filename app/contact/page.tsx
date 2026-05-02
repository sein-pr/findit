export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">Contact Us</h1>
      <p className="mb-8 text-muted-foreground">
        Reach out to the FindIt Namibia team for support, partnerships, or general questions.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">Email</h2>
          <p className="text-muted-foreground">info@finditnamibia.na</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-2 text-lg font-semibold text-foreground">Phone</h2>
          <p className="text-muted-foreground">+264 61 123 4567</p>
        </div>
      </div>
    </div>
  )
}
