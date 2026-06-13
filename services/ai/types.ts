export type ProductExtraction = {
  product_name: string
  brand: string | null
  category: string | null
  price: number | null
  rating: number | null
  review_count: number | null
  features: string[]
  specifications: Record<string, string | null>
  pros: string[]
  cons: string[]
  affiliate_url: string | null
  source_confidence: 'low' | 'medium' | 'high'
  missing_fields: string[]
  source_screenshot_url?: string
}

export type GeneratedProductContent = {
  title: string
  slug: string
  category: string
  badge: string | null
  tags: string[]
  short_description: string
  full_description: string
  what_we_love: string[]
  worth_noting: string[]
  key_features: string[]
  seo_title: string
  seo_description: string
  pinterest_caption: string
  instagram_caption: string
  youtube_hook: string
  cta: string
  image_prompt: string
}

export type AiProvider = {
  extractProduct(input: {
    imageBase64: string
    mimeType: string
  }): Promise<ProductExtraction>
  generateProductContent(input: ProductExtraction): Promise<GeneratedProductContent>
}

export type SaveProductPayload = {
  product_id?: string
  extraction?: ProductExtraction
  product: GeneratedProductContent
  image_url?: string | null
  source_screenshot_url?: string | null
  status: 'draft' | 'published'
}