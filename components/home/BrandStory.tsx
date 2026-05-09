
// ─── components/home/BrandStory.tsx ────────────────────────────────────────
import Link from 'next/link'
export function BrandStory() {
    return (
        <section className="bg-cozy-900 text-cozy-100 py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <span className="text-4xl block mb-6">🌿</span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-snug">
                    Your home should feel like<br />
                    <span className="italic text-cozy-300">a warm, welcoming hug</span>
                </h2>
                <p className="text-cozy-400 text-lg leading-relaxed mb-8">
                    The Cozy Shelf was created to help people discover beautiful, useful, and comforting products
                    that make everyday life feel warmer, calmer, and more inspiring.
                </p>
                <Link href="/about"
                      className="inline-flex items-center gap-2 border border-cozy-600 hover:border-cozy-400
            text-cozy-300 hover:text-cozy-100 font-medium px-6 py-3 rounded-2xl transition-all">
                    Our Story →
                </Link>
            </div>
        </section>
    )
}
export default BrandStory