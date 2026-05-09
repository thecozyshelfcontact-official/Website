import { query } from '@/lib/db'
import BlogCard from '@/components/blog/BlogCard'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
  title: 'Blog — Tips, Reviews & Guides',
  description: 'Expert product reviews, buying guides, and money-saving tips.',
})

export default async function BlogPage() {
  const posts = await query(`
    SELECT bp.*,c.name as cat_name,c.slug as cat_slug
    FROM blog_posts bp LEFT JOIN categories c ON bp.category_id=c.id
    WHERE bp.is_published=true ORDER BY bp.published_at DESC`)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Reviews, guides, and deals to help you shop smarter.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => <BlogCard key={post.id} post={post} />)}
      </div>
    </div>
  )
}