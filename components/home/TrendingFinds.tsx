import ProductCard from '@/components/products/ProductCard'
import Link from 'next/link'

export function TrendingFinds({ products }: { products: any[] }) {
    if (!products.length) return null
    return (
        <section className="section-linen">
            <div className="section-shell">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="eyebrow mb-2">What We Love Right Now</p>
                        <h2 className="editorial-title text-3xl md:text-4xl">Trending Cozy Finds</h2>
                    </div>
                    <Link href="/products" className="text-sm font-semibold text-bark hover:underline underline-offset-4 hidden sm:block">View all</Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </section>
    )
}
export default TrendingFinds
