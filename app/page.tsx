import { getPosts } from '../lib/posts'
import PostCard from '@/components/post-card'
import Header from '@/components/header'
import Link from 'next/link'

export const metadata = {
  title: 'TechInsights - AI, Data & Infrastructure',
  description: 'Explore insights on AI, data infrastructure, and tech innovation',
}

export default async function HomePage() {
  let posts : any[] = []
  try {
    posts = await getPosts(10, 0)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  }

  return (
  <main className="min-h-screen bg-white">
    <Header />

    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Hero Section */}
      <div className="mb-20 text-center">
        <h1 className="text-6xl font-extrabold mb-6 text-gray-900">
          Insights on AI, Data & Tech Innovation
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Discover deep dives on artificial intelligence, data infrastructure,
          and the leaders shaping the future of technology.
        </p>

        <Link
          href="/editor"
          className="bg-blue-900 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-800 transition shadow-lg"
        >
          ✍️ Write a Post
        </Link>
      </div>

      {/* Featured Tags */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold mb-5 text-gray-900">Popular Topics</h2>
        <div className="flex flex-wrap gap-3">
          {['AI', 'Data', 'Infrastructure', 'Founders', 'Startups', 'Cloud'].map(
            (tag) => (
              <Link
                key={tag}
                href={'/tags/'}
                className="px-4 py-2 rounded-full text-sm font-medium text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white transition cursor-pointer"
              >
                {tag}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Posts Feed */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Latest Posts</h2>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <div key={post.id} className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg hover:scale-[1.02] transition transform">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 text-lg">
            <p>No posts yet. Start writing!</p>
          </div>
        )}
      </div>
    </div>
  </main>
)}