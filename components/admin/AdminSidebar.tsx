'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FileText, Tag, LogOut, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const nav = [
  { href:'/admin', label:'Dashboard', icon:LayoutDashboard },
  { href:'/admin/products', label:'Products', icon:Package },
  { href:'/admin/blog', label:'Blog Posts', icon:FileText },
  { href:'/admin/categories', label:'Categories', icon:Tag },
]

export default function AdminSidebar() {
  const path = usePathname()
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/admin/logout', { method:'POST' })
    toast.success('Logged out'); router.push('/admin/login')
  }
  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Zap size={22} className="text-orange-500" /> DealRadar
        </Link>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {nav.map(item => (
          <Link key={item.href} href={item.href}
            className={cn('flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
              path === item.href ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800')}>
            <item.icon size={18} /> {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  )
}