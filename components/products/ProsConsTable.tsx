import { Check, X } from 'lucide-react'
export default function ProsConsTable({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-4">Pros & Cons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-5 border border-green-100 dark:border-green-900/30">
          <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2"><Check size={16} /> Pros</h3>
          <ul className="space-y-2">
            {pros.map((p,i) => <li key={i} className="flex gap-2 text-sm"><Check size={14} className="text-green-500 mt-0.5 shrink-0" />{p}</li>)}
          </ul>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-5 border border-red-100 dark:border-red-900/30">
          <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2"><X size={16} /> Cons</h3>
          <ul className="space-y-2">
            {cons.map((c,i) => <li key={i} className="flex gap-2 text-sm"><X size={14} className="text-red-500 mt-0.5 shrink-0" />{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}