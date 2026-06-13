import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'
import { uploadImageToCloudinary } from '@/lib/cloudinary'

/**
 * POST /api/upload-lifestyle-image
 *
 * Accepts a multipart/form-data request with an `image` file field.
 * Uploads to Cloudinary under the folder `the-cozy-shelf/lifestyle-images`
 * and returns { image_url } with the Cloudinary secure URL.
 *
 * The caller (ai-import page) is responsible for persisting
 * the URL to the database via /api/save-product.
 */
export async function POST(req: NextRequest) {
    try {
        if (!await getAdminSession()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const form = await req.formData()
        const file = form.get('image')

        if (!(file instanceof File)) {
            return NextResponse.json({ error: 'An image file is required (field name: "image").' }, { status: 400 })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `Unsupported file type "${file.type}". Please upload a JPEG, PNG, or WebP.` },
                { status: 400 },
            )
        }

        const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
        if (file.size > MAX_BYTES) {
            return NextResponse.json({ error: 'File exceeds the 10 MB size limit.' }, { status: 400 })
        }

        const buffer   = Buffer.from(await file.arrayBuffer())
        const filename = `lifestyle-${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`

        const upload = await uploadImageToCloudinary({
            buffer,
            filename,
            mimeType: file.type,
            folder:   'the-cozy-shelf/lifestyle-images',
        })

        return NextResponse.json({
            image_url:   upload.secure_url,
            public_id:   upload.public_id,
        })
    } catch (error: any) {
        console.error('[upload-lifestyle-image]', error)
        return NextResponse.json(
            { error: error.message || 'Lifestyle image upload failed.' },
            { status: 500 },
        )
    }
}