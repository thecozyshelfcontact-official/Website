'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { href:'/', label:'Home' },
  { href:'/products', label:'Products' },
  { href:'/categories', label:'Categories' },
  { href:'/blog', label:'Blog' },
  { href:'/about', label:'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0">
          <Zap size={22} className="text-orange-500" />
          <span>DealRadar</span>
        </Link>
        <div className="hidden md:flex flex-1 max-w-md"><SearchBar /></div>
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20">
              {l.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 pb-4">
          <div className="pt-3 pb-2"><SearchBar /></div>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}