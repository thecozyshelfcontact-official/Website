'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: product?.title || '', slug: product?.slug || '',
    short_description: product?.short_description || '',
    full_description: product?.full_description || '',
    category_id: product?.category_id || '',
    price: product?.price || '', original_price: product?.original_price || '',
    rating: product?.rating || 0, review_count: product?.review_count || 0,
    pros: (product?.pros || []).join('\n'), cons: (product?.cons || []).join('\n'),
    features: (product?.features || []).join('\n'),
    tags: (product?.tags || []).join(', '),
    is_featured: product?.is_featured || false, is_trending: product?.is_trending || false,
    is_active: product?.is_active ?? true,
    meta_title: product?.meta_title || '', meta_description: product?.meta_description || '',
    images: product?.images || [],
  })

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
  }, [])

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

  const submit = async () => {
    setLoading(true)
    const payload = {
      ...form,
      pros: form.pros.split('\n').filter(Boolean),
      cons: form.cons.split('\n').filter(Boolean),
      features: form.features.split('\n').filter(Boolean),
      tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      price: parseFloat(form.price), original_price: parseFloat(form.original_price) || null,
    }
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const res = await fetch(url, { method: product ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setLoading(false)
    if (res.ok) { toast.success(product ? 'Updated!' : 'Created!'); router.push('/admin/products') }
    else toast.error('Something went wrong')
  }

  const inp = "w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
  const lbl = "block text-sm font-medium mb-1"
  const section = "bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4"

  return (
    <div className="max-w-4xl space-y-6">
      <div className={section}>
        <h2 className="font-bold text-lg">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lbl}>Title *</label><input className={inp} value={form.title} onChange={e => set('title', e.target.value)} /></div>
          <div><label className={lbl}>Slug</label><input className={inp} value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated" /></div>
          <div><label className={lbl}>Price *</label><input className={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} /></div>
          <div><label className={lbl}>Original Price</label><input className={inp} type="number" value={form.original_price} onChange={e => set('original_price', e.target.value)} /></div>
          <div><label className={lbl}>Rating (0–5)</label><input className={inp} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} /></div>
          <div><label className={lbl}>Review Count</label><input className={inp} type="number" value={form.review_count} onChange={e => set('review_count', e.target.value)} /></div>
          <div><label className={lbl}>Category</label>
            <select className={inp} value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><label className={lbl}>Tags (comma-separated)</label><input className={inp} value={form.tags} onChange={e => set('tags', e.target.value)} /></div>
        </div>
        <div><label className={lbl}>Short Description</label><textarea className={inp} rows={2} value={form.short_description} onChange={e => set('short_description', e.target.value)} /></div>
        <div><label className={lbl}>Full Description (Markdown)</label><textarea className={inp} rows={6} value={form.full_description} onChange={e => set('full_description', e.target.value)} /></div>
      </div>
      <div className={section}>
        <h2 className="font-bold text-lg">Pros, Cons & Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[['pros','Pros (one per line)'],['cons','Cons (one per line)'],['features','Features (one per line)']].map(([k,l]) => (
            <div key={k}><label className={lbl}>{l}</label>
              <textarea className={inp} rows={5} value={(form as any)[k]} onChange={e => set(k, e.target.value)} /></div>
          ))}
        </div>
      </div>
      <div className={section}>
        <h2 className="font-bold text-lg">SEO</h2>
        <div><label className={lbl}>Meta Title</label><input className={inp} value={form.meta_title} onChange={e => set('meta_title', e.target.value)} /></div>
        <div><label className={lbl}>Meta Description</label><textarea className={inp} rows={2} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} /></div>
      </div>
      <div className={section}>
        <h2 className="font-bold text-lg">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          {[['is_active','Active'],['is_featured','Featured'],['is_trending','Trending']].map(([k,l]) => (
            <label key={k} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={(form as any)[k]} onChange={e => set(k, e.target.checked)}
                className="w-4 h-4 accent-orange-500" />
              <span className="text-sm font-medium">{l}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={submit} disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl transition-colors">
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </div>
  )
}