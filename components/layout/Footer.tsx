import Link from 'next/link'
import { Zap } from 'lucide-react'
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <Zap size={20} className="text-orange-500" /> DealRadar
            </Link>
            <p className="text-sm text-gray-500">Honest reviews and best deals, curated for you.</p>
          </div>
          {[
            { title:'Explore', links:[{href:'/products',l:'Products'},{href:'/categories',l:'Categories'},{href:'/blog',l:'Blog'}] },
            { title:'Company', links:[{href:'/about',l:'About'},{href:'/contact',l:'Contact'}] },
            { title:'Legal', links:[{href:'/privacy-policy',l:'Privacy Policy'},{href:'/affiliate-disclosure',l:'Disclosure'}] },
          ].map(col => (
            <div key={col.title}>
              <h3 className="font-semibold text-sm mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.href}><Link href={l.href} className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{l.l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} DealRadar. We may earn commissions from links. <Link href="/affiliate-disclosure" className="underline hover:text-gray-600">Disclosure</Link>
        </div>
      </div>
    </footer>
  )
}