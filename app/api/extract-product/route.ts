import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { uploadImageToCloudinary } from '@/lib/cloudinary'
import { getAiProvider } from '@/services/ai/provider'

const MAX_FILE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

export async function POST(req: NextRequest) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('screenshot')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Upload a product screenshot first.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Use a PNG, JPG, or WebP screenshot.' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Screenshot is too large. Use an image under 8MB.' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const imageBase64 = buffer.toString('base64')

    const [extraction, sourceUpload] = await Promise.all([
      getAiProvider().extractProduct({ imageBase64, mimeType: file.type }),
      uploadImageToCloudinary({
        buffer,
        filename: `source-${Date.now()}-${file.name}`,
        mimeType: file.type,
        folder: 'the-cozy-shelf/source-screenshots',
      }),
    ])

    return NextResponse.json({
      extraction: {
        ...extraction,
        source_screenshot_url: sourceUpload.secure_url,
      },
      source_screenshot_url: sourceUpload.secure_url
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Product extraction failed.' }, { status: 500 })
  }
}