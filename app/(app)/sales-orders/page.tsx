'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { ChevronUpIcon as ChevronUpSolidIcon, ChevronDownIcon as ChevronDownSolidIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/utils'

// ── Stats data ──
const stats = [
  { name: 'Open Orders', value: '1,247', change: '+12.5%', changeType: 'increase' as const, icon: ShoppingCartIcon, color: 'bg-primary-50 text-primary-500' },
  { name: 'Revenue (MTD)', value: '$847,291', change: '+8.2%', changeType: 'increase' as const, icon: CurrencyDollarIcon, color: 'bg-emerald-50 text-emerald-500' },
  { name: 'Avg. Order Value', value: '$679', change: '+3.1%', changeType: 'increase' as const, icon: ArrowTrendingUpIcon, color: 'bg-sky-50 text-sky-500' },
  { name: 'Awaiting Pick', value: '89', change: '-15.3%', changeType: 'decrease' as const, icon: ClockIcon, color: 'bg-amber-50 text-amber-500' },
  { name: 'Dispatched Today', value: '48', change: '+22.1%', changeType: 'increase' as const, icon: TruckIcon, color: 'bg-violet-50 text-violet-500' },
  { name: 'Overdue', value: '12', change: '-4.2%', changeType: 'decrease' as const, icon: ExclamationTriangleIcon, color: 'bg-red-50 text-red-500' },
]

// ── Sample sales orders ──
type SalesOrder = {
  order: string
  bo: number
  brn: number
  transType: string
  customer: string
  orderDate: string
  delivDate: string
  deliveryAddress: string
  custRef: string
  despatch: string | number
  status: string
  assignee: string
  totalInc: number
  custType: string
  isDemo?: boolean
  demoLabel?: string
}

