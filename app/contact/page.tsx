'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message sent! We\'ll reply within 48 hours.')
    setForm({ name: '', email: '', message: '' })
  }
  return (
    <div className="section-cozy">
      <div className="max-w-xl mx-auto">
        <p className="eyebrow mb-3">Say Hello</p>
        <h1 className="editorial-title text-4xl md:text-5xl mb-3">Contact Us</h1>
        <p className="editorial-copy mb-8">We would love to hear from you.</p>
        <form onSubmit={submit} className="bg-brand-card rounded-3xl p-6 md:p-8 border border-cozy-200 shadow-cozy space-y-4">
          {(['name','email'] as const).map(f => (
            <div key={f}>
              <label className="block text-xs font-semibold text-cozy-600 uppercase tracking-[0.16em] mb-1.5 capitalize">{f}</label>
              <input type={f === 'email' ? 'email' : 'text'} value={form[f]}
                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                className="input-cozy" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-cozy-600 uppercase tracking-[0.16em] mb-1.5">Message</label>
            <textarea rows={5} value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="input-cozy" />
          </div>
          <button type="submit" className="btn-primary w-full">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
