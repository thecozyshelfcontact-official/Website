import BlogCard from '@/components/blog/BlogCard'
import Link from 'next/link'

export function LatestBlogPosts({ posts }: { posts: any[] }) {
    if (!posts.length) return null
    return (
        <section className="section-linen">
            <div className="section-shell">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="eyebrow mb-2">From the Journal</p>
                        <h2 className="editorial-title text-3xl md:text-4xl">Cozy Corner</h2>
                    </div>
                    <Link href="/blog" className="text-sm font-semibold text-bark hover:underline underline-offset-4 hidden sm:block">Read all</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((p: any) => <BlogCard key={p.id} post={p} />)}
                </div>
            </div>
        </section>
    )
}
export default LatestBlogPosts
