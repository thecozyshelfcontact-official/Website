'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQSection({ items }: { items: {q:string;a:string}[] }) {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="eyebrow mb-2">Good to Know</p>
        <h2 className="editorial-title text-2xl md:text-3xl">Frequently Asked Questions</h2>
      </div>
      <div className="space-y-3">
        {items.map((item,i) => (
          <div key={i} className="bg-brand-card rounded-2xl border border-cozy-200 overflow-hidden shadow-cozy">
            <button onClick={() => setOpen(open===i?null:i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-sm text-cozy-900 hover:bg-linen transition-colors">
              {item.q}
              <ChevronDown size={16} className={`text-bark transition-transform ${open===i?'rotate-180':''}`} />
            </button>
            {open===i && <div className="px-5 pb-5 text-sm text-cozy-600 leading-relaxed">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
