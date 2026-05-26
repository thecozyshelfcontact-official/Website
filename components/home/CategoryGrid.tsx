// ─── components/home/CategoryGrid.tsx ──────────────────────────────────────

import Link from 'next/link'
import Image from 'next/image'

export function CategoryGrid({ categories }: { categories: any[] }) {
    if (!categories.length) return null

    return (
        <section className="max-w-7xl  mx-auto px-4 py-16">
            <div className="text-center mb-10">
                <p className="text-cozy-400 text-xs uppercase tracking-[0.25em] mb-2">
                    Browse by
                </p>

                <h2 className="font-serif text-3xl font-bold text-cozy-900 dark:text-white">
                    Our Collections
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((cat: any) => (
                    <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="group relative overflow-hidden rounded-3xl h-48
                        border border-cozy-200
                        shadow-cozy
                        hover:shadow-2xl
                        transition-all duration-300 hover:-translate-y-1"
                    >
                        {/* Background Image */}
                        <Image
                            src={cat.image_url}
                            alt={cat.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors duration-300" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-white">
                            <h3 className="font-serif text-lg font-semibold leading-tight">
                                {cat.name}
                            </h3>

                            <p className="text-xs text-white/80 mt-1">
                                {cat.product_count} finds
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default CategoryGrid