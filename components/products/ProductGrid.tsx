import ProductCard from './ProductCard'
export default function ProductGrid({ products }: { products: any[] }) {
  if (!products.length) return <div className="text-center py-16 text-cozy-400 bg-linen rounded-3xl border border-cozy-200">No cozy finds matched your search.</div>
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
      {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
