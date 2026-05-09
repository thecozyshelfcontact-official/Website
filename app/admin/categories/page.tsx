'use client'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'

const EMOJI_SUGGESTIONS = ['🌿','🏡','🕯️','☕','🛁','✨','💐','🍃','🧺','📚','🛋️','🌸']

export default function AdminCategories() {
    const [cats, setCats] = useState<any[]>([])
    const [form, setForm] = useState({ name: '', icon: '🌿', description: '', image_url: '' })

    const load = async () => {
        const r = await fetch('/api/admin/categories')
        setCats(await r.json())
    }
    useEffect(() => { load() }, [])

    const add = async () => {
        if (!form.name.trim()) { toast.error('Name is required'); return }
        const res = await fetch('/api/admin/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        })
        if (res.ok) {
            toast.success('Category added! 🌿')
            setForm({ name: '', icon: '🌿', description: '', image_url: '' })
            load()
        } else {
            toast.error('Slug already exists — try a different name')
        }
    }

    const L = 'block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5'

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl font-bold text-cozy-900">Categories</h1>
                <p className="text-cozy-500 text-sm mt-0.5">{cats.length} collections on the shelf</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

                {/* Add form */}
                <div className="bg-cozy-50 rounded-3xl p-6 border border-cozy-200 space-y-4">
                    <h2 className="font-serif font-bold text-cozy-900">Add Category</h2>
                    <div>
                        <label className={L}>Name *</label>
                        <input className="input-cozy" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Home & Kitchen" />
                    </div>
                    <div>
                        <label className={L}>Icon (emoji)</label>
                        <div className="flex gap-2 flex-wrap mb-2">
                            {EMOJI_SUGGESTIONS.map(e => (
                                <button key={e} onClick={() => setForm(p => ({ ...p, icon: e }))}
                                        className={`text-xl p-1.5 rounded-xl transition-all border
                    ${form.icon === e ? 'border-bark bg-cozy-100' : 'border-transparent hover:bg-cozy-100'}`}>
                                    {e}
                                </button>
                            ))}
                        </div>
                        <input className="input-cozy" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} placeholder="Or type any emoji" />
                    </div>
                    <div>
                        <label className={L}>Description</label>
                        <textarea className="input-cozy" rows={2} value={form.description}
                                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                  placeholder="Short description shown on the categories page" />
                    </div>
                    <div>
                        <label className={L}>Cover Image URL (optional)</label>
                        <input className="input-cozy" value={form.image_url}
                               onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                               placeholder="https://images.unsplash.com/..." />
                    </div>
                    <button onClick={add} className="btn-primary w-full">Add Category 🌿</button>
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
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}