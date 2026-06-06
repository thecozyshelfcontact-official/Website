'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2, Pencil, Check, X } from 'lucide-react'

const EMOJI_SUGGESTIONS = ['🌿','🏡','🕯️','☕','🛁','✨','💐','🍃','🧺','📚','🛋️','🌸','💻','🏠','💪']

const emptyForm = { name: '', icon: '🌿', description: '', image_url: '' }

export default function AdminCategories() {
  const [cats, setCats] = useState<any[]>([])
  const [form, setForm] = useState<any>({ ...emptyForm })
  const [editing, setEditing] = useState<string | null>(null)

  const load = async () => {
    const r = await fetch('/api/admin/categories')
    setCats(await r.json())
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name.trim()) { toast.error('Name is required'); return }
    const url = editing ? `/api/admin/categories/${editing}` : '/api/admin/categories'
    const res = await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      toast.success(editing ? 'Updated! 🌿' : 'Category added! 🌿')
      setForm({ ...emptyForm })
      setEditing(null)
      load()
    } else {
      toast.error('Slug already exists — try a different name')
    }
  }

  const startEdit = (c: any) => {
    setEditing(c.id)
    setForm({ name: c.name, icon: c.icon || '🌿', description: c.description || '', image_url: c.image_url || '' })
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm({ ...emptyForm })
  }

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? Products in this category will become uncategorized.`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted 🌿'); load() }
    else toast.error('Could not delete')
  }

  const L = 'block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-cozy-900">Categories</h1>
        <p className="text-cozy-500 text-sm mt-0.5">{cats.length} collections on the shelf</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Add / Edit form */}
        <div className="bg-cozy-50 rounded-3xl p-6 border border-cozy-200 space-y-4">
          <h2 className="font-serif font-bold text-cozy-900">
            {editing ? 'Edit Category' : 'Add Category'}
          </h2>
          <div>
            <label className={L}>Name *</label>
            <input className="input-cozy" value={form.name}
              onChange={e => setForm((p: any) => ({ ...p, name: e.target.value }))}
              placeholder="Home & Kitchen" />
          </div>
          <div>
            <label className={L}>Icon (emoji)</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {EMOJI_SUGGESTIONS.map(e => (
                <button key={e} onClick={() => setForm((p: any) => ({ ...p, icon: e }))}
                  className={`text-xl p-1.5 rounded-xl transition-all border
                  ${form.icon === e ? 'border-bark bg-cozy-100' : 'border-transparent hover:bg-cozy-100'}`}>
                  {e}
                </button>
              ))}
            </div>
            <input className="input-cozy" value={form.icon}
              onChange={e => setForm((p: any) => ({ ...p, icon: e.target.value }))}
              placeholder="Or type any emoji" />
          </div>
          <div>
            <label className={L}>Description</label>
            <textarea className="input-cozy" rows={2} value={form.description}
              onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))}
              placeholder="Short description shown on the categories page" />
          </div>
          <div>
            <label className={L}>Cover Image URL (optional)</label>
            <input className="input-cozy" value={form.image_url}
              onChange={e => setForm((p: any) => ({ ...p, image_url: e.target.value }))}
              placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="btn-primary flex-1">
              {editing ? 'Update Category 🌿' : 'Add Category 🌿'}
            </button>
            {editing && (
              <button onClick={cancelEdit}
                className="px-4 py-2.5 text-sm text-cozy-500 hover:text-bark rounded-2xl border border-cozy-200 hover:bg-cozy-50 transition-all">
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Existing categories */}
        <div className="bg-cream rounded-3xl border border-cozy-200 shadow-cozy overflow-hidden">
          <div className="px-6 py-4 border-b border-cozy-100">
            <h2 className="font-serif font-bold text-cozy-900">Existing Categories</h2>
          </div>
          {cats.length === 0 ? (
            <div className="px-6 py-12 text-center text-cozy-400 font-serif">No categories yet 🌿</div>
          ) : (
            <ul className="divide-y divide-cozy-50">
              {cats.map((c: any) => (
                <li key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-cozy-50 transition-colors group">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-cozy-800 text-sm">{c.name}</p>
                    <p className="text-xs text-cozy-400 font-mono">{c.slug}</p>
                    {c.description && <p className="text-xs text-cozy-500 truncate mt-0.5">{c.description}</p>}
                  </div>
                  <span className="text-xs text-cozy-400 shrink-0">{c.product_count || 0} finds</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(c)}
                      className="p-1.5 rounded-xl hover:bg-cozy-100 text-cozy-400 hover:text-bark transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => del(c.id, c.name)}
                      className="p-1.5 rounded-xl hover:bg-red-50 text-cozy-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
