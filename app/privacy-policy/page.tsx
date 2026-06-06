import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({ title: 'Privacy Policy', description: 'Our privacy policy.' })

export default function PrivacyPage() {
  return (
    <div className="section-cozy">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Policy</p>
        <h1 className="editorial-title text-4xl md:text-5xl mb-6">Privacy Policy</h1>
        <div className="prose-cozy bg-brand-card border border-cozy-200 rounded-3xl p-6 md:p-10 shadow-cozy">
          <p><strong>Last updated: {new Date().getFullYear()}</strong></p>
          <h2>Information We Collect</h2>
          <p>We collect anonymous click data, such as hashed IP and user agent information, to improve our recommendations. We do not sell personal data.</p>
          <h2>Cookies</h2>
          <p>We use cookies for site functionality, including theme preference and admin sessions. Third-party affiliate networks may set their own cookies.</p>
        </div>
      </div>
    </div>
  )
}
