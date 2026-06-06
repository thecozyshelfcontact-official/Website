import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'The Cozy Shelf — Curated Finds for a Warm & Beautiful Life',
    template: '%s | The Cozy Shelf',
  },
  description: 'Discover cozy home decor, aesthetic essentials, kitchen favorites, and wellness products curated for a warm and beautiful life.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  keywords: ['cozy home decor', 'home finds', 'aesthetic home products', 'kitchen essentials',
    'wellness products', 'cozy living', 'minimalist lifestyle', 'home inspiration'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-cream text-mocha">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#FAF7F2', color: '#3B2A20',
                border: '1px solid #E8DED3', borderRadius: '1rem',
                fontFamily: 'Inter, sans-serif',
              },
            }}
        />
      </ThemeProvider>
      </body>
      </html>
  )
}
