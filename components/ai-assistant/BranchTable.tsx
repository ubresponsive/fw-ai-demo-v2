'use client'

import type { BranchRevenueRow } from '@/lib/ai/types'

interface BranchTableProps {
  data: BranchRevenueRow[]
}

export function BranchTable({ data }: BranchTableProps) {
  const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
  const totalOrders = data.reduce((s, r) => s + r.orders, 0)

  return (
    <div className="my-3 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800">
            <th className="px-3 py-2.5 text-left font-semibold text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700">
              Branch
            </th>
            {['Revenue', 'Orders', 'GP%'].map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-right font-semibold text-gray-900 dark:text-slate-200 border-b border-gray-200 dark:border-slate-700"
              >
                {h}
              </th>
            ))}
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
                {row.branch}
              </td>
              <td className="px-3 py-2.5 text-right text-gray-600 dark:text-slate-400">
                ${row.revenue.toLocaleString()}
              </td>
              <td className="px-3 py-2.5 text-right text-gray-600 dark:text-slate-400">
                {row.orders}
              </td>
              <td className="px-3 py-2.5 text-right">
                <span
                  className={`font-semibold ${row.gp >= 32 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}
                >
                  {row.gp}%
                </span>
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 dark:bg-slate-800 font-bold">
            <td className="px-3 py-2.5 text-gray-900 dark:text-slate-200">Total</td>
            <td className="px-3 py-2.5 text-right text-gray-900 dark:text-slate-200">
              ${totalRevenue.toLocaleString()}
            </td>
            <td className="px-3 py-2.5 text-right text-gray-900 dark:text-slate-200">
              {totalOrders}
            </td>
            <td className="px-3 py-2.5 text-right text-gray-900 dark:text-slate-200">
              32.8%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
