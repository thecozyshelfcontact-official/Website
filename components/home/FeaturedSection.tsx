
// ─── components/home/FeaturedSection.tsx ───────────────────────────────────
import ProductCard from '@/components/products/ProductCard'
export function FeaturedSection({ products }: { products: any[] }) {
    if (!products.length) return null
    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <p className="text-cozy-400 text-xs uppercase tracking-widest mb-2">Handpicked</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-cozy-900">Editor's Favorite Finds</h2>
                <p className="text-cozy-600 mt-2">Products that have truly earned their place on the shelf</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
        </section>
    )
}
export default FeaturedSection