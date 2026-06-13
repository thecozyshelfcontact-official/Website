import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { getAiProvider } from '@/services/ai/provider'
import { assertProductExtraction } from '@/services/ai/schema'

export async function POST(req: NextRequest) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const extraction = assertProductExtraction(body.extraction)
    const product = await getAiProvider().generateProductContent(extraction)
    return NextResponse.json({ product })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product content generation failed.' }, { status: 500 })
  }
}
