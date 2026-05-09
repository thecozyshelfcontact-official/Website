
// ─── components/home/LatestBlogPosts.tsx ───────────────────────────────────
import BlogCard from '@/components/blog/BlogCard'
import Link from 'next/link'
export function LatestBlogPosts({ posts }: { posts: any[] }) {
    if (!posts.length) return null
    return (
        <section className="bg-cozy-50 py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-cozy-400 text-xs uppercase tracking-widest mb-2">From the Journal</p>
                        <h2 className="font-serif text-3xl md:text-4xl font-bold text-cozy-900">Cozy Corner</h2>
                    </div>
                    <Link href="/blog" className="text-sm font-medium text-bark hover:underline hidden sm:block">Read all →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((p: any) => <BlogCard key={p.id} post={p} />)}
                </div>
            </div>
        </section>
    )
}
export default LatestBlogPosts