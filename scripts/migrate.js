const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

const schema = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images JSONB DEFAULT '[]',
  rating NUMERIC(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  price NUMERIC(10,2) DEFAULT 0,
  original_price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  pros JSONB DEFAULT '[]',
  cons JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  faq JSONB DEFAULT '[]',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  network TEXT,
  commission_rate TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_link_id UUID REFERENCES affiliate_links(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  referer TEXT,
  country TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image TEXT,
  author TEXT DEFAULT 'Admin',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  related_product_ids UUID[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  read_time INT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_trending ON products(is_trending) WHERE is_trending = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_click_product ON click_events(product_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated ON products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_posts_updated ON blog_posts;
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`

const seed = `
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Electronics', 'electronics', '💻', 'Gadgets, phones, laptops and more'),
  ('Home & Kitchen', 'home-kitchen', '🏠', 'Smart home and kitchen essentials'),
  ('Health & Fitness', 'health-fitness', '💪', 'Supplements and workout gear'),
  ('Beauty', 'beauty', '✨', 'Skincare, makeup, and personal care'),
  ('Software & Tools', 'software-tools', '🛠️', 'Apps, SaaS, and digital tools')
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM categories WHERE slug='electronics' LIMIT 1)
INSERT INTO products (title,slug,short_description,rating,review_count,price,original_price,
  is_trending,is_featured,category_id,pros,cons,features,images,tags)
SELECT
  'Sony WH-1000XM5 Headphones',
  'sony-wh-1000xm5',
  'Industry-leading noise cancellation with 30-hour battery life and multipoint Bluetooth.',
  4.8, 2847, 279.99, 399.99, true, true, cat.id,
  '["Best-in-class ANC","30hr battery","Multipoint Bluetooth","Foldable design"]'::jsonb,
  '["No 3.5mm when off","Slightly bulky"]'::jsonb,
  '["Active Noise Cancellation","LDAC Hi-Res Audio","Speak-to-Chat","USB-C charging"]'::jsonb,
  '[{"url":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600","alt":"Sony WH-1000XM5"}]'::jsonb,
  ARRAY['headphones','audio','noise-cancelling','sony']
FROM cat
ON CONFLICT (slug) DO NOTHING;

WITH cat AS (SELECT id FROM categories WHERE slug='electronics' LIMIT 1)
INSERT INTO products (title,slug,short_description,rating,review_count,price,original_price,
  is_trending,is_featured,category_id,pros,cons,features,images,tags)
SELECT
  'Apple AirPods Pro 2nd Gen',
  'apple-airpods-pro-2',
  'Premium wireless earbuds with Adaptive Transparency and H2 chip.',
  4.7, 5123, 189.99, 249.00, true, true, cat.id,
  '["Excellent ANC","Adaptive Transparency","Compact case","Apple ecosystem"]'::jsonb,
  '["Pricey","Best with iPhone"]'::jsonb,
  '["H2 Chip","Adaptive EQ","MagSafe charging","IPX4 water resistant"]'::jsonb,
  '[{"url":"https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=600","alt":"AirPods Pro"}]'::jsonb,
  ARRAY['earbuds','apple','wireless','airpods']
FROM cat
ON CONFLICT (slug) DO NOTHING;
`

async function run() {
  console.log('🚀 Running migrations...')
  try {
    await pool.query(schema)
    console.log('✅ Schema created')
    await pool.query(seed)
    console.log('✅ Seed data inserted')
  } catch (e) { console.error('❌', e) }
  finally { await pool.end() }
}
run()