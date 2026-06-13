import { slugify } from '@/lib/utils'
import {
  assertGeneratedProduct,
  assertProductExtraction,
  generatedProductSchema,
  productExtractionSchema,
} from './schema'
import type { AiProvider, ProductExtraction } from './types'

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models'

function apiKey() {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('Missing GEMINI_API_KEY')
  return key
}

function textModel() {
  return process.env.GEMINI_MULTIMODAL_MODEL || process.env.GEMINI_TEXT_MODEL || 'gemini-3.1-flash-lite'
}

async function generateJson<T>(model: string, body: any, errorLabel: string): Promise<T> {
  const res = await fetch(`${GEMINI_ENDPOINT}/${model}:generateContent?key=${apiKey()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.error?.message || `${errorLabel} failed`)
  }
  const text = data?.candidates?.[0]?.content?.parts?.find((part: any) => part.text)?.text
  if (!text) throw new Error(`${errorLabel} returned an empty response`)
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`${errorLabel} returned invalid JSON`)
  }
}

export const geminiProvider: AiProvider = {
  async extractProduct({ imageBase64, mimeType }) {
    const json = await generateJson<any>(textModel(), {
      contents: [{
        role: 'user',
        parts: [
          {
            text: [
              'Analyze this product screenshot for The Cozy Shelf admin import system.',
              'Return strict JSON only.',
              'Use only information visible in the screenshot.',
              'Do not invent product specs, dimensions, claims, ratings, review counts, or prices.',
              'If dimensions or specs are unavailable, use null or an empty list.',
              'If an Amazon AI review summary is visible, use positives as pros and negatives as cons.',
            ].join('\n'),
          },
          { inlineData: { mimeType, data: imageBase64 } },
        ],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: productExtractionSchema,
      },
    }, 'Product extraction')
    return assertProductExtraction(json)
  },

  async generateProductContent(extraction: ProductExtraction) {
    const json = await generateJson<any>(textModel(), {
      contents: [{
        role: 'user',
        parts: [{
          text: [
            'Generate The Cozy Shelf product content from this extraction JSON.',
            'Return strict JSON only. Never return markdown fences or prose outside JSON.',

            'BRAND VOICE:',
            'Tone: cozy, warm, premium, minimal, Pinterest-worthy, helpful, trustworthy.',
            'Never sound pushy, aggressive, salesy, clickbait, exaggerated, or hype-driven.',
            'Write for real shoppers, not SEO bots.',

            'CONTENT ACCURACY RULES:',
            'Use ONLY information present in the extraction JSON.',
            'The extraction JSON is derived from Amazon screenshots and product information.',
            'Never invent product specifications, dimensions, certifications, materials, colors, smart features, compatibility claims, warranties, technical details, or performance claims.',
            'If information is unavailable, omit it.',
            'Do not guess.',

            'DESCRIPTION RULES:',
            'Focus on how the product fits into a real home.',
            'Explain realistic use cases.',
            'Keep descriptions warm, useful, and trustworthy.',
            'Avoid fake luxury language.',
            'Avoid generic marketing filler.',
            'Avoid phrases like:',
            '- game changer',
            '- must have',
            '- life changing',
            '- revolutionary',
            '- ultimate solution',
            '- best ever',
            '- unbeatable',

            '',

            'REVIEW SUMMARY RULES:',
            'If Amazon AI review summary information exists:',

            'Use positive review points ONLY for what_we_love.',
            'Use negative review points ONLY for worth_noting.',

            'Never convert review comments into technical specifications.',
            'Never place customer opinions into key_features.',

            'Examples:',
            'Correct:',
            'What We Love:',
            '- Customers frequently praise the appearance.',
            '- Customers mention good value for money.',

            'Worth Noting:',
            '- Assembly is required.',
            '- Some customers mention brightness concerns.',

            'Incorrect:',
            'Key Features:',
            '- Easy assembly',
            '- Premium brightness',

            '',

            'WHAT WE LOVE RULES:',
            'Use customer positives when available.',
            'Use product strengths that are directly supported by listing information.',
            'Keep each item concise and useful.',

            '',

            'WORTH NOTING RULES (MANDATORY — NEVER LEAVE EMPTY):',
            'worth_noting MUST always contain at least 1 item. An empty array is a validation failure.',
            'Source material in this order of priority:',
            '1. cons[] from the extraction JSON — map every con directly into worth_noting, do not skip any.',
            '2. Customer negatives or complaints from any review summary in the extraction.',
            '3. Physical setup requirements (assembly required, wall mount needed, batteries not included, etc.).',
            '4. If genuinely no negatives exist, include one neutral practical consideration such as "Check dimensions before ordering." or "Style may not suit all decors."',
            'Brand voice (cozy/warm tone) does NOT apply to worth_noting — write plainly and objectively.',
            'Do NOT sugarcoat, minimize, or add positive caveats.',
            'Keep language objective, transparent, and neutral.',

            'Examples:',
            '- Assembly required.',
            '- Ceiling installation required.',
            '- Requires wall mounting.',
            '- Larger footprint than some alternatives.',

            '',

            'KEY FEATURES RULES:',
            'Use ONLY factual product information.',
            'Only include features explicitly visible in:',
            '- Product title',
            '- Product description',
            '- Product specifications',
            '- Product images',
            '- Extraction JSON',

            'Never use customer opinions as features.',

            '',

            'IMAGE PROMPT RULES:',
            'Generate exactly ONE master lifestyle image prompt.',

            'The image must work for:',
            '- Product cards',
            '- Product detail pages',
            '- Homepage collections',
            '- Pinterest',
            '- Blog posts',

            '',

            'PRODUCT ACCURACY:',
            'Analyze the product carefully and describe ONLY visible characteristics.',
            'Identify:',
            '- Shape',
            '- Color',
            '- Visible materials',
            '- Design style',
            '- Intended use',

            'Never invent:',
            '- Dimensions',
            '- Materials not visible',
            '- Extra accessories',
            '- Additional product variants',
            '- Features not present',

            '',

            'REALISTIC SCALE RULES (EXTREMELY IMPORTANT):',
            'Use the Amazon listing images as the primary scale reference.',
            'The product must appear at realistic consumer scale.',
            'Match proportions seen in the original listing images.',

            'Avoid:',
            '- Oversized luxury-showroom scaling',
            '- Miniaturized products',
            '- Unrealistic proportions',

            'The final image should look exactly like a real customer installed or placed the product in a real home.',

            '',

            'ROOM PLACEMENT RULES:',
            'Place the product only where it would naturally be used.',

            'Examples:',
            '- Chandelier -> living room, dining room, bedroom',
            '- Desk lamp -> desk setup',
            '- Moon lamp -> bedside table',
            '- Kitchen organizer -> kitchen countertop',

            '',

            'VISUAL STYLE:',
            '- Ultra realistic',
            '- Premium interior styling',
            '- Bright natural daylight unless product requires darkness',
            '- Warm neutral color palette',
            '- Cozy atmosphere',
            '- Magazine-quality photography',
            '- Clean composition',
            '- Natural shadows',
            '- Realistic reflections',

            'Avoid:',
            '- AI-looking interiors',
            '- Fantasy environments',
            '- Excessive plants',
            '- Excessive decor clutter',
            '- Unrealistic lighting',
            '- Empty showroom environments',

            '',

            'COMPOSITION RULES:',
            'The product must be clearly visible.',
            'The environment should support the product without overpowering it.',
            'The product should feel naturally integrated into the room.',
            'Use professional interior photography composition.',

            '',

            'MANDATORY IMAGE PROMPT PHRASES:',
            'The generated image prompt must explicitly include:',
            '- realistic product proportions',
            '- scale matched to Amazon listing images',
            '- realistic residential environment',
            '- photorealistic',
            '- high-resolution 3072x3072 quality',
            '- suitable for ecommerce product cards',
            '- suitable for zoom viewing',
            '- no text',
            '- no logos',
            '- no watermark',
            '- no exaggerated AI effects',

            '',

            `Fallback slug if needed should derive from: ${slugify(extraction.product_name || 'cozy-find')}`,

            '',

            JSON.stringify(extraction),
          ].join('\n')
          ,
        }],
      }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: generatedProductSchema,
      },
    }, 'Product content generation')
    const product = assertGeneratedProduct(json)
    return { ...product, slug: slugify(product.slug || product.title) }
  },

}