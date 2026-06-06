import { Check, X } from 'lucide-react'

export default function ProsConsTable({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className="mb-12">
      <div className="mb-5">
        <p className="eyebrow mb-2">At a Glance</p>
        <h2 className="editorial-title text-2xl md:text-3xl">Pros & Cons</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-sage-50 rounded-3xl p-5 border border-sage-200 shadow-cozy">
          <h3 className="font-serif font-bold text-sage-700 mb-3 flex items-center gap-2"><Check size={16} /> Why it works</h3>
          <ul className="space-y-2.5">
            {pros.map((p,i) => <li key={i} className="flex gap-2 text-sm text-cozy-700"><Check size={14} className="text-sage-600 mt-0.5 shrink-0" />{p}</li>)}
          </ul>
        </div>
        <div className="bg-warm-50 rounded-3xl p-5 border border-warm-200 shadow-cozy">
          <h3 className="font-serif font-bold text-warm-700 mb-3 flex items-center gap-2"><X size={16} /> Worth noting</h3>
          <ul className="space-y-2.5">
            {cons.map((c,i) => <li key={i} className="flex gap-2 text-sm text-cozy-700"><X size={14} className="text-warm-600 mt-0.5 shrink-0" />{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
