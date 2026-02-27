'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import type { OrderLineData } from '@/lib/ai/types'

interface MarginChartProps {
  orderLines: OrderLineData[]
  orderNumber: string
}

export function MarginChart({ orderLines, orderNumber }: MarginChartProps) {
  const data = orderLines.map((l) => ({
    name: l.productCode,
    gp: l.gpPercent,
    fill:
      l.gpPercent < 0
        ? '#dc2626' // red
        : l.gpPercent < 20
          ? '#eaab30' // amber
          : '#16a34a', // green
  }))

  return (
    <div className="my-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-4 pb-2">
      <div className="text-[13px] font-semibold mb-3 text-gray-900 dark:text-slate-200">
        Margin Analysis — SO {orderNumber}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 60, right: 40, top: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            domain={[-220, 50]}
            tick={{ fontSize: 11, fill: 'currentColor' }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 11, fill: 'currentColor' }}
            width={55}
          />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, 'GP']} />
          <Bar dataKey="gp" radius={[0, 4, 4, 0]} barSize={22}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
