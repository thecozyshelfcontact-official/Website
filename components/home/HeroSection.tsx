import Link from 'next/link'
import Image from 'next/image'
export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-cozy-100 via-cream to-warm-100 py-24 md:py-32 px-4">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-10 right-10 w-72 h-72 bg-cozy-200 rounded-full blur-3xl" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-warm-200 rounded-full blur-3xl" />
            </div>
            <div className="relative max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="animate-slide-up">
                        <p className="text-cozy-500 text-sm font-medium uppercase tracking-widest mb-4">
                            Welcome to The Cozy Shelf
                        </p>
                        <h1 className="font-serif text-5xl md:text-6xl font-bold text-cozy-900 leading-tight mb-6">
                            Curated Finds for a<br />
                            <span className="italic text-cozy-600">Warm & Beautiful</span> Life
                        </h1>
                        <p className="text-cozy-700 text-xl leading-relaxed mb-10 max-w-lg">
                            Discover cozy home decor, aesthetic essentials, smart upgrades, and everyday products we genuinely love.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/products" className="btn-primary text-base px-8 py-4">Explore Finds ✦</Link>
                            <Link href="/categories" className="btn-outline text-base px-8 py-4">Browse Categories</Link>
                        </div>
                        <div className="flex flex-wrap gap-6 mt-10 text-sm text-cozy-500">
                            {['✦ Thoughtfully curated', '🌿 Honest reviews', '🏡 Cozy approved'].map(b => (
                                <span key={b}>{b}</span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 animate-fade-in">
                        {[
                            { src:'/images/asth-livingroom.png', alt:'Cozy living room', extra:'mt-0' },
                            { src:'/images/asth-bedroom.png',     alt:'Cozy bedroom',    extra:'mt-6' },
                            { src:'/images/asth-kitchen.png',    alt:'Kitchen finds',   extra:'mt-0' },
                            { src:'/images/asth-home.png',        alt:'Cozy home',       extra:'mt-6' },
                        ].map((img, i) => (
                            <div key={i} className={`relative h-48 rounded-3xl overflow-hidden shadow-cozy ${img.extra}`}>
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}