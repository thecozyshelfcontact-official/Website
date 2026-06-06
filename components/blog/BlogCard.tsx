import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function BlogCard({ post, featured = false }: { post: any; featured?: boolean }) {
    return (
        <Link href={`/blog/${post.slug}`}
              className={cn(
                  'group bg-brand-card rounded-3xl overflow-hidden border border-cozy-200 shadow-cozy hover:shadow-cozy-lg transition-all duration-300 hover:-translate-y-1',
                  featured && 'grid grid-cols-1 md:grid-cols-2'
              )}>

            {post.cover_image && (
                <div className={cn('relative overflow-hidden bg-linen', featured ? 'min-h-64' : 'aspect-video')}>
                    <Image src={post.cover_image} alt={post.title} fill
                           className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {featured && (
                        <div className="absolute top-4 left-4">
                            <span className="bg-bark text-cream text-xs font-medium px-3 py-1.5 rounded-full">Featured Story</span>
                        </div>
                    )}
                </div>
            )}

            <div className={cn('p-5', featured && 'p-8 flex flex-col justify-center')}>
                {post.cat_name && (
                    <span className="text-xs text-sage-600 font-semibold uppercase tracking-[0.16em]">{post.cat_name}</span>
                )}
                <h3 className={cn(
                    'font-serif font-bold text-cozy-900 group-hover:text-bark transition-colors leading-snug mt-1.5 mb-2',
                    featured ? 'text-2xl md:text-3xl mb-4' : 'text-base line-clamp-2'
                )}>
                    {post.title}
                </h3>
                {post.excerpt && (
                    <p className={cn('text-cozy-600 leading-relaxed mb-4', featured ? 'text-base' : 'text-sm line-clamp-2')}>
                        {post.excerpt}
                    </p>
                )}
                <div className="flex items-center gap-4 text-xs text-cozy-500">
                    <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {post.read_time} min read</span>
                </div>
            </div>
        </Link>
    )
}
