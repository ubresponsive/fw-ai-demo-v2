'use client'

import { useState, useEffect } from 'react'

interface ProcessingChecklistProps {
  items: string[]
  onComplete: () => void
  stepDelay?: number
}

export function ProcessingChecklist({
  items,
  onComplete,
  stepDelay = 350,
}: ProcessingChecklistProps) {
  const [completedCount, setCompletedCount] = useState(0)

  useEffect(() => {
    if (completedCount >= items.length) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setCompletedCount((c) => c + 1)
    }, stepDelay)
    return () => clearTimeout(t)
  }, [completedCount, items.length, stepDelay, onComplete])

  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-3 space-y-2">
      {items.map((item, i) => {
        const done = i < completedCount
        const active = i === completedCount && completedCount < items.length
        return (
          <div key={i} className="flex items-center gap-2.5">
            {/* Indicator */}
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              {done ? (
                <span className="text-emerald-500 text-sm animate-scale-in">&#10003;</span>
              ) : active ? (
                <div className="w-4 h-4 border-2 border-tertiary-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-200 dark:border-slate-600" />
              )}
            </div>
            <span
              className={`text-[13px] transition-colors duration-200 ${
                done
                  ? 'text-gray-800 dark:text-slate-200'
                  : active
                    ? 'text-gray-700 dark:text-slate-300 font-medium'
                    : 'text-gray-400 dark:text-slate-500'
              }`}
            >
              {item}
            </span>
          </div>
        )
      })}
    </div>
  )
}
