import Link from 'next/link'
import { Code2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <Code2 className="w-12 h-12 text-primary mb-6" />
      <h1 className="text-6xl font-bold text-foreground tracking-tight mb-2">
        404
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page doesn&apos;t exist. Maybe it was deleted, or you followed a broken link.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        Back to Vibe Code
      </Link>
    </div>
  )
}
