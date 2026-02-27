'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { BranchRevenueRow } from '@/lib/ai/types'

interface BranchChartProps {
  data: BranchRevenueRow[]
}

export function BranchChart({ data }: BranchChartProps) {
  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 pb-2">
      <div className="text-[13px] font-semibold mb-3 text-gray-900 dark:text-slate-200">
        Revenue by Branch — Jan 2026
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 80, right: 50, top: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`}
          />
          <YAxis
            type="category"
            dataKey="branch"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            width={75}
          />
          <Tooltip
            formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20} fill="#0284c7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
