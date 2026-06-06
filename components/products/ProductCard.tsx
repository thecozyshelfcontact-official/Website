import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { calcDiscount } from '@/lib/utils'

export default function ProductCard({ product }: { product: any }) {
  const discount = calcDiscount(product.price, product.original_price)

  return (
      <Link href={`/products/${product.slug}`}
            className="group bg-brand-card rounded-3xl overflow-hidden border border-cozy-200 shadow-cozy hover:shadow-cozy-lg transition-all duration-300 hover:-translate-y-1.5">
        <div className="relative aspect-square overflow-hidden bg-linen">
          <Image
              src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400'}
              alt={product.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500" />

          {product.badge ? (
              <span className="absolute top-3 left-3 bg-bark/90 text-cream text-xs font-medium px-2.5 py-1 rounded-full">
            {product.badge}
          </span>
          ) : product.is_trending ? (
              <span className="absolute top-3 left-3 bg-warm-600/90 text-cream text-xs font-medium px-2.5 py-1 rounded-full">
            Trending
          </span>
          ) : null}

          {discount && (
              <span className="absolute top-3 right-3 bg-cozy-800/80 text-cream text-xs px-2 py-1 rounded-full">
            {discount}% off
          </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-sage-600 mb-1 font-semibold uppercase tracking-[0.16em]">{product.cat_name || 'Cozy Finds'}</p>
          <h3 className="font-serif font-semibold text-cozy-900 line-clamp-2 group-hover:text-bark transition-colors text-sm mb-2 leading-snug">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={11}
                      className={i < Math.round(product.rating) ? 'text-warm-500 fill-warm-500' : 'text-cozy-200'} />
            ))}
            <span className="text-xs text-cozy-400 ml-1">({product.review_count})</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif font-bold text-cozy-900">₹{product.price}</span>
              {product.original_price && (
                  <span className="text-xs text-cozy-300 line-through">₹{product.original_price}</span>
              )}
            </div>
            <span className="text-xs font-semibold text-bark group-hover:text-cozy-600 transition-colors">
            View
          </span>
          </div>
        </div>
      </Link>
  )
}
