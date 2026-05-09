import { queryOne, query } from '@/lib/db'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import { generateMeta, blogSchema } from '@/lib/seo'
import { Clock, User, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await queryOne('SELECT * FROM blog_posts WHERE slug=$1 AND is_published=true', [params.slug])
  if (!p) return {}
  return generateMeta({ title: p.meta_title || p.title,
    description: p.meta_description || p.excerpt || '',
    image: p.cover_image, url: `/blog/${p.slug}`, type: 'article' })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await queryOne(`
    SELECT bp.*,c.name as cat_name,c.slug as cat_slug
    FROM blog_posts bp LEFT JOIN categories c ON bp.category_id=c.id
    WHERE bp.slug=$1 AND bp.is_published=true`, [params.slug])
  if (!post) notFound()
  const related = await query(
    'SELECT * FROM products WHERE id=ANY($1::uuid[]) AND is_active=true LIMIT 4',
    [post.related_product_ids || []])

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema(post)) }} />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {post.cover_image && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time} min read</span>
          {post.cat_name && (
            <Link href={`/categories/${post.cat_slug}`}
              className="flex items-center gap-1 text-blue-500 hover:underline">
              <Tag size={14} /> {post.cat_name}
            </Link>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.excerpt && <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 border-l-4 border-brand-500 pl-4">{post.excerpt}</p>}
        <article className="prose dark:prose-invert prose-lg max-w-none">
          <MDXRemote source={post.content} />
        </article>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {post.tags.map((tag: string) => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </>
  )
}