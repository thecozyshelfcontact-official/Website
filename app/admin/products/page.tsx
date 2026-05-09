'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Trash2, Plus, Star } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const load = async () => {
    const res = await fetch('/api/admin/products')
    setProducts(await res.json())
  }
  useEffect(() => { load() }, [])
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/admin/products/${id}`, { method:'DELETE' })
    toast.success('Deleted'); load()
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products ({products.length})</h1>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
          <Plus size={16} /> Add Product
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>{['Title','Category','Price','Rating','Status','Actions'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-medium text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3 text-gray-500">{p.cat_name || '—'}</td>
                <td className="px-4 py-3">${p.price}</td>
                <td className="px-4 py-3 flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{p.rating}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {p.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => del(p.id, p.title)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}