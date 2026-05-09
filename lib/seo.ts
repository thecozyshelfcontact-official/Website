export function generateMeta({ title, description, image, url, type = 'website' }: {
  title: string; description: string; image?: string; url?: string; type?: string
}) {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'DealRadar'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`
  return {
    title: fullTitle,
    description,
    openGraph: { title: fullTitle, description, type, siteName,
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
      url: url ? `${siteUrl}${url}` : siteUrl },
    twitter: { card: 'summary_large_image' as const, title: fullTitle, description,
      images: image ? [image] : [] },
    alternates: { canonical: url ? `${siteUrl}${url}` : siteUrl },
  }
}

export function productSchema(p: any) {
  return {
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.title, description: p.short_description,
    image: p.images?.[0]?.url,
    aggregateRating: p.rating ? { '@type': 'AggregateRating',
      ratingValue: p.rating, reviewCount: p.review_count } : undefined,
    offers: { '@type': 'Offer', price: p.price, priceCurrency: p.currency || 'USD',
      availability: 'https://schema.org/InStock' }
  }
}

export function blogSchema(post: any) {
  return {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.excerpt,
    image: post.cover_image, datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { '@type': 'Person', name: post.author || 'Admin' },
    publisher: { '@type': 'Organization',
      name: process.env.NEXT_PUBLIC_SITE_NAME || 'DealRadar' }
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem', position: i + 1, name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
    }))
  }
}