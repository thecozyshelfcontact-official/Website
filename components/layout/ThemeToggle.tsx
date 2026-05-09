'use client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-1" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-500" />}
    </button>
  )
}