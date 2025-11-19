'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateUserProfileAction } from '../../../lib/users-action'
import Header from '@/components/header'
import Image from 'next/image'

export default function EditProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    async function loadProfile() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push('/login')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (userData) {
        setUser(userData)
        setFullName(userData.full_name || '')
        setBio(userData.bio || '')
        setAvatarUrl(userData.avatar_url || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) throw new Error('Not authenticated')

      await updateUserProfileAction(authUser.id, {
        full_name: fullName,
        bio: bio,
        avatar_url: avatarUrl,
      })

      alert('Profile updated successfully!')
      router.push(`/profile/${authUser.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          Loading...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>

        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/avatar.jpg"
            />
            {avatarUrl && (
              <div className="mt-4">
                <Image
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar preview"
                  width={96}
                  height={96}
                  className="rounded-full"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tell us about yourself..."
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {bio.length}/500
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-border rounded-lg font-medium hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
