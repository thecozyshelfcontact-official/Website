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
  const itemClass = (active: boolean) =>
    `w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'bg-bark text-cream font-semibold shadow-cozy' : 'hover:bg-linen text-cozy-600 hover:text-bark'}`

  return (
    <div className="bg-brand-card rounded-3xl p-5 border border-cozy-200 shadow-cozy space-y-6">
      <div>
        <h3 className="font-serif font-bold text-cozy-900 mb-3">Refine the Shelf</h3>
        <select className="input-cozy py-2.5"
          value={sort || ''} onChange={e => navigate({ category: selected || '', sort: e.target.value, q: q || '' })}>
          <option value="">Newest Finds</option>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div>
        <h3 className="eyebrow mb-3">Collections</h3>
        <div className="space-y-1.5">
          <button onClick={() => navigate({ category:'', sort:sort||'', q:q||'' })}
            className={itemClass(!selected)}>
            All Categories
          </button>
          {categories.map((c: any) => (
            <button key={c.id} onClick={() => navigate({ category:c.slug, sort:sort||'', q:q||'' })}
              className={itemClass(selected===c.slug)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
