import { query } from '@/lib/db'
import BlogCard from '@/components/blog/BlogCard'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
  title: 'The Journal - Tips, Reviews & Guides',
  description: 'Cozy lifestyle stories, product guides, and thoughtful recommendations from The Cozy Shelf.',
})

export default async function BlogPage() {
  const posts = await query(`
    SELECT bp.*,c.name as cat_name,c.slug as cat_slug
    FROM blog_posts bp LEFT JOIN categories c ON bp.category_id=c.id
    WHERE bp.is_published=true ORDER BY bp.published_at DESC`)
  const [featured, ...rest] = posts
  return (
    <div className="section-cozy">
      <div className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-3">The Journal</p>
          <h1 className="editorial-title text-4xl md:text-5xl mb-4">Cozy Corner</h1>
          <p className="editorial-copy text-lg">Buying guides, home notes, and small rituals for building a warmer everyday life.</p>
        </div>
        {featured && (
          <div className="mb-8">
            <BlogCard post={featured} featured />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post: any) => <BlogCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  )
}
