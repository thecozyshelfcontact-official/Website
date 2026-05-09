import { query } from '@/lib/db'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
  title: 'All Products', description: 'Browse all top-rated products and best deals.',
})

export default async function ProductsPage({
  searchParams
}: { searchParams: { category?: string; sort?: string; q?: string } }) {
  const { category, sort, q } = searchParams
  let sql = `SELECT p.*,c.name as cat_name,c.slug as cat_slug
    FROM products p LEFT JOIN categories c ON p.category_id=c.id
    WHERE p.is_active=true`
  const params: any[] = []
  if (category) { params.push(category); sql += ` AND c.slug=$${params.length}` }
  if (q) { params.push(`%${q}%`); sql += ` AND (p.title ILIKE $${params.length} OR p.short_description ILIKE $${params.length})` }
  sql += sort === 'price_asc' ? ' ORDER BY p.price ASC'
       : sort === 'price_desc' ? ' ORDER BY p.price DESC'
       : sort === 'rating' ? ' ORDER BY p.rating DESC'
       : ' ORDER BY p.created_at DESC'
  const [products, categories] = await Promise.all([
    query(sql, params),
    query('SELECT * FROM categories WHERE is_active=true ORDER BY name')
  ])
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilters categories={categories} selected={category} sort={sort} q={q} />
        </aside>
        <div className="flex-1">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  )
}