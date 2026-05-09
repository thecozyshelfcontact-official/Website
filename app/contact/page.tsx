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
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8">We&apos;d love to hear from you!</p>
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
        <div className="space-y-4">
          {(['name','email'] as const).map(f => (
            <div key={f}>
              <label className="block text-sm font-medium mb-1 capitalize">{f}</label>
              <input type={f === 'email' ? 'email' : 'text'} value={form[f]}
                onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows={5} value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <button onClick={submit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}