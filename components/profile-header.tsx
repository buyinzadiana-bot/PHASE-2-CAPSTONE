'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { followUser, unfollowUser } from '../lib/users'
import Image from 'next/image'
import Link from 'next/link'

interface ProfileHeaderProps {
  user: any
  followerCount: number
  followingCount: number
}

export default function ProfileHeader({
  user,
  followerCount,
  followingCount,
}: ProfileHeaderProps) {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function initialize() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      setCurrentUser(authUser)

      if (authUser && authUser.id !== user.id) {
        const { data } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', authUser.id)
          .eq('following_id', user.id)
          .single()

        setIsFollowing(!!data)
      }
    }

    initialize()
  }, [user.id])

  async function handleFollowToggle() {
  if (!currentUser) {
    alert('Please sign in to follow')
    return
  }

  setLoading(true)

  try {
    const url = isFollowing ? '/api/unfollow' : '/api/follow'

    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        followerId: currentUser.id,
        followingId: user.id,
      })
    })

    setIsFollowing(!isFollowing)
  } catch (err) {
    console.error('Error:', err)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-start gap-6">
          {user.avatar_url && (
            <Image
              src={user.avatar_url || "/placeholder.svg"}
              alt={user.full_name}
              width={120}
              height={120}
              className="rounded-full"
            />
          )}

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {user.full_name || user.username}
            </h1>
            <p className="text-muted-foreground mb-4 max-w-lg">
              {user.bio || 'No bio yet'}
            </p>

            <div className="flex items-center gap-6 mb-6">
              <div>
                <p className="font-semibold">{followerCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div>
                <p className="font-semibold">{followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            <div className="flex gap-4">
              {currentUser && currentUser.id === user.id ? (
                <Link
                  href="/settings/profile"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
                >
                  Edit Profile
                </Link>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    isFollowing
                      ? 'bg-muted text-foreground hover:bg-border'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  } disabled:opacity-50`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
