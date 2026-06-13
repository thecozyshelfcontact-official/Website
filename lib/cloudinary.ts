type CloudinaryUploadInput = {
  buffer: Buffer
  filename: string
  mimeType: string
  folder?: string
}

export function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/)
  if (!match) throw new Error('Invalid data URL')
  return {
    buffer: Buffer.from(match[2], 'base64'),
    mimeType: match[1],
  }
}

export async function uploadImageToCloudinary({
  buffer,
  filename,
  mimeType,
  folder = 'the-cozy-shelf/ai-imports',
}: CloudinaryUploadInput) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Missing Cloudinary environment variables')
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
  const signatureBuffer = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(signaturePayload))
  const signature = Array.from(new Uint8Array(signatureBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')

  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
  const form = new FormData()
  form.set('file', new Blob([arrayBuffer], { type: mimeType }), filename)
  form.set('api_key', apiKey)
  form.set('timestamp', String(timestamp))
  form.set('folder', folder)
  form.set('signature', signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed')
  }
  if (!data.secure_url) throw new Error('Cloudinary did not return secure_url')
  return {
    secure_url: data.secure_url as string,
    public_id: data.public_id as string,
  }
}
