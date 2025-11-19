import { getUserById, getFollowerCount, getFollowingCount } from '../../../lib/users'
import { getPosts } from '../../../lib/posts'
import Header from '@/components/header'
import ProfileHeader from '@/components/profile-header'
import PostCard from '@/components/post-card'
import { notFound } from 'next/navigation'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let user, posts, followerCount, followingCount

  try {
    [user, posts, followerCount, followingCount] = await Promise.all([
      getUserById(id),
      getPosts(10, 0),
      getFollowerCount(id),
      getFollowingCount(id),
    ])
  } catch (error) {
    notFound()
  }

  if (!user) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <ProfileHeader
        user={user}
        followerCount={followerCount}
        followingCount={followingCount}
      />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Articles</h2>

        {posts && posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No articles published yet</p>
          </div>
        )}
      </div>
    </main>
  )
}
