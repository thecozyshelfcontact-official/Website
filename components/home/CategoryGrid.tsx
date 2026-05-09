import Link from 'next/link'
export default function CategoryGrid({ categories }: { categories: any[] }) {
  if (!categories.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map((cat: any) => (
          <Link key={cat.id} href={`/categories/${cat.slug}`}
            className="flex flex-col items-center gap-2 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:border-orange-300 hover:shadow-md transition-all text-center group">
            <span className="text-3xl">{cat.icon || '📦'}</span>
            <span className="text-xs font-medium group-hover:text-orange-500 transition-colors line-clamp-2">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}