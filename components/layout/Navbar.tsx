'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import Image from "next/image";

const navLinks = [
  { href: '/',                              label: 'Home' },
  { href: '/products?category=cozy-finds',  label: 'Cozy Finds' },
  { href: '/categories/home-kitchen',       label: 'Home & Kitchen' },
  { href: '/categories/beauty',    label: 'Beauty & Wellness' },
  { href: '/categories/electronics',        label: 'Electronics' },
  { href: '/categories/software-tools',     label: 'Software Tools' },
  { href: '/blog',                          label: 'Blog' },
  { href: '/about',                         label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [q, setQ] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { router.push(`/products?q=${encodeURIComponent(q.trim())}`); setShowSearch(false); setQ('') }
  }

  return (
      <header className={cn('sticky top-0 z-50 transition-all duration-300 border-b border-cozy-200/80',
          scrolled ? 'bg-cream/92 backdrop-blur-xl shadow-cozy' : 'bg-cream/95')}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-[4.5rem] flex items-center justify-between gap-4 py-2">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div>
                <Image
                    src="/logo.png"
                    alt="The Cozy Shelf Logo"
                    width={56}
                    height={56}
                    priority
                    className="object-contain"
                    unoptimized
                />
              </div>

              <div className="leading-none">
                <span className="font-serif font-bold text-cozy-900 text-lg block">The Cozy Shelf</span>
                <span className="text-sage-600 text-xs hidden sm:block uppercase tracking-[0.18em]">curated finds</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(l => (
                  <Link key={l.href} href={l.href}
                        className="px-3 py-2 text-xs font-semibold text-cozy-600 hover:text-bark rounded-full hover:bg-linen transition-all whitespace-nowrap">
                    {l.label}
                  </Link>
              ))}
            </nav>

            {/* Search + mobile toggle */}
            <div className="flex items-center gap-2">
              {showSearch ? (
                  <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input autoFocus value={q} onChange={e => setQ(e.target.value)}
                           placeholder="Search finds..."
                           className="input-cozy rounded-full px-4 py-2 w-44 transition-all" />
                    <button type="button" onClick={() => setShowSearch(false)} className="text-cozy-400 hover:text-bark">
                      <X size={16} />
                    </button>
                  </form>
              ) : (
                  <button onClick={() => setShowSearch(true)}
                          className="p-2 text-cozy-500 hover:text-bark hover:bg-linen rounded-full transition-all">
                    <Search size={18} />
                  </button>
              )}
              <button onClick={() => setOpen(!open)}
                      className="lg:hidden p-2 text-cozy-600 hover:bg-linen rounded-full transition-all">
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
            <div className="lg:hidden bg-cream border-t border-cozy-200 px-4 pb-5 animate-fade-in shadow-cozy">
              {navLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                        className="block py-3 text-sm font-semibold text-cozy-700 hover:text-bark border-b border-cozy-100 last:border-0 transition-colors">
                    {l.label}
                  </Link>
              ))}
            </div>
        )}
      </header>
  )
}
