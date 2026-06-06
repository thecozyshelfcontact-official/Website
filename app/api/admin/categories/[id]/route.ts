import { NextRequest, NextResponse } from 'next/server'
import { query, queryOne } from '@/lib/db'
import { getAdminSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug || slugify(body.name)
  const cat = await queryOne(
    'UPDATE categories SET name=$1, slug=$2, description=$3, image_url=$4, icon=$5 WHERE id=$6 RETURNING *',
    [body.name, slug, body.description, body.image_url, body.icon, params.id]
  )
  return NextResponse.json(cat)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await query('DELETE FROM categories WHERE id=$1', [params.id])
  return NextResponse.json({ ok: true })
}
