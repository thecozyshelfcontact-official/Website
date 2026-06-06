import { queryOne, query } from '@/lib/db'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Image from 'next/image'
import Link from 'next/link'
import { generateMeta, blogSchema } from '@/lib/seo'
import { Clock, Tag, User } from 'lucide-react'
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
  await query(
    'SELECT * FROM products WHERE id=ANY($1::uuid[]) AND is_active=true LIMIT 4',
    [post.related_product_ids || []])

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema(post)) }} />
      <div className="section-cozy">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="eyebrow mb-3">The Journal</p>
            <h1 className="editorial-title text-4xl md:text-5xl mb-5 text-balance">{post.title}</h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-cozy-500">
              <span className="flex items-center gap-1"><User size={14} /> {post.author}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {post.read_time} min read</span>
              {post.cat_name && (
                <Link href={`/categories/${post.cat_slug}`}
                  className="flex items-center gap-1 text-sage-700 hover:text-bark">
                  <Tag size={14} /> {post.cat_name}
                </Link>
              )}
            </div>
          </div>
          {post.cover_image && (
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-8 border border-cozy-200 shadow-cozy-lg">
              <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
            </div>
          )}
          {post.excerpt && <p className="text-xl text-cozy-600 leading-relaxed mb-8 border-l-4 border-sage-400 pl-5 bg-linen/70 py-4 pr-4 rounded-r-2xl">{post.excerpt}</p>}
          <div className="prose-cozy bg-brand-card border border-cozy-200 rounded-3xl p-6 md:p-10 shadow-cozy">
            <MDXRemote source={post.content} />
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8">
              {post.tags.map((tag: string) => (
                <span key={tag} className="bg-linen text-cozy-600 border border-cozy-200 text-xs px-3 py-1 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    </>
  )
}
