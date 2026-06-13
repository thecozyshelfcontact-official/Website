import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { query, queryOne } from '@/lib/db'
import { slugify } from '@/lib/utils'
import { assertGeneratedProduct, assertProductExtraction } from '@/services/ai/schema'
import type { SaveProductPayload } from '@/services/ai/types'

export async function POST(req: NextRequest) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json() as SaveProductPayload
    const product = assertGeneratedProduct(body.product)
    const extraction = body.extraction ? assertProductExtraction(body.extraction) : null
    const status = body.status === 'published' ? 'published' : 'draft'
    const isActive = status === 'published'
    const categoryId = await resolveCategoryId(product.category)
    const slug = body.product_id ? slugify(product.slug || product.title) : await uniqueSlug(product.slug || product.title)
    const imageUrl = body.image_url || null
    const sourceScreenshotUrl = body.source_screenshot_url || extraction?.source_screenshot_url || null
    const affiliateUrl = extraction?.affiliate_url || null

    const values = [
      product.title,
      slug,
      product.short_description,
      product.full_description,
      categoryId,
      JSON.stringify(imageUrl ? [{ url: imageUrl, alt: product.title }] : []),
      extraction?.rating || 0,
      extraction?.review_count || 0,
      extraction?.price || 0,
      null,
      JSON.stringify(product.what_we_love),
      JSON.stringify(product.worth_noting),
      JSON.stringify(product.key_features),
      JSON.stringify([]),
      product.tags,
      false,
      false,
      isActive,
      product.seo_title,
      product.seo_description,
      product.badge,
      product.category,
      JSON.stringify(product.what_we_love),
      JSON.stringify(product.worth_noting),
      JSON.stringify(product.key_features),
      product.seo_title,
      product.seo_description,
      product.pinterest_caption,
      product.instagram_caption,
      product.youtube_hook,
      product.cta,
      product.image_prompt,
      imageUrl,
      sourceScreenshotUrl,
      affiliateUrl,
      status,
      extraction ? JSON.stringify(extraction) : null,
    ]

    const saved = body.product_id
      ? await updateProduct(body.product_id, values)
      : await insertProduct(values)

    if (affiliateUrl && saved?.id) {
      await upsertPrimaryAffiliateLink(saved.id, affiliateUrl, product.cta || 'Shop this find')
    }

    return NextResponse.json({ product: saved })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Saving product failed.' }, { status: 500 })
  }
}

async function insertProduct(values: any[]) {
  return queryOne(
    `INSERT INTO products
      (title, slug, short_description, full_description, category_id, images,
       rating, review_count, price, original_price, pros, cons, features, faq,
       tags, is_featured, is_trending, is_active, meta_title, meta_description, badge,
       category, what_we_love, worth_noting, key_features, seo_title, seo_description,
       pinterest_caption, instagram_caption, youtube_hook, cta, image_prompt, image_url,
       source_screenshot_url, affiliate_url, status, ai_extraction)
     VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,
       $22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37)
     RETURNING *`,
    values
  )
}

async function updateProduct(id: string, values: any[]) {
  return queryOne(
    `UPDATE products SET
       title=$1, slug=$2, short_description=$3, full_description=$4, category_id=$5, images=$6,
       rating=$7, review_count=$8, price=$9, original_price=$10, pros=$11, cons=$12,
       features=$13, faq=$14, tags=$15, is_featured=$16, is_trending=$17, is_active=$18,
       meta_title=$19, meta_description=$20, badge=$21, category=$22, what_we_love=$23,
       worth_noting=$24, key_features=$25, seo_title=$26, seo_description=$27,
       pinterest_caption=$28, instagram_caption=$29, youtube_hook=$30, cta=$31,
       image_prompt=$32, image_url=$33, source_screenshot_url=$34, affiliate_url=$35,
       status=$36, ai_extraction=$37, updated_at=now()
     WHERE id=$38
     RETURNING *`,
    [...values, id]
  )
}

async function resolveCategoryId(category: string) {
  if (!category) return null
  const slug = slugify(category)
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM categories WHERE slug=$1 OR lower(name)=lower($2) LIMIT 1',
    ["home-kitchen", "Home & Kitchen"]
  )
  if (existing) return existing.id
  const created = await queryOne<{ id: string }>(
    'INSERT INTO categories(name, slug, description, icon, is_active) VALUES($1,$2,$3,$4,true) RETURNING id',
    [category, slug, `Curated ${category.toLowerCase()} finds from The Cozy Shelf.`, '']
  )
  return created?.id || null
}

async function uniqueSlug(input: string) {
  const base = slugify(input || 'cozy-find')
  const existing = await queryOne('SELECT id FROM products WHERE slug=$1', [base])
  if (!existing) return base
  return `${base}-${Date.now().toString(36)}`
}

async function upsertPrimaryAffiliateLink(productId: string, url: string, label: string) {
  const existing = await queryOne<{ id: string }>(
    'SELECT id FROM affiliate_links WHERE product_id=$1 AND is_primary=true LIMIT 1',
    [productId]
  )
  if (existing) {
    await query(
      'UPDATE affiliate_links SET label=$1, url=$2, is_active=true WHERE id=$3',
      [label, url, existing.id]
    )
    return
  }
  await query(
    'INSERT INTO affiliate_links(product_id, label, url, network, is_primary, is_active) VALUES($1,$2,$3,$4,true,true)',
    [productId, label, url, 'AI Import']
  )
}
