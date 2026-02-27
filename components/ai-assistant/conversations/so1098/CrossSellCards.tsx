'use client'

import type { CrossSellItem } from '@/lib/ai/types'

interface CrossSellCardsProps {
  items: CrossSellItem[]
  onToggle: (id: string) => void
  onAddSelected: () => void
  onSkip: () => void
}

export function CrossSellCards({
  items,
  onToggle,
  onAddSelected,
  onSkip,
}: CrossSellCardsProps) {
  const anyAdded = items.some((i) => i.added)

  return (
    <div className="my-3 space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border p-3 transition-all ${
            item.added
              ? 'border-tertiary-300 dark:border-tertiary-500/40 bg-tertiary-50/50 dark:bg-tertiary-500/10'
              : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-gray-800 dark:text-slate-200">
                {item.product}
              </div>
              <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mt-0.5">
                {item.code}
              </div>
              <div className="text-[12px] text-gray-500 dark:text-slate-400 mt-1">
                {item.detail}
              </div>
              {item.prevOrdered && (
                <span className="inline-block mt-1 text-[10px] text-tertiary-600 dark:text-tertiary-400 font-medium">
                  Previously ordered by this customer
                </span>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-[14px] font-semibold text-gray-800 dark:text-slate-200">
                ${item.price.toFixed(2)}
              </div>
              {item.qty > 1 && (
                <div className="text-[10px] text-gray-400 dark:text-slate-500">
                  {item.qty} x ${item.unitPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div
                className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-700"
                style={{ width: 60 }}
              >
                <div
                  className="h-full rounded-full bg-tertiary-500"
                  style={{ width: `${item.coPurchasePercent}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 dark:text-slate-400">
                {item.coPurchasePercent}% co-purchase
              </span>
            </div>
            <button
              onClick={() => onToggle(item.id)}
              className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-colors ${
                item.added
                  ? 'bg-tertiary-100 text-tertiary-700 dark:bg-tertiary-500/20 dark:text-tertiary-300'
                  : 'border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:border-tertiary-400 hover:text-tertiary-600 dark:hover:text-tertiary-400'
              }`}
            >
              {item.added ? '✓ Added' : '+ Add'}
            </button>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onSkip}
          className="text-[13px] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
        >
          No thanks
        </button>
        {anyAdded && (
          <button
            onClick={onAddSelected}
            className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-tertiary-600 text-white hover:bg-tertiary-700 transition-colors"
          >
            Add Selected to Quote
          </button>
        )}
      </div>
    </div>
  )
}
