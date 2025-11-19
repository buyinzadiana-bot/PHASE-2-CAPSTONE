import { createClient } from '@/lib/supabase/server'

export async function getPosts(limit = 10, offset = 0) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      published_at,
      users:author_id (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })


  if (error) {
    console.error('❌ Error fetching posts:', error)
    return []
  }

  return data
}
