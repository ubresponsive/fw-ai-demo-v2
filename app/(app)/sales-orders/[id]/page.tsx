'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import {
  XMarkIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  ChevronDownIcon,
  HomeIcon,
  ChevronRightIcon,
  PlusIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  ScissorsIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  DocumentTextIcon,
  EyeSlashIcon,
  CurrencyDollarIcon,
  PauseIcon,
  TrashIcon,
  PrinterIcon,
  DocumentDuplicateIcon,
  LinkIcon,
  ClipboardDocumentListIcon,
  EllipsisHorizontalIcon,
  ShoppingCartIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  PaperClipIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  Bars3BottomLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import { ChevronUpIcon as ChevronUpSolidIcon, ChevronDownIcon as ChevronDownSolidIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/utils'

// ── Order line data ──
type OrderLine = {
  ln: number
  product: string
  desc: string
  supplier: string
  qty: number
  uom: string
  sell: number
  disc: number
  total: number
  pickGroup: string
  unitCost: number
  gp: number
}

const orderLines: OrderLine[] = [
  { ln: 1, product: '1381631', desc: 'Extractor Screw #1 Prepack', supplier: '829663', qty: 2.0, uom: 'CD', sell: 9.00, disc: 0, total: 18.00, pickGroup: '', unitCost: 7.16, gp: 12.47 },
  { ln: 2, product: 'JMB3', desc: 'JODYS JMB3 PRODUCT', supplier: 'GreenTexta', qty: 5.0, uom: 'ea', sell: 2.20, disc: 0, total: 11.00, pickGroup: '', unitCost: 6.12, gp: -206.08 },
  { ln: 3, product: 'TIM4520', desc: 'Timber Pine DAR 45x20 4.8m', supplier: 'AUS-TIM', qty: 12.0, uom: 'LM', sell: 4.85, disc: 5, total: 55.29, pickGroup: 'TIMBER', unitCost: 2.90, gp: 37.11 },
  { ln: 4, product: 'CEM025', desc: 'Cement GP 20kg Bag', supplier: 'BORAL01', qty: 40.0, uom: 'ea', sell: 9.50, disc: 0, total: 380.00, pickGroup: 'HEAVY', unitCost: 6.20, gp: 34.74 },
]

// ── Status Badge ──
function StatusBadge({ label, variant }: { label: string; variant: 'green' | 'blue' | 'amber' }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    blue: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {variant === 'green' && <CheckCircleIcon className="size-3" />}
      {variant === 'amber' && <ClockIcon className="size-3" />}
      {label}
    </span>
  )
}

// ── Tab component ──
function Tab({ active, icon: Icon, label, count, onClick }: { active: boolean; icon: React.ElementType; label: string; count?: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        active ? 'border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600',
        'flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
      )}
    >
      <Icon className="size-4" />
      {label}
      {count !== undefined && (
        <span className={classNames(active ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-400' : 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500', 'ml-1 px-1.5 py-0 text-[10px] font-normal rounded-full')}>
          {count}
        </span>
      )}
    </button>
  )
}

// ── Column definitions for TanStack Table ──
const columnHelper = createColumnHelper<OrderLine>()

function buildColumns(lineComments: Record<number, string>, onToggleComment: (ln: number) => void) {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
      enableSorting: false,
    }),
    columnHelper.accessor('ln', {
      header: 'Ln',
      cell: (info) => <span className="text-gray-400 dark:text-slate-500 font-mono">{info.getValue()}</span>,
      size: 50,
    }),
    columnHelper.accessor('product', {
      header: 'Product',
      cell: (info) => <button className="font-medium text-primary-500 dark:text-primary-400 hover:underline">{info.getValue()}</button>,
    }),
    columnHelper.accessor('desc', {
      header: 'Description',
      cell: (info) => <span className="text-gray-700 dark:text-slate-300">{info.getValue()}</span>,
      size: 220,
    }),
    columnHelper.accessor('supplier', {
      header: 'Supplier',
      cell: (info) => <span className="text-gray-500 dark:text-slate-400">{info.getValue()}</span>,
    }),
    columnHelper.accessor('qty', {
      header: () => <span className="block text-right">Qty</span>,
      cell: (info) => <span className="block text-right font-mono text-gray-700 dark:text-slate-300">{info.getValue().toFixed(1)}</span>,
      size: 70,
    }),
    columnHelper.accessor('uom', {
      header: () => <span className="block text-center">UOM</span>,
      cell: (info) => <span className="block text-center text-gray-500 dark:text-slate-400">{info.getValue()}</span>,
      size: 60,
      enableSorting: false,
    }),
    columnHelper.accessor('sell', {
      header: () => <span className="block text-right">Sell Price</span>,
      cell: (info) => <span className="block text-right font-mono text-gray-700 dark:text-slate-300">${info.getValue().toFixed(2)}</span>,
      size: 90,
    }),
    columnHelper.accessor('disc', {
      header: () => <span className="block text-right">Disc%</span>,
      cell: (info) => <span className="block text-right font-mono text-gray-400 dark:text-slate-500">{info.getValue().toFixed(0)}</span>,
      size: 60,
    }),
    columnHelper.accessor('total', {
      header: () => <span className="block text-right">Total</span>,
      cell: (info) => <span className="block text-right font-mono font-medium text-gray-800 dark:text-slate-100">${info.getValue().toFixed(2)}</span>,
      size: 100,
    }),
    columnHelper.accessor('pickGroup', {
      header: 'Pick Grp',
      cell: (info) => <span className="text-gray-500 dark:text-slate-400">{info.getValue()}</span>,
      size: 80,
    }),
    columnHelper.accessor('unitCost', {
      header: () => <span className="block text-right">Unit Cost</span>,
      cell: (info) => <span className="block text-right font-mono text-gray-500 dark:text-slate-400">${info.getValue().toFixed(2)}</span>,
      size: 90,
    }),
    columnHelper.accessor('gp', {
      header: () => <span className="block text-right">GP%</span>,
      cell: (info) => {
        const val = info.getValue()
        return (
          <span className="block text-right">
            <span className={classNames(
              val < 0 ? 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400' : val < 15 ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
              'inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-medium font-mono',
            )}>
              {val.toFixed(1)}%
            </span>
          </span>
        )
      },
      size: 80,
    }),
    columnHelper.display({
      id: 'actions',
      cell: ({ row }) => {
        const ln = row.original.ln
        const hasComment = !!lineComments[ln]
        return (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onToggleComment(ln)}
              className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700"
              title={hasComment ? 'Edit comment' : 'Add comment'}
            >
              <ChatBubbleLeftRightIcon className={classNames(hasComment ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500', 'size-4')} />
            </button>
            <button className="p-0.5 rounded hover:bg-gray-100 dark:hover:bg-slate-700">
              <EllipsisHorizontalIcon className="size-4 text-gray-400 dark:text-slate-500" />
            </button>
          </div>
        )
      },
      size: 60,
      enableSorting: false,
    }),
  ]
}

