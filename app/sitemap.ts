import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('slug, updated_at, published_at')
    .eq('status', 'published')

  const { data: tags } = await supabase
    .from('tags')
    .select('slug, created_at')

  const postEntries = posts?.map((post) => ({
    url: `https://techinsights.vercel.app/posts/${post.slug}`,
    lastModified: new Date(post.updated_at || post.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []

  const tagEntries = tags?.map((tag) => ({
    url: `https://techinsights.vercel.app/tags/${tag.slug}`,
    lastModified: new Date(tag.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  })) || []

  return [
    {
      url: 'https://techinsights.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postEntries,
    ...tagEntries,
  ]
}
