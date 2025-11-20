'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LikeSection({ postId, userId }: { postId: string, userId: string | null }) {
  const supabase = createClient()
  const [likeCount, setLikeCount] = useState(0)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    async function loadLikes() {
      const { count } = await supabase
        .from('claps')
        .select('*', { count: 'exact' })
        .eq('post_id', postId)

      setLikeCount(count || 0)

      if (userId) {
        const { data } = await supabase
          .from('claps')
          .select()
          .eq('post_id', postId)
          .eq('user_id', userId)

        setLiked(data && data.length > 0)
      }
    }

    loadLikes()
  }, [postId, userId])

  async function toggleLike() {
    if (!userId) return alert('Please login ❤️')

    if (liked) {
      await supabase.from('claps').delete().eq('post_id', postId).eq('user_id', userId)
      setLikeCount(likeCount - 1)
      setLiked(false)
    } else {
      await supabase.from('claps').insert({ post_id: postId, user_id: userId })
      setLikeCount(likeCount + 1)
      setLiked(true)
    }
  }

  return (
    <button
      onClick={toggleLike}
      className={`px-5 py-2 rounded-full text-lg font-semibold transition ${
        liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-red-500 hover:text-white'
      }`}
    >
      ❤️ {likeCount}
    </button>
  )
}