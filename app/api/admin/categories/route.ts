import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET() {
  const cats = await query('SELECT * FROM categories ORDER BY name')
  return NextResponse.json(cats)
}

export async function POST(req: NextRequest) {
  if (!await getAdminSession()) return NextResponse.json({ error:'Unauthorized' }, { status:401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.name)
  const cat = await queryOne(
    'INSERT INTO categories(name,slug,description,image_url,icon) VALUES($1,$2,$3,$4,$5) RETURNING *',
    [body.name,slug,body.description,body.image_url,body.icon])
  return NextResponse.json(cat, { status:201 })
}