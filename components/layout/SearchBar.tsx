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
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cozy-400" />
      <input value={q} onChange={e => setQ(e.target.value)}
        placeholder="Search finds..."
        className="input-cozy pl-9 py-2" />
    </form>
  )
}
