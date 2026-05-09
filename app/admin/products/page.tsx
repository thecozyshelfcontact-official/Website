'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Search } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const load = async () => {
    const r = await fetch('/api/admin/products')
    setProducts(await r.json())
  }
  useEffect(() => { load() }, [])

  const del = async (id: string, title: string) => {
    if (!confirm(`Remove "${title}" from the shelf?`)) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    toast.success('Removed 🌿')
    load()
  }

  const filtered = products.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.cat_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-cozy-900">Products</h1>
            <p className="text-cozy-500 text-sm mt-0.5">{products.length} items on the shelf</p>
          </div>
          <Link href="/admin/products/new" className="btn-primary text-sm py-2.5 self-start sm:self-auto">
            <Plus size={15} /> Add Product
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cozy-400" />
          <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="input-cozy pl-9 py-2.5 text-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-cream rounded-3xl border border-cozy-200 shadow-cozy overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cozy-50 border-b border-cozy-100">
            <tr>
              {['Product', 'Category', 'Price', 'Rating', 'Badge', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-cozy-500 uppercase tracking-wide">
                    {h}
                  </th>
              ))}
            </tr>
            </thead>
            <tbody className="divide-y divide-cozy-50">
            {filtered.map((p: any) => (
                <tr key={p.id} className="hover:bg-cozy-50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-medium text-cozy-800 truncate max-w-[180px]">{p.title}</p>
                    <p className="text-xs text-cozy-400 font-mono truncate max-w-[180px]">{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-cozy-600">{p.cat_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="font-serif font-semibold text-cozy-800">${p.price}</span>
                    {p.original_price && (
                        <span className="text-xs text-cozy-300 line-through ml-1">${p.original_price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-cozy-600">
                  <span className="flex items-center gap-1">
                    <span className="text-warm-500">★</span> {p.rating}
                  </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.badge
                        ? <span className="bg-cozy-100 text-cozy-600 text-xs px-2.5 py-1 rounded-full">{p.badge}</span>
                        : <span className="text-cozy-300">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                    ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-cozy-100 text-cozy-500'}`}>
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded-xl hover:bg-cozy-100 text-cozy-500 hover:text-bark transition-colors">
                        <Pencil size={13} />
                      </Link>
                      <button onClick={() => del(p.id, p.title)}
                              className="p-1.5 rounded-xl hover:bg-red-50 text-cozy-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-cozy-400 font-serif">
                  No products found 🌿
                </td></tr>
            )}
            </tbody>
          </table>
        </div>
      </div>
  )
}