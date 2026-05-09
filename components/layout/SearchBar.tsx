'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
export default function SearchBar() {
  const [q, setQ] = useState('')
  const router = useRouter()
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) router.push(`/products?q=${encodeURIComponent(q.trim())}`)
  }
  return (
    <form onSubmit={submit} className="relative w-full">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search products..."
        className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
    </form>
  )
}