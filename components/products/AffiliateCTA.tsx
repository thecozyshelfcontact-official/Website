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
    <div className="space-y-3 rounded-3xl border border-cozy-200 bg-linen/70 p-4 shadow-cozy">
      <button onClick={() => handleClick(primary)} disabled={loading === primary.id}
        className="w-full flex items-center justify-center gap-2 bg-bark hover:bg-cozy-800 text-cream font-bold py-4 px-6 rounded-2xl text-lg transition-all shadow-cozy-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
        <ShoppingCart size={20} />
        {loading === primary.id ? 'Redirecting...' : primary.label}
        <ExternalLink size={16} />
      </button>
      {secondary.map((link: any) => (
        <button key={link.id} onClick={() => handleClick(link)} disabled={loading === link.id}
          className="w-full flex items-center justify-center gap-2 border border-cozy-300 text-bark font-semibold py-3 px-6 rounded-2xl hover:bg-cream hover:border-cozy-400 transition-all disabled:opacity-70">
          <Zap size={16} /> {loading === link.id ? 'Redirecting...' : link.label}
        </button>
      ))}
      <p className="text-xs text-center text-cozy-500">We may earn a commission. <a href="/affiliate-disclosure" className="underline underline-offset-4 hover:text-bark">Disclosure</a></p>
    </div>
  )
}
