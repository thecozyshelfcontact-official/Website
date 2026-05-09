import { Star } from 'lucide-react'
export default function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_,i) => (
        <Star key={i} size={size}
          className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'} />
      ))}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  )
}