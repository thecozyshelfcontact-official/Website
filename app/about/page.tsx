import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({ title: 'About Us', description: 'Learn about The Cozy Shelf and our mission.' })

export default function AboutPage() {
  return (
    <div className="section-cozy">
      <div className="max-w-3xl mx-auto">
        <p className="eyebrow mb-3">Our Story</p>
        <h1 className="editorial-title text-4xl md:text-5xl mb-6">About The Cozy Shelf</h1>
        <div className="prose-cozy bg-brand-card border border-cozy-200 rounded-3xl p-6 md:p-10 shadow-cozy">
          <p>The Cozy Shelf is your trusted source for honest product reviews, curated deals, and buying guides with a warm, intentional point of view.</p>
          <p>Our team researches and tests products so you can make informed purchasing decisions and create a home that feels beautiful, useful, and lived-in.</p>
          <h2>Our Mission</h2>
          <p>We believe everyone deserves access to honest, unbiased product information. We do the research so you can spend more time enjoying the spaces and rituals that make life feel good.</p>
          <h2>How We Make Money</h2>
          <p>We earn affiliate commissions when you purchase through our links at no extra cost to you. This helps us keep the site free. <a href="/affiliate-disclosure">Read our full disclosure.</a></p>
        </div>
      </div>
    </div>
  )
}
