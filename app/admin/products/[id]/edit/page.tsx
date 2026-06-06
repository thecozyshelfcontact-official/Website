'use client'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/products/${params.id}`)
      .then(r => {
        if (!r.ok) { setError(true); return null }
        return r.json()
      })
      .then(data => { if (data) setProduct(data) })
  }, [params.id])

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-400 font-serif">
      Product not found.
    </div>
  )
  if (!product) return (
    <div className="flex items-center justify-center h-64 text-cozy-400 font-serif">
      Loading product...
    </div>
  )

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-cozy-900 mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}
