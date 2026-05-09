import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

export function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export function calcDiscount(price: number, originalPrice: number) {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round((1 - price / originalPrice) * 100)
}

export function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function readingTime(content: string) {
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}