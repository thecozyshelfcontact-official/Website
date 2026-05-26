import { query } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
    title: 'Browse Categories',
    description: 'Explore products by category.',
})

export default async function CategoriesPage() {
    const cats = await query(`
        SELECT c.*, COUNT(p.id) as product_count
        FROM categories c
                 LEFT JOIN products p
                           ON p.category_id = c.id
                               AND p.is_active = true
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.name
    `)

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="mb-10">
                <p className="text-xs uppercase tracking-[0.25em] text-cozy-400 mb-2">
                    Explore
                </p>

                <h1 className="font-serif text-4xl font-bold text-cozy-900 dark:text-white">
                    Browse Categories
                </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {cats.map((cat: any) => (
                    <Link
                        key={cat.id}
                        href={`/categories/${cat.slug}`}
                        className="group relative overflow-hidden rounded-3xl h-56
            border border-cozy-200 dark:border-gray-800
            shadow-sm hover:shadow-2xl
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
                        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300" />

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col justify-end p-5 text-white">
                            <h2 className="font-serif text-xl font-semibold">
                                {cat.name}
                            </h2>

                            <p className="text-sm text-white/80 mt-1">
                                {cat.product_count} products
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}