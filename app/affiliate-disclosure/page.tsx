import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'
export const metadata: Metadata = generateMeta({ title: 'Affiliate Disclosure', description: 'Our affiliate disclosure policy.' })
export default function DisclosurePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Affiliate Disclosure</h1>
      <div className="prose dark:prose-invert">
        <p><strong>Last updated: {new Date().getFullYear()}</strong></p>
        <p>The Cozy Shelf participates in various affiliate programs, including Amazon Associates, and others. When you click on product links and make a purchase, we may earn a small commission at no additional cost to you.</p>
        <h2>Amazon Associates</h2>
        <p>The Cozy Shelf is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
        <h2>How It Works</h2>
        <p>We only recommend products we believe provide genuine value. Our editorial opinions are not influenced by affiliate partnerships.</p>
      </div>
    </div>
  )
}