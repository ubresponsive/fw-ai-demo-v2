'use client'

import { useState } from 'react'
import { useAppShell } from '@/lib/app-shell-context'
import { classNames } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  CalculatorIcon,
  ChartBarIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  ReceiptPercentIcon,
  WrenchScrewdriverIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

const dashboardStats = [
  { id: 1, name: 'Revenue (MTD)', stat: '$284,391', icon: CurrencyDollarIcon, change: '12.5%', changeType: 'increase' as const },
  { id: 2, name: 'Sales Orders', stat: '1,247', icon: ShoppingCartIcon, change: '8.2%', changeType: 'increase' as const },
  { id: 3, name: 'Purchase Orders', stat: '342', icon: ClipboardDocumentListIcon, change: '3.1%', changeType: 'decrease' as const },
  { id: 4, name: 'Inventory Value', stat: '$1.2M', icon: CubeIcon, change: '2.4%', changeType: 'increase' as const },
  { id: 5, name: 'Outstanding AR', stat: '$127,450', icon: BanknotesIcon, change: '5.7%', changeType: 'decrease' as const },
  { id: 6, name: 'Dispatches Today', stat: '48', icon: TruckIcon, change: '15.3%', changeType: 'increase' as const },
]

const quickLinks = [
  { name: 'New Sales Order', href: '#', description: 'Create a sales order', icon: PlusCircleIcon },
  { name: 'Customer Dashboard', href: '#', description: 'View customer accounts', icon: UsersIcon },
  { name: 'Invoice Entry', href: '#', description: 'Enter supplier invoices', icon: DocumentTextIcon },
  { name: 'Price Inquiry', href: '#', description: 'Check product pricing', icon: ReceiptPercentIcon },
  { name: 'Inventory Lookup', href: '#', description: 'Search stock levels', icon: CubeIcon },
  { name: 'Financial Reports', href: '/financial-reports', description: 'Run financial reports', icon: ChartBarIcon },
  { name: 'Production Dashboard', href: '#', description: 'View production status', icon: WrenchScrewdriverIcon },
  { name: 'GL Journal Entry', href: '#', description: 'Post journal entries', icon: CalculatorIcon },
]

const recentActivity = [
  { id: 1, action: 'Sales Order #4521 created', user: 'Sarah Chen', time: '2 min ago', type: 'sales' },
  { id: 2, action: 'Payment received — Inv #3892', user: 'System', time: '15 min ago', type: 'payment' },
  { id: 3, action: 'Purchase Order #1204 approved', user: 'Mark Thompson', time: '32 min ago', type: 'purchase' },
  { id: 4, action: 'Stock adjustment — SKU WH-4410', user: 'James Liu', time: '1 hr ago', type: 'inventory' },
  { id: 5, action: 'Customer account updated — Acme Corp', user: 'Sarah Chen', time: '1 hr ago', type: 'customer' },
  { id: 6, action: 'Dispatch run #89 completed', user: 'Driver - Route A', time: '2 hr ago', type: 'dispatch' },
  { id: 7, action: 'Credit Memo #CM-221 issued', user: 'Amy Rodriguez', time: '3 hr ago', type: 'sales' },
  { id: 8, action: 'Bank reconciliation completed', user: 'Finance Team', time: '4 hr ago', type: 'finance' },
]

// Deterministic mock revenue data (30 days)
const revenueData = [
  { day: '1', revenue: 8200 }, { day: '2', revenue: 7800 }, { day: '3', revenue: 9100 },
  { day: '4', revenue: 8600 }, { day: '5', revenue: 7400 }, { day: '6', revenue: 5200 },
  { day: '7', revenue: 4800 }, { day: '8', revenue: 8900 }, { day: '9', revenue: 9400 },
  { day: '10', revenue: 10200 }, { day: '11', revenue: 9800 }, { day: '12', revenue: 10800 },
  { day: '13', revenue: 6100 }, { day: '14', revenue: 5600 }, { day: '15', revenue: 9200 },
  { day: '16', revenue: 9700 }, { day: '17', revenue: 10400 }, { day: '18', revenue: 11200 },
  { day: '19', revenue: 10600 }, { day: '20', revenue: 7800 }, { day: '21', revenue: 6200 },
  { day: '22', revenue: 9800 }, { day: '23', revenue: 10100 }, { day: '24', revenue: 11400 },
  { day: '25', revenue: 10900 }, { day: '26', revenue: 11800 }, { day: '27', revenue: 7200 },
  { day: '28', revenue: 6800 }, { day: '29', revenue: 10500 }, { day: '30', revenue: 11100 },
]

