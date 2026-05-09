import ProductCard from './ProductCard'
export default function RelatedProducts({ products }: { products: any[] }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-4">Related Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}