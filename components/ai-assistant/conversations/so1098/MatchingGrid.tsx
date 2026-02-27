'use client'

import { useState } from 'react'
import type { MatchedProduct } from '@/lib/ai/types'

interface MatchingGridProps {
  products: MatchedProduct[]
  onChange: (products: MatchedProduct[]) => void
  onAddSelected: () => void
}

const confidenceColor: Record<string, string> = {
  High: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  Low: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
}

export function MatchingGrid({ products, onChange, onAddSelected }: MatchingGridProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleSelect = (id: string) => {
    onChange(products.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const selectAlternative = (productId: string, altId: string) => {
    onChange(
      products.map((p) => {
        if (p.id !== productId || !p.alternatives) return p
        const alt = p.alternatives.find((a) => a.id === altId)
        if (!alt) return p
        return {
          ...p,
          matchedProduct: alt.product,
          code: alt.code,
          price: alt.price,
          confidence: 100,
          confidenceLabel: 'High' as const,
          selected: true,
        }
      })
    )
  }

  const selectSpec = (productId: string, optionLabel: string) => {
    onChange(
      products.map((p) => {
        if (p.id !== productId || !p.specQuery) return p
        const opt = p.specQuery.options.find((o) => o.label === optionLabel)
        if (!opt) return p
        return {
          ...p,
          matchedProduct: `Villaboard 2400x1200x${opt.thickness}`,
          code: opt.code,
          price: opt.price,
          confidence: 95,
          confidenceLabel: 'High' as const,
          specQuery: { ...p.specQuery, defaultOption: optionLabel },
        }
      })
    )
  }

  // Row 4 must have a selection (has alternatives, needs to be selected)
  const row4 = products.find((p) => p.id === '4')
  const canAdd = !row4 || row4.selected

  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[24px_1fr_70px_50px_60px_70px] gap-1 px-3 py-2 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600 text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
        <div />
        <div>Product</div>
        <div className="text-center">Conf.</div>
        <div className="text-center">Stock</div>
        <div className="text-right">Price</div>
        <div className="text-center">Select</div>
      </div>

      {/* Rows */}
      {products.map((p) => (
        <div key={p.id}>
          {/* Main row */}
          <div
            className={`grid grid-cols-[24px_1fr_70px_50px_60px_70px] gap-1 px-3 py-2 border-b border-gray-100 dark:border-slate-700 items-center ${
              p.confidence < 50 && !p.selected ? 'bg-red-50/50 dark:bg-red-500/5' : ''
            }`}
          >
            {/* Row number */}
            <div className="text-[11px] text-gray-400 dark:text-slate-500 font-mono">
              {p.id}
            </div>

            {/* Product info */}
            <div className="min-w-0">
              <div className="text-[12px] text-gray-500 dark:text-slate-400 truncate">
                {p.customerDescription}
              </div>
              {p.matchedProduct ? (
                <div className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate">
                  {p.matchedProduct}
                </div>
              ) : (
                <div className="text-[13px] text-red-500 dark:text-red-400 italic">
                  No direct match
                </div>
              )}
              {p.code && (
                <div className="text-[10px] text-gray-400 dark:text-slate-500 font-mono">
                  {p.code}
                </div>
              )}
              {p.prevOrdered && (
                <span className="text-[10px] text-tertiary-600 dark:text-tertiary-400">
                  Previously ordered
                </span>
              )}
            </div>

            {/* Confidence */}
            <div className="text-center">
              <span
                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  confidenceColor[p.confidenceLabel] || ''
                }`}
              >
                {p.confidence}%
              </span>
            </div>

            {/* Stock */}
            <div className="text-center text-[12px] text-gray-600 dark:text-slate-300">
              {p.stock > 0 ? p.stock : '—'}
            </div>

            {/* Price */}
            <div className="text-right text-[12px] font-medium text-gray-800 dark:text-slate-200">
              {p.price > 0 ? `$${p.price.toFixed(2)}` : '—'}
            </div>

            {/* Select checkbox */}
            <div className="text-center">
              {p.alternatives && !p.selected ? (
                <button
                  onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  className="text-[11px] text-tertiary-600 dark:text-tertiary-400 hover:underline font-medium"
                >
                  {expandedRow === p.id ? 'Hide' : 'Select'}
                </button>
              ) : (
                <input
                  type="checkbox"
                  checked={p.selected}
                  onChange={() => toggleSelect(p.id)}
                  className="w-4 h-4 rounded border-gray-300 dark:border-slate-500 text-tertiary-600 focus:ring-tertiary-500"
                />
              )}
            </div>
          </div>

          {/* Alternatives (Row 4 type) */}
          {p.alternatives && (expandedRow === p.id || !p.selected) && (
            <div className="px-3 py-2 bg-amber-50/50 dark:bg-amber-500/5 border-b border-gray-100 dark:border-slate-700">
              <div className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 mb-1.5">
                Select an alternative:
              </div>
              <div className="space-y-1.5">
                {p.alternatives.map((alt) => (
                  <label
                    key={alt.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-amber-100/50 dark:hover:bg-amber-500/10 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`alt-${p.id}`}
                      checked={p.code === alt.code}
                      onChange={() => selectAlternative(p.id, alt.id)}
                      className="w-3.5 h-3.5 text-tertiary-600 focus:ring-tertiary-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-gray-800 dark:text-slate-200 truncate">
                        {alt.product}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-slate-400">
                        {alt.code} &middot; {alt.packSize}
                      </div>
                    </div>
                    <div className="text-[12px] font-medium text-gray-700 dark:text-slate-300">
                      ${alt.price.toFixed(2)}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Spec query (Row 6 type) */}
          {p.specQuery && (
            <div className="px-3 py-2 bg-blue-50/50 dark:bg-blue-500/5 border-b border-gray-100 dark:border-slate-700">
              <div className="text-[11px] text-blue-700 dark:text-blue-400 mb-1.5">
                {p.specQuery.message}
              </div>
              <div className="flex gap-1.5">
                {p.specQuery.options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => selectSpec(p.id, opt.label)}
                    className={`px-2.5 py-1 rounded text-[12px] font-medium border transition-colors ${
                      p.specQuery!.defaultOption === opt.label
                        ? 'border-tertiary-500 bg-tertiary-500/10 text-tertiary-700 dark:text-tertiary-300'
                        : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-tertiary-400'
                    }`}
                  >
                    {opt.label} — ${opt.price.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="text-[12px] text-gray-500 dark:text-slate-400">
          {products.filter((p) => p.selected).length} of {products.length} selected
        </div>
        <button
          onClick={onAddSelected}
          disabled={!canAdd}
          className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium bg-tertiary-600 text-white hover:bg-tertiary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add Selected to Quote
        </button>
      </div>
    </div>
  )
}