const salesByCategory = [
  { name: 'Timber', value: 84200, color: '#485DCA' },
  { name: 'Hardware', value: 62100, color: '#3aa8d0' },
  { name: 'Paint', value: 41800, color: '#14b8a6' },
  { name: 'Plumbing', value: 38700, color: '#7281de' },
  { name: 'Electrical', value: 32400, color: '#65c0de' },
  { name: 'Other', value: 25191, color: '#9ca3af' },
]

const salesTotalValue = salesByCategory.reduce((sum, c) => sum + c.value, 0)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-900">Day {label}</p>
      <p className="text-primary-600">${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

const periodOptions = ['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Quarter', 'This Year']

export default function DashboardPage() {
  const { userName } = useAppShell()
  const [period, setPeriod] = useState('Last 30 Days')

  return (
    <>
      <div className="xl:pr-96">
        <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
          {/* Page heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              Welcome back, {userName}
            </p>
          </div>

          {/* Stats section */}
          <div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-base font-semibold text-gray-900">Overview</h3>
              <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-0.5">
                {periodOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPeriod(opt)}
                    className={classNames(
                      opt === period
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700',
                      'rounded-md px-2.5 py-1 text-xs font-medium transition-all',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardStats.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className="group relative overflow-hidden rounded-lg border border-gray-100 bg-white px-4 pt-5 pb-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all sm:px-6 sm:pt-6"
                >
                  <ChevronRightIcon className="absolute top-4 right-3 size-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                  <dt>
                    <div className="absolute rounded-md bg-secondary-100 p-3">
                      <item.icon aria-hidden="true" className="size-6 text-secondary-700" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                    <p
                      className={classNames(
                        item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                        'ml-2 flex items-baseline text-sm font-semibold',
                      )}
                    >
                      {item.changeType === 'increase' ? (
                        <ArrowUpIcon aria-hidden="true" className="size-5 shrink-0 self-center text-green-500" />
                      ) : (
                        <ArrowDownIcon aria-hidden="true" className="size-5 shrink-0 self-center text-red-500" />
                      )}
                      <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
                      {item.change}
                    </p>
                  </dd>
                </a>
              ))}
            </dl>
          </div>

          {/* Charts section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Revenue Area Chart */}
            <div className="lg:col-span-3 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Revenue — Last 30 Days</h3>
                <p className="text-xs text-gray-500 mt-0.5">Daily revenue trend</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#485DCA" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#485DCA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#485DCA"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Category Donut */}
            <div className="lg:col-span-2 rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Sales by Category</h3>
                <p className="text-xs text-gray-500 mt-0.5">Month to date breakdown</p>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {salesByCategory.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">${(salesTotalValue / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-gray-400">Total</p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {salesByCategory.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-600 truncate">{cat.name}</span>
                    <span className="ml-auto text-gray-400">{Math.round(cat.value / salesTotalValue * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="mt-10">
            <h3 className="text-base font-semibold text-gray-900">Quick Links</h3>
            <ul role="list" className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-x-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-primary-400 hover:shadow-md transition-all"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
                      <link.icon aria-hidden="true" className="size-5 text-primary-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-500">{link.name}</p>
                      <p className="truncate text-xs text-gray-500">{link.description}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Secondary column on right */}
      <aside className="fixed top-16 bottom-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <div className="mt-4 flow-root">
          <ul role="list" className="-mb-8">
            {recentActivity.map((item, idx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {idx !== recentActivity.length - 1 && (
                    <span aria-hidden="true" className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={classNames(
                        item.type === 'sales' ? 'bg-primary-500' :
                        item.type === 'payment' ? 'bg-primary-400' :
                        item.type === 'purchase' ? 'bg-primary-300' :
                        item.type === 'inventory' ? 'bg-primary-500' :
                        item.type === 'customer' ? 'bg-primary-400' :
                        item.type === 'dispatch' ? 'bg-primary-300' :
                        'bg-primary-400',
                        'flex size-8 items-center justify-center rounded-full ring-8 ring-white',
                      )}>
                        {item.type === 'sales' && <ShoppingCartIcon className="size-4 text-white" />}
                        {item.type === 'payment' && <BanknotesIcon className="size-4 text-white" />}
                        {item.type === 'purchase' && <ClipboardDocumentListIcon className="size-4 text-white" />}
                        {item.type === 'inventory' && <CubeIcon className="size-4 text-white" />}
                        {item.type === 'customer' && <UsersIcon className="size-4 text-white" />}
                        {item.type === 'dispatch' && <TruckIcon className="size-4 text-white" />}
                        {item.type === 'finance' && <CalculatorIcon className="size-4 text-white" />}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.user}</p>
                      </div>
                      <div className="whitespace-nowrap text-right text-xs text-gray-500">
                        {item.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
