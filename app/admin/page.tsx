import { query } from '@/lib/db'
import Link from 'next/link'
import { Package, FileText, Tag, MousePointerClick, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const [
    [{ count: products }],
    [{ count: posts }],
    [{ count: categories }],
    [{ count: clicks }],
    recentProducts,
    recentPosts,
  ] = await Promise.all([
    query('SELECT COUNT(*) FROM products'),
    query('SELECT COUNT(*) FROM blog_posts'),
    query('SELECT COUNT(*) FROM categories'),
    query('SELECT COUNT(*) FROM click_events'),
    query('SELECT title, slug, price, is_active FROM products ORDER BY created_at DESC LIMIT 5'),
    query('SELECT title, slug, is_published FROM blog_posts ORDER BY created_at DESC LIMIT 5'),
  ])

  const stats = [
    { label: 'Products',        value: products,   icon: Package,           color: 'bg-bark',      href: '/admin/products' },
    { label: 'Blog Posts',      value: posts,      icon: FileText,          color: 'bg-cozy-600',  href: '/admin/blog' },
    { label: 'Categories',      value: categories, icon: Tag,               color: 'bg-warm-600',  href: '/admin/categories' },
    { label: 'Affiliate Clicks',value: clicks,     icon: MousePointerClick, color: 'bg-cozy-700',  href: '#' },
  ]

  return (
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-cozy-900">Dashboard 🌿</h1>
          <p className="text-cozy-500 text-sm mt-1">Welcome back. Here's what's on the shelf.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
              <Link href={s.href} key={s.label}
                    className="bg-cream rounded-2xl p-5 border border-cozy-200 shadow-cozy hover:shadow-cozy-lg transition-all hover:-translate-y-0.5 group">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon size={18} className="text-cream" />
                </div>
                <div className="font-serif text-3xl font-bold text-cozy-900">
                  {Number(s.value).toLocaleString()}
                </div>
                <div className="text-sm text-cozy-500 mt-1 group-hover:text-bark transition-colors">{s.label}</div>
              </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/admin/products/new',  label: 'Add New Product',  emoji: '📦' },
            { href: '/admin/blog/new',      label: 'Write Blog Post',  emoji: '✍️' },
            { href: '/admin/categories',    label: 'Add Category',     emoji: '🏷️' },
          ].map(a => (
              <Link key={a.href} href={a.href}
                    className="flex items-center justify-between bg-cozy-50 hover:bg-cozy-100 border border-cozy-200
              rounded-2xl px-5 py-4 transition-all group">
            <span className="flex items-center gap-3 text-sm font-medium text-cozy-700 group-hover:text-bark">
              <span className="text-xl">{a.emoji}</span> {a.label}
            </span>
                <ArrowRight size={14} className="text-cozy-400 group-hover:text-bark transition-colors" />
              </Link>
          ))}
        </div>

        {/* Recent items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-cream rounded-3xl border border-cozy-200 shadow-cozy overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cozy-100">
              <h2 className="font-serif font-bold text-cozy-900">Recent Products</h2>
              <Link href="/admin/products" className="text-xs text-bark hover:underline">View all →</Link>
            </div>
            <ul className="divide-y divide-cozy-50">
              {(recentProducts as any[]).map(p => (
                  <li key={p.slug} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-cozy-800 truncate max-w-[180px]">{p.title}</p>
                      <p className="text-xs text-cozy-400">${p.price}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                  ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-cozy-100 text-cozy-500'}`}>
                  {p.is_active ? 'Active' : 'Draft'}
                </span>
                  </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="bg-cream rounded-3xl border border-cozy-200 shadow-cozy overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cozy-100">
              <h2 className="font-serif font-bold text-cozy-900">Recent Posts</h2>
              <Link href="/admin/blog" className="text-xs text-bark hover:underline">View all →</Link>
            </div>
            <ul className="divide-y divide-cozy-50">
              {(recentPosts as any[]).map(p => (
                  <li key={p.slug} className="flex items-center justify-between px-6 py-3">
                    <p className="text-sm font-medium text-cozy-800 truncate max-w-[220px]">{p.title}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                  ${p.is_published ? 'bg-green-100 text-green-700' : 'bg-cozy-100 text-cozy-500'}`}>
                  {p.is_published ? 'Published' : 'Draft'}
                </span>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
  )
}