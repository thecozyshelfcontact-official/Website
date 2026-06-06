import ProductCard from '@/components/products/ProductCard'

export function FeaturedSection({ products }: { products: any[] }) {
    if (!products.length) return null
    return (
        <section className="section-cozy">
            <div className="section-shell">
                <div className="text-center mb-10">
                    <p className="eyebrow mb-2">Handpicked</p>
                    <h2 className="editorial-title text-3xl md:text-4xl">Editor's Favorite Finds</h2>
                    <p className="editorial-copy mt-2">Products that have truly earned their place on the shelf.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
                    {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
                </div>
            </div>
        </section>
    )
}
export default FeaturedSection
