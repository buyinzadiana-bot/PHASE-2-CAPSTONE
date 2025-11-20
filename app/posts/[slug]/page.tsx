// import { getPosts } from '../../../lib/posts'
// import { getPostBySlug } from '../../../lib/posts'
// import { notFound } from 'next/navigation'
// import Header from '@/components/header'
// import PostDetail from '@/components/post-detail'

import Header from "@/components/header";
import PostDetail from "@/components/post-detail";
import { getPostBySlug } from "@/lib/posts";
import { notFound } from "next/navigation";

// export async function generateStaticParams() {
//   const posts = await getPosts(100, 0)
//   return posts.map((post) => ({
//     slug: post.slug,
//   }))
// }

// export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
//   const { slug } = await params; // ⬅ FIXED

//   const post = await getPostBySlug(slug);

//   if (!post) {
//     notFound();
//   }

//   return (
//     <main className="bg-white min-h-screen">
//       <div className="fixed top-0 left-0 w-full z-50">
//         <Header />
//       </div>
//       <div className="max-w-4xl mx-auto pt-32 px-6 pb-12 space-y-8">
//         <PostDetail post={post} />
//       </div>
//     </main>
//   );
// }

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ⬅ FIXED

  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <div className="max-w-4xl mx-auto pt-32 px-6 pb-12 space-y-8">
        <PostDetail post={post} />
      </div>
    </main>
  );
}
