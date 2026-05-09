import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'
export const metadata: Metadata = generateMeta({ title: 'Privacy Policy', description: 'Our privacy policy.' })
export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p><strong>Last updated: {new Date().getFullYear()}</strong></p>
        <h2>Information We Collect</h2>
        <p>We collect anonymous click data (hashed IP, user agent) to improve our recommendations. We do not sell personal data.</p>
        <h2>Cookies</h2>
        <p>We use cookies for site functionality (theme preference, admin sessions). Third-party affiliate networks may set their own cookies.</p>
        <h2>Third Parties</h2>
        <p>We use Vercel for hosting, Supabase for database, and Cloudinary for images. Each has their own privacy policy.</p>
        <h2>Contact</h2>
        <p>Email us at privacy@dealradar.com with any questions.</p>
      </div>
    </div>
  )
}