import ProductCard from './ProductCard'
export default function RelatedProducts({ products }: { products: any[] }) {
  return (
    <section className="mt-14">
      <p className="eyebrow mb-2">Keep Browsing</p>
      <h2 className="editorial-title text-2xl md:text-3xl mb-5">Related Finds</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
