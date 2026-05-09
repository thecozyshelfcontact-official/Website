// ─── components/home/CategoryGrid.tsx ──────────────────────────────────────
import Link from 'next/link'
export function CategoryGrid({ categories }: { categories: any[] }) {
    if (!categories.length) return null
    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <p className="text-cozy-400 text-xs uppercase tracking-widest mb-2">Browse by</p>
                <h2 className="font-serif text-3xl font-bold text-cozy-900">Our Collections</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {categories.map((cat: any) => (
                    <Link key={cat.id} href={`/categories/${cat.slug}`}
                          className="group bg-cozy-50 hover:bg-cozy-100 rounded-3xl p-5 text-center
              border border-cozy-200 hover:border-cozy-300 transition-all duration-300 hover:-translate-y-1">
                        <div className="text-3xl mb-3 group-hover:animate-float">{cat.icon || '🌿'}</div>
                        <h3 className="font-serif font-semibold text-cozy-800 text-sm group-hover:text-bark transition-colors leading-tight">
                            {cat.name}
                        </h3>
                        <p className="text-xs text-cozy-400 mt-1">{cat.product_count} finds</p>
                    </Link>
                ))}
            </div>
        </section>
    )
}
export default CategoryGrid

