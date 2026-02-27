'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { classNames } from '@/lib/utils'

type Theme = 'light' | 'dark'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    // Migrate legacy "system" preference to "light"
    const resolved: Theme = stored === 'dark' ? 'dark' : 'light'
    console.log('[ThemeToggle] mount — stored:', stored, '→ resolved:', resolved, '| <html> classes:', document.documentElement.className)
    setTheme(resolved)
    applyTheme(resolved)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    localStorage.setItem('theme', newTheme)
    root.classList.toggle('dark', newTheme === 'dark')
    console.log('[ThemeToggle] applied:', newTheme, '| <html> classes:', root.className)
  }

  const handleToggle = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light'
    console.log('[ThemeToggle] toggle:', theme, '→', next)
    setTheme(next)
    applyTheme(next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={handleToggle}
      className={classNames(
        'relative inline-flex h-7 w-12 items-center rounded-full transition-colors',
        theme === 'dark' ? 'bg-slate-700' : 'bg-gray-200',
      )}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span
        className={classNames(
          'inline-flex size-5 items-center justify-center rounded-full bg-white dark:bg-slate-500 shadow-sm transition-transform',
          theme === 'dark' ? 'translate-x-6' : 'translate-x-1',
        )}
      >
        {theme === 'light' ? (
          <SunIcon className="size-3 text-amber-500" />
        ) : (
          <MoonIcon className="size-3 text-slate-200" />
        )}
      </span>
    </button>
  )
}
