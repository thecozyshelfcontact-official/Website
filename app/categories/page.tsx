import { query } from '@/lib/db'
import Link from 'next/link'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
  title: 'Browse Categories', description: 'Explore products by category.',
})

export default async function CategoriesPage() {
  const cats = await query(`SELECT c.*,COUNT(p.id) as product_count FROM categories c
    LEFT JOIN products p ON p.category_id=c.id AND p.is_active=true
    WHERE c.is_active=true GROUP BY c.id ORDER BY c.name`)
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cats.map((cat: any) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800 hover:border-orange-300 hover:shadow-lg transition-all duration-200 group">
            <div className="text-4xl mb-3">{cat.icon || '📦'}</div>
            <h2 className="font-semibold group-hover:text-orange-500 transition-colors">{cat.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{cat.product_count} products</p>
          </Link>
        ))}
      </div>
    </div>
  )
}