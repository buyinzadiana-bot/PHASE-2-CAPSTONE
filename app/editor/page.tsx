'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Header from '../../components/header'

export default function EditorPage() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  useEffect(() => {
    if (title) setSlug(generateSlug(title))
  }, [title])

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  async function handlePublish() {
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')
      if (!title || !content) throw new Error('Title and content are required')

      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            author_id: user.id,
            title,
            slug,
            excerpt: excerpt || content.substring(0, 150),
            content,
            status: 'published',
            published_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (postError) throw postError

      if (tags.length > 0 && post) {
        const { data: tagRecords } = await supabase
          .from('tags')
          .select('id')
          .in('name', tags)

        if (tagRecords && tagRecords.length > 0) {
          await supabase.from('post_tags').insert(
            tagRecords.map((tag) => ({
              post_id: post.id,
              tag_id: tag.id,
            }))
          )
        }
      }

      router.push(`/posts`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveDraft() {
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')
      if (!title || !content) throw new Error('Title and content are required')

      await supabase.from('posts').insert([
        {
          author_id: user.id,
          title,
          slug,
          excerpt: excerpt || content.substring(0, 150),
          content,
          status: 'draft',
        },
      ])

      alert('Draft saved!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header fixed at top */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto pt-32 px-6 pb-12 space-y-8">
        {/* Page Title */}
        <h1 className="text-4xl font-extrabold text-blue-900 mb-6">
          Create New Post
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
            {error}
          </div>
        )}

        {/* Input Card */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl text-black font-bold border-b-2 border-gray-200 focus:border-blue-700 outline-none py-2 transition"
              placeholder="Your post title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none transition"
              placeholder="post-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none transition"
              placeholder="Brief summary of your post..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none font-mono text-sm transition"
              placeholder="Write your content here..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-blue-900 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(idx)}
                    className="hover:opacity-70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-700 outline-none transition"
              placeholder="Add tags (press Enter)..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePublish}
              disabled={loading}
              className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition"
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex-1 border border-blue-900 text-blue-900 py-3 rounded-lg font-semibold shadow hover:bg-blue-900 hover:text-white transition"
            >
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
