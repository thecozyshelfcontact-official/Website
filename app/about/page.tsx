import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'
export const metadata: Metadata = generateMeta({ title: 'About Us', description: 'Learn about DealRadar and our mission.' })
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About The Cozy Shelf</h1>
      <div className="prose dark:prose-invert prose-lg">
        <p>The Cozy Shelf is your trusted source for honest product reviews, curated deals, and buying guides.</p>
        <p>Our team researches and tests products so you can make informed purchasing decisions and save money.</p>
        <h2>Our Mission</h2>
        <p>We believe everyone deserves access to honest, unbiased product information. We do the research so you don&apos;t have to.</p>
        <h2>How We Make Money</h2>
        <p>We earn affiliate commissions when you purchase through our links — at no extra cost to you. This helps us keep the site free. <a href="/affiliate-disclosure">Read our full disclosure.</a></p>
      </div>
    </div>
  )
}