
// ─── components/home/TrendingFinds.tsx ─────────────────────────────────────
import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'
export function TrendingFinds({ products }: { products: any[] }) {
    if (!products.length) return null
    return (
        <section className="bg-cozy-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-cozy-400 text-xs uppercase tracking-widest mb-2">What We Love Right Now</p>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-cozy-900">Trending Cozy Finds</h2>
                    </div>
                    <Link href="/products" className="text-sm font-medium text-bark hover:underline hidden sm:block">View all →</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </section>
    )
}
export default TrendingFinds
