'use client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="p-2 rounded-full text-cozy-500 hover:text-bark hover:bg-linen transition-colors ml-1" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} className="text-warm-500" /> : <Moon size={18} />}
    </button>
  )
}
