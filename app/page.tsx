import { query } from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import TrendingProducts from '@/components/home/TrendingProducts'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedDeals from '@/components/home/FeaturedDeals'
import LatestBlogPosts from '@/components/home/LatestBlogPosts'
import type { Metadata } from 'next'
import { generateMeta } from '@/lib/seo'

export const metadata: Metadata = generateMeta({
  title: 'DealRadar — Best Product Deals & Reviews',
  description: 'Find the best deals, honest reviews, and top product recommendations curated for you.',
})

export default async function HomePage() {
  const [trending, featured, categories, posts] = await Promise.all([
    query(`SELECT p.*,c.name as cat_name,c.slug as cat_slug
      FROM products p LEFT JOIN categories c ON p.category_id=c.id
      WHERE p.is_trending=true AND p.is_active=true ORDER BY p.created_at DESC LIMIT 8`),
    query(`SELECT p.*,c.name as cat_name,c.slug as cat_slug
      FROM products p LEFT JOIN categories c ON p.category_id=c.id
      WHERE p.is_featured=true AND p.is_active=true ORDER BY p.rating DESC LIMIT 4`),
    query(`SELECT c.*,COUNT(p.id) as product_count FROM categories c
      LEFT JOIN products p ON p.category_id=c.id AND p.is_active=true
      WHERE c.is_active=true GROUP BY c.id ORDER BY c.name LIMIT 8`),
    query(`SELECT * FROM blog_posts WHERE is_published=true ORDER BY published_at DESC LIMIT 3`),
  ])
  return (
    <>
      <HeroSection />
      <CategoryGrid categories={categories} />
      <TrendingProducts products={trending} />
      <FeaturedDeals products={featured} />
      <LatestBlogPosts posts={posts} />
    </>
  )
}