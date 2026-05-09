export interface Category {
  id: string; name: string; slug: string; description?: string
  image_url?: string; icon?: string; is_active: boolean
  created_at: string; product_count?: number
}
export interface Product {
  id: string; title: string; slug: string; short_description?: string
  full_description?: string; category_id?: string; category?: Category
  images: { url: string; alt: string }[]; rating: number; review_count: number
  price: number; original_price?: number; currency: string
  pros: string[]; cons: string[]; features: string[]
  faq: { q: string; a: string }[]; tags: string[]
  is_featured: boolean; is_trending: boolean; is_active: boolean
  meta_title?: string; meta_description?: string
  affiliate_links?: AffiliateLink[]; created_at: string; updated_at: string
}
export interface AffiliateLink {
  id: string; product_id: string; label: string; url: string
  network?: string; commission_rate?: string; is_primary: boolean
  is_active: boolean; click_count?: number; created_at: string
}
export interface BlogPost {
  id: string; title: string; slug: string; excerpt?: string
  content: string; cover_image?: string; author: string
  category_id?: string; category?: Category; tags: string[]
  related_product_ids: string[]; is_published: boolean; is_featured: boolean
  meta_title?: string; meta_description?: string; read_time?: number
  published_at?: string; created_at: string; updated_at: string
}
export interface ClickEvent {
  id: string; affiliate_link_id: string; product_id: string
  ip_hash?: string; user_agent?: string; referer?: string
  clicked_at: string
}