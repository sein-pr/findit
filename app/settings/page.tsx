import Link from "next/link"

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-3xl font-bold text-foreground">Settings</h1>
      <p className="text-muted-foreground">
        Account settings are managed in dashboard. Go to{" "}
        <Link href="/dashboard" className="text-primary underline">
          Dashboard
        </Link>
        .
      </p>
    </div>
  )
}
