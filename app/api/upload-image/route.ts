import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { dataUrlToBuffer, uploadImageToCloudinary } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    if (!await getAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('image')
      if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
      const buffer = Buffer.from(await file.arrayBuffer())
      const upload = await uploadImageToCloudinary({
        buffer,
        filename: file.name,
        mimeType: file.type || 'image/png',
      })
      return NextResponse.json({ image_url: upload.secure_url })
    }

    const { data_url, filename = `image-${Date.now()}.png` } = await req.json()
    if (!data_url) return NextResponse.json({ error: 'data_url is required.' }, { status: 400 })
    const image = dataUrlToBuffer(data_url)
    const upload = await uploadImageToCloudinary({
      buffer: image.buffer,
      filename,
      mimeType: image.mimeType,
    })
    return NextResponse.json({ image_url: upload.secure_url })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Image upload failed.' }, { status: 500 })
  }
}
