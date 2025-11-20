'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CommentSection({ postId, user }: any) {
  const supabase = createClient()
  const [comments, setComments] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('comments')
        .select('*, author:users(username)')
        .eq('post_id', postId)

      setComments(data || [])
    }
    load()
  }, [postId])

  async function submitComment(e: any) {
    e.preventDefault()
    if (!user) return alert('Login to comment')

    setLoading(true)
    const { data } = await supabase
      .from('comments')
      .insert({ post_id: postId, content: text, author_id: user.id })
      .select('*, author:users(username)')
      .single()

    setComments([...comments, data])
    setText('')
    setLoading(false)
  }

  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-xl shadow">
      <h3 className="font-bold text-black text-xl mb-4">💬 Comments</h3>

      {user ? (
        <form onSubmit={submitComment} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share something..."
            rows={3}
            className="w-full p-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <p className="text-gray-500">Login to join the discussion 👋</p>
      )}

      {/* Show Comments */}
      <div className="mt-6 space-y-4">
        {comments.length === 0 && <p className="text-gray-500">No comments yet</p>}
        {comments.map((c) => (
          <div key={c.id} className="bg-white shadow p-4 rounded-lg">
            <p className="font-semibold">{c.author?.username || 'User'}</p>
            <p className="text-gray-700">{c.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(c.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}