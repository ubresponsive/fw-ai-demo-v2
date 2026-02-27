'use client'

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { OCRItem } from '@/lib/ai/types'
import { UOM_OPTIONS } from '@/lib/ai/data/quote-1098'

interface OCRGridProps {
  items: OCRItem[]
  onChange: (items: OCRItem[]) => void
  onSearchCatalogue: () => void
}

export function OCRGrid({ items, onChange, onSearchCatalogue }: OCRGridProps) {
  const updateItem = (id: string, field: keyof OCRItem, value: string | number) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id))
  }

  const addItem = () => {
    const nextId = String(Math.max(0, ...items.map((i) => Number(i.id))) + 1)
    onChange([...items, { id: nextId, description: '', qty: 1, uom: 'EA' }])
  }

  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_60px_70px_28px] gap-1 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        <div>Description</div>
        <div className="text-center">Qty</div>
        <div className="text-center">UOM</div>
        <div />
      </div>

      {/* Rows */}
      {items.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[1fr_60px_70px_28px] gap-1 px-3 py-1.5 border-b border-gray-100 dark:border-slate-700 items-center"
        >
          <input
            type="text"
            value={item.description}
            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            className="w-full text-[13px] px-2 py-1 rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 focus:outline-none focus:border-tertiary-400"
          />
          <input
            type="number"
            value={item.qty}
            min={1}
            onChange={(e) => updateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))}
            className="w-full text-[13px] px-2 py-1 rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 text-center focus:outline-none focus:border-tertiary-400"
          />
          <select
            value={item.uom}
            onChange={(e) => updateItem(item.id, 'uom', e.target.value)}
            className="w-full text-[12px] px-1 py-1 rounded border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 focus:outline-none focus:border-tertiary-400"
          >
            {UOM_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeItem(item.id)}
            className="p-0.5 text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={addItem}
          className="flex items-center gap-1 text-[12px] text-tertiary-600 dark:text-tertiary-400 hover:text-tertiary-700 dark:hover:text-tertiary-300 font-medium"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Add Row
        </button>
        <button
          onClick={onSearchCatalogue}
          disabled={items.length === 0}
          className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-tertiary-600 text-white hover:bg-tertiary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Search Catalogue
        </button>
      </div>
    </div>
  )
}
