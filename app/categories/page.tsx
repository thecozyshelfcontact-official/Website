import { query } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { generateMeta } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateMeta({
    title: 'Browse Categories',
    description: 'Explore cozy lifestyle finds by collection.',
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
        <div className="section-cozy">
            <div className="section-shell">
                <div className="mb-10 max-w-3xl">
                    <p className="eyebrow mb-3">Explore</p>
                    <h1 className="editorial-title text-4xl md:text-5xl mb-4">Browse Collections</h1>
                    <p className="editorial-copy text-lg">Shop by mood, room, ritual, and everyday need with visual collections that feel considered from the first glance.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {cats.map((cat: any) => (
                        <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            className="group relative overflow-hidden rounded-3xl h-72 border border-cozy-200 shadow-cozy hover:shadow-cozy-lg transition-all duration-300 hover:-translate-y-1"
                        >
                            <Image
                                src={cat.image_url}
                                alt={cat.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cozy-900/75 via-cozy-900/25 to-transparent group-hover:from-cozy-900/82 transition-colors duration-300" />
                            <div className="relative z-10 h-full flex flex-col justify-end p-5 text-cream">
                                <p className="text-xs uppercase tracking-[0.2em] text-cozy-200 mb-2">
                                    {cat.product_count} finds
                                </p>
                                <h2 className="font-serif text-2xl font-semibold leading-tight">
                                    {cat.name}
                                </h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
