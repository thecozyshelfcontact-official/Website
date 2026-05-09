import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
export default function TrendingProducts({ products }: { products: any[] }) {
  if (!products.length) return null
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">🔥 Trending Now</h2>
        <Link href="/products?sort=trending" className="text-orange-500 hover:underline text-sm font-medium">View all →</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}