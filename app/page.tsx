import { query } from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import TrendingFinds from '@/components/home/TrendingFinds'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedSection from '@/components/home/FeaturedSection'
import BrandStory from '@/components/home/BrandStory'
import LatestBlogPosts from '@/components/home/LatestBlogPosts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'The Cozy Shelf — Curated Finds for a Warm & Beautiful Life',
    description: 'Discover cozy home decor, aesthetic essentials, kitchen favorites, and wellness products curated for everyday warmth and beauty.',
}

export default async function HomePage() {
    const [trending, featured, categories, posts] = await Promise.all([
        query(`SELECT p.*, c.name as cat_name, c.slug as cat_slug
               FROM products p LEFT JOIN categories c ON p.category_id = c.id
               WHERE p.is_trending = true AND p.is_active = true ORDER BY p.created_at DESC LIMIT 8`),
        query(`SELECT p.*, c.name as cat_name, c.slug as cat_slug
               FROM products p LEFT JOIN categories c ON p.category_id = c.id
               WHERE p.is_featured = true AND p.is_active = true ORDER BY p.rating DESC LIMIT 4`),
        query(`SELECT c.*, COUNT(p.id) as product_count FROM categories c
                                                                 LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
               WHERE c.is_active = true GROUP BY c.id ORDER BY c.name LIMIT 8`),
        query(`SELECT * FROM blog_posts WHERE is_published = true ORDER BY published_at DESC LIMIT 3`),
    ])

    return (
        <div className="bg-cream">
            <HeroSection />
            <CategoryGrid categories={categories} />
            <TrendingFinds products={trending} />
            <BrandStory />
            <FeaturedSection products={featured} />
            <LatestBlogPosts posts={posts} />
        </div>
    )
}