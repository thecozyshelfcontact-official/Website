'use client'
import { useRouter, usePathname } from 'next/navigation'
export default function ProductFilters({ categories, selected, sort, q }: any) {
  const router = useRouter()
  const path = usePathname()
  const navigate = (params: Record<string,string>) => {
    const sp = new URLSearchParams()
    if (params.category) sp.set('category', params.category)
    if (params.sort) sp.set('sort', params.sort)
    if (params.q) sp.set('q', params.q)
    router.push(`${path}?${sp.toString()}`)
  }
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 space-y-5">
      <div>
        <h3 className="font-semibold text-sm mb-3">Sort By</h3>
        <select className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={sort || ''} onChange={e => navigate({ category: selected || '', sort: e.target.value, q: q || '' })}>
          <option value="">Newest</option>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-3">Categories</h3>
        <div className="space-y-1">
          <button onClick={() => navigate({ category:'', sort:sort||'', q:q||'' })}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selected ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
            All Categories
          </button>
          {categories.map((c: any) => (
            <button key={c.id} onClick={() => navigate({ category:c.slug, sort:sort||'', q:q||'' })}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selected===c.slug ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}