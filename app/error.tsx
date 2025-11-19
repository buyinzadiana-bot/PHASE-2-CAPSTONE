'use client'

import Link from 'next/link'
import Header from '@/components/header'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Something went wrong
        </p>
        {error.message && (
          <p className="text-sm text-muted-foreground mb-8 bg-muted p-4 rounded">
            {error.message}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-border px-6 py-3 rounded-lg font-medium hover:bg-muted"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
