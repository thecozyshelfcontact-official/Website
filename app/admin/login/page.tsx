'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds)
    })
    setLoading(false)
    if (res.ok) { toast.success('Welcome back!'); router.push('/admin') }
    else toast.error('Invalid credentials')
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">DealRadar Dashboard</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-lg">
          <div className="space-y-4">
            {(['username','password'] as const).map(f => (
              <div key={f}>
                <label className="block text-sm font-medium mb-1 capitalize">{f}</label>
                <input type={f === 'password' ? 'password' : 'text'} value={creds[f]}
                  onChange={e => setCreds(p => ({ ...p, [f]: e.target.value }))}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            ))}
            <button onClick={submit} disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}