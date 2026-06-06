import { query, queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { generateMeta, productSchema, breadcrumbSchema } from '@/lib/seo'
import AffiliateCTA from '@/components/products/AffiliateCTA'
import ProsConsTable from '@/components/products/ProsConsTable'
import FAQSection from '@/components/products/FAQSection'
import RelatedProducts from '@/components/products/RelatedProducts'
import StarRating from '@/components/ui/StarRating'
import { Check, ShoppingBag, Tag } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await queryOne('SELECT * FROM products WHERE slug=$1 AND is_active=true', [params.slug])
  if (!p) return {}
  return generateMeta({ title: p.meta_title || p.title,
    description: p.meta_description || p.short_description || '',
    image: p.images?.[0]?.url, url: `/products/${p.slug}` })
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
      <div className="section-cozy">
        <div className="section-shell">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-14">
            <div className="space-y-3">
              {images[0] && (
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-linen border border-cozy-200 shadow-cozy-lg">
                  <Image src={images[0].url} alt={images[0].alt || product.title} fill className="object-cover" />
                </div>
              )}
              <div className="grid grid-cols-4 gap-2.5">
                {images.slice(1).map((img: any, i: number) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-linen border border-cozy-200 shadow-cozy">
                    <Image src={img.url} alt={img.alt || ''} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6 lg:pt-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-sage-700 font-semibold bg-sage-50 border border-sage-200 rounded-full px-3 py-1.5">
                <Tag size={13} /> {product.cat_name}
              </div>
              <div>
                <h1 className="editorial-title text-4xl md:text-5xl mb-4 text-balance">{product.title}</h1>
                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating} />
                  <span className="text-cozy-500 text-sm">({product.review_count} reviews)</span>
                </div>
              </div>
              <p className="editorial-copy text-lg">{product.short_description}</p>
              <div className="flex items-baseline gap-3 border-y border-cozy-200 py-5">
<span className="text-sm font-medium text-cozy-800">
  ₹{product.price}
</span>                {product.original_price && (
                  <span className="text-xl text-cozy-400 line-through">₹{product.original_price}</span>
                )}
              </div>
              <AffiliateCTA links={affiliateLinks} productId={product.id} />
            </div>
          </div>
          {features.length > 0 && (
            <section className="mb-12 rounded-3xl border border-cozy-200 bg-linen p-6 md:p-8 shadow-cozy">
              <div className="mb-5">
                <p className="eyebrow mb-2">Details</p>
                <h2 className="editorial-title text-2xl md:text-3xl flex items-center gap-2"><ShoppingBag size={22} /> Key Features</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 bg-brand-card rounded-2xl p-4 border border-cozy-200">
                    <Check size={16} className="text-sage-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-cozy-700 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {(pros.length > 0 || cons.length > 0) && <ProsConsTable pros={pros} cons={cons} />}
          {faq.length > 0 && <FAQSection items={faq} />}
          {related.length > 0 && <RelatedProducts products={related} />}
        </div>
      </div>
    </>
  )
}