const salesOrders: SalesOrder[] = [
  // ── AI Demo orders (pinned to top) ──
  { order: '00000436', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '20/11/2012', delivDate: '20/10/2025', deliveryAddress: 'PrePaid Deliveries 123 Hill Street NSW ACT AUSTRALIA', custRef: '3321', despatch: 10, status: 'Waiting', assignee: 'master', totalInc: 39.00, custType: 'Cash', isDemo: true, demoLabel: 'Margin Analysis' },
  { order: '00001098', bo: 0, brn: 10, transType: 'Quote', customer: 'CJ Constructions Pty Ltd', orderDate: '27/02/2026', delivDate: '15/03/2026', deliveryAddress: 'CJ Constructions Pty Ltd', custRef: '', despatch: 10, status: 'New', assignee: 'steve', totalInc: 0.00, custType: 'Charge', isDemo: true, demoLabel: 'Product Matching' },
  // ── Regular orders ──
  { order: '00000055', bo: 1, brn: 10, transType: 'Order', customer: 'DEVONPORT AUTO ELECTRICS', orderDate: '14/12/2011', delivDate: '19/09/2025', deliveryAddress: 'DEVONPORT AUTO ELECTRICS a a ACT AUSTRALIA', custRef: '', despatch: 90, status: 'New', assignee: 'amanda', totalInc: 83616.50, custType: 'Charge' },
  { order: '00000477', bo: 0, brn: 10, transType: 'Order', customer: 'James Nailer', orderDate: '21/11/2012', delivDate: '23/08/2025', deliveryAddress: '11/210 The Entrance Road erina', custRef: '43', despatch: 40, status: 'Waiting', assignee: 'tomj', totalInc: 419.10, custType: 'C.O.D.' },
  { order: '00000514', bo: 0, brn: 10, transType: 'Order', customer: 'Junior', orderDate: '23/11/2012', delivDate: '28/09/2025', deliveryAddress: 'Junior Customer Pick Up ACT AUSTRALIA', custRef: '889', despatch: 45, status: 'Picking', assignee: 'master', totalInc: 223518.72, custType: 'Charge' },
  { order: '00000518', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '23/11/2012', delivDate: '20/07/2025', deliveryAddress: 'PrePaid Deliveries', custRef: '5556', despatch: 40, status: 'New', assignee: '', totalInc: 90.00, custType: 'Cash' },
  { order: '00000706', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '10/05/2013', delivDate: '17/05/2013', deliveryAddress: 'Nancy Carter dunno', custRef: '00000001', despatch: 'LOCAR', status: 'New', assignee: '', totalInc: 48.00, custType: 'Cash' },
  { order: '00000921', bo: 0, brn: 10, transType: 'Order', customer: 'Bill Fredericks', orderDate: '29/09/2014', delivDate: '16/05/2025', deliveryAddress: 'Bill Fredericks 3489 Ballina Road Tintinba NSW AUSTRALIA', custRef: '', despatch: 10, status: 'New', assignee: 'master', totalInc: 1389.96, custType: 'C.O.D.' },
  { order: '00000921', bo: 1, brn: 10, transType: 'Order', customer: 'Bill Fredericks', orderDate: '29/09/2014', delivDate: '16/05/2025', deliveryAddress: 'Bill Fredericks 3489 Ballina Road Tintinba NSW', custRef: '', despatch: 10, status: 'New', assignee: '', totalInc: 1663.86, custType: 'C.O.D.' },
  { order: '00000954', bo: 0, brn: 10, transType: 'Order', customer: 'marty smith', orderDate: '07/01/2015', delivDate: '11/08/2025', deliveryAddress: 'marty smith', custRef: '2131321', despatch: 30, status: 'New', assignee: 'chris', totalInc: 19.50, custType: 'C.O.D.' },
  { order: '00000961', bo: 0, brn: 10, transType: 'Order', customer: 'martin tyler', orderDate: '07/01/2015', delivDate: '07/07/2025', deliveryAddress: 'martin tyler', custRef: '13132', despatch: 40, status: 'New', assignee: 'chris', totalInc: 32.50, custType: 'C.O.D.' },
  { order: '00000969', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '08/01/2015', delivDate: '09/01/2015', deliveryAddress: 'johnny prepaid 1 this street', custRef: '55454', despatch: 'DIRCT', status: 'New', assignee: '', totalInc: 32.50, custType: 'Cash' },
  { order: '00000973', bo: 0, brn: 10, transType: 'Order', customer: 'Freddy COD', orderDate: '08/01/2015', delivDate: '22/09/2025', deliveryAddress: 'Freddy COD 34 43214 4234', custRef: '111', despatch: 45, status: 'Picked (Loc...)', assignee: 'master', totalInc: 975.00, custType: 'C.O.D.' },
  { order: '00000973', bo: 1, brn: 10, transType: 'Order', customer: 'Freddy COD', orderDate: '08/01/2015', delivDate: '28/08/2025', deliveryAddress: 'Freddy COD 34 43214 4234', custRef: '111', despatch: 45, status: 'New', assignee: 'master', totalInc: 357.50, custType: 'C.O.D.' },
  { order: '00000980', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '08/01/2015', delivDate: '10/01/2015', deliveryAddress: 'PrePaid Deliveries Makati', custRef: '1233', despatch: 'CRANE', status: 'New', assignee: '', totalInc: 45.00, custType: '' },
  { order: '00000981', bo: 0, brn: 10, transType: 'Order', customer: 'Freddy COD', orderDate: '08/01/2015', delivDate: '29/07/2025', deliveryAddress: 'Freddy COD 123', custRef: '1233', despatch: 40, status: 'New', assignee: 'tcroll', totalInc: 45.00, custType: 'C.O.D.' },
  { order: '00000985', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '08/01/2015', delivDate: '13/06/2025', deliveryAddress: 'freddy prepaid 1', custRef: '4554', despatch: 'CPKUP', status: 'New', assignee: 'chris', totalInc: 206.84, custType: 'Cash' },
  { order: '00001011', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '09/01/2015', delivDate: '14/08/2025', deliveryAddress: 'PrePaid Deliveries', custRef: '132132', despatch: 40, status: 'Picking', assignee: 'master', totalInc: 6.50, custType: 'Cash' },
  { order: '00001024', bo: 0, brn: 10, transType: 'Order', customer: 'freddo frog', orderDate: '09/01/2015', delivDate: '11/08/2025', deliveryAddress: 'freddo frog', custRef: '123', despatch: 40, status: 'Waiting', assignee: 'tcroll', totalInc: 20.02, custType: 'C.O.D.' },
  { order: '00001043', bo: 0, brn: 10, transType: 'Order', customer: 'Cuthbert & Sons', orderDate: '23/01/2015', delivDate: '17/05/2025', deliveryAddress: 'mark hughes 5454', custRef: '4554', despatch: 'LOCAR', status: 'New', assignee: '', totalInc: 31.50, custType: 'Charge' },
  { order: '00001061', bo: 0, brn: 10, transType: 'Order', customer: 'PrePaid Deliveries', orderDate: '28/01/2015', delivDate: '06/10/2025', deliveryAddress: 'PrePaid Deliveries Test 1234 Sydney ACT AUSTRALIA', custRef: 'Test 12345', despatch: 45, status: 'Waiting', assignee: 'fareen', totalInc: 13.00, custType: 'Cash' },
]

