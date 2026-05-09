import ProductCard from './ProductCard'
export default function ProductGrid({ products }: { products: any[] }) {
  if (!products.length) return <div className="text-center py-16 text-gray-400">No products found.</div>
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}