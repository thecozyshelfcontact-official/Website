'use client'
import { createContext, useContext, useEffect, useState } from 'react'
const ThemeCtx = createContext({ theme:'light', toggle: () => {} })
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])
  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next); localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}
export const useTheme = () => useContext(ThemeCtx)