'use client'
import { useEffect, useState } from 'react'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProduct({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState(null)
  useEffect(() => {
    fetch(`/api/admin/products`)
      .then(r => r.json())
      .then(products => setProduct(products.find((p: any) => p.id === params.id) || null))
  }, [params.id])
  if (!product) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  )
}