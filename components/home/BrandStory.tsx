import Link from 'next/link'
import Image from 'next/image'

export function BrandStory() {
    return (
        <section className="bg-[#3B2A20] text-cozy-100 py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
                <div className="mb-6 flex justify-center">
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-cream shadow-cozy">
                        <Image
                            src="/logo.png"
                            alt="The Cozy Shelf Logo"
                            fill
                            priority
                            className="object-cover scale-100"
                        />
                    </div>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 leading-snug text-balance">
                    Your home should feel like<br />
                    <span className="italic text-cozy-300">a warm, welcoming hug</span>
                </h2>
                <p className="text-cozy-400 text-lg leading-relaxed mb-8">
                    The Cozy Shelf was created to help people discover beautiful, useful, and comforting products
                    that make everyday life feel warmer, calmer, and more inspiring.
                </p>
                <Link href="/about"
                      className="inline-flex items-center gap-2 border border-cozy-600 hover:border-cozy-300 bg-cozy-800/40 hover:bg-cozy-800 text-cozy-200 hover:text-cozy-100 font-semibold px-6 py-3 rounded-2xl transition-all">
                    Our Story
                </Link>
            </div>
        </section>
    )
}
export default BrandStory