// ── Footer totals ──
const footerTotals = [
  { label: 'Total Exc', value: '$35.45', bold: true },
  { label: 'Total Inc', value: '$39.00' },
  { label: 'GP%', value: '-26.71', warn: true },
  { label: 'Rebated GP%', value: '-22.34', warn: true },
  { label: 'Fully Reb. GP%', value: '-13.74', warn: true },
  { label: 'Total Cost', value: '$44.92' },
  { label: 'Delivery Fee', value: '$10.00' },
  { label: 'Weight', value: '0.00' },
  { label: 'Area', value: '0.00' },
  { label: 'Volume', value: '0.00' },
]

// ── Actions menu items ──
const actionItems = [
  { icon: DocumentTextIcon, label: 'Edit Header' },
  { icon: EyeSlashIcon, label: 'Hide Costs' },
  { icon: ArrowPathIcon, label: 'Reprice' },
  { icon: CurrencyDollarIcon, label: 'Gross Profit Reprice' },
  { icon: ScissorsIcon, label: 'Split Transaction' },
  { icon: CubeIcon, label: 'Pick & Release' },
  { icon: ClipboardDocumentListIcon, label: 'Picking Enquiry' },
  { icon: LinkIcon, label: 'Linked PO' },
  { icon: CreditCardIcon, label: 'Make Payment' },
  { icon: PauseIcon, label: 'Hold Order' },
  { icon: TrashIcon, label: 'Void Order', danger: true },
  { icon: PrinterIcon, label: 'Print Options' },
  { icon: DocumentDuplicateIcon, label: 'Copy Order' },
]

const COMMENTS_KEY = 'so-436-0-comments'

