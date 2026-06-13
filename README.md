# The Cozy Shelf

Next.js affiliate lifestyle site with an admin panel and AI product import workflow.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with:

```txt
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=
AI_PROVIDER=gemini
GEMINI_MULTIMODAL_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image-preview

ADMIN_USERNAME=
ADMIN_PASSWORD_HASH=
JWT_SECRET=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=The Cozy Shelf
```

Use the latest Gemini multimodal and image model IDs available in the Gemini API docs by updating `GEMINI_MULTIMODAL_MODEL` and `GEMINI_IMAGE_MODEL`.

## Database

Run migrations:

```bash
npm run db:migrate
```

The AI import fields are also available as a standalone SQL migration:

```txt
scripts/migrations/20260611_ai_import_fields.sql
```

## Development

```bash
npm run dev
```

Admin AI import page:

```txt
/admin/ai-import
```

## AI Product Import Workflow

The admin workflow is:

1. Upload product screenshot.
2. Gemini extracts product data as strict JSON.
3. Gemini generates Cozy Shelf content as strict JSON.
4. Gemini generates one realistic lifestyle image.
5. Cloudinary stores the generated image.
6. Product is saved as a draft in Supabase.
7. Admin reviews preview.
8. Admin can regenerate content or image.
9. Admin publishes when ready.

No browser automation, Playwright, Puppeteer, or form filling is used.
