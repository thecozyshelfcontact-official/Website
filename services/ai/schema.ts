import type { GeneratedProductContent, ProductExtraction } from './types'

// Declaring the missing helper variable
const stringArray = {
  type: 'array',
  items: { type: 'string' },
}

export const productExtractionSchema = {
  type: 'object',
  properties: {
    product_name: { type: 'string' },
    brand: { type: 'string', nullable: true },
    category: { type: 'string', nullable: true },
    price: { type: 'number', nullable: true },
    rating: { type: 'number', nullable: true },
    review_count: { type: 'number', nullable: true },
    features: stringArray,
    // Safely handles dynamic specs without using additionalProperties
    specifications: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: { type: 'string', nullable: true }
        },
        required: ['key', 'value']
      }
    },
    pros: stringArray,
    cons: stringArray,
    affiliate_url: { type: 'string', nullable: true },
    source_confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    missing_fields: stringArray,
  },
  required: [
    'product_name',
    'brand',
    'category',
    'price',
    'rating',
    'review_count',
    'features',
    'specifications',
    'pros',
    'cons',
    'affiliate_url',
    'source_confidence',
    'missing_fields',
  ],
}

export const generatedProductSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    slug: { type: 'string' },
    category: { type: 'string' },
    badge: { type: 'string', nullable: true },
    tags: stringArray,
    short_description: { type: 'string' },
    full_description: { type: 'string' },
    what_we_love: stringArray,
    worth_noting: { type: 'array', items: { type: 'string' }, minItems: 1 },
    key_features: stringArray,
    seo_title: { type: 'string' },
    seo_description: { type: 'string' },
    pinterest_caption: { type: 'string' },
    instagram_caption: { type: 'string' },
    youtube_hook: { type: 'string' },
    cta: { type: 'string' },
    image_prompt: { type: 'string' },
  },
  required: [
    'title',
    'slug',
    'category',
    'badge',
    'tags',
    'short_description',
    'full_description',
    'what_we_love',
    'worth_noting',
    'key_features',
    'seo_title',
    'seo_description',
    'pinterest_caption',
    'instagram_caption',
    'youtube_hook',
    'cta',
    'image_prompt',
  ],
}

export function assertProductExtraction(value: any): ProductExtraction {
  const required = ['product_name', 'features', 'specifications', 'pros', 'cons', 'missing_fields']
  for (const key of required) {
    if (!(key in value)) throw new Error(`Gemini response missing extraction field: ${key}`)
  }
  if (!value.product_name || typeof value.product_name !== 'string') {
    throw new Error('Gemini did not identify a product name.')
  }

  // Re-assembling the structured list array back into an object format for your app
  const specsRecord: Record<string, string | null> = {}
  if (Array.isArray(value.specifications)) {
    for (const item of value.specifications) {
      if (item && typeof item === 'object' && 'key' in item) {
        specsRecord[String(item.key)] = item.value != null ? String(item.value) : null
      }
    }
  }

  return {
    product_name: value.product_name,
    brand: value.brand || null,
    category: value.category || null,
    price: typeof value.price === 'number' ? value.price : null,
    rating: typeof value.rating === 'number' ? value.rating : null,
    review_count: typeof value.review_count === 'number' ? value.review_count : null,
    features: asStringArray(value.features),
    specifications: specsRecord,
    pros: asStringArray(value.pros),
    cons: asStringArray(value.cons),
    affiliate_url: value.affiliate_url || null,
    source_confidence: ['low', 'medium', 'high'].includes(value.source_confidence) ? value.source_confidence : 'low',
    missing_fields: asStringArray(value.missing_fields),
  }
}

export function assertGeneratedProduct(value: any): GeneratedProductContent {
  const required = [
    'title',
    'slug',
    'category',
    'tags',
    'short_description',
    'full_description',
    'what_we_love',
    'worth_noting',
    'key_features',
    'seo_title',
    'seo_description',
    'pinterest_caption',
    'instagram_caption',
    'youtube_hook',
    'cta',
    'image_prompt',
  ]
  for (const key of required) {
    if (!(key in value)) throw new Error(`Gemini response missing product field: ${key}`)
  }
  if (!value.title || !value.slug || !value.short_description || !value.image_prompt) {
    throw new Error('Gemini returned incomplete product content.')
  }
  return {
    title: String(value.title),
    slug: String(value.slug),
    category: String(value.category),
    badge: value.badge ? String(value.badge) : null,
    tags: asStringArray(value.tags),
    short_description: String(value.short_description),
    full_description: String(value.full_description),
    what_we_love: asStringArray(value.what_we_love),
    worth_noting: asStringArray(value.worth_noting),
    key_features: asStringArray(value.key_features),
    seo_title: String(value.seo_title),
    seo_description: String(value.seo_description),
    pinterest_caption: String(value.pinterest_caption),
    instagram_caption: String(value.instagram_caption),
    youtube_hook: String(value.youtube_hook),
    cta: String(value.cta),
    image_prompt: String(value.image_prompt),
  }
}

function asStringArray(value: any): string[] {
  return Array.isArray(value) ? value.map(String).map(s => s.trim()).filter(Boolean) : []
}