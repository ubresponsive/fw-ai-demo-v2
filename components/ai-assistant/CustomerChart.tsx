'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { CustomerHistoryRow } from '@/lib/ai/types'

interface CustomerChartProps {
  data: CustomerHistoryRow[]
  customerName: string
}

export function CustomerChart({ data, customerName }: CustomerChartProps) {
  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 pb-2">
      <div className="text-[13px] font-semibold mb-3 text-gray-900 dark:text-slate-200">
        Order History — {customerName}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart
          data={data}
          margin={{ left: 10, right: 10, top: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="ai-revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: 'currentColor' }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#14b8a6"
            fill="url(#ai-revGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
