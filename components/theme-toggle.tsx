'use client'

import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { classNames } from '@/lib/utils'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    setTheme(stored || 'light') // Default to light
    applyTheme(stored || 'light')
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement

    if (newTheme === 'system') {
      localStorage.setItem('theme', 'system')
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemDark)
    } else {
      localStorage.setItem('theme', newTheme)
      root.classList.toggle('dark', newTheme === 'dark')
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) return null // Avoid hydration mismatch

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 dark:bg-slate-800 p-0.5">
      <button
        onClick={() => handleThemeChange('light')}
        className={classNames(
          theme === 'light'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300',
          'p-1.5 rounded-md transition-all'
        )}
        title="Light mode"
      >
        <SunIcon className="size-4" />
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={classNames(
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300',
          'p-1.5 rounded-md transition-all'
        )}
        title="System preference"
      >
        <ComputerDesktopIcon className="size-4" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={classNames(
          theme === 'dark'
            ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
            : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300',
          'p-1.5 rounded-md transition-all'
        )}
        title="Dark mode"
      >
        <MoonIcon className="size-4" />
      </button>
    </div>
  )
}
