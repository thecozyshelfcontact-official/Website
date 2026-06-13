'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  AlertCircle,
  CheckCircle2,
  ImagePlus,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react'
import type { GeneratedProductContent, ProductExtraction } from '@/services/ai/types'

type ProgressState =
    | 'idle'
    | 'uploading'
    | 'extracting'
    | 'generating-content'
    | 'saving-draft'
    | 'ready'
    | 'publishing'

const steps = [
  ['uploading',          'Uploading screenshot'],
  ['extracting',         'Analyzing screenshot'],
  ['generating-content', 'Generating product content'],
  ['saving-draft',       'Saving draft'],
  ['ready',              'Ready for review'],
] as const

export default function AiImportPage() {
  // ── screenshot ──────────────────────────────────────────────────────────────
  const [file, setFile]             = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // ── AI results ──────────────────────────────────────────────────────────────
  const [extraction, setExtraction]               = useState<ProductExtraction | null>(null)
  const [product, setProduct]                     = useState<GeneratedProductContent | null>(null)
  const [sourceScreenshotUrl, setSourceScreenshotUrl] = useState<string | null>(null)
  const [productId, setProductId]                 = useState<string | null>(null)

  // ── lifestyle image ─────────────────────────────────────────────────────────
  const [imageUrl, setImageUrl]                   = useState<string | null>(null)
  const [lifestyleFile, setLifestyleFile]         = useState<File | null>(null)
  const [lifestylePreview, setLifestylePreview]   = useState<string | null>(null)
  const [uploadingImage, setUploadingImage]       = useState(false)
  const lifestyleInputRef                         = useRef<HTMLInputElement>(null)

  // ── UI state ────────────────────────────────────────────────────────────────
  const [progress, setProgress] = useState<ProgressState>('idle')
  const [error, setError]       = useState<string | null>(null)

  const busy         = !['idle', 'ready'].includes(progress)
  const progressIndex = steps.findIndex(([key]) => key === progress)
  const contentReady = progress === 'ready' && !!product

  // ── screenshot picker ────────────────────────────────────────────────────────
  const chooseFile = (next: File | null) => {
    setFile(next)
    setError(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(next ? URL.createObjectURL(next) : null)
  }

  // ── main pipeline ────────────────────────────────────────────────────────────
  const run = async () => {
    if (!file) { setError('Upload a product screenshot first.'); return }
    try {
      setError(null)
      setProgress('uploading')
      const form = new FormData()
      form.set('screenshot', file)

      setProgress('extracting')
      const extracted = await postForm('/api/extract-product', form)
      setExtraction(extracted.extraction)
      setSourceScreenshotUrl(extracted.source_screenshot_url)

      setProgress('generating-content')
      const generated = await postJson('/api/generate-product', { extraction: extracted.extraction })
      setProduct(generated.product)

      setProgress('saving-draft')
      const saved = await saveProduct(generated.product, null, extracted.extraction, 'draft', extracted.source_screenshot_url)
      setProductId(saved.product.id)

      setProgress('ready')
      toast.success('Draft saved — upload a lifestyle image below.')
    } catch (err: any) {
      setProgress('idle')
      setError(err.message || 'AI import failed.')
      toast.error(err.message || 'AI import failed.')
    }
  }

  // ── lifestyle image picker ───────────────────────────────────────────────────
  const chooseLifestyleFile = (next: File | null) => {
    setLifestyleFile(next)
    if (lifestylePreview) URL.revokeObjectURL(lifestylePreview)
    setLifestylePreview(next ? URL.createObjectURL(next) : null)
  }

  // ── upload lifestyle image → Cloudinary → save to DB ────────────────────────
  const uploadLifestyleImage = async () => {
    if (!lifestyleFile || !product) return
    try {
      setUploadingImage(true)
      setError(null)

      const form = new FormData()
      form.set('image', lifestyleFile)

      const res = await fetch('/api/upload-lifestyle-image', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      const url: string = data.image_url
      setImageUrl(url)

      // Persist the new image URL into the existing draft
      const saved = await saveProduct(product, url, extraction, 'draft', sourceScreenshotUrl, productId)
      setProductId(saved.product.id)

      // Clear picker — preview is now served from the saved URL
      setLifestyleFile(null)
      if (lifestylePreview) URL.revokeObjectURL(lifestylePreview)
      setLifestylePreview(null)

      toast.success('Lifestyle image uploaded and saved!')
    } catch (err: any) {
      setError(err.message || 'Image upload failed.')
      toast.error(err.message || 'Image upload failed.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeLifestyleImage = () => {
    setImageUrl(null)
    setLifestyleFile(null)
    if (lifestylePreview) URL.revokeObjectURL(lifestylePreview)
    setLifestylePreview(null)
  }

  // ── regenerate content ───────────────────────────────────────────────────────
  const regenerateContent = async () => {
    if (!extraction) return
    try {
      setError(null)
      setProgress('generating-content')
      const generated = await postJson('/api/generate-product', { extraction })
      setProduct(generated.product)
      setProgress('saving-draft')
      const saved = await saveProduct(generated.product, imageUrl, extraction, 'draft', sourceScreenshotUrl, productId)
      setProductId(saved.product.id)
      setProgress('ready')
      toast.success('Content regenerated.')
    } catch (err: any) {
      setProgress('ready')
      setError(err.message || 'Could not regenerate content.')
    }
  }

  // ── save / publish ───────────────────────────────────────────────────────────
  const saveDraft = async () => {
    if (!product) return
    try {
      setError(null)
      setProgress('saving-draft')
      const saved = await saveProduct(product, imageUrl, extraction, 'draft', sourceScreenshotUrl, productId)
      setProductId(saved.product.id)
      setProgress('ready')
      toast.success('Draft saved.')
    } catch (err: any) {
      setProgress('ready')
      setError(err.message || 'Could not save draft.')
    }
  }

  const publish = async () => {
    if (!product) return
    try {
      setError(null)
      setProgress('publishing')
      const saved = await saveProduct(product, imageUrl, extraction, 'published', sourceScreenshotUrl, productId)
      setProductId(saved.product.id)
      setProgress('ready')
      toast.success('Product published.')
    } catch (err: any) {
      setProgress('ready')
      setError(err.message || 'Could not publish product.')
    }
  }

  const saveProduct = (
      nextProduct: GeneratedProductContent,
      nextImageUrl: string | null | undefined,
      nextExtraction: ProductExtraction | null,
      status: 'draft' | 'published',
      nextSourceScreenshotUrl: string | null | undefined,
      id?: string | null,
  ) => postJson('/api/save-product', {
    product_id: id || productId || undefined,
    extraction: nextExtraction || undefined,
    product: nextProduct,
    image_url: nextImageUrl ?? imageUrl,
    source_screenshot_url: nextSourceScreenshotUrl ?? sourceScreenshotUrl,
    status,
  })

  // ── render ───────────────────────────────────────────────────────────────────
  return (
      <div className="space-y-6 pb-10">
        <div>
          <p className="eyebrow mb-2">AI Import</p>
          <h1 className="font-serif text-3xl font-bold text-cozy-900">Generate Product From Screenshot</h1>
          <p className="text-cozy-500 text-sm mt-1 max-w-2xl">
            Upload a product screenshot to extract data and generate Cozy Shelf content.
            Then upload your own lifestyle image — it's stored in Cloudinary and linked to the draft.
          </p>
        </div>

        {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-warm-200 bg-warm-50 px-4 py-3 text-sm text-warm-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6">
          {/* ── LEFT COLUMN ───────────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Screenshot upload */}
            <section className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy">
              <div className="flex items-center gap-2 mb-4">
                <UploadCloud size={18} className="text-bark" />
                <h2 className="font-serif text-xl font-bold text-cozy-900">Screenshot Upload</h2>
              </div>
              <label
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); chooseFile(e.dataTransfer.files?.[0] || null) }}
                  className="block cursor-pointer rounded-3xl border border-dashed border-cozy-300 bg-linen/70 p-6 text-center hover:border-bark transition-colors"
              >
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={e => chooseFile(e.target.files?.[0] || null)}
                />
                <ImagePlus className="mx-auto mb-3 text-cozy-500" size={28} />
                <p className="font-medium text-cozy-800">Drop a screenshot here or click to upload</p>
                <p className="text-xs text-cozy-500 mt-1">PNG, JPG, or WebP under 8 MB</p>
              </label>
              {previewUrl && (
                  <div className="relative mt-4 aspect-video overflow-hidden rounded-2xl border border-cozy-200 bg-linen">
                    <Image src={previewUrl} alt="Uploaded screenshot preview" fill className="object-contain" />
                  </div>
              )}
            </section>

            {/* Generate button */}
            <section className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-bark" />
                <h2 className="font-serif text-xl font-bold text-cozy-900">Generate Product</h2>
              </div>
              <button onClick={run} disabled={busy || !file} className="btn-primary w-full">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generate Product
              </button>
            </section>

            {/* Progress tracker */}
            <section className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy">
              <h2 className="font-serif text-xl font-bold text-cozy-900 mb-4">Progress</h2>
              <div className="space-y-3">
                {steps.map(([key, label], index) => {
                  const done   = progress === 'ready' || (progressIndex >= 0 && index < progressIndex)
                  const active = key === progress
                  return (
                      <div key={key} className="flex items-center gap-3 text-sm">
                    <span className={`h-7 w-7 rounded-full flex items-center justify-center border ${
                        done   ? 'bg-sage-600 border-sage-600 text-cream' :
                            active ? 'border-bark text-bark bg-linen' :
                                'border-cozy-200 text-cozy-300'
                    }`}>
                      {done   ? <CheckCircle2 size={15} /> :
                          active ? <Loader2 size={15} className="animate-spin" /> :
                              index + 1}
                    </span>
                        <span className={active ? 'font-semibold text-cozy-900' : 'text-cozy-600'}>{label}</span>
                      </div>
                  )
                })}
              </div>
            </section>

            {/* ── Lifestyle image upload (appears after content is ready) ─────── */}
            {contentReady && (
                <section className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy">
                  <div className="flex items-center gap-2 mb-1">
                    <ImagePlus size={18} className="text-bark" />
                    <h2 className="font-serif text-xl font-bold text-cozy-900">Lifestyle Image</h2>
                  </div>
                  <p className="text-xs text-cozy-500 mb-4">
                    Generate your image using the prompt in the preview panel, then upload it here.
                  </p>

                  {/* Current saved image preview */}
                  {imageUrl && (
                      <div className="relative mb-4 aspect-video overflow-hidden rounded-2xl border border-cozy-200 bg-linen">
                        <Image src={imageUrl} alt="Lifestyle image" fill className="object-cover" />
                        <button
                            onClick={removeLifestyleImage}
                            className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
                            title="Remove image"
                        >
                          <X size={14} className="text-cozy-700" />
                        </button>
                        <span className="absolute bottom-2 left-2 rounded-full bg-sage-600/90 px-2 py-0.5 text-[11px] text-cream font-medium">
                    Saved to Cloudinary
                  </span>
                      </div>
                  )}

                  {/* Pick a new file */}
                  {!imageUrl && (
                      <label
                          onDragOver={e => e.preventDefault()}
                          onDrop={e => { e.preventDefault(); chooseLifestyleFile(e.dataTransfer.files?.[0] || null) }}
                          className="block cursor-pointer rounded-3xl border border-dashed border-cozy-300 bg-linen/70 p-5 text-center hover:border-bark transition-colors"
                      >
                        <input
                            ref={lifestyleInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={e => chooseLifestyleFile(e.target.files?.[0] || null)}
                        />
                        <UploadCloud className="mx-auto mb-2 text-cozy-400" size={24} />
                        <p className="text-sm font-medium text-cozy-800">Drop your lifestyle image or click to browse</p>
                        <p className="text-xs text-cozy-500 mt-1">PNG, JPG, or WebP — recommended 1024×1024</p>
                      </label>
                  )}

                  {/* Selected-but-not-yet-uploaded preview */}
                  {lifestylePreview && !imageUrl && (
                      <div className="mt-4 space-y-3">
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-cozy-200 bg-linen">
                          <Image src={lifestylePreview} alt="Lifestyle preview" fill className="object-cover" />
                          <button
                              onClick={() => chooseLifestyleFile(null)}
                              className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white shadow"
                          >
                            <X size={14} className="text-cozy-700" />
                          </button>
                        </div>
                        <button
                            onClick={uploadLifestyleImage}
                            disabled={uploadingImage}
                            className="btn-primary w-full"
                        >
                          {uploadingImage
                              ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
                              : <><UploadCloud size={16} /> Upload to Cloudinary & Save</>}
                        </button>
                      </div>
                  )}

                  {/* Replace button once image is saved */}
                  {imageUrl && (
                      <button
                          onClick={() => { setImageUrl(null); setLifestyleFile(null); setLifestylePreview(null) }}
                          className="btn-outline w-full mt-3 text-xs"
                      >
                        <RefreshCw size={13} /> Replace Image
                      </button>
                  )}
                </section>
            )}
          </div>

          {/* ── RIGHT COLUMN — product preview ────────────────────────────────── */}
          <section className="bg-cream rounded-3xl border border-cozy-200 p-6 shadow-cozy min-h-[520px]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="font-serif text-xl font-bold text-cozy-900">Generated Product Preview</h2>
                <p className="text-xs text-cozy-500 mt-1">
                  {productId ? `Draft ID: ${productId}` : 'Preview appears after generation.'}
                </p>
              </div>
              {product && (
                  <div className="flex flex-wrap gap-2">
                    <button onClick={regenerateContent} disabled={busy} className="btn-outline text-xs py-2 px-3">
                      <RefreshCw size={13} /> Content
                    </button>
                  </div>
              )}
            </div>

            {!product ? (
                <div className="h-[420px] rounded-3xl bg-linen border border-cozy-200 flex items-center justify-center text-center px-6">
                  <div>
                    <Sparkles className="mx-auto text-cozy-400 mb-3" />
                    <p className="font-serif text-lg text-cozy-700">Your generated Cozy Shelf product will appear here.</p>
                  </div>
                </div>
            ) : (
                <div className="space-y-5">
                  {/* Image preview or placeholder */}
                  {imageUrl ? (
                      <div className="relative aspect-video overflow-hidden rounded-3xl border border-cozy-200 bg-linen shadow-cozy">
                        <Image src={imageUrl} alt={product.title} fill className="object-cover" />
                      </div>
                  ) : (
                      <div className="aspect-video rounded-3xl border-2 border-dashed border-cozy-200 bg-linen flex flex-col items-center justify-center text-center px-6 gap-2">
                        <ImagePlus className="text-cozy-300" size={32} />
                        <p className="text-sm text-cozy-500 font-medium">No lifestyle image yet</p>
                        <p className="text-xs text-cozy-400">
                          Use the prompt below → generate externally → upload in the panel on the left
                        </p>
                      </div>
                  )}

                  {/* Product info */}
                  <div>
                    <p className="eyebrow mb-2">{product.category}</p>
                    <h3 className="font-serif text-3xl font-bold text-cozy-900">{product.title}</h3>
                    <p className="text-cozy-600 mt-2 leading-relaxed">{product.short_description}</p>
                  </div>

                  <PreviewList title="What We Love"  items={product.what_we_love} />
                  <PreviewList title="Worth Noting"  items={product.worth_noting} />
                  <PreviewList title="Key Features"  items={product.key_features} />

                  {/* Editable image prompt */}
                  <div className="rounded-2xl bg-linen border border-cozy-200 p-4">
                    <h4 className="font-serif font-bold text-cozy-900 mb-1">Lifestyle Image Prompt</h4>
                    <p className="text-xs text-cozy-400 mb-2">
                      Copy this into Midjourney, DALL-E, Ideogram, or any image generator, then upload the result on the left.
                    </p>
                    <textarea
                        className="input-cozy text-xs w-full"
                        rows={5}
                        value={product.image_prompt}
                        onChange={e => setProduct({ ...product, image_prompt: e.target.value })}
                    />
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button onClick={saveDraft} disabled={busy} className="btn-outline">
                      <Save size={16} /> Save Draft
                    </button>
                    <button onClick={publish} disabled={busy} className="btn-primary">
                      {progress === 'publishing'
                          ? <Loader2 size={16} className="animate-spin" />
                          : <Send size={16} />}
                      Publish
                    </button>
                  </div>
                </div>
            )}
          </section>
        </div>
      </div>
  )
}

function PreviewList({ title, items }: { title: string; items: string[] }) {
  return (
      <div>
        <h4 className="font-serif font-bold text-cozy-900 mb-2">{title}</h4>
        <ul className="space-y-2">
          {items.map(item => (
              <li key={item} className="rounded-2xl border border-cozy-200 bg-linen/70 px-4 py-2 text-sm text-cozy-700">
                {item}
              </li>
          ))}
        </ul>
      </div>
  )
}

async function postForm(url: string, body: FormData) {
  const res  = await fetch(url, { method: 'POST', body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

async function postJson(url: string, body: unknown) {
  const res  = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}