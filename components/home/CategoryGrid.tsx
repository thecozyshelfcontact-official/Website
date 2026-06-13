import Link from 'next/link'
import Image from 'next/image'

export function CategoryGrid({ categories }: { categories: any[] }) {
    // Guard against undefined or empty array
    if (!categories || !Array.isArray(categories) || !categories.length) return null

    return (
        <section className="section-cozy">
            <div className="section-shell">
                <div className="text-center mb-10">
                    <p className="eyebrow mb-2">Browse by</p>
                    <h2 className="editorial-title text-3xl md:text-4xl">Our Collections</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {categories.map((cat: any) => {
                        // Skip corrupted iterations safely
                        if (!cat) return null;

                        // ⚡ Strict Guard Check: fallback to a safe image if image_url is missing or null
                        const safeImageUrl = typeof cat.image_url === 'string' && cat.image_url.trim() !== ''
                            ? cat.image_url
                            : 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600'; // Aesthetic furniture placeholder

                        return (
                            <Link
                                key={cat.id || cat.slug}
                                href={`/categories/${cat.slug || ''}`}
                                className="group relative overflow-hidden rounded-3xl h-48 border border-cozy-200 shadow-cozy hover:shadow-cozy-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Background Image */}
                                <Image
                                    src={safeImageUrl}
                                    alt={cat.name || 'Category'}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-cozy-900/70 via-cozy-900/25 to-transparent group-hover:from-cozy-900/80 transition-colors duration-300" />

                                {/* Content */}
                                <div className="relative z-10 h-full flex flex-col justify-end p-4 text-cream">
                                    <h3 className="font-serif text-lg font-semibold leading-tight">
                                        {cat.name || 'Unnamed Category'}
                                    </h3>

                                    <p className="text-xs text-cozy-200 mt-1">
                                        {cat.product_count || 0} finds
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    )
}

export default CategoryGrid