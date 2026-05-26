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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{cat.name}</h1>
          {cat.description && <p className="text-gray-500 mt-1">{cat.description}</p>}
        </div>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}