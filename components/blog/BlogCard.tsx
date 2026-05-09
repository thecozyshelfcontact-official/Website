import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
export default function BlogCard({ post }: { post: any }) {
  return (
    <Link href={`/blog/${post.slug}`}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {post.cover_image && (
        <div className="relative aspect-video overflow-hidden bg-gray-50">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-5">
        {post.cat_name && <span className="text-xs text-blue-500 font-medium">{post.cat_name}</span>}
        <h3 className="font-bold mt-1 mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">{post.title}</h3>
        {post.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{post.excerpt}</p>}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{post.read_time} min</span>
        </div>
      </div>
    </Link>
  )
}