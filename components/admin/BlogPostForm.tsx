// ─── components/admin/BlogPostForm.tsx ─────────────────────────────────────
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { slugify } from '@/lib/utils'

export default function BlogPostForm({ post }: { post?: any }) {
    const router = useRouter()
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title:            post?.title            || '',
        slug:             post?.slug             || '',
        excerpt:          post?.excerpt          || '',
        content:          post?.content          || '',
        cover_image:      post?.cover_image      || '',
        author:           post?.author           || 'The Cozy Shelf',
        category_id:      post?.category_id      || '',
        tags:             (post?.tags || []).join(', '),
        is_published:     post?.is_published     || false,
        is_featured:      post?.is_featured      || false,
        meta_title:       post?.meta_title       || '',
        meta_description: post?.meta_description || '',
    })

    useEffect(() => {
        fetch('/api/admin/categories').then(r => r.json()).then(setCategories)
    }, [])

    const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }))

    const submit = async () => {
        if (!form.title || !form.content) { toast.error('Title and content are required'); return }
        setLoading(true)
        const payload = {
            ...form,
            slug: form.slug || slugify(form.title),
            tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
        }
        const url = post ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
        const res = await fetch(url, {
            method: post ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        setLoading(false)
        if (res.ok) {
            toast.success(post ? 'Updated! 🌿' : 'Published! 🌿')
            router.push('/admin/blog')
        } else {
            toast.error('Something went wrong')
        }
    }

    const S = 'bg-cozy-50 rounded-3xl p-6 border border-cozy-200 space-y-4'
    const L = 'block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5'

    return (
        <div className="max-w-3xl space-y-5 pb-10">

            {/* Post Details */}
            <div className={S}>
                <h2 className="font-serif font-bold text-cozy-900 text-lg">Post Details</h2>
                <div>
                    <label className={L}>Title *</label>
                    <input className="input-cozy" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Post title" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className={L}>Slug (auto if empty)</label>
                        <input className="input-cozy font-mono text-xs" value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="post-slug" />
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
                        <label className={L}>Author</label>
                        <input className="input-cozy" value={form.author} onChange={e => set('author', e.target.value)} />
                    </div>
                    <div>
                        <label className={L}>Tags (comma separated)</label>
                        <input className="input-cozy" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="cozy living, home decor" />
                    </div>
                </div>
                <div>
                    <label className={L}>Cover Image URL</label>
                    <input className="input-cozy" value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="https://images.unsplash.com/..." />
                    {form.cover_image && (
                        <img src={form.cover_image} alt="Preview" className="mt-2 rounded-2xl h-32 w-full object-cover border border-cozy-200" />
                    )}
                </div>
                <div>
                    <label className={L}>Excerpt</label>
                    <textarea className="input-cozy" rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="A short teaser shown on blog cards..." />
                </div>
            </div>

            {/* Content */}
            <div className={S}>
                <div className="flex items-center justify-between">
                    <h2 className="font-serif font-bold text-cozy-900 text-lg">Content (Markdown) *</h2>
                    <span className="text-xs text-cozy-400">{form.content.split(/\s+/).filter(Boolean).length} words</span>
                </div>
                <textarea
                    className="input-cozy font-mono text-xs leading-relaxed"
                    rows={18}
                    value={form.content}
                    onChange={e => set('content', e.target.value)}
                    placeholder={`## Introduction\n\nWrite your post in Markdown...\n\n### Section Title\n\nYour content here.`}
                />
            </div>

            {/* SEO */}
            <div className={S}>
                <h2 className="font-serif font-bold text-cozy-900 text-lg">SEO</h2>
                <div>
                    <label className={L}>Meta Title</label>
                    <input className="input-cozy" value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="Defaults to post title" />
                </div>
                <div>
                    <label className={L}>Meta Description</label>
                    <textarea className="input-cozy" rows={2} value={form.meta_description} onChange={e => set('meta_description', e.target.value)} placeholder="150–160 characters" />
                    <p className="text-xs text-cozy-400 mt-1">{form.meta_description.length} / 160 chars</p>
                </div>
            </div>

            {/* Publish */}
            <div className={S}>
                <h2 className="font-serif font-bold text-cozy-900 text-lg">Publish Settings</h2>
                <div className="flex flex-wrap gap-6">
                    {[['is_published', 'Publish (make live)'], ['is_featured', 'Feature on homepage']].map(([k, l]) => (
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

            <div className="flex items-center gap-4">
                <button onClick={submit} disabled={loading} className="btn-primary px-8 py-3.5">
                    {loading ? 'Saving...' : post ? 'Update Post 🌿' : 'Publish Post 🌿'}
                </button>
                <button onClick={() => router.push('/admin/blog')} className="text-sm text-cozy-500 hover:text-bark transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    )
}

