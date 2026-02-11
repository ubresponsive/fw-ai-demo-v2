'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  SparklesIcon,
  ChartBarIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ListBulletIcon,
  HomeIcon,
  ChevronRightIcon,
  BookmarkIcon,
  PrinterIcon,
  DocumentArrowDownIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  CreditCardIcon,
  WalletIcon,
  ShoppingCartIcon,
  CubeIcon,
  BookOpenIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartPieIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/utils'

// ── KPI Data ──
const kpiCards = [
  { label: 'Revenue MTD', value: '$1.24M', change: '+8.3%', up: true, icon: CurrencyDollarIcon, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50', sparkData: [30,45,35,60,55,70,65,80,75,90] },
  { label: 'Gross Profit', value: '$412K', change: '+3.1%', up: true, icon: ArrowTrendingUpIcon, colorClass: 'text-tertiary-600', bgClass: 'bg-tertiary-50', sparkData: [40,38,45,42,48,44,50,52,49,55] },
  { label: 'Accounts Receivable', value: '$287K', change: '-2.4%', up: false, icon: ReceiptPercentIcon, colorClass: 'text-primary-600', bgClass: 'bg-primary-50', sparkData: [60,58,55,57,52,54,50,48,51,47] },
  { label: 'Accounts Payable', value: '$198K', change: '+5.7%', up: true, icon: CreditCardIcon, colorClass: 'text-amber-600', bgClass: 'bg-amber-50', sparkData: [30,32,35,33,38,36,40,42,39,44] },
  { label: 'Cash Position', value: '$534K', change: '+12.1%', up: true, icon: WalletIcon, colorClass: 'text-purple-600', bgClass: 'bg-purple-50', sparkData: [20,28,25,35,40,38,48,52,50,60] },
  { label: 'GP Margin', value: '33.2%', change: '-0.8%', up: false, icon: ChartPieIcon, colorClass: 'text-rose-600', bgClass: 'bg-rose-50', sparkData: [35,34,36,35,34,33,35,34,33,33] },
]

// ── Report Categories ──
type Report = { name: string; type: 'table' | 'chart'; starred: boolean; lastRun: string }
type Category = { id: string; label: string; icon: typeof ChartBarIcon; colorClass: string; bgClass: string; reports: Report[] }

const reportCategories: Category[] = [
  {
    id: 'sales', label: 'Sales & Revenue', icon: ShoppingCartIcon, colorClass: 'text-primary-600', bgClass: 'bg-primary-50',
    reports: [
      { name: 'Sales Summary by Branch', type: 'table', starred: true, lastRun: '2h ago' },
      { name: 'Sales by Product Group', type: 'chart', starred: false, lastRun: '1d ago' },
      { name: 'Sales Rep Performance', type: 'table', starred: true, lastRun: '3h ago' },
      { name: 'Monthly Revenue Trend', type: 'chart', starred: false, lastRun: '5h ago' },
      { name: 'Top 20 Customers by Revenue', type: 'table', starred: false, lastRun: '1d ago' },
      { name: 'Sales Order Pipeline', type: 'table', starred: true, lastRun: '30m ago' },
    ],
  },
  {
    id: 'profit', label: 'Profitability', icon: ArrowTrendingUpIcon, colorClass: 'text-emerald-600', bgClass: 'bg-emerald-50',
    reports: [
      { name: 'Gross Profit by Branch', type: 'chart', starred: true, lastRun: '1h ago' },
      { name: 'GP% by Product Category', type: 'chart', starred: false, lastRun: '4h ago' },
      { name: 'Margin Erosion Analysis', type: 'table', starred: false, lastRun: '2d ago' },
      { name: 'Below-Margin Transactions', type: 'table', starred: true, lastRun: '1h ago' },
    ],
  },
  {
    id: 'ar', label: 'Accounts Receivable', icon: ReceiptPercentIcon, colorClass: 'text-tertiary-600', bgClass: 'bg-tertiary-50',
    reports: [
      { name: 'Aged Debtors Summary', type: 'table', starred: true, lastRun: '1h ago' },
      { name: 'Overdue Invoices', type: 'table', starred: true, lastRun: '2h ago' },
      { name: 'Customer Payment History', type: 'table', starred: false, lastRun: '1d ago' },
      { name: 'DSO Trend Analysis', type: 'chart', starred: false, lastRun: '3d ago' },
    ],
  },
  {
    id: 'ap', label: 'Accounts Payable', icon: CreditCardIcon, colorClass: 'text-amber-600', bgClass: 'bg-amber-50',
    reports: [
      { name: 'Aged Creditors Summary', type: 'table', starred: true, lastRun: '2h ago' },
      { name: 'Supplier Spend Analysis', type: 'chart', starred: false, lastRun: '1d ago' },
      { name: 'Purchase Order Commitments', type: 'table', starred: false, lastRun: '5h ago' },
    ],
  },
  {
    id: 'inventory', label: 'Inventory & Stock', icon: CubeIcon, colorClass: 'text-purple-600', bgClass: 'bg-purple-50',
    reports: [
      { name: 'Stock Valuation by Location', type: 'table', starred: true, lastRun: '3h ago' },
      { name: 'Slow Moving Stock', type: 'table', starred: false, lastRun: '1d ago' },
      { name: 'Stock Turn Analysis', type: 'chart', starred: false, lastRun: '2d ago' },
      { name: 'Reorder Point Report', type: 'table', starred: false, lastRun: '6h ago' },
    ],
  },
  {
    id: 'gl', label: 'General Ledger', icon: BookOpenIcon, colorClass: 'text-gray-600', bgClass: 'bg-gray-100',
    reports: [
      { name: 'Trial Balance', type: 'table', starred: true, lastRun: '1h ago' },
      { name: 'P&L Statement', type: 'table', starred: true, lastRun: '2h ago' },
      { name: 'Balance Sheet', type: 'table', starred: true, lastRun: '2h ago' },
      { name: 'GL Transaction Listing', type: 'table', starred: false, lastRun: '4h ago' },
      { name: 'Budget vs Actual', type: 'chart', starred: false, lastRun: '1d ago' },
    ],
  },
]

// ── AI Quick Actions ──
const aiQuickActions = [
  { icon: ChartBarIcon, label: 'Revenue by branch this month', colorClass: 'text-primary-500' },
  { icon: ExclamationCircleIcon, label: 'Overdue invoices over $5K', colorClass: 'text-rose-500' },
  { icon: ArrowTrendingDownIcon, label: 'Products with declining margins', colorClass: 'text-amber-500' },
  { icon: ChartPieIcon, label: 'Top 10 customers by profit', colorClass: 'text-emerald-500' },
  { icon: CubeIcon, label: 'Slow-moving stock over 90 days', colorClass: 'text-purple-500' },
  { icon: CurrencyDollarIcon, label: 'Cash flow forecast next 30 days', colorClass: 'text-tertiary-500' },
]

// ── Mini Sparkline Component ──
function MiniSparkline({ data, colorClass, width = 80, height = 24 }: { data: number[]; colorClass: string; width?: number; height?: number }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`
  ).join(' ')

  // Extract base color from class for SVG stroke
  const colorMap: Record<string, string> = {
    'text-emerald-600': '#059669',
    'text-tertiary-600': '#0d9488',
    'text-primary-600': '#3a4bb5',
    'text-amber-600': '#d97706',
    'text-purple-600': '#9333ea',
    'text-rose-600': '#e11d48',
  }
  const strokeColor = colorMap[colorClass] || '#6b7280'

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} opacity="0.6" />
      <circle
        cx={(data.length - 1) / (data.length - 1) * width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="2"
        fill={strokeColor}
      />
    </svg>
  )
}

export default function FinancialReportsPage() {
  const [aiOpen, setAiOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [aiInput, setAiInput] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (aiOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [aiOpen])

  const filteredCategories = activeCategory === 'all'
    ? reportCategories
    : reportCategories.filter(c => c.id === activeCategory)

  // Apply search filter
  const searchedCategories = searchQuery
    ? filteredCategories.map(c => ({
        ...c,
        reports: c.reports.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase())),
      })).filter(c => c.reports.length > 0)
    : filteredCategories

  const starredReports = reportCategories.flatMap(c =>
    c.reports.filter(r => r.starred).map(r => ({ ...r, category: c.label, colorClass: c.colorClass, bgClass: c.bgClass, catIcon: c.icon }))
  )

  return (
    <div className="min-h-full">
      {/* ── Breadcrumb ── */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
          <a href="/dashboard" className="flex items-center gap-1 hover:text-gray-700">
            <HomeIcon className="size-4" />
            <span>Home</span>
          </a>
          <ChevronRightIcon className="size-4 text-gray-400" />
          <span className="font-medium text-gray-800">Financial Reports</span>
        </nav>
      </div>

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">Run standard reports or use AI to generate custom analysis</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:border-gray-300">
              <CalendarIcon className="size-3.5 text-gray-400" />
              This Month
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-600 cursor-pointer hover:border-gray-300">
              <BuildingOfficeIcon className="size-3.5 text-gray-400" />
              All Branches
            </div>
            <button
              onClick={() => setAiOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-tertiary-500 hover:bg-tertiary-600 transition-all shadow-sm animate-[sparkle_1.5s_ease-in-out_infinite]"
            >
              <SparklesIcon className="size-3.5" />
              AI Report Builder
            </button>
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {kpiCards.map((item) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className={classNames(item.bgClass, 'size-9 rounded-lg flex items-center justify-center')}>
                  <item.icon className={classNames(item.colorClass, 'size-4.5')} />
                </div>
                <MiniSparkline data={item.sparkData} colorClass={item.colorClass} />
              </div>
              <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-gray-900">{item.value}</span>
                <span className={classNames(
                  item.up ? 'text-emerald-600' : 'text-red-500',
                  'inline-flex items-center gap-0.5 text-xs font-medium',
                )}>
                  {item.up
                    ? <ArrowUpRightIcon className="size-3" />
                    : <ArrowDownRightIcon className="size-3" />
                  }
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Favourites ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <StarIconSolid className="size-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-gray-800">Favourites</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{starredReports.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {starredReports.map((r, i) => (
              <button key={i} className="group flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-3.5 py-3 hover:shadow-md hover:border-gray-300 transition-all text-left">
                <div className={classNames(r.bgClass, 'size-8 rounded-lg flex items-center justify-center shrink-0')}>
                  <r.catIcon className={classNames(r.colorClass, 'size-4')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 truncate group-hover:text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.category}</p>
                </div>
                <PlayIcon className="size-3.5 text-gray-300 group-hover:text-gray-500 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveCategory('all')}
              className={classNames(
                activeCategory === 'all'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
                'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
              )}
            >
              All Reports
            </button>
            {reportCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
                className={classNames(
                  activeCategory === cat.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50',
                  'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                )}
              >
                <cat.icon className="size-3" />
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <MagnifyingGlassIcon className="size-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search reports..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300"
              />
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={classNames(
                  viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600',
                  'p-1.5',
                )}
              >
                <Squares2X2Icon className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={classNames(
                  viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-400 hover:text-gray-600',
                  'p-1.5',
                )}
              >
                <ListBulletIcon className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Report Categories Grid ── */}
        <div className={classNames(
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1',
          'grid gap-4',
        )}>
          {searchedCategories.map(cat => (
            <div key={cat.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-gray-100">
                <div className={classNames(cat.bgClass, 'size-8 rounded-lg flex items-center justify-center')}>
                  <cat.icon className={classNames(cat.colorClass, 'size-4')} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">{cat.label}</h3>
                  <p className="text-xs text-gray-400">{cat.reports.length} reports</p>
                </div>
                <button className="text-xs font-medium text-primary-500 hover:underline">View All</button>
              </div>
              {/* Report List */}
              <div className="py-1">
                {cat.reports.map((report, i) => (
                  <div key={i} className="group flex items-center gap-3 px-3 py-2 rounded-lg mx-1 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="size-7 rounded-md flex items-center justify-center bg-gray-50 group-hover:bg-white border border-gray-100">
                      {report.type === 'chart'
                        ? <ChartBarIcon className="size-3.5 text-gray-400" />
                        : <TableCellsIcon className="size-3.5 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 truncate">{report.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                        <ClockIcon className="size-3" /> {report.lastRun}
                      </p>
                    </div>
                    {report.starred && <StarIconSolid className="size-3.5 text-amber-400 shrink-0" />}
                    <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                      <button className="p-1 rounded hover:bg-gray-200" title="Run"><PlayIcon className="size-3.5 text-gray-400" /></button>
                      <button className="p-1 rounded hover:bg-gray-200" title="Download"><ArrowDownTrayIcon className="size-3.5 text-gray-400" /></button>
                      <button className="p-1 rounded hover:bg-gray-200" title="Schedule"><ClockIcon className="size-3.5 text-gray-400" /></button>
                    </div>
                    <ArrowRightIcon className="size-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {searchedCategories.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="size-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-500">No reports found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* ── AI Report Builder Drawer ── */}
      <Dialog open={aiOpen} onClose={setAiOpen} className="relative z-[60]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-all duration-500 ease-in-out data-closed:opacity-0 data-closed:backdrop-blur-none"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition-transform duration-700 ease-in-out data-closed:translate-x-full data-closed:duration-500"
              >
                <div className="flex h-full flex-col bg-white shadow-2xl">
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-tertiary-400 to-primary-500">
                        <SparklesIcon className="size-4 text-white" />
                      </div>
                      <div>
                        <DialogTitle className="text-sm font-semibold text-gray-800">AI Report Builder</DialogTitle>
                        <p className="text-xs text-gray-400">Generate custom reports with natural language</p>
                      </div>
                    </div>
                    <button onClick={() => setAiOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                      <XMarkIcon className="size-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Quick Starters */}
                  <div className="px-4 py-3 border-b border-gray-100 shrink-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Quick Reports</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {aiQuickActions.map(({ icon: Icon, label, colorClass }) => (
                        <button
                          key={label}
                          className="group flex items-start gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left"
                        >
                          <Icon className={classNames(colorClass, 'size-3.5 shrink-0 mt-0.5')} />
                          <span className="text-xs text-gray-600 leading-tight">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
                    {/* AI Welcome */}
                    <div className="flex gap-2.5">
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50">
                        <SparklesIcon className="size-3.5 text-tertiary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                          <p>Describe the report you need in plain language and I&apos;ll generate it. You can ask for any combination of data, time periods, branches, customers, and products.</p>
                          <p className="mt-1.5 text-gray-500">Try: <em>&ldquo;Show me aged debtors over $10K for the Sydney branch&rdquo;</em></p>
                        </div>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-primary-50 border border-primary-100 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-gray-700 max-w-80">
                        Show me revenue by branch for January 2026
                      </div>
                    </div>

                    {/* AI Generated Report */}
                    <div className="flex gap-2.5">
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50">
                        <SparklesIcon className="size-3.5 text-tertiary-500" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 leading-relaxed">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-800">Revenue by Branch — Jan 2026</p>
                            <div className="flex items-center gap-1">
                              <button className="p-1 rounded hover:bg-gray-200" title="Export"><ArrowDownTrayIcon className="size-3 text-gray-400" /></button>
                            </div>
                          </div>

                          {/* Inline bar chart */}
                          <div className="bg-white rounded-lg border border-gray-100 p-3 mb-2.5">
                            {[
                              { branch: 'Sydney Metro', value: 342180, pct: 100 },
                              { branch: 'Melbourne', value: 298450, pct: 87 },
                              { branch: 'Brisbane', value: 187320, pct: 55 },
                              { branch: 'Adelaide', value: 124890, pct: 37 },
                              { branch: 'Perth', value: 98760, pct: 29 },
                            ].map((row, i) => (
                              <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                                <span className="w-24 text-xs text-gray-500 truncate text-right">{row.branch}</span>
                                <div className="flex-1 h-5 bg-gray-50 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all flex items-center justify-end pr-2 bg-primary-400"
                                    style={{
                                      width: `${row.pct}%`,
                                      opacity: 1 - (i * 0.15),
                                    }}
                                  >
                                    {row.pct > 40 && (
                                      <span className="text-white text-[10px] font-medium">
                                        ${(row.value / 1000).toFixed(0)}K
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {row.pct <= 40 && (
                                  <span className="text-xs text-gray-500 font-mono w-12">${(row.value / 1000).toFixed(0)}K</span>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Data Table */}
                          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden mb-2.5">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-50">
                                  <th className="px-2.5 py-1.5 text-left font-medium text-gray-500">Branch</th>
                                  <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">Revenue</th>
                                  <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">Orders</th>
                                  <th className="px-2.5 py-1.5 text-right font-medium text-gray-500">GP%</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { branch: '10 — Sydney Metro', revenue: '$342,180', orders: '487', gp: '34.2%', up: true },
                                  { branch: '20 — Melbourne', revenue: '$298,450', orders: '412', gp: '31.8%', up: true },
                                  { branch: '30 — Brisbane', revenue: '$187,320', orders: '298', gp: '35.1%', up: false },
                                  { branch: '40 — Adelaide', revenue: '$124,890', orders: '189', gp: '29.4%', up: true },
                                  { branch: '50 — Perth', revenue: '$98,760', orders: '156', gp: '32.7%', up: false },
                                ].map((row, i) => (
                                  <tr key={i} className="border-t border-gray-50">
                                    <td className="px-2.5 py-1.5 text-gray-700">{row.branch}</td>
                                    <td className="px-2.5 py-1.5 text-right font-mono text-gray-700">{row.revenue}</td>
                                    <td className="px-2.5 py-1.5 text-right font-mono text-gray-500">{row.orders}</td>
                                    <td className="px-2.5 py-1.5 text-right">
                                      <span className="inline-flex items-center gap-0.5">
                                        {row.up
                                          ? <ArrowUpRightIcon className="size-3 text-emerald-500" />
                                          : <ArrowDownRightIcon className="size-3 text-red-400" />
                                        }
                                        <span className={classNames(row.up ? 'text-emerald-600' : 'text-red-500', 'font-mono')}>{row.gp}</span>
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                <tr className="border-t-2 border-gray-200 bg-gray-50">
                                  <td className="px-2.5 py-1.5 font-semibold text-gray-800">Total</td>
                                  <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-800">$1,051,600</td>
                                  <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-700">1,542</td>
                                  <td className="px-2.5 py-1.5 text-right font-mono font-semibold text-gray-700">32.8%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Key Insights */}
                          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 text-xs text-emerald-800 leading-relaxed">
                            <p className="flex items-center gap-1.5 font-medium mb-1">
                              <BoltIcon className="size-3" /> Key Insights
                            </p>
                            <p>Sydney Metro leads with 32.5% of total revenue. Brisbane has the highest GP% at 35.1% despite being 3rd in volume. Adelaide&apos;s GP of 29.4% is below the 32.8% company average — worth investigating pricing.</p>
                          </div>
                        </div>

                        {/* Report Actions */}
                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <ArrowDownTrayIcon className="size-3" /> Export CSV
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <DocumentArrowDownIcon className="size-3" /> Export Excel
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <PrinterIcon className="size-3" /> Print
                          </button>
                          <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                            <BookmarkIcon className="size-3" /> Save Report
                          </button>
                        </div>

                        {/* Refinement Chips */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {[
                            'Add comparison to last month',
                            'Break down Sydney by product group',
                            'Show as line chart',
                            'Filter to branches under target',
                          ].map(s => (
                            <button
                              key={s}
                              className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div ref={chatEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="p-3 border-t border-gray-100 shrink-0">
                    <div className="flex items-stretch gap-2">
                      <div className="flex-1 relative">
                        <textarea
                          value={aiInput}
                          onChange={e => setAiInput(e.target.value)}
                          placeholder="Describe the report you need..."
                          rows={1}
                          className="w-full h-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-tertiary-300 focus:border-transparent pr-10"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100">
                          <PaperClipIcon className="size-4 text-gray-400" />
                        </button>
                      </div>
                      <button className="flex items-center justify-center px-2.5 rounded-xl text-white bg-tertiary-500 hover:bg-tertiary-600 shrink-0">
                        <PaperAirplaneIcon className="size-4" />
                      </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-300 mt-1.5">
                      AI-generated reports should be verified against source data
                    </p>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
