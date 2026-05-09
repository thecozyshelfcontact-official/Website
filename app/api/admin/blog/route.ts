import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify, readingTime } from '@/lib/utils'

export async function GET() {
  const posts = await query('SELECT * FROM blog_posts ORDER BY created_at DESC')
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.title)
  const read_time = readingTime(body.content || '')
  const p = await queryOne(`INSERT INTO blog_posts
    (title,slug,excerpt,content,cover_image,author,category_id,tags,related_product_ids,
     is_published,is_featured,meta_title,meta_description,read_time,published_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [body.title,slug,body.excerpt,body.content,body.cover_image,body.author||'Admin',
     body.category_id,body.tags||[],body.related_product_ids||[],
     body.is_published||false,body.is_featured||false,body.meta_title,body.meta_description,
     read_time,body.is_published?new Date():null])
  return NextResponse.json(p, { status:201 })
}