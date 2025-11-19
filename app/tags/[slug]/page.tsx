import { createClient } from '@/lib/supabase/server'
import Header from '@/components/header'
import PostCard from '@/components/post-card'
import { notFound } from 'next/navigation'

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  const supabase = await createClient()

  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()

  if (tagError || !tag) {
    notFound()
  }

  const { data: postTags } = await supabase
    .from('post_tags')
    .select('post:posts(*, author:users(id, username, avatar_url, full_name))')
    .eq('tag_id', tag.id)

  const posts = postTags?.map((pt: any) => pt.post) || []

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{tag.name}</h1>
          {tag.description && (
            <p className="text-lg text-muted-foreground">{tag.description}</p>
          )}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No posts with this tag yet</p>
          </div>
        )}
      </div>
    </main>
  )
}
