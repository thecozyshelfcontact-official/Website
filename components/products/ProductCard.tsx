import Link from 'next/link'
import Image from 'next/image'
import { Star, TrendingUp, Tag } from 'lucide-react'
import { calcDiscount } from '@/lib/utils'
export default function ProductCard({ product }: { product: any }) {
  const discount = calcDiscount(product.price, product.original_price)
  return (
    <Link href={`/products/${product.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-800">
        <Image src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400'}
          alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        {product.is_trending && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <TrendingUp size={10} /> Hot
          </span>
        )}
        {discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-500 font-medium mb-1 flex items-center gap-1">
          <Tag size={10} /> {product.cat_name || 'General'}
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-orange-500 transition-colors text-sm mb-2">{product.title}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_,i) => (
            <Star key={i} size={12} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.review_count})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold">${product.price}</span>
            {product.original_price && <span className="text-xs text-gray-400 line-through ml-1">${product.original_price}</span>}
          </div>
          <span className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Deal →</span>
        </div>
      </div>
    </Link>
  )
}