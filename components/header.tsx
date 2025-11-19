'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-900/95 backdrop-blur-lg shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link 
          href="/" 
          className="text-3xl font-extrabold text-white tracking-tight hover:text-blue-200 transition duration-200"
        >
          TechInsights
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
          >
            Home
          </Link>

          {user && (
            <Link
              href="/editor"
              className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
            >
              Write
            </Link>
          )}

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    href={`/profile/${user.id}`}
                    className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    className="px-5 py-2 rounded-full bg-white text-blue-900 font-semibold shadow transition duration-200 hover:bg-blue-800 hover:text-white hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-blue-900 text-center space-y-4 py-6 animate-slide-down">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
          >
            Home
          </Link>

          {user && (
            <Link
              href="/editor"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
            >
              Write
            </Link>
          )}

          {!loading && (
            <>
              {user ? (
                <>
                  <Link
                    href={`/profile/${user.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block mx-auto px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
                  >
                    Login
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 rounded-full bg-white text-blue-900 font-semibold shadow hover:bg-blue-800 hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </header>
  )
}