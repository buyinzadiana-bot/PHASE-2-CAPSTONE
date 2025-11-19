import Link from 'next/link'
import Image from 'next/image'

interface PostCardProps {
  post: any
}

export default function PostCard({ post }: PostCardProps) {
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200)

  return (
    <article className="border-b border-border pb-8 hover:bg-muted/30 p-4 rounded-lg transition">
      <Link href={`/posts/${post.slug}`} className="group">
        <div className="flex gap-6">
          {post.cover_image_url && (
            <div className="hidden md:block flex-shrink-0 w-24 h-24">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                width={96}
                height={96}
                className="object-cover rounded"
              />
            </div>
          )}

          <div className="flex-1">
            <h3 className="text-xl font-bold group-hover:text-primary transition mb-2">
              {post.title}
            </h3>

            <p className="text-muted-foreground mb-3 line-clamp-2">
              {post.excerpt || post.content.substring(0, 150)}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{readingTime} min read</span>
              <span>·</span>
              <span>
                {new Date(post.published_at || post.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
