'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  SparklesIcon,
  ChevronDownIcon,
  HomeIcon,
  ChevronRightIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  TruckIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { classNames } from '@/lib/utils'
import type { QuoteOrderLine } from '@/lib/ai/types'
import { QUOTE_1098_HEADER } from '@/lib/ai/data/quote-1098'
import { AIDrawerShell } from '@/components/ai-assistant/AIDrawerShell'
import { SO1098Conversation } from '@/components/ai-assistant/conversations/SO1098Conversation'

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

// ── Status badge ──
function StatusBadge({ label, variant }: { label: string; variant: 'green' | 'blue' | 'amber' | 'gray' }) {
  const styles = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
    blue: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30',
    amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    gray: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600',
  }
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${styles[variant]}`}>
      {variant === 'green' && <CheckCircleIcon className="size-3" />}
      {variant === 'amber' && <ClockIcon className="size-3" />}
      {label}
    </span>
  )
}

// ── Column definitions ──
const columnHelper = createColumnHelper<QuoteOrderLine>()

const columns = [
  columnHelper.accessor('lineNumber', {
    header: 'Ln',
    cell: (info) => <span className="text-gray-400 dark:text-slate-500 font-mono">{info.getValue()}</span>,
    size: 40,
  }),
  columnHelper.accessor('productCode', {
    header: 'Product Code',
    cell: (info) => <span className="font-mono text-primary-600 dark:text-primary-400">{info.getValue()}</span>,
    size: 140,
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => info.getValue(),
    size: 250,
  }),
  columnHelper.accessor('qty', {
    header: 'Qty',
    cell: (info) => info.getValue(),
    size: 60,
  }),
  columnHelper.accessor('uom', {
    header: 'UOM',
    cell: (info) => info.getValue(),
    size: 50,
  }),
  columnHelper.accessor('sellPrice', {
    header: 'Sell Price',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
    size: 80,
  }),
  columnHelper.accessor('lineTotal', {
    header: 'Line Total',
    cell: (info) => `$${info.getValue().toFixed(2)}`,
    size: 90,
  }),
]

// ── Main Page Component ──
export default function SalesOrder1098Page() {
  const [activeTab, setActiveTab] = useState('lines')
  const [aiOpen, setAiOpen] = useState(false)
  const [orderLines, setOrderLines] = useState<QuoteOrderLine[]>([])
  const [highlightedLines, setHighlightedLines] = useState<Set<number>>(new Set())

  const h = QUOTE_1098_HEADER

  // Handle adding lines from the AI assistant
  const handleAddLines = useCallback((newLines: QuoteOrderLine[]) => {
    setOrderLines((prev) => {
      // Re-number lines sequentially
      const combined = [...prev, ...newLines]
      return combined.map((line, i) => ({ ...line, lineNumber: i + 1 }))
    })
    // Highlight the new lines
    const newLineNumbers = new Set(
      newLines.map((_, i) => orderLines.length + i + 1)
    )
    setHighlightedLines(newLineNumbers)
    // Clear highlights after animation
    setTimeout(() => setHighlightedLines(new Set()), 2500)
  }, [orderLines.length])

  // Computed totals
  const subtotal = useMemo(
    () => orderLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [orderLines]
  )
  const gst = useMemo(() => subtotal * 0.1, [subtotal])
  const total = useMemo(() => subtotal + gst, [subtotal, gst])

  const table = useReactTable({
    data: orderLines,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const footerTotals = [
    { label: 'Subtotal', value: `$${subtotal.toFixed(2)}`, bold: true },
    { label: 'GST', value: `$${gst.toFixed(2)}` },
    { label: 'Total (inc GST)', value: `$${total.toFixed(2)}`, bold: true },
    { label: 'Lines', value: String(orderLines.length) },
  ]

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-slate-900 overflow-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <a href="/dashboard" className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-slate-300">
          <HomeIcon className="size-4" /> Home
        </a>
        <ChevronRightIcon className="size-3" />
        <a href="/sales-orders" className="hover:text-gray-700 dark:hover:text-slate-300">Sales Orders</a>
        <ChevronRightIcon className="size-3" />
        <span className="font-medium text-gray-900 dark:text-slate-100 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">SO {h.orderNumber}</span>
      </div>

      {/* Order Header Card */}
      <div className="mx-4 mt-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-card">
        {/* Header Top Row */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-slate-100">SO {h.orderNumber}</h1>
              <StatusBadge label={h.type} variant="blue" />
              <StatusBadge label={h.status} variant="amber" />
            </div>
            <p className="text-xs text-gray-500 dark:text-slate-400">{h.type} &middot; {h.customer.name}</p>
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
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 transition-all">
              Actions
              <ChevronDownIcon className="size-3" />
            </button>
          </div>
        </div>

        {/* Header Fields Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 px-5 pb-4 text-xs">
          {[
            { label: 'Customer', value: `${h.customer.id} — ${h.customer.name}`, isLink: true },
            { label: 'Cust Order #', value: '—' },
            { label: 'Sales Rep', value: h.salesRep },
            { label: 'Branch', value: h.branch },
            { label: 'Despatch Method', value: h.despatchMethod },
            { label: 'Date Required', value: h.dateRequired },
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
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-4 mt-2 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mx-4 rounded-t-lg overflow-x-auto">
        <Tab active={activeTab === 'lines'} icon={ShoppingCartIcon} label="Order Lines" count={orderLines.length || undefined} onClick={() => setActiveTab('lines')} />
        <Tab active={activeTab === 'delivery'} icon={TruckIcon} label="Delivery Details" onClick={() => setActiveTab('delivery')} />
        <Tab active={activeTab === 'header'} icon={DocumentTextIcon} label="Header" onClick={() => setActiveTab('header')} />
        <Tab active={activeTab === 'diary'} icon={ClipboardDocumentListIcon} label="Diary Notes" onClick={() => setActiveTab('diary')} />
        <Tab active={activeTab === 'messages'} icon={ChatBubbleLeftRightIcon} label="Messages" onClick={() => setActiveTab('messages')} />
        <Tab active={activeTab === 'tasks'} icon={CheckCircleIcon} label="Tasks" onClick={() => setActiveTab('tasks')} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 mx-4 bg-white dark:bg-slate-800 border-x border-b border-gray-200 dark:border-slate-700 rounded-b-lg flex flex-col overflow-hidden mb-4">
        {/* ── Order Lines Tab ── */}
        {activeTab === 'lines' && (
          <>
            {/* Quick Add Bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-slate-400">
                <PlusIcon className="size-4" />
                Quick Add:
              </div>
              <input
                type="text"
                placeholder="Search products or enter code..."
                className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600">
                Add
              </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {orderLines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500">
                  <ShoppingCartIcon className="size-10 mb-3 opacity-40" />
                  <p className="text-sm font-medium">No items on this quote yet</p>
                  <p className="text-xs mt-1">Use the AI Assistant to find and add products</p>
                  <button
                    onClick={() => setAiOpen(true)}
                    className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-tertiary-300 dark:border-tertiary-500/40 text-tertiary-600 dark:text-tertiary-400 hover:bg-tertiary-50 dark:hover:bg-tertiary-500/10 transition-colors"
                  >
                    <SparklesIcon className="size-4" />
                    Open AI Assistant
                  </button>
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id} className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-3 py-2 text-left font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                            style={{ fontSize: '10px', width: header.getSize() }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => {
                      const isHighlighted = highlightedLines.has(row.original.lineNumber)
                      const isCrossSell = row.original.isCrossSell
                      return (
                        <tr
                          key={row.id}
                          className={classNames(
                            'border-b border-gray-100 dark:border-slate-700 transition-colors',
                            isHighlighted
                              ? 'animate-highlight-green dark:animate-highlight-green-dark'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800',
                            isCrossSell ? 'bg-tertiary-50/30 dark:bg-tertiary-500/5' : '',
                          )}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="px-3 py-2 text-gray-700 dark:text-slate-300"
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'lines' && (
          <div className="flex-1 flex items-center justify-center py-20">
            <p className="text-sm text-gray-400 dark:text-slate-500">No items to show.</p>
          </div>
        )}

        {/* Footer Totals */}
        <div className="border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 px-4 py-2.5 flex items-center gap-5 text-xs shrink-0 flex-wrap">
          {footerTotals.map(({ label, value, bold }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-gray-400 dark:text-slate-500 uppercase" style={{ fontSize: '10px' }}>{label}</span>
              <span className={classNames(
                bold ? 'text-gray-900 dark:text-slate-100' : 'text-gray-700 dark:text-slate-300',
                'font-mono font-semibold',
              )}>
                {value}
              </span>
            </div>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600">Save</button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600">Cancel</button>
            <button className="px-4 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700">Close</button>
          </div>
        </div>
      </div>

      {/* ── AI Assistant Drawer ── */}
      <AIDrawerShell
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        title="AI Assistant"
        subtitle={`Quote: SO ${h.orderNumber} · ${h.customer.name} · ${orderLines.length} lines`}
      >
        <SO1098Conversation onAddLines={handleAddLines} />
      </AIDrawerShell>
    </div>
  )
}
