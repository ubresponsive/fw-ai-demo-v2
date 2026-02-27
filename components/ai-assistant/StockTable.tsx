'use client'

import type { StockRow } from '@/lib/ai/types'

interface StockTableProps {
  data: StockRow[]
}

const statusColors: Record<string, string> = {
  'In Stock': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  'Low Stock': 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'Out of Stock': 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400',
}

export function StockTable({ data }: StockTableProps) {
  return (
    <div className="my-3 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800">
            {['Product', 'On Hand', 'Allocated', 'Available', 'Status'].map(
              (h) => (
                <th
                  key={h}
                  className="px-3 py-2.5 text-left font-semibold text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className={
                i % 2
                  ? 'bg-gray-50/50 dark:bg-slate-800/50'
                  : 'bg-white dark:bg-slate-900'
              }
            >
              <td className="px-3 py-2.5 font-medium text-gray-900 dark:text-slate-200">
                {row.productCode}
              </td>
              <td className="px-3 py-2.5 text-gray-600 dark:text-slate-400">
                {row.onHand}
              </td>
              <td className="px-3 py-2.5 text-gray-600 dark:text-slate-400">
                {row.allocated}
              </td>
              <td className="px-3 py-2.5 font-semibold text-gray-900 dark:text-slate-200">
                {row.available}
              </td>
              <td className="px-3 py-2.5">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] || ''}`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
