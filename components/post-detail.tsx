'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import Link from 'next/link'
import LikeSection from './LikeSection'
import CommentSection from './CommentSection'

interface PostDetailProps {
  post: any
}

export default function PostDetail({ post }: PostDetailProps) {
  const [clapCount, setClapCount] = useState(0)
  const [hasClapped, setHasClapped] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>('')

  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)

  useEffect(() => {
    const supabase = createClient()

    async function initialize() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Fetch clap count
      const { count } = await supabase
        .from('claps')
        .select('*', { count: 'exact' })
        .eq('post_id', post.id)

      setClapCount(count || 0)

      // Check if user has clapped
      if (user) {
        const { data } = await supabase
          .from('claps')
          .select('*')
          .eq('post_id', post.id)
          .eq('user_id', user.id)

        setHasClapped(data && data.length > 0)
      }

      // Fetch comments
      const { data: commentsData } = await supabase
        .from('comments')
        .select('*, author:users(*)')
        .eq('post_id', post.id)
        .is('parent_comment_id', null)

      setComments(commentsData || [])
    }

    initialize()
  }, [post.id])

  async function handleClap() {
    if (!user) {
      alert('Please sign in to clap')
      return
    }

    const supabase = createClient()

    if (hasClapped) {
      await supabase
        .from('claps')
        .delete()
        .eq('post_id', post.id)
        .eq('user_id', user.id)

      setClapCount(clapCount - 1)
      setHasClapped(false)
    } else {
      await supabase.from('claps').insert([
        {
          post_id: post.id,
          user_id: user.id,
        },
      ])

      setClapCount(clapCount + 1)
      setHasClapped(true)
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !commentText.trim()) return

    setLoading(true)

    try {
      const supabase = createClient()

      const { data } = await supabase
        .from('comments')
        .insert([
          {
            post_id: post.id,
            author_id: user.id,
            content: commentText,
          },
        ])
        .select('*, author:users(*)')

      if (data) {
        setComments([...comments, data[0]])
        setCommentText('')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <article className="max-w-2xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl text-black font-bold mb-4 text-pretty">{post.title}</h1>

        {post.author && (
          <div className="flex items-center bg-black gap-4 mb-6">
            {post.author.avatar_url && (
              <Image
                src={post.author.avatar_url || "/placeholder.svg"}
                alt={post.author.full_name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-semibold">
                {post.author.full_name || post.author.username}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.published_at || post.created_at).toLocaleDateString()} · {readingTime} min read
              </p>
            </div>
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tagObj: any) => (
              <Link
                key={tagObj.tag.id}
                href={`/tags/${tagObj.tag.slug}`}
                className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-primary hover:text-primary-foreground transition"
              >
                {tagObj.tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="mb-8">
          <Image
            src={post.cover_image_url || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={400}
            className="w-full rounded-lg object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none mb-12 text-black">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Actions */}
      <div className="flex gap-4 py-6 border-y border-border mb-8">
        <button
          onClick={handleClap}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            hasClapped
              ? 'bg-primary text-primary-foreground'
              : 'border border-border hover:bg-muted'
          }`}
        >
          👏 Clap ({clapCount})
        </button>

        {post.author && (
          <Link
            href={`/profile/${post.author.id}`}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
          >
            Follow Author
          </Link>
        )}
      </div>
      <LikeSection postId={post.id} userId={user?.id || null} />

<CommentSection postId={post.id} user={user} />

      {/* Comments */}
      <div className="space-y-6">
        <h3 className="text-xl  text-black font-bold">Comments</h3>

        {user && (
          <form onSubmit={handleComment} className="space-y-4">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="text-black w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className="bg-primary text-black text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Post Comment
            </button>
          </form>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border border-border rounded-lg p-4">
                {comment.author && (
                  <p className="font-semibold text-sm mb-2">
                    {comment.author.full_name || comment.author.username}
                  </p>
                )}
                <p className="text-muted-foreground mb-2">{comment.content}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-black text-muted-foreground text-center py-8">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </article>
  )
}
