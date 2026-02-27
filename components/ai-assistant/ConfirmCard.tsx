'use client'

import type { ConfirmField } from '@/lib/ai/types'

interface ConfirmCardProps {
  title: string
  fields: ConfirmField[]
  onApply?: () => void
  onCancel?: () => void
}

export function ConfirmCard({
  title,
  fields,
  onApply,
  onCancel,
}: ConfirmCardProps) {
  const hasNewColumn = fields.some((f) => f.new !== null)

  return (
    <div className="my-3 rounded-lg border-2 border-amber-300 dark:border-amber-500/50 overflow-hidden bg-amber-50/50 dark:bg-amber-500/5">
      <div className="px-4 py-3 bg-amber-100/50 dark:bg-amber-500/10 border-b border-amber-200/50 dark:border-amber-500/20 flex items-center gap-2">
        <span className="text-base">⚠</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">
          {title}
        </span>
      </div>
      <div className="px-4 py-3">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className="text-left py-1.5 text-gray-500 dark:text-slate-400 font-medium">
                Field
              </th>
              <th className="text-right py-1.5 text-gray-500 dark:text-slate-400 font-medium">
                Current
              </th>
              {hasNewColumn && (
                <th className="text-right py-1.5 text-gray-500 dark:text-slate-400 font-medium">
                  New
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={i}>
                <td className="py-1.5 text-gray-900 dark:text-slate-200">
                  {f.label}
                </td>
                <td
                  className={`py-1.5 text-right ${
                    f.highlight && f.new !== null
                      ? 'text-red-600 dark:text-red-400 font-semibold line-through'
                      : f.highlight
                        ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-gray-900 dark:text-slate-200'
                  }`}
                >
                  {f.current}
                </td>
                {f.new !== null && (
                  <td className="py-1.5 text-right text-emerald-600 dark:text-emerald-400 font-semibold">
                    {f.new}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onApply && (
        <div className="px-4 py-3 flex gap-2.5 border-t border-amber-200/30 dark:border-amber-500/15">
          <button
            onClick={onApply}
            className="flex-1 px-4 py-2.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors"
          >
            ✓ Apply Change
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 font-medium text-[13px] flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            ✕ Cancel
          </button>
        </div>
      )}
    </div>
  )
}
