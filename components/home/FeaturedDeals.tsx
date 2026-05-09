import ProductCard from '@/components/products/ProductCard'
export default function FeaturedDeals({ products }: { products: any[] }) {
  if (!products.length) return null
  return (
    <section className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">⭐ Featured Deals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}