export default function SalesOrderDetailPage() {
  const [activeTab, setActiveTab] = useState('lines')
  const [aiOpen, setAiOpen] = useState(false)
  const [aiInput, setAiInput] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [rowSelection, setRowSelection] = useState({})

  // Sorting
  const [sorting, setSorting] = useState<SortingState>([])

  // Filtering
  const [showFilterBar, setShowFilterBar] = useState(false)
  const [globalFilter, setGlobalFilter] = useState('')
  const [negativeGpOnly, setNegativeGpOnly] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Comments
  const [lineComments, setLineComments] = useState<Record<number, string>>({})
  const [expandedCommentRow, setExpandedCommentRow] = useState<number | null>(null)
  const [commentDraft, setCommentDraft] = useState('')

  // Density
  const [compact, setCompact] = useState(false)

  // Load comments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMMENTS_KEY)
      if (stored) setLineComments(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [])

  const saveComment = useCallback((ln: number, text: string) => {
    setLineComments((prev) => {
      const next = { ...prev }
      if (text.trim()) {
        next[ln] = text.trim()
      } else {
        delete next[ln]
      }
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleCommentRow = useCallback((ln: number) => {
    setExpandedCommentRow((prev) => {
      if (prev === ln) return null
      setCommentDraft(lineComments[ln] || '')
      return ln
    })
  }, [lineComments])

  // Sync negative GP filter with columnFilters
  useEffect(() => {
    setColumnFilters(negativeGpOnly ? [{ id: 'gp', value: 'negative' }] : [])
  }, [negativeGpOnly])

  const data = useMemo(() => orderLines, [])

  const columns = useMemo(
    () => buildColumns(lineComments, toggleCommentRow),
    [lineComments, toggleCommentRow],
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, sorting, globalFilter, columnFilters },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = String(filterValue).toLowerCase()
      const { product, desc, supplier } = row.original
      return product.toLowerCase().includes(search) ||
        desc.toLowerCase().includes(search) ||
        supplier.toLowerCase().includes(search)
    },
    filterFns: {
      gpFilter: (row, _columnId, filterValue) => {
        if (filterValue === 'negative') return row.original.gp < 0
        return true
      },
    },
  })

  // Apply custom filter fn to gp column
  useEffect(() => {
    const gpColumn = table.getColumn('gp')
    if (gpColumn) {
      gpColumn.columnDef.filterFn = (row, _columnId, filterValue) => {
        if (filterValue === 'negative') return row.original.gp < 0
        return true
      }
    }
  }, [table])

  const selectedCount = Object.keys(rowSelection).length
  const commentCount = Object.keys(lineComments).length
  const hasActiveFilters = globalFilter || negativeGpOnly

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50 dark:bg-slate-900">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <a href="/dashboard" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-slate-300">
          <HomeIcon className="size-4" /> Home
        </a>
        <ChevronRightIcon className="size-3" />
        <a href="/sales-orders" className="hover:text-gray-700 dark:hover:text-slate-300">Sales Orders</a>
        <ChevronRightIcon className="size-3" />
        <span className="font-medium text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">SO 436/0</span>
      </div>

      {/* Order Header Card */}
      <div className="mx-4 mt-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-card">
        {/* Header Top Row */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">SO 436/0</h1>
              <StatusBadge label="Entry Complete" variant="green" />
              <StatusBadge label="Date Confirmed" variant="blue" />
              <StatusBadge label="Waiting on Picking" variant="amber" />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">Order &middot; PrePaid Deliveries &middot; Cash Card Holder</p>
          </div>
          <div className="flex items-center gap-2">
            {/* AI Toggle */}
            <button
              onClick={() => setAiOpen(true)}
              className={classNames(
                aiOpen ? 'border-tertiary-500 text-tertiary-500 bg-tertiary-50 dark:bg-tertiary-500/20' : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600',
                'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border group',
              )}
            >
              <SparklesIcon className="size-4 text-tertiary-500 dark:text-tertiary-400 animate-sparkle-3" />
              AI Assistant
            </button>

            {/* Actions dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 transition-all"
              >
                Actions
                <ChevronDownIcon className="size-3" />
              </button>
              {showActions && (
                <>
                  <div className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70" onClick={() => setShowActions(false)} />
                  <div className="absolute right-0 top-full mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-xl z-50 py-1">
                    {actionItems.map(({ icon: Icon, label, danger }) => (
                      <button
                        key={label}
                        className={classNames(
                          danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300',
                          'w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors',
                        )}
                      >
                        <Icon className="size-4 text-gray-400 dark:text-slate-500" />
                        {label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Header Fields Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 px-5 pb-4 text-xs">
          {[
            { label: 'Customer', value: '555555 — PrePaid Deliveries', isLink: true },
            { label: 'Cust Order #', value: '3321' },
            { label: 'Sales Rep', value: 'Anne Love' },
            { label: 'Branch', value: '10 — Test Branch 010' },
            { label: 'Despatch Method', value: 'Delivery from Store' },
            { label: 'Date Required', value: '20/10/2025' },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-[10px] text-neutral-500 dark:text-slate-500 font-medium uppercase tracking-wider">{field.label}</label>
              <div className={classNames(
                'font-medium mt-0.5',
                field.isLink
                  ? 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline cursor-pointer'
                  : 'text-neutral-800 dark:text-slate-200'
              )}>{field.value}</div>
            </div>
          ))}
        </div>

        {/* Payment Alert */}
        <div className="mx-5 mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-amber-50 dark:bg-amber-500/20 border border-amber-200 dark:border-amber-500/30 border-l-4 border-l-amber-400 dark:border-l-amber-500">
          <ExclamationTriangleIcon className="size-4 shrink-0 text-amber-500 dark:text-amber-400" />
          <span className="text-amber-800 dark:text-amber-300">$15.00 still to be paid on this order.</span>
          <button className="ml-auto text-xs font-medium text-primary-500 dark:text-primary-400 hover:text-primary-400 dark:hover:text-primary-300">Make Payment</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-4 mt-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mx-4 rounded-t-lg overflow-x-auto">
        <Tab active={activeTab === 'lines'} icon={ShoppingCartIcon} label="Order Lines" count={4} onClick={() => setActiveTab('lines')} />
        <Tab active={activeTab === 'delivery'} icon={TruckIcon} label="Delivery Details" onClick={() => setActiveTab('delivery')} />
        <Tab active={activeTab === 'header'} icon={DocumentTextIcon} label="Header" onClick={() => setActiveTab('header')} />
        <Tab active={activeTab === 'diary'} icon={ClipboardDocumentListIcon} label="Diary Notes" count={commentCount || undefined} onClick={() => setActiveTab('diary')} />
        <Tab active={activeTab === 'messages'} icon={ChatBubbleLeftRightIcon} label="Messages" onClick={() => setActiveTab('messages')} />
        <Tab active={activeTab === 'tasks'} icon={CheckCircleIcon} label="Tasks" onClick={() => setActiveTab('tasks')} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 mx-4 bg-white dark:bg-slate-800 border-x border-b border-gray-200 dark:border-slate-700 rounded-b-lg flex flex-col overflow-hidden mb-4">

        {/* ── Order Lines Tab ── */}
        {activeTab === 'lines' && (
          <>
            {/* Quick Add Bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                <PlusIcon className="size-4" />
                Quick Add:
              </div>
              <input className="w-32 px-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 focus:border-primary-300" placeholder="Product code..." />
              <input className="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md text-center" placeholder="Qty" defaultValue="1" />
              <input className="w-20 px-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md text-right" placeholder="Sell Price" />
              <input className="w-16 px-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md text-center" placeholder="Disc%" defaultValue="0" />
              <input className="flex-1 min-w-[120px] px-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md" placeholder="Comments..." />
              <button className="p-1.5 rounded-md text-white bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-500">
                <CheckIcon className="size-4" />
              </button>
              <button className="p-1.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-600">
                <XMarkIcon className="size-4" />
              </button>
              <div className="ml-auto flex items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                <span>SOH: <strong className="text-gray-700 dark:text-slate-300">—</strong></span>
                <span>Avail: <strong className="text-gray-700 dark:text-slate-300">—</strong></span>
              </div>
            </div>

            {/* Table Toolbar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/20 text-primary-500 dark:text-primary-400">
                    {selectedCount} selected
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowFilterBar(!showFilterBar)}
                  className={classNames(hasActiveFilters ? 'bg-primary-50 dark:bg-primary-500/20' : '', 'relative p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700')}
                  title="Toggle filters"
                >
                  <FunnelIcon className={classNames(hasActiveFilters ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500', 'size-4')} />
                  {hasActiveFilters && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                  )}
                </button>
                <button
                  onClick={() => setSorting([])}
                  className={classNames(sorting.length > 0 ? 'bg-primary-50 dark:bg-primary-500/20' : '', 'p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700')}
                  title={sorting.length > 0 ? 'Clear sorting' : 'No active sorting'}
                >
                  <ArrowsUpDownIcon className={classNames(sorting.length > 0 ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500', 'size-4')} />
                </button>
                <button
                  onClick={() => setCompact(!compact)}
                  className={classNames(compact ? 'bg-primary-50 dark:bg-primary-500/20' : '', 'p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700')}
                  title={compact ? 'Normal density' : 'Compact density'}
                >
                  <Bars3BottomLeftIcon className={classNames(compact ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500', 'size-4')} />
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            {showFilterBar && (
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-900/30">
                <div className="relative flex-1 max-w-xs">
                  <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search product, description, supplier..."
                    className="w-full pl-7 pr-2 py-1 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 focus:border-primary-300"
                  />
                </div>
                <button
                  onClick={() => setNegativeGpOnly(!negativeGpOnly)}
                  className={classNames(
                    negativeGpOnly ? 'bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30' : 'bg-white dark:bg-slate-700 text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600',
                    'px-2.5 py-1 text-xs font-medium rounded-full border transition-colors',
                  )}
                >
                  Negative GP
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setGlobalFilter(''); setNegativeGpOnly(false) }}
                    className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}

            {/* TanStack Data Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort()
                        const sorted = header.column.getIsSorted()
                        return (
                          <th
                            key={header.id}
                            className={classNames(
                              canSort ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-slate-800' : '',
                              'px-2 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider',
                            )}
                            style={{ fontSize: '10px', width: header.getSize() }}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            <span className="flex items-center gap-0.5">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                              {canSort && sorted === 'asc' && <ChevronUpSolidIcon className="size-3 text-primary-500 dark:text-primary-400" />}
                              {canSort && sorted === 'desc' && <ChevronDownSolidIcon className="size-3 text-primary-500 dark:text-primary-400" />}
                            </span>
                          </th>
                        )
                      })}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const ln = row.original.ln
                    const isCommentOpen = expandedCommentRow === ln
                    return (
                      <React.Fragment key={row.id}>
                        <tr
                          className={classNames(
                            row.getIsSelected() ? 'bg-primary-50 dark:bg-primary-500/20' : 'hover:bg-gray-50 dark:hover:bg-slate-700/50',
                            'border-b border-gray-100 dark:border-slate-700 transition-colors',
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className={classNames('px-2', compact ? 'py-1' : 'py-2.5')}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                        {isCommentOpen && (
                          <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                            <td colSpan={columns.length} className="px-4 py-2">
                              <div className="flex items-start gap-2 max-w-lg">
                                <ChatBubbleLeftRightIcon className="size-4 text-gray-400 dark:text-slate-500 mt-1.5 shrink-0" />
                                <div className="flex-1">
                                  <textarea
                                    value={commentDraft}
                                    onChange={(e) => setCommentDraft(e.target.value)}
                                    placeholder="Add a comment for this line..."
                                    rows={2}
                                    className="w-full px-2.5 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 focus:border-primary-300 resize-none"
                                  />
                                  <div className="flex items-center gap-1.5 mt-1.5">
                                    <button
                                      onClick={() => { saveComment(ln, commentDraft); setExpandedCommentRow(null) }}
                                      className="px-2.5 py-1 text-xs font-medium rounded-md text-white bg-primary-500 dark:bg-primary-600 hover:bg-primary-400 dark:hover:bg-primary-500"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setExpandedCommentRow(null)}
                                      className="px-2.5 py-1 text-xs font-medium rounded-md text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
                                    >
                                      Cancel
                                    </button>
                                    {lineComments[ln] && (
                                      <button
                                        onClick={() => { saveComment(ln, ''); setExpandedCommentRow(null) }}
                                        className="px-2.5 py-1 text-xs font-medium rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 ml-auto"
                                      >
                                        Remove
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── Delivery Details Tab ── */}
        {activeTab === 'delivery' && (
          <div className="flex-1 overflow-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column — Address & Contact */}
              <div className="space-y-4">
                {[
                  { label: 'Delivery Date', value: '20/10/2025', type: 'date' },
                  { label: 'Requested Time', value: '', type: 'select' },
                  { label: 'Delivery Time', value: '00:00' },
                  { label: 'Deliver To', value: 'PrePaid Deliveries' },
                  { label: 'Address', value: '123 Hill Street' },
                  { label: 'Suburb/City', value: 'NSW' },
                  { label: 'State', value: 'ACT - Australian Capital Territory', type: 'select' },
                  { label: 'Post Code', value: '' },
                  { label: 'Country', value: 'AUSTRALIA' },
                  { label: 'Instructions', value: '' },
                  { label: 'Contact Name', value: '' },
                  { label: 'Contact Phone', value: '0430000000' },
                  { label: 'Contact Email', value: '' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-28 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    {field.type === 'select' ? (
                      <select className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500">
                        <option>{field.value || '—'}</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500"
                      />
                    )}
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-28" />
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600">
                    Save Contact
                  </button>
                </div>
              </div>

              {/* Middle column — Delivery details */}
              <div className="space-y-4">
                {[
                  { label: 'Type Of Load', value: '', type: 'select' },
                  { label: 'Has Phoned', value: false, type: 'checkbox' },
                  { label: 'Map Ref', value: '10D102' },
                  { label: 'Map Xref', value: '332' },
                  { label: 'Delivery Area', value: 'D102' },
                  { label: 'Delivery Fee(Inc)', value: '10' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-28 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    {field.type === 'checkbox' ? (
                      <input type="checkbox" defaultChecked={field.value as boolean} className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                    ) : field.type === 'select' ? (
                      <select className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500">
                        <option>{field.value || '—'}</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        defaultValue={field.value as string}
                        className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500"
                      />
                    )}
                  </div>
                ))}
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <label className="w-28 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0 pt-1.5">Comments</label>
                    <textarea rows={3} className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 resize-none" />
                  </div>
                  <div className="flex items-start gap-3">
                    <label className="w-28 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0 pt-1.5">Picking Comment</label>
                    <textarea rows={3} className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 resize-none bg-green-50/30 dark:bg-green-500/10" />
                  </div>
                </div>
              </div>

              {/* Right column — Vehicle & Map */}
              <div className="space-y-4">
                {[
                  { label: 'Vehicle', value: '' },
                  { label: 'Run No.', value: '0' },
                  { label: 'Drop No.', value: '0' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-20 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-24 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500"
                    />
                  </div>
                ))}
                {/* Map placeholder */}
                <div className="mt-2 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                  <div className="bg-gray-100 dark:bg-slate-900 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <MapPinIcon className="size-8 text-gray-300 dark:text-slate-600 mx-auto" />
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">123 Hill St, Muswellbrook</p>
                      <a href="#" className="text-xs text-primary-500 dark:text-primary-400 hover:underline">View larger map</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Header Tab ── */}
        {activeTab === 'header' && (
          <div className="flex-1 overflow-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column — Order details */}
              <div className="space-y-3 border border-gray-100 dark:border-slate-700 rounded-lg p-4">
                {[
                  { label: 'Ordered By', value: 'master' },
                  { label: 'Operator', value: '10', extra: 'System Administrator' },
                  { label: 'Order Taken By', value: 'Test', extra: 'test1111' },
                  { label: 'Status', value: 'Waiting' },
                  { label: 'Assignee', value: 'master' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    <span className="text-xs text-gray-800 dark:text-slate-200">{field.value}</span>
                    {field.extra && <span className="text-xs text-gray-400 dark:text-slate-500 ml-2">{field.extra}</span>}
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <div className="w-32" />
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600">
                    Assign To Me
                  </button>
                </div>
                <div className="border-t border-gray-100 dark:border-slate-700 my-2" />
                {[
                  { label: 'Date ordered', value: '20/11/2012' },
                  { label: 'BO Created', value: '' },
                  { label: 'Original Deliv Date', value: '' },
                  { label: 'Linked Transfer', value: '' },
                  { label: 'Pick List Print #', value: '10' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    <span className="text-xs text-gray-800 dark:text-slate-200">{field.value || '—'}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 dark:border-slate-700 my-2" />
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Hide Quote Line Pricing on Web</label>
                  <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Selling Branch</label>
                  <span className="text-xs text-gray-800 dark:text-slate-200">10 - TEST BRANCH 010</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Supply Warehouse</label>
                  <span className="text-xs text-gray-800 dark:text-slate-200">—</span>
                </div>
              </div>

              {/* Middle column — Project, payment, descriptions */}
              <div className="space-y-3 border border-gray-100 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Export Sale</label>
                  <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Online Sale</label>
                  <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                </div>
                {[
                  { label: 'Project', value: '0' },
                  { label: 'Job', value: '0' },
                  { label: 'Section', value: '0' },
                ].map((field) => (
                  <div key={field.label} className="flex items-center gap-3">
                    <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">{field.label}</label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-24 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500"
                    />
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0 pt-1.5">Transaction Description</label>
                  <textarea rows={2} className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 resize-none" />
                </div>
                <div className="flex items-start gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0 pt-1.5">Text Invoice</label>
                  <textarea rows={2} className="flex-1 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500 resize-none" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32 text-xs font-medium text-gray-500 dark:text-slate-400 text-right shrink-0">Payment Terms</label>
                  <input
                    type="text"
                    defaultValue="30Days"
                    className="w-24 px-2 py-1.5 text-xs border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300 dark:focus:ring-primary-500"
                  />
                  <span className="text-xs text-gray-500 dark:text-slate-400">Nett 30 Days</span>
                </div>
              </div>

              {/* Right column — Approvals */}
              <div className="space-y-3 border border-gray-100 dark:border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Checked by Sales Manager</label>
                  <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600 dark:text-slate-300">Checked by Transport Manager</label>
                  <input type="checkbox" className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Diary Notes Tab ── */}
        {activeTab === 'diary' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                    {['Type', 'Date', 'Time', 'User', 'Perm.', 'Secure', 'Follow Up', 'Diary Note'].map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: 'order', date: '28/10/2025', time: '8:57 PM', user: 'mdebeer', perm: false, secure: false, followUp: false, note: 'Picking Slip 436, 00 Output as PDF. Value of transaction is $39.00' },
                    { type: 'order', date: '28/05/2025', time: '2:20 PM', user: 'taskSched', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:b16878d8-52a5-8597-da14-335198f48e30' },
                    { type: 'order', date: '06/03/2025', time: '10:43 AM', user: 'stevend', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:8fcdefa6-a436-ca81-d514-bf35a80e9cce' },
                    { type: 'order', date: '06/03/2025', time: '10:42 AM', user: 'stevend', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:8fcdefa6-a436-ca81-d514-bb35b878a734' },
                    { type: 'order', date: '06/03/2025', time: '10:41 AM', user: 'stevend', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:8fcdefa6-a436-ca81-d514-b83b5b8b42a55' },
                    { type: 'order', date: '06/03/2025', time: '10:41 AM', user: 'stevend', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:8fcdefa6-a436-ca81-d514-b83558389d55' },
                    { type: 'transport', date: '06/03/2025', time: '10:40 AM', user: 'master', perm: false, secure: false, followUp: false, note: 'Delivery Date Changed: 20/11/2012 to 06/03/2025' },
                    { type: 'order', date: '06/03/2025', time: '10:40 AM', user: 'stevend', perm: false, secure: false, followUp: false, note: 'orderModified Notification Sent To: sean Subject:Test: Order 436 modified Body: Trigger ID:8fcdefa6-a436-ca81-d514-b735d02cbc89' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-3 py-2 text-gray-700 dark:text-slate-300">{row.type}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-slate-300 whitespace-nowrap">{row.date}</td>
                      <td className="px-3 py-2 text-gray-500 dark:text-slate-400 whitespace-nowrap">{row.time}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-slate-300">{row.user}</td>
                      <td className="px-3 py-2"><input type="checkbox" defaultChecked={row.perm} className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" disabled /></td>
                      <td className="px-3 py-2"><input type="checkbox" defaultChecked={row.secure} className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" disabled /></td>
                      <td className="px-3 py-2"><input type="checkbox" defaultChecked={row.followUp} className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700" disabled /></td>
                      <td className="px-3 py-2 text-gray-600 dark:text-slate-400 truncate max-w-md">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-gray-100 dark:border-slate-700 px-4 py-2.5 bg-gray-50/50 dark:bg-slate-900/50">
              <button className="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600">
                Add Diary Note
              </button>
            </div>
          </div>
        )}

        {/* ── Messages Tab ── */}
        {activeTab === 'messages' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-300">
                <PlusIcon className="size-3.5" />
                Add
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 50 }}>Line</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', width: 120 }}>Type</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px' }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-3 py-2 text-gray-700 dark:text-slate-300 font-mono">0</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-slate-300">System Message</td>
                    <td className="px-3 py-2 text-gray-600 dark:text-slate-400">Testing if the XML updates me Testing if the XML updates me Testing if the XML updates me Testing if the XML updates me</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tasks Tab ── */}
        {activeTab === 'tasks' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                    {['Code', 'Assignee', 'Status', 'Quantity', 'UOM', 'Date Due', 'Date Complete', 'Notes'].map((col) => (
                      <th key={col} className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="px-3 py-16 text-center text-sm text-gray-400 dark:text-slate-500">
                      No items to show.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Totals — visible on all tabs */}
        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-2.5 flex items-center gap-5 text-xs shrink-0 flex-wrap">
          {footerTotals.map(({ label, value, bold, warn }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-gray-400 dark:text-slate-500 uppercase" style={{ fontSize: '10px' }}>{label}</span>
              <span className={classNames(
                warn ? 'text-red-600 dark:text-red-400' : bold ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300',
                'font-mono font-semibold',
              )}>
                {value}
              </span>
            </div>
          ))}
          <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:underline text-xs font-medium ml-2">
            View Totals &amp; Charges
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600">Save</button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600">Cancel</button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Close</button>
          </div>
        </div>
      </div>

      {/* ── AI Assistant Slide-Over Drawer ── */}
      <Dialog open={aiOpen} onClose={setAiOpen} className="relative z-[60]">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-all duration-500 ease-in-out data-[closed]:opacity-0 data-[closed]:backdrop-blur-none"
        />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition-transform duration-700 ease-in-out data-[closed]:translate-x-full data-[closed]:duration-500"
              >
                <div className="flex h-full flex-col bg-white dark:bg-slate-800 shadow-2xl">
                  {/* Panel Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-xl flex items-center justify-center bg-tertiary-50 dark:bg-tertiary-500/20">
                        <SparklesIcon className="size-4 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                      </div>
                      <div>
                        <DialogTitle className="text-sm font-semibold text-gray-800 dark:text-slate-100">AI Assistant</DialogTitle>
                        <p className="text-xs text-gray-400 dark:text-slate-500">Context: SO 436/0</p>
                      </div>
                    </div>
                    <button onClick={() => setAiOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                      <XMarkIcon className="size-5 text-gray-400 dark:text-slate-500" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { icon: ArrowPathIcon, label: 'Reprice Order', color: 'text-primary-500 dark:text-primary-400' },
                        { icon: CubeIcon, label: 'Check Stock', color: 'text-tertiary-500 dark:text-tertiary-400' },
                        { icon: ScissorsIcon, label: 'Split Transaction', color: 'text-secondary-500 dark:text-secondary-400' },
                        { icon: ChartBarIcon, label: 'Margin Analysis', color: 'text-purple-500 dark:text-purple-400' },
                        { icon: ArrowTrendingUpIcon, label: 'Customer Trends', color: 'text-green-500 dark:text-green-400' },
                        { icon: CreditCardIcon, label: 'Payment Status', color: 'text-rose-500 dark:text-rose-400' },
                      ].map(({ icon: Icon, label, color }) => (
                        <button
                          key={label}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left"
                        >
                          <Icon className={classNames(color, 'size-4 shrink-0')} />
                          <span className="text-xs text-gray-600 dark:text-slate-300">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                    {/* AI Welcome */}
                    <div className="flex gap-2.5">
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50 dark:bg-tertiary-500/20">
                        <SparklesIcon className="size-3.5 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                          <p>You&apos;re viewing <strong>SO 436/0</strong> for PrePaid Deliveries (Cust 555555). There are <strong>4 order lines</strong> totalling <strong>$464.29</strong> exc. GST.</p>
                          <p className="mt-2 flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <ExclamationTriangleIcon className="size-3" />
                            <span>Line 2 has a negative GP of -206% — selling below cost.</span>
                          </p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {['Check stock for all items', 'Reprice line 2', 'Show margin breakdown', 'Customer order history'].map((s) => (
                            <button key={s} className="px-2.5 py-1 text-xs rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 transition-colors">
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex gap-2.5 justify-end">
                      <div className="bg-primary-50 dark:bg-primary-500/20 border border-primary-100 dark:border-primary-500/30 rounded-xl rounded-tr-sm px-3 py-2 text-xs text-gray-700 dark:text-slate-300 max-w-72">
                        Show me the margin breakdown for this order
                      </div>
                    </div>

                    {/* AI Response with Chart */}
                    <div className="flex gap-2.5">
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50 dark:bg-tertiary-500/20">
                        <SparklesIcon className="size-3.5 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                          <p className="font-medium mb-2">Margin Analysis — SO 436/0</p>
                          {/* Mini Chart */}
                          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 p-2.5 mb-2">
                            <div className="space-y-2">
                              {orderLines.map((line) => (
                                <div key={line.ln} className="flex items-center gap-2">
                                  <span className="w-20 text-xs text-gray-500 dark:text-slate-400 truncate">{line.product}</span>
                                  <div className="flex-1 h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className={classNames(
                                        line.gp < 0 ? 'bg-red-400' : line.gp < 15 ? 'bg-amber-400' : 'bg-green-400',
                                        'h-full rounded-full transition-all',
                                      )}
                                      style={{ width: `${Math.max(2, Math.min(100, line.gp > 0 ? line.gp * 2 : 2))}%` }}
                                    />
                                  </div>
                                  <span className={classNames(line.gp < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-slate-300', 'w-14 text-right text-xs font-mono font-medium')}>
                                    {line.gp.toFixed(1)}%
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <p><strong className="text-red-600 dark:text-red-400">Line 2 (JMB3)</strong> is selling at $2.20 against a unit cost of $6.12, resulting in a loss of $3.92 per unit ($19.60 total).</p>
                          <p className="mt-1.5">The other 3 lines average <strong className="text-emerald-600 dark:text-emerald-400">28.1% GP</strong>, within acceptable range.</p>
                        </div>

                        {/* Action Suggestions */}
                        <div className="mt-2 space-y-1">
                          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left">
                            <ArrowPathIcon className="size-4 text-primary-500 dark:text-primary-400" />
                            <span className="text-xs text-gray-600 dark:text-slate-300 flex-1">Reprice JMB3 to breakeven ($6.12)</span>
                            <ArrowRightIcon className="size-3 text-gray-400 dark:text-slate-500" />
                          </button>
                          <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left">
                            <CurrencyDollarIcon className="size-4 text-green-500 dark:text-green-400" />
                            <span className="text-xs text-gray-600 dark:text-slate-300 flex-1">Reprice JMB3 to 15% GP ($7.20)</span>
                            <ArrowRightIcon className="size-3 text-gray-400 dark:text-slate-500" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Confirmation Preview */}
                    <div className="flex gap-2.5">
                      <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50 dark:bg-tertiary-500/20">
                        <SparklesIcon className="size-3.5 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                      </div>
                      <div className="flex-1">
                        <div className="rounded-xl border-2 border-dashed border-secondary-400 dark:border-secondary-500/50 bg-secondary-50/30 dark:bg-secondary-500/10 px-3 py-2.5 text-xs">
                          <p className="font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                            <ExclamationTriangleIcon className="size-3 text-secondary-500 dark:text-secondary-400" />
                            Confirm Price Change
                          </p>
                          <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-slate-700 overflow-hidden mb-2">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-50 dark:bg-slate-900">
                                  <th className="px-2 py-1.5 text-left text-gray-500 dark:text-slate-400 font-medium">Field</th>
                                  <th className="px-2 py-1.5 text-right text-gray-500 dark:text-slate-400 font-medium">Current</th>
                                  <th className="px-2 py-1.5 text-right text-gray-500 dark:text-slate-400 font-medium">New</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-t border-gray-50 dark:border-slate-700">
                                  <td className="px-2 py-1.5 text-gray-600 dark:text-slate-400">Sell Price</td>
                                  <td className="px-2 py-1.5 text-right font-mono text-red-500 dark:text-red-400 line-through">$2.20</td>
                                  <td className="px-2 py-1.5 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">$7.20</td>
                                </tr>
                                <tr className="border-t border-gray-50 dark:border-slate-700">
                                  <td className="px-2 py-1.5 text-gray-600 dark:text-slate-400">Line Total</td>
                                  <td className="px-2 py-1.5 text-right font-mono text-gray-400 dark:text-slate-500">$11.00</td>
                                  <td className="px-2 py-1.5 text-right font-mono font-medium text-gray-700 dark:text-slate-300">$36.00</td>
                                </tr>
                                <tr className="border-t border-gray-50 dark:border-slate-700">
                                  <td className="px-2 py-1.5 text-gray-600 dark:text-slate-400">GP%</td>
                                  <td className="px-2 py-1.5 text-right font-mono text-red-500 dark:text-red-400">-206.1%</td>
                                  <td className="px-2 py-1.5 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">15.0%</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="flex items-center gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-500">
                              <CheckIcon className="size-3" /> Apply Change
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-600">
                              <XMarkIcon className="size-3" /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Input Area */}
                  <div className="p-3 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-stretch gap-2">
                      <div className="flex-1 relative">
                        <textarea
                          value={aiInput}
                          onChange={(e) => setAiInput(e.target.value)}
                          placeholder="Ask about this order..."
                          rows={1}
                          className="w-full h-full resize-none rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-tertiary-300 dark:focus:ring-tertiary-500 focus:border-transparent pr-10 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600">
                          <PaperClipIcon className="size-4 text-gray-400 dark:text-slate-500" />
                        </button>
                      </div>
                      <button className="flex items-center justify-center px-2.5 rounded-xl text-white bg-tertiary-500 hover:bg-tertiary-600 dark:bg-tertiary-600 dark:hover:bg-tertiary-500 shrink-0">
                        <PaperAirplaneIcon className="size-4" />
                      </button>
                    </div>
                    <p className="text-center text-[10px] text-gray-300 dark:text-slate-600 mt-1.5">
                      AI responses are generated — always verify before applying changes
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
