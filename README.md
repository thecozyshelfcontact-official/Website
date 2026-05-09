# 🛍️ DealRadar — Affiliate Product Site

Full-stack affiliate product recommendation site built with Next.js 14, PostgreSQL (Supabase), and Tailwind CSS.

## Stack
- **Frontend**: Next.js 14 App Router, React 18, Tailwind CSS
- **Database**: PostgreSQL via Supabase (direct pg connection)
- **Images**: Cloudinary (free tier)
- **Auth**: JWT + bcrypt (admin only)
- **Hosting**: Vercel (free tier)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env.local
# Fill in your Supabase, Cloudinary credentials
```

### 3. Generate admin password hash
```bash
node -e "const b=require('bcryptjs');b.hash('yourpassword',10).then(console.log)"
# Paste output as ADMIN_PASSWORD_HASH in .env.local
```

### 4. Run database migration
```bash
npm run db:migrate
```

### 5. Start development server
```bash
npm run dev
# Open http://localhost:3000
# Admin: http://localhost:3000/admin
```

## Deploy to Vercel
1. Push to GitHub
2. Connect repo on vercel.com
3. Add all .env.local vars in Vercel Dashboard
4. Deploy!

## Admin Panel
Visit `/admin` to manage products, blog posts, categories, and affiliate links.

## Affiliate Networks to Join
- Amazon Associates: affiliate-program.amazon.com
- Impact: impact.com  
- CJ Affiliate: cj.com
- ClickBank: clickbank.com
- Digistore24: digistore24.com
