'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Pencil, ExternalLink, Star, BarChart2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const NETWORKS = ['', 'Amazon Associates', 'ShareASale', 'CJ Affiliate', 'Rakuten', 'Impact', 'PartnerStack', 'Direct']

const empty = {
  product_id: '', label: '', url: '', network: '',
  commission_rate: '', is_primary: false, is_active: true,
}

export default function AdminAffiliateLinks() {
  const [products, setProducts] = useState<any[]>([])
  const [links, setLinks] = useState<any[]>([])
  const [filterProduct, setFilterProduct] = useState('')
  const [form, setForm] = useState<any>({ ...empty })
  const [editing, setEditing] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadLinks = async (productId = filterProduct) => {
    const url = productId
      ? `/api/admin/affiliate-links?product_id=${productId}`
      : '/api/admin/affiliate-links'
    const r = await fetch(url)
    setLinks(await r.json())
  }

  useEffect(() => {
    fetch('/api/admin/products').then(r => r.json()).then(setProducts)
    loadLinks()
  }, [])

  useEffect(() => { loadLinks(filterProduct) }, [filterProduct])

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const openAdd = () => {
    setEditing(null)
    setForm({ ...empty, product_id: filterProduct })
    setShowForm(true)
  }

  const openEdit = (link: any) => {
    setEditing(link.id)
    setForm({
      product_id: link.product_id, label: link.label, url: link.url,
      network: link.network || '', commission_rate: link.commission_rate || '',
      is_primary: link.is_primary, is_active: link.is_active,
    })
    setShowForm(true)
  }

  const save = async () => {
    if (!form.product_id) { toast.error('Select a product'); return }
    if (!form.label || !form.url) { toast.error('Label and URL are required'); return }
    setLoading(true)
    const url = editing ? `/api/admin/affiliate-links/${editing}` : '/api/admin/affiliate-links'
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      toast.success(editing ? 'Link updated 🌿' : 'Link added 🌿')
      setShowForm(false)
      setEditing(null)
      loadLinks()
    } else {
      toast.error('Something went wrong')
    }
  }

  const del = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return
    await fetch(`/api/admin/affiliate-links/${id}`, { method: 'DELETE' })
    toast.success('Removed 🌿')
    loadLinks()
  }

  const S = 'bg-cozy-50 rounded-3xl p-6 border border-cozy-200 space-y-4'
  const L = 'block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5'

  const totalClicks = links.reduce((s, l) => s + (Number(l.click_count) || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-cozy-900">Affiliate Links</h1>
          <p className="text-cozy-500 text-sm mt-0.5">
            {links.length} links · {totalClicks} total clicks
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary text-sm py-2.5 self-start sm:self-auto">
          <Plus size={15} /> Add Link
        </button>
      </div>

      {/* Filter */}
      <div className="max-w-sm">
        <label className={L}>Filter by Product</label>
        <select
          className="input-cozy"
          value={filterProduct}
          onChange={e => setFilterProduct(e.target.value)}
        >
          <option value="">All products</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className={S}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-cozy-900 text-lg">
              {editing ? 'Edit Link' : 'Add Affiliate Link'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-cozy-400 hover:text-bark transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={L}>Product *</label>
              <select className="input-cozy" value={form.product_id} onChange={e => set('product_id', e.target.value)}>
                <option value="">Select product</option>
                {products.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={L}>Button Label *</label>
              <input className="input-cozy" value={form.label} onChange={e => set('label', e.target.value)}
                placeholder="Buy on Amazon" />
            </div>
            <div>
              <label className={L}>Network</label>
              <select className="input-cozy" value={form.network} onChange={e => set('network', e.target.value)}>
                {NETWORKS.map(n => <option key={n} value={n}>{n || '— None —'}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={L}>Affiliate URL *</label>
              <input className="input-cozy font-mono text-xs" value={form.url}
                onChange={e => set('url', e.target.value)}
                placeholder="https://amzn.to/your-affiliate-link" />
            </div>
            <div>
              <label className={L}>Commission Rate</label>
              <input className="input-cozy" value={form.commission_rate}
                onChange={e => set('commission_rate', e.target.value)} placeholder="3%" />
            </div>
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            {[
              ['is_primary', 'Primary CTA (shown first)'],
              ['is_active', 'Active (visible on site)'],
            ].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                  ${(form as any)[k] ? 'bg-bark border-bark' : 'border-cozy-300 bg-cream'}`}
                  onClick={() => set(k, !(form as any)[k])}>
                  {(form as any)[k] && <span className="text-cream text-xs font-bold">✓</span>}
                </div>
                <span className="text-sm font-medium text-cozy-700 group-hover:text-bark transition-colors">{l}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={save} disabled={loading} className="btn-primary px-6 py-2.5">
              {loading ? 'Saving...' : editing ? 'Update Link 🌿' : 'Add Link 🌿'}
            </button>
            <button onClick={() => setShowForm(false)}
              className="text-sm text-cozy-500 hover:text-bark transition-colors px-4">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Links table */}
      <div className="bg-cream rounded-3xl border border-cozy-200 shadow-cozy overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cozy-50 border-b border-cozy-100">
            <tr>
              {['Product', 'Label / Network', 'URL', 'Commission', 'Clicks', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-cozy-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cozy-50">
            {links.map((l: any) => {
              const product = products.find(p => p.id === l.product_id)
              return (
                <tr key={l.id} className="hover:bg-cozy-50 transition-colors group">
                  <td className="px-4 py-3">
                    <p className="font-medium text-cozy-800 truncate max-w-[160px]">
                      {product?.title || l.product_title || '—'}
                    </p>
                    {l.is_primary && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                        <Star size={10} fill="currentColor" /> Primary
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-cozy-800">{l.label}</p>
                    {l.network && <p className="text-xs text-cozy-400">{l.network}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <a href={l.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sage-700 hover:text-bark hover:underline text-xs font-mono truncate max-w-[180px]">
                      {l.url.replace(/^https?:\/\//, '').slice(0, 30)}…
                      <ExternalLink size={10} />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-cozy-600 text-xs">
                    {l.commission_rate || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-cozy-600">
                      <BarChart2 size={12} /> {Number(l.click_count) || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                      ${l.is_active ? 'bg-green-100 text-green-700' : 'bg-cozy-100 text-cozy-500'}`}>
                      {l.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(l)}
                        className="p-1.5 rounded-xl hover:bg-cozy-100 text-cozy-500 hover:text-bark transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => del(l.id, l.label)}
                        className="p-1.5 rounded-xl hover:bg-red-50 text-cozy-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {links.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-cozy-400 font-serif">
                No affiliate links yet. Add one above 🌿
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
