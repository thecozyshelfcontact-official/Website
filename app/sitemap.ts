import { query } from '@/lib/db'
import { MetadataRoute } from 'next'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const [products, posts, cats] = await Promise.all([
    query('SELECT slug,updated_at FROM products WHERE is_active=true'),
    query('SELECT slug,updated_at FROM blog_posts WHERE is_published=true'),
    query('SELECT slug FROM categories WHERE is_active=true'),
  ])
  const statics = ['','/about','/contact','/blog','/products','/categories','/privacy-policy','/affiliate-disclosure']
    .map(p => ({ url: `${base}${p}`, changeFrequency:'monthly' as const, priority:0.7 }))
  return [
    ...statics,
    ...products.map((p:any) => ({ url:`${base}/products/${p.slug}`, lastModified:new Date(p.updated_at), changeFrequency:'weekly' as const, priority:0.9 })),
    ...posts.map((p:any) => ({ url:`${base}/blog/${p.slug}`, lastModified:new Date(p.updated_at), changeFrequency:'weekly' as const, priority:0.8 })),
    ...cats.map((c:any) => ({ url:`${base}/categories/${c.slug}`, changeFrequency:'weekly' as const, priority:0.6 })),
  ]
}