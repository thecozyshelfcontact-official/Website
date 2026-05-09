'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
export default function FAQSection({ items }: { items: {q:string;a:string}[] }) {
  const [open, setOpen] = useState<number|null>(null)
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {items.map((item,i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <button onClick={() => setOpen(open===i?null:i)}
              className="w-full text-left px-5 py-4 flex items-center justify-between font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {item.q}
              <ChevronDown size={16} className={`transition-transform ${open===i?'rotate-180':''}`} />
            </button>
            {open===i && <div className="px-5 pb-4 text-sm text-gray-600 dark:text-gray-400">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}