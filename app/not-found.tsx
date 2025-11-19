import Link from 'next/link'
import Header from '@/components/header'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          We couldn't find the page you're looking for
        </p>
        <Link
          href="/"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}
