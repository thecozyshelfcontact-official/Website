# The Cozy Shelf - AI Product Import System Specification

## Project Goal

Build an AI-powered product import system inside the existing Next.js admin panel for The Cozy Shelf.

The workflow should reduce product creation to:

1. Upload a product screenshot.
2. Gemini analyzes the screenshot and extracts product information.
3. Gemini generates all product fields according to The Cozy Shelf brand standards.
4. Gemini generates one lifestyle image prompt.
5. Gemini generates the lifestyle image.
6. Upload the generated image to Cloudinary.
7. Save the product directly to Supabase as a draft.
8. Show a generated product preview.
9. Allow the admin to regenerate content or image if needed.
10. Admin publishes when ready.

Do not use browser automation, Playwright, Puppeteer, or form filling for this workflow. Use direct API calls and direct database insertion only.

## Existing Stack

- Frontend: Next.js
- Database: Supabase
- Image storage: Cloudinary
- AI provider: Gemini API, free tier where possible

Use the latest Gemini multimodal model available through the Gemini API for both screenshot analysis and image generation.

## New Admin Page

Create:

```txt
/admin/ai-import
```

The page should include:

- Upload Screenshot
- Drag and drop support
- Uploaded image preview
- Generate Product button
- Generated Product Preview
- Regenerate Content button
- Regenerate Image button
- Save Draft button
- Publish button

## Complete Workflow

```txt
Upload Screenshot
-> Gemini Vision screenshot analysis
-> Structured product information extraction
-> Cozy Shelf product content generation
-> Lifestyle image prompt generation
-> Gemini lifestyle image generation
-> Cloudinary upload
-> Supabase draft insert
-> Preview
-> Optional regenerate content/image
-> Publish
```

## Product Extraction Requirements

Gemini must analyze the screenshot and extract:

- Product name
- Brand
- Price
- Category
- Key features
- Product specifications
- Customer likes
- Customer dislikes
- Rating
- Number of reviews

If the screenshot contains an Amazon AI review summary, use it heavily for:

- What We Love
- Worth Noting

## Structured JSON Requirement

Gemini extraction and content generation must return structured JSON, not free-form text.

Define strict TypeScript types and JSON schemas for:

- Screenshot extraction response
- Generated product content response
- Lifestyle image prompt response
- Save draft payload

Gemini responses must be validated before the UI renders a preview or the API writes to Supabase. If validation fails, show a helpful error and allow the admin to retry.

Example extraction schema shape:

```json
{
  "product_name": "string",
  "brand": "string | null",
  "price": "number | null",
  "category": "string | null",
  "key_features": ["string"],
  "specifications": {
    "dimensions": "string | null",
    "material": "string | null",
    "color": "string | null"
  },
  "customer_likes": ["string"],
  "customer_dislikes": ["string"],
  "rating": "number | null",
  "review_count": "number | null",
  "source_confidence": "low | medium | high",
  "missing_fields": ["string"]
}
```

## Cozy Shelf Brand Guidelines

Brand name: The Cozy Shelf

Brand personality:

- Cozy
- Warm
- Minimal
- Premium
- Pinterest-worthy
- Helpful
- Trustworthy

Writing style should feel like a friend recommending a beautiful, useful find.

Never sound:

- Pushy
- Aggressive
- Salesy
- Clickbait

Avoid phrases such as:

- Best ever
- Must buy
- Life changing

## Product Content Generation Rules

Generate:

- Title
- Slug
- Category
- Badge
- Tags
- Short description
- Full description
- What We Love
- Worth Noting
- Key features
- SEO meta title
- SEO meta description
- Pinterest caption
- Instagram caption
- YouTube Shorts hook
- CTA
- Lifestyle image prompt

Rules:

- Do not invent product specifications.
- Do not invent dimensions.
- Use only screenshot information.
- If dimensions are unavailable, leave dimensions blank.
- Use customer likes for What We Love.
- Use customer dislikes for Worth Noting.
- Avoid fake claims.
- Avoid exaggerated marketing language.
- Maintain a premium cozy tone.

## Lifestyle Image Generation Rules

Generate only one image prompt.

The same prompt will be used everywhere:

- Product card
- Product detail page
- Pinterest
- Social media

Image style must be:

- Realistic
- Professionally photographed
- Pinterest-worthy
- Premium
- Warm
- Natural

Image style must not be:

- Obviously AI generated
- Over-stylized
- Cartoonish
- Fantasy-like

## Product Scaling Rules

Before generating the image prompt:

1. Determine actual product dimensions if available.
2. Scale the product realistically in the scene.
3. Never enlarge the product unrealistically.
4. Never shrink the product unrealistically.
5. Never display dimensions in the image.
6. Never display measurement labels.

Example:

A 15cm moon lamp must appear approximately as a 15cm lamp, not a giant moon and not a tiny moon.

## Environment Rules

Place the product naturally in an appropriate environment.

Examples:

- Home decor: living room, bedroom, shelf styling
- Kitchen: real kitchen counter
- Desk setup: real desk environment
- Wellness: bathroom vanity or bedside table

Avoid:

- Floating products
- Isolated products
- White backgrounds
- Amazon-style product photos
- Excessive plants

Use plants minimally and only when appropriate.

## Image Composition Rules

Generated images should be suitable for:

- Product cards
- Product detail pages
- Pinterest pins

Requirements:

- Sharp when zoomed
- High resolution
- Professional composition
- Natural daylight preferred
- Avoid excessive evening or night scenes unless the product requires it

## Cloudinary Workflow

After image generation:

1. Upload the generated image to Cloudinary.
2. Receive `secure_url`.
3. Store `secure_url` in the product record.

Never require manual upload for generated images.

## Database Workflow

Insert directly into Supabase.

Do not use browser automation.

New products should be saved as:

```txt
status = draft
```

Admin reviews the generated preview.

When admin clicks Publish:

```txt
status = published
```

## Supabase Product Record

Required fields:

- title
- slug
- category
- badge
- tags
- short_description
- full_description
- what_we_love
- worth_noting
- key_features
- seo_title
- seo_description
- pinterest_caption
- instagram_caption
- youtube_hook
- cta
- image_prompt
- image_url
- affiliate_url
- status

Before implementation, compare these required fields against the existing Supabase schema. If the schema does not contain one or more fields, do not silently invent a database shape. Either map to existing fields or propose a migration separately.

## API Routes

Create:

```txt
/api/extract-product
/api/generate-product
/api/generate-image
/api/save-product
```

Responsibilities:

- `/api/extract-product`: receive screenshot upload, call Gemini Vision, return validated structured extraction JSON.
- `/api/generate-product`: receive extraction JSON, generate Cozy Shelf product content, return validated structured product JSON.
- `/api/generate-image`: receive the single lifestyle image prompt, generate image using Gemini, upload to Cloudinary, return `secure_url`.
- `/api/save-product`: receive validated product payload, insert or update product in Supabase as draft or published.

Use TypeScript throughout.

Use server actions where appropriate, but keep provider and database logic on the server.

## AI Service Architecture

Keep AI providers abstracted.

Create a service layer:

```txt
services/ai/gemini.ts
services/ai/types.ts
services/ai/schema.ts
```

Future providers should be swappable without changing admin page business logic:

- OpenAI
- Claude
- Gemini

The admin page should call app APIs or server actions, not Gemini directly.

## Preview And Regeneration

The generated preview page/state must include:

- Product title
- Category
- Price
- Rating and review count
- Short description
- Full description
- What We Love
- Worth Noting
- Key features
- SEO fields
- Social captions
- Lifestyle image prompt
- Generated lifestyle image
- Draft/publish status

Add:

- Regenerate Content button
- Regenerate Image button

Regenerate Content:

- Reuses the original screenshot extraction JSON.
- Does not require screenshot re-upload.
- Generates a fresh product content response.
- Preserves uploaded/generated image unless the admin also regenerates image.

Regenerate Image:

- Reuses the current lifestyle image prompt by default.
- Allows prompt edits before regeneration.
- Uploads the new image to Cloudinary.
- Replaces the preview image URL before saving.

## UI Requirements

The admin UI should match the existing admin style and stay usable:

- Clear step-by-step progress
- Loading states
- Failure states
- Validation errors
- Draft saved confirmation
- Published confirmation
- Disabled buttons while generation is running
- No over-designed or distracting visuals

Suggested progress states:

```txt
Uploading screenshot
Analyzing screenshot
Generating product content
Generating lifestyle image
Uploading image
Saving draft
Ready for review
Published
```

## Error Handling

Handle failures gracefully:

- Gemini extraction failure
- Gemini JSON validation failure
- Gemini image generation failure
- Cloudinary upload failure
- Supabase insert/update failure
- Missing required fields
- Unsupported screenshot file type
- Oversized image upload

Every error should show:

- What failed
- Whether retry is possible
- What the admin should do next

## Security And Environment Variables

Keep secrets server-side only.

Expected environment variables:

```txt
GEMINI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not expose Gemini, Cloudinary secret, or Supabase service role keys to the client.

## Success Criteria

The final workflow should allow:

```txt
Upload Screenshot
-> Generate Product
-> Review Draft
-> Optional Regenerate Content/Image
-> Publish
```

Target completion time:

- Approximately 30-60 seconds per product
- 50-100 products per day with minimal manual effort

The system is successful when an admin can create a high-quality draft product without browser automation, manual form filling, or manual image upload.
