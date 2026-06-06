import { query } from '@/lib/db'
import ProductGrid from '@/components/products/ProductGrid'
import ProductFilters from '@/components/products/ProductFilters'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
  title: 'All Finds', description: 'Browse cozy home, lifestyle, kitchen, beauty, and everyday finds from The Cozy Shelf.',
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
    <div className="section-cozy">
      <div className="section-shell">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-3">The Shop Edit</p>
          <h1 className="editorial-title text-4xl md:text-5xl mb-4">All Cozy Finds</h1>
          <p className="editorial-copy text-lg">
            A curated shelf of warm home pieces, clever everyday upgrades, and lifestyle favorites chosen for comfort, beauty, and usefulness.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
          <aside className="w-full md:w-72 shrink-0">
            <ProductFilters categories={categories} selected={category} sort={sort} q={q} />
          </aside>
          <div className="flex-1">
            <ProductGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  )
}
