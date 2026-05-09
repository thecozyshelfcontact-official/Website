'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FileText, Tag, LogOut, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const nav = [
    { href: '/admin',            label: 'Dashboard',  icon: LayoutDashboard },
    { href: '/admin/products',   label: 'Products',   icon: Package },
    { href: '/admin/blog',       label: 'Blog Posts', icon: FileText },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
]

export default function AdminSidebar() {
    const path = usePathname()
    const router = useRouter()

    const logout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' })
        toast.success('Goodbye! 🌿')
        router.push('/admin/login')
    }

    return (
        <aside className="w-60 min-h-screen bg-cream border-r border-cozy-100 flex flex-col shadow-cozy">
            {/* Brand */}
            <div className="p-6 border-b border-cozy-100">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-2xl">🌿</span>
                    <div className="leading-none">
                        <span className="font-serif font-bold text-cozy-900 text-base block">The Cozy Shelf</span>
                        <span className="text-cozy-400 text-xs">Admin Panel</span>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {nav.map(item => (
                    <Link key={item.href} href={item.href}
                          className={cn(
                              'flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
                              path === item.href
                                  ? 'bg-cozy-100 text-bark shadow-cozy'
                                  : 'text-cozy-600 hover:bg-cozy-50 hover:text-bark'
                          )}>
                        <item.icon size={16} />
                        {item.label}
                    </Link>
                ))}

                <div className="pt-4 border-t border-cozy-100 mt-4">
                    <Link href="/" target="_blank"
                          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-cozy-500 hover:bg-cozy-50 hover:text-bark transition-all">
                        <ExternalLink size={16} /> View Site
                    </Link>
                </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-cozy-100">
                <button onClick={logout}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium
            text-cozy-500 hover:bg-red-50 hover:text-red-500 transition-all w-full">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </aside>
    )
}