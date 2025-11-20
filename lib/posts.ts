// import { createClient } from '../lib/supabase/server'
// import { prisma } from './prisma'

// export async function getPosts(limit = 10, offset = 0) {
//   const supabase = await createClient()
//   const { data, error } = await supabase
//     .from('posts')
//     .select(`
//       id,
//       title,
//       slug,
//       excerpt,
//       content,
//       published_at,
//       users:author_id (
//         id,
//         full_name,
//         avatar_url
//       )
//     `)
//     .eq('status', 'published')
//     .order('published_at', { ascending: false })


//   if (error) {
//     console.error('❌ Error fetching posts:', error)
//     return []
//   }

//   return data
// }

// export async function getPostBySlug(slug: string) {
//   const posts = await getPosts(1000, 0); // Fetch enough posts to find one
//   return posts.find((post) => post.slug === slug) || null;
// }

import { supabaseAdmin } from './supabase/server-admin';

export async function getPosts(limit = 100, offset = 0) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .range(offset, offset + limit - 1)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getPostBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data;
}
import { prisma } from './prisma';

export async function getPostsByAuthor(userId: string, limit = 10, offset = 0) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    take: limit,
    skip: offset,
    orderBy: { publishedAt: 'desc' },
  });
  return posts;
}
