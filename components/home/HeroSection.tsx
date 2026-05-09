import Link from 'next/link'
import { TrendingUp, Star, Shield } from 'lucide-react'
export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <TrendingUp size={14} /> Trending deals updated daily
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
          Find the Best Deals,<br /><span className="text-orange-500">Before Anyone Else</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Expert reviews, honest comparisons, and hand-picked deals across electronics, home, health, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-200 dark:hover:shadow-orange-900">
            Browse All Deals →
          </Link>
          <Link href="/blog" className="border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 font-semibold px-8 py-4 rounded-xl transition-all">
            Read Reviews
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
          <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400 fill-yellow-400" /> Expert-curated picks</span>
          <span className="flex items-center gap-1.5"><Shield size={14} className="text-green-500" /> Honest, unbiased reviews</span>
          <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-blue-500" /> Updated daily</span>
        </div>
      </div>
    </section>
  )
}