// ── Status badge colors ──
function statusStyle(status: string) {
  switch (status) {
    case 'New': return 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
    case 'Waiting': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
    case 'Picking': return 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800'
    case 'Picked (Loc...)': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
    default: return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800'
  }
}

// ── Sort column type ──
type SortCol = 'order' | 'customer' | 'orderDate' | 'delivDate' | 'totalInc' | 'status' | null
type SortDir = 'asc' | 'desc'

export default function SalesOrdersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sortCol, setSortCol] = useState<SortCol>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter & sort
  const filtered = salesOrders
    .filter((so) => {
      if (statusFilter !== 'all' && so.status !== statusFilter) return false
      if (search) {
        const s = search.toLowerCase()
        return so.order.includes(s) || so.customer.toLowerCase().includes(s) || so.deliveryAddress.toLowerCase().includes(s) || so.custRef.toLowerCase().includes(s)
      }
      return true
    })
    .sort((a, b) => {
      // Demo rows always pinned to top
      if (a.isDemo && !b.isDemo) return -1
      if (!a.isDemo && b.isDemo) return 1
      if (!sortCol) return 0
      const dir = sortDir === 'asc' ? 1 : -1
      if (sortCol === 'totalInc') return (a.totalInc - b.totalInc) * dir
      const av = a[sortCol] ?? ''
      const bv = b[sortCol] ?? ''
      return String(av).localeCompare(String(bv)) * dir
    })

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol(null); setSortDir('asc') }
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const SortIndicator = ({ col }: { col: SortCol }) => {
    if (sortCol !== col) return null
    return sortDir === 'asc'
      ? <ChevronUpSolidIcon className="size-3 text-primary-500" />
      : <ChevronDownSolidIcon className="size-3 text-primary-500" />
  }

  const grandTotal = filtered.reduce((sum, so) => sum + so.totalInc, 0)

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-slate-950">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <a href="/dashboard" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-slate-300">
          <HomeIcon className="size-4" /> Home
        </a>
        <ChevronRightIcon className="size-3" />
        <span className="font-medium text-gray-900 dark:text-slate-100">Sales Orders</span>
      </div>

      {/* Page Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Sales Orders</h1>
            <p className="text-sm text-gray-700 dark:text-slate-300 mt-0.5">Manage and track all sales orders across branches</p>
          </div>
          <button
            onClick={() => router.push('/sales-orders/436-0')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-400 transition-colors shadow-sm"
          >
            <PlusIcon className="size-4" />
            New Order
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-3 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <div className={classNames(stat.color.split(' ')[0], 'p-1.5 rounded-lg')}>
                  <stat.icon className={classNames(stat.color.split(' ')[1], 'size-4')} />
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400">{stat.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-gray-900 dark:text-slate-100">{stat.value}</span>
                <span className={classNames(
                  stat.changeType === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400',
                  'flex items-center text-xs font-medium',
                )}>
                  {stat.changeType === 'increase'
                    ? <ArrowUpIcon className="size-3 mr-0.5" />
                    : <ArrowDownIcon className="size-3 mr-0.5" />
                  }
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="mx-4 bg-white dark:bg-slate-800 rounded-t-lg border border-b-0 border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, customer, address, ref..."
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
            />
          </div>

          {/* Branch */}
          <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option>Branch: 10 - TEST BRANCH 010</option>
          </select>

          {/* Type */}
          <select className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-300">
            <option>Type: Order</option>
            <option>Type: Quote</option>
            <option>Type: All</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Waiting">Waiting</option>
            <option value="Picking">Picking</option>
            <option value="Picked (Loc...)">Picked</option>
          </select>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={classNames(showFilters ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700', 'p-1.5 rounded-lg transition-colors')}
              title="Advanced filters"
            >
              <FunnelIcon className="size-4" />
            </button>
            <span className="text-xs text-gray-400 dark:text-slate-500">{filtered.length} orders</span>
          </div>
        </div>

        {/* Advanced Filters (toggleable) */}
        {showFilters && (
          <div className="flex items-center gap-3 px-3 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 dark:text-slate-300">Customer:</label>
              <input className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md w-32 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-300" placeholder="Customer #" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 dark:text-slate-300">Sales Rep:</label>
              <input className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md w-24 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-300" placeholder="0" defaultValue="0" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-700 dark:text-slate-300">Order #:</label>
              <input className="px-2 py-1 text-xs border border-gray-300 dark:border-slate-600 rounded-md w-24 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-300" placeholder="0" defaultValue="0" />
            </div>
            <button className="px-3 py-1 text-xs font-medium rounded-md text-white bg-primary-500 hover:bg-primary-400">Find</button>
            <button className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Advanced</button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="mx-4 flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-b-lg overflow-hidden flex flex-col mb-4">
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-300 dark:border-slate-700">
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px' }} onClick={() => toggleSort('order')}>
                  <span className="flex items-center gap-0.5">Order <SortIndicator col="order" /></span>
                </th>
                <th className="px-2 py-2.5 text-center font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 40 }}>B/O</th>
                <th className="px-2 py-2.5 text-center font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 40 }}>Brn</th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 80 }}>Type</th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px' }} onClick={() => toggleSort('customer')}>
                  <span className="flex items-center gap-0.5">Customer Name <SortIndicator col="customer" /></span>
                </th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px', width: 90 }} onClick={() => toggleSort('orderDate')}>
                  <span className="flex items-center gap-0.5">Order Date <SortIndicator col="orderDate" /></span>
                </th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px', width: 90 }} onClick={() => toggleSort('delivDate')}>
                  <span className="flex items-center gap-0.5">Deliv Date <SortIndicator col="delivDate" /></span>
                </th>
                <th className="px-3 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px' }}>Delivery Address</th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 80 }}>Cust Ref</th>
                <th className="px-2 py-2.5 text-center font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 65 }}>Despatch</th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px', width: 95 }} onClick={() => toggleSort('status')}>
                  <span className="flex items-center gap-0.5">Status <SortIndicator col="status" /></span>
                </th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 75 }}>Assignee</th>
                <th className="px-3 py-2.5 text-right font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800" style={{ fontSize: '10px', width: 110 }} onClick={() => toggleSort('totalInc')}>
                  <span className="flex items-center justify-end gap-0.5">Total INC <SortIndicator col="totalInc" /></span>
                </th>
                <th className="px-2 py-2.5 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 70 }}>Cust Type</th>
                <th className="px-2 py-2.5" style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((so, idx) => (
                <tr
                  key={`${so.order}-${so.bo}-${idx}`}
                  className={classNames(
                    'border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group',
                    so.isDemo ? 'bg-tertiary-50/40 dark:bg-tertiary-900/10' : ''
                  )}
                  onClick={() => router.push(`/sales-orders/${so.order.replace(/^0+/, '')}-${so.bo}`)}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 hover:underline font-mono">{so.order}</button>
                      {so.isDemo && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-md bg-tertiary-100 dark:bg-tertiary-500/20 text-tertiary-700 dark:text-tertiary-300 border border-tertiary-200 dark:border-tertiary-500/30 whitespace-nowrap">
                          <SparklesIcon className="size-3" />
                          {so.demoLabel}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-gray-500 dark:text-slate-400 font-mono">{so.bo}</td>
                  <td className="px-2 py-2 text-center text-gray-500 dark:text-slate-400 font-mono">{so.brn}</td>
                  <td className="px-2 py-2 text-gray-900 dark:text-slate-100">{so.transType}</td>
                  <td className="px-3 py-2 text-gray-900 dark:text-slate-100 font-medium">{so.customer}</td>
                  <td className="px-2 py-2 text-gray-500 dark:text-slate-400 whitespace-nowrap font-mono">{so.orderDate}</td>
                  <td className="px-2 py-2 text-primary-600 dark:text-primary-400 whitespace-nowrap font-mono">{so.delivDate}</td>
                  <td className="px-3 py-2 text-gray-500 dark:text-slate-400 truncate max-w-[200px]">{so.deliveryAddress}</td>
                  <td className="px-2 py-2 text-gray-500 dark:text-slate-400 font-mono">{so.custRef}</td>
                  <td className="px-2 py-2 text-center text-gray-500 dark:text-slate-400">{so.despatch}</td>
                  <td className="px-2 py-2">
                    <span className={classNames(statusStyle(so.status), 'inline-flex px-2 py-0.5 text-xs font-medium rounded-full border')}>
                      {so.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-gray-900 dark:text-slate-100">{so.assignee}</td>
                  <td className="px-3 py-2 text-right font-mono font-medium text-gray-900 dark:text-slate-100">
                    ${so.totalInc.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-2 py-2 text-gray-500 dark:text-slate-400">{so.custType}</td>
                  <td className="px-2 py-2">
                    <button className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EllipsisHorizontalIcon className="size-4 text-gray-400 dark:text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={15} className="px-3 py-16 text-center text-sm text-gray-400 dark:text-slate-500">
                    No orders match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-gray-700 dark:text-slate-300">{filtered.length} orders</span>
            <span className="text-gray-400 dark:text-slate-600">|</span>
            <span className="text-gray-700 dark:text-slate-300">Total: <strong className="text-gray-900 dark:text-slate-100 font-mono">${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
          </div>
          <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
