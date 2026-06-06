import { Star } from 'lucide-react'

export default function StarRating({
                                       rating,
                                       size = 16,
                                   }: {
    rating: number | string
    size?: number
}) {
    const numericRating = Number(rating) || 0

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={
                        i < Math.round(numericRating)
                            ? 'text-warm-500 fill-warm-500'
                            : 'text-cozy-200'
                    }
                />
            ))}

            <span className="ml-1 text-sm font-semibold text-cozy-700">
        {numericRating.toFixed(1)}
      </span>
        </div>
    )
}
