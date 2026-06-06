import { query, queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import ProductGrid from '@/components/products/ProductGrid'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = await queryOne('SELECT * FROM categories WHERE slug=$1', [params.slug])
  if (!cat) return {}
  return generateMeta({ title: cat.name, description: cat.description || '', url: `/categories/${cat.slug}` })
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = await queryOne('SELECT * FROM categories WHERE slug=$1 AND is_active=true', [params.slug])
  if (!cat) notFound()
  const products = await query(`SELECT p.*,c.name as cat_name,c.slug as cat_slug
    FROM products p LEFT JOIN categories c ON p.category_id=c.id
    WHERE p.category_id=$1 AND p.is_active=true ORDER BY p.rating DESC`, [cat.id])
  return (
    <div className="section-cozy">
      <div className="section-shell">
        <div className="rounded-3xl bg-linen border border-cozy-200 p-8 md:p-10 shadow-cozy mb-8">
          <p className="eyebrow mb-3">Collection</p>
          <h1 className="editorial-title text-4xl md:text-5xl mb-3">{cat.name}</h1>
          {cat.description && <p className="editorial-copy text-lg max-w-3xl">{cat.description}</p>}
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
