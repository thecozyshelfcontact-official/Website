'use client'
import { useState } from 'react'
import { ExternalLink, ShoppingCart, Zap } from 'lucide-react'
export default function AffiliateCTA({ links, productId }: { links: any[]; productId: string }) {
  const [loading, setLoading] = useState<string|null>(null)
  const handleClick = async (link: any) => {
    setLoading(link.id)
    fetch('/api/track-click', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ affiliate_link_id:link.id, product_id:productId, referer:document.referrer })
    }).catch(()=>{})
    await new Promise(r => setTimeout(r, 250))
    window.open(link.url, '_blank', 'noopener,noreferrer')
    setLoading(null)
  }
  if (!links.length) return null
  const primary = links.find(l => l.is_primary) || links[0]
  const secondary = links.filter(l => l.id !== primary?.id)
  return (
    <div className="space-y-3">
      <button onClick={() => handleClick(primary)} disabled={loading === primary.id}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl text-lg transition-all shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900 disabled:opacity-70">
        <ShoppingCart size={20} />
        {loading === primary.id ? 'Redirecting...' : primary.label}
        <ExternalLink size={16} />
      </button>
      {secondary.map((link: any) => (
        <button key={link.id} onClick={() => handleClick(link)} disabled={loading === link.id}
          className="w-full flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950 transition-all disabled:opacity-70">
          <Zap size={16} /> {loading === link.id ? 'Redirecting...' : link.label}
        </button>
      ))}
      <p className="text-xs text-center text-gray-400">We may earn a commission · <a href="/affiliate-disclosure" className="underline hover:text-gray-600">Disclosure</a></p>
    </div>
  )
}