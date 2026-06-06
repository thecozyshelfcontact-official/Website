'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Trash2, Star, ExternalLink } from 'lucide-react'

const BADGES = ['', 'Cozy Pick', 'Trending', 'Best Seller', "Editor's Choice", 'New Arrival']
const NETWORKS = ['', 'Amazon Associates', 'ShareASale', 'CJ Affiliate', 'Rakuten', 'Impact', 'PartnerStack', 'Direct']

const emptyLink = { label: '', url: '', network: '', commission_rate: '', is_primary: false, is_active: true }

export default function ProductForm({ product }: { product?: any }) {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [affiliateLinks, setAffiliateLinks] = useState<any[]>([])
  const [linkForm, setLinkForm] = useState<any>({ ...emptyLink })
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [showLinkForm, setShowLinkForm] = useState(false)

  const [form, setForm] = useState({
    title:             product?.title             || '',
    slug:              product?.slug              || '',
    short_description: product?.short_description || '',
    full_description:  product?.full_description  || '',
    category_id:       product?.category_id       || '',
    price:             product?.price             || '',
    original_price:    product?.original_price    || '',
    rating:            product?.rating            || 0,
    review_count:      product?.review_count      || 0,
    pros:              (product?.pros    || []).join('\n'),
    cons:              (product?.cons    || []).join('\n'),
    features:          (product?.features|| []).join('\n'),
    tags:              (product?.tags    || []).join(', '),
    badge:             product?.badge             || '',
    is_featured:       product?.is_featured       || false,
    is_trending:       product?.is_trending       || false,
    is_active:         product?.is_active         ?? true,
    meta_title:        product?.meta_title        || '',
    meta_description:  product?.meta_description  || '',
    images:            product?.images            || [],
  })

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
    if (product?.id) {
      fetch(`/api/admin/affiliate-links?product_id=${product.id}`)
        .then(r => r.json()).then(setAffiliateLinks)
    }
  }, [product?.id])

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))
  const setLF = (k: string, v: any) => setLinkForm((p: any) => ({ ...p, [k]: v }))

  const submit = async () => {
    if (!form.title || !form.price) { toast.error('Title and price are required'); return }
    setLoading(true)
    const payload = {
      ...form,
      pros:     form.pros.split('\n').filter(Boolean),
      cons:     form.cons.split('\n').filter(Boolean),
      features: form.features.split('\n').filter(Boolean),
      tags:     form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      price:          parseFloat(form.price),
      original_price: parseFloat(form.original_price) || null,
    }
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
    const res = await fetch(url, {
      method: product ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    if (res.ok) {
      toast.success(product ? 'Updated! 🌿' : 'Added to the shelf! 🌿')
      router.push('/admin/products')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error || 'Something went wrong')
    }
  }

  const saveLink = async () => {
    if (!linkForm.label || !linkForm.url) { toast.error('Label and URL required'); return }
    if (!product?.id) { toast.error('Save the product first before adding links'); return }
    const url = editingLink
      ? `/api/admin/affiliate-links/${editingLink}`
      : '/api/admin/affiliate-links'
    const res = await fetch(url, {
      method: editingLink ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...linkForm, product_id: product.id }),
    })
    if (res.ok) {
      toast.success(editingLink ? 'Link updated 🌿' : 'Link added 🌿')
      setLinkForm({ ...emptyLink })
      setEditingLink(null)
      setShowLinkForm(false)
      fetch(`/api/admin/affiliate-links?product_id=${product.id}`)
        .then(r => r.json()).then(setAffiliateLinks)
    } else {
      toast.error('Failed to save link')
    }
  }

  const deleteLink = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return
    await fetch(`/api/admin/affiliate-links/${id}`, { method: 'DELETE' })
    toast.success('Link removed 🌿')
    setAffiliateLinks(prev => prev.filter(l => l.id !== id))
  }

  const startEditLink = (link: any) => {
    setEditingLink(link.id)
    setLinkForm({
      label: link.label, url: link.url, network: link.network || '',
      commission_rate: link.commission_rate || '',
      is_primary: link.is_primary, is_active: link.is_active,
    })
    setShowLinkForm(true)
  }

  const S = 'bg-cozy-50 rounded-3xl p-6 border border-cozy-200 space-y-4'
  const L = 'block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5'

  return (
    <div className="max-w-4xl space-y-5 pb-10">

      {/* Basic Info */}
      <div className={S}>
        <h2 className="font-serif font-bold text-cozy-900 text-lg">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={L}>Title *</label>
            <input className="input-cozy" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Product name" />
          </div>
          <div>
            <label className={L}>Slug (auto if empty)</label>
            <input className="input-cozy font-mono text-xs" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="product-slug" />
          </div>
          <div>
            <label className={L}>Category</label>
            <select className="input-cozy" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={L}>Price *</label>
            <input className="input-cozy" type="number" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="29.99" />
          </div>
          <div>
            <label className={L}>Original Price (for discount)</label>
            <input className="input-cozy" type="number" step="0.01" value={form.original_price} onChange={e => set('original_price', e.target.value)} placeholder="49.99" />
          </div>
          <div>
            <label className={L}>Rating (0–5)</label>
            <input className="input-cozy" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={e => set('rating', e.target.value)} />
          </div>
          <div>
            <label className={L}>Review Count</label>
            <input className="input-cozy" type="number" value={form.review_count} onChange={e => set('review_count', e.target.value)} />
          </div>
          <div>
            <label className={L}>Badge</label>
            <select className="input-cozy" value={form.badge} onChange={e => set('badge', e.target.value)}>
              {BADGES.map(b => <option key={b} value={b}>{b || '— None —'}</option>)}
            </select>
          </div>
          <div>
            <label className={L}>Tags (comma separated)</label>
            <input className="input-cozy" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="cozy home, kitchen, wellness" />
          </div>
        </div>
        <div>
          <label className={L}>Short Description</label>
          <textarea className="input-cozy" rows={2} value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="One or two sentences shown on cards" />
        </div>
        <div>
          <label className={L}>Full Description (Markdown)</label>
          <textarea className="input-cozy font-mono text-xs" rows={7} value={form.full_description} onChange={e => set('full_description', e.target.value)} placeholder={"## About this product\nWrite in Markdown..."} />
        </div>
      </div>

      {/* Pros / Cons / Features */}
      <div className={S}>
        <h2 className="font-serif font-bold text-cozy-900 text-lg">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            ['pros',     'What We Love (one per line)'],
            ['cons',     'Worth Noting (one per line)'],
            ['features', 'Key Features (one per line)'],
          ] as [string, string][]).map(([k, l]) => (
            <div key={k}>
              <label className={L}>{l}</label>
              <textarea className="input-cozy" rows={6}
                value={(form as any)[k]}
                onChange={e => set(k, e.target.value)}
                placeholder={`Item 1\nItem 2\nItem 3`} />
            </div>
          ))}
        </div>
      </div>

      {/* Image URLs */}
      <div className={S}>
        <h2 className="font-serif font-bold text-cozy-900 text-lg">Images</h2>
        <p className="text-xs text-cozy-500">Enter Cloudinary or Unsplash URLs, one per line</p>
        <textarea className="input-cozy font-mono text-xs" rows={4}
          value={(form.images as any[]).map((i: any) => i.url).join('\n')}
          onChange={e => {
            const urls = e.target.value.split('\n').filter(Boolean)
            set('images', urls.map(url => ({ url, alt: form.title })))
          }}
          placeholder="https://res.cloudinary.com/your-cloud/image/upload/v1/product.jpg" />
      </div>

      {/* Affiliate Links (only shown when editing an existing product) */}
      {product?.id && (
        <div className={S}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-cozy-900 text-lg">Affiliate Links</h2>
            <button onClick={() => { setEditingLink(null); setLinkForm({ ...emptyLink }); setShowLinkForm(s => !s) }}
              className="btn-outline text-xs py-1.5 px-3">
              <Plus size={13} /> Add Link
            </button>
          </div>

          {showLinkForm && (
            <div className="bg-cream rounded-2xl p-4 border border-cozy-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={L}>Button Label *</label>
                  <input className="input-cozy" value={linkForm.label}
                    onChange={e => setLF('label', e.target.value)} placeholder="Buy on Amazon" />
                </div>
                <div>
                  <label className={L}>Network</label>
                  <select className="input-cozy" value={linkForm.network} onChange={e => setLF('network', e.target.value)}>
                    {NETWORKS.map(n => <option key={n} value={n}>{n || '— None —'}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={L}>URL *</label>
                  <input className="input-cozy font-mono text-xs" value={linkForm.url}
                    onChange={e => setLF('url', e.target.value)}
                    placeholder="https://amzn.to/your-link" />
                </div>
                <div>
                  <label className={L}>Commission Rate</label>
                  <input className="input-cozy" value={linkForm.commission_rate}
                    onChange={e => setLF('commission_rate', e.target.value)} placeholder="3%" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {[['is_primary', 'Primary CTA'], ['is_active', 'Active']].map(([k, l]) => (
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                      ${(linkForm as any)[k] ? 'bg-bark border-bark' : 'border-cozy-300'}`}
                      onClick={() => setLF(k, !(linkForm as any)[k])}>
                      {(linkForm as any)[k] && <span className="text-cream text-xs font-bold">✓</span>}
                    </div>
                    <span className="text-sm text-cozy-700">{l}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={saveLink} className="btn-primary text-xs py-2 px-4">
                  {editingLink ? 'Update' : 'Add'} Link 🌿
                </button>
                <button onClick={() => { setShowLinkForm(false); setEditingLink(null) }}
                  className="text-xs text-cozy-500 hover:text-bark px-3">Cancel</button>
              </div>
            </div>
          )}

          {affiliateLinks.length === 0 ? (
            <p className="text-sm text-cozy-400 font-serif py-2">No affiliate links yet. Add one above.</p>
          ) : (
            <ul className="space-y-2">
              {affiliateLinks.map((link: any) => (
                <li key={link.id}
                  className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3 border border-cozy-100 group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-cozy-800">{link.label}</span>
                      {link.is_primary && (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                          <Star size={9} fill="currentColor" /> Primary
                        </span>
                      )}
                      {!link.is_active && (
                        <span className="text-xs text-cozy-400 bg-cozy-100 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {link.network && <span className="text-xs text-cozy-400">{link.network}</span>}
                      {link.commission_rate && <span className="text-xs text-green-600">{link.commission_rate}</span>}
                      <span className="text-xs text-cozy-400">{Number(link.click_count) || 0} clicks</span>
                    </div>
                  </div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-sage-600 hover:text-bark">
                    <ExternalLink size={13} />
                  </a>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditLink(link)}
                      className="p-1 rounded-lg hover:bg-cozy-100 text-cozy-400 hover:text-bark transition-colors text-xs">
                      Edit
                    </button>
                    <button onClick={() => deleteLink(link.id, link.label)}
                      className="p-1 rounded-lg hover:bg-red-50 text-cozy-300 hover:text-red-500 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-cozy-400">
            You can also manage all links globally from the <a href="/admin/affiliate-links" className="underline hover:text-bark">Affiliate Links</a> page.
          </p>
        </div>
      )}

      {!product?.id && (
        <div className="bg-sage-50 border border-sage-200 rounded-2xl px-5 py-3 text-sm text-sage-700">
          💡 Save this product first, then add affiliate links from the edit page.
        </div>
      )}

      {/* SEO */}
      <div className={S}>
        <h2 className="font-serif font-bold text-cozy-900 text-lg">SEO</h2>
        <div>
          <label className={L}>Meta Title</label>
          <input className="input-cozy" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="Defaults to product title" />
        </div>
        <div>
          <label className={L}>Meta Description</label>
          <textarea className="input-cozy" rows={2} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} placeholder="150–160 characters for best SEO" />
          <p className="text-xs text-cozy-400 mt-1">{form.meta_description.length} / 160 chars</p>
        </div>
      </div>

      {/* Visibility */}
      <div className={S}>
        <h2 className="font-serif font-bold text-cozy-900 text-lg">Visibility</h2>
        <div className="flex flex-wrap gap-6">
          {([
            ['is_active',   'Active (visible on site)'],
            ['is_featured', "Editor's Pick"],
            ['is_trending', 'Trending'],
          ] as [string, string][]).map(([k, l]) => (
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
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button onClick={submit} disabled={loading} className="btn-primary px-8 py-3.5">
          {loading ? 'Saving...' : product ? 'Update Product 🌿' : 'Add to Shelf 🌿'}
        </button>
        <button onClick={() => router.push('/admin/products')}
          className="text-sm text-cozy-500 hover:text-bark transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}
