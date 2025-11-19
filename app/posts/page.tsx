import { getPosts } from '../../lib/posts'
import { notFound } from 'next/navigation'
import Header from '@/components/header'
import PostDetail from '../../components/post-detail'

export async function generateStaticParams() {
  const posts = await getPosts(100, 0)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  
  let post
 
  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <PostDetail post={post} />
    </main>
  )
}
