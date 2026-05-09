import { query, queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { generateMeta, productSchema, breadcrumbSchema } from '@/lib/seo'
import AffiliateCTA from '@/components/products/AffiliateCTA'
import ProsConsTable from '@/components/products/ProsConsTable'
import FAQSection from '@/components/products/FAQSection'
import RelatedProducts from '@/components/products/RelatedProducts'
import StarRating from '@/components/ui/StarRating'
import { Tag, ShoppingBag } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await queryOne('SELECT * FROM products WHERE slug=$1 AND is_active=true', [params.slug])
  if (!p) return {}
  return generateMeta({ title: p.meta_title || p.title,
    description: p.meta_description || p.short_description || '',
    image: p.images?.[0]?.url, url: `/products/${p.slug}`, type: 'product' })
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await queryOne(`
    SELECT p.*,c.name as cat_name,c.slug as cat_slug
    FROM products p LEFT JOIN categories c ON p.category_id=c.id
    WHERE p.slug=$1 AND p.is_active=true`, [params.slug])
  if (!product) notFound()
  const [affiliateLinks, related] = await Promise.all([
    query('SELECT * FROM affiliate_links WHERE product_id=$1 AND is_active=true ORDER BY is_primary DESC', [product.id]),
    query(`SELECT p.*,c.name as cat_name FROM products p LEFT JOIN categories c ON p.category_id=c.id
      WHERE p.category_id=$1 AND p.id<>$2 AND p.is_active=true LIMIT 4`, [product.category_id, product.id])
  ])
  const images: any[] = product.images || []
  const pros: string[] = product.pros || []
  const cons: string[] = product.cons || []
  const features: string[] = product.features || []
  const faq: any[] = product.faq || []

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(product)) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: product.cat_name || 'Products', url: `/categories/${product.cat_slug}` },
          { name: product.title, url: `/products/${product.slug}` }
        ])) }} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="space-y-3">
            {images[0] && (
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image src={images[0].url} alt={images[0].alt || product.title} fill className="object-cover" />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((img: any, i: number) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sm text-blue-500 font-medium">
              <Tag size={14} /> {product.cat_name}
            </div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-gray-500 text-sm">({product.review_count} reviews)</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{product.short_description}</p>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">${product.price}</span>
              {product.original_price && (
                <span className="text-xl text-gray-400 line-through">${product.original_price}</span>
              )}
            </div>
            <AffiliateCTA links={affiliateLinks} productId={product.id} />
          </div>
        </div>
        {features.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShoppingBag size={22} /> Key Features</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2 bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
        {(pros.length > 0 || cons.length > 0) && <ProsConsTable pros={pros} cons={cons} />}
        {faq.length > 0 && <FAQSection items={faq} />}
        {related.length > 0 && <RelatedProducts products={related} />}
      </div>
    </>
  )
}