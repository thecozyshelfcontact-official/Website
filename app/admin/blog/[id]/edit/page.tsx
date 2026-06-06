'use client'
import { useEffect, useState } from 'react'
import BlogPostForm from '@/components/admin/BlogPostForm'

export default function EditBlogPost({ params }: { params: { id: string } }) {
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetch(`/api/admin/blog/${params.id}`)
      .then(r => r.json())
      .then(setPost)
  }, [params.id])

  if (!post) return (
    <div className="flex items-center justify-center h-64 text-cozy-400 font-serif">
      Loading post...
    </div>
  )

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-cozy-900 mb-6">Edit Post</h1>
      <BlogPostForm post={post} />
    </div>
  )
}
