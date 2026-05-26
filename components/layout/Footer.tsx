import Link from 'next/link'
import { Instagram, Youtube } from 'lucide-react'

const cols = [
  { title: 'Explore', links: [
      { href:'/products',                    l:'All Finds' },
      { href:'/categories',                  l:'Categories' },
      { href:'/products?category=cozy-finds',       l:'Cozy Picks' },
      { href:'/categories/home-kitchen',     l:'Home & Kitchen' },
    ]},
  { title: 'Journal', links: [
      { href:'/blog', l:'All Posts' },
      { href:'/blog?cat=cozy-living',  l:'Cozy Living' },
      { href:'/blog?cat=home-decor',   l:'Home Decor' },
      { href:'/blog?cat=wellness',     l:'Wellness' },
    ]},
  { title: 'Company', links: [
      { href:'/about',                 l:'About Us' },
      //{ href:'/contact',               l:'Contact' },
      { href:'/privacy-policy',        l:'Privacy Policy' },
      { href:'/affiliate-disclosure',  l:'Disclosure' },
    ]},
]

export default function Footer() {
  return (
      <footer className="bg-cozy-900 text-cozy-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🌿</span>
                <span className="font-serif font-bold text-cozy-100 text-lg">The Cozy Shelf</span>
              </div>
              <p className="text-sm text-cozy-400 leading-relaxed mb-5">
                Curated finds for a warm, beautiful, and intentional life.
              </p>
              <div className="flex gap-3">
                <a href="https://www.instagram.com/the_cozy_shelf_official" aria-label="Instagram"
                   className="w-9 h-9 bg-cozy-800 hover:bg-cozy-700 rounded-xl flex items-center justify-center transition-colors">
                  <Instagram size={15} className="text-cozy-300" />
                </a>
                <a href="https://m.youtube.com/@the_cozy_shelf_official" aria-label="YouTube"
                   className="w-9 h-9 bg-cozy-800 hover:bg-cozy-700 rounded-xl flex items-center justify-center transition-colors">
                  <Youtube size={15} className="text-cozy-300" />
                </a>
                <a href="https://in.pinterest.com/the_cozy_shelf_official/" aria-label="Pinterest"
                   className="w-9 h-9 bg-cozy-800 hover:bg-red-600 rounded-xl flex items-center justify-center transition-colors">
                  <span className="text-xs font-bold text-cozy-300">P</span>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {cols.map(col => (
                <div key={col.title}>
                  <h3 className="font-serif font-semibold text-cozy-100 mb-4">{col.title}</h3>
                  <ul className="space-y-2.5">
                    {col.links.map(l => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-sm text-cozy-400 hover:text-cozy-200 transition-colors">{l.l}</Link>
                        </li>
                    ))}
                  </ul>
                </div>
            ))}
          </div>

          <div className="border-t border-cozy-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-cozy-500">© {new Date().getFullYear()} The Cozy Shelf. Made with warmth 🌿</p>
            <p className="text-xs text-cozy-500">
              We may earn commissions ·{' '}
              <Link href="/affiliate-disclosure" className="underline hover:text-cozy-300 transition-colors">Disclosure</Link>
            </p>
          </div>
        </div>
      </footer>
  )
}