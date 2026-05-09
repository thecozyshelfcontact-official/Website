import BlogCard from '@/components/blog/BlogCard'
import Link from 'next/link'
export default function LatestBlogPosts({ posts }: { posts: any[] }) {
  if (!posts.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">📖 Latest Reviews & Guides</h2>
        <Link href="/blog" className="text-orange-500 hover:underline text-sm font-medium">View all →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((p: any) => <BlogCard key={p.id} post={p} />)}
      </div>
    </section>
  )
}