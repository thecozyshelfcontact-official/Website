'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    })
    setLoading(false)
    if (res.ok) { toast.success('Welcome back! 🌿'); router.push('/admin') }
    else toast.error('Invalid credentials')
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-cozy-50 px-4">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🌿</span>
            <h1 className="font-serif text-3xl font-bold text-cozy-900">The Cozy Shelf</h1>
            <p className="text-cozy-500 text-sm mt-1">Sign in to your admin panel</p>
          </div>

          {/* Card */}
          <div className="bg-cream rounded-3xl p-8 border border-cozy-200 shadow-cozy-lg">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5">
                  Username
                </label>
                <input
                    type="text"
                    value={creds.username}
                    onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
                    className="input-cozy"
                    placeholder="admin"
                    required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-cozy-600 uppercase tracking-wide mb-1.5">
                  Password
                </label>
                <input
                    type="password"
                    value={creds.password}
                    onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
                    className="input-cozy"
                    placeholder="••••••••"
                    required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3.5">
                {loading ? 'Signing in...' : 'Sign In 🌿'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-cozy-400 mt-6">
            The Cozy Shelf Admin · Private Access Only
          </p>
        </div>
      </div>
  )
}