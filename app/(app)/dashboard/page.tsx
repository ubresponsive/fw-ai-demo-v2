'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAppShell } from '@/lib/app-shell-context'
import { classNames } from '@/lib/utils'
import { getChartColors } from '@/lib/chart-colors'
import { ArrowDownIcon, ArrowUpIcon, ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
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
  ClockIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ArrowTrendingDownIcon,
  ArchiveBoxIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ScheduleCategory = 'purchasing' | 'sales' | 'accounts' | 'inventory' | 'production'

interface ScheduleItem {
  id: string
  priority: number
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>
  category: ScheduleCategory
  title: string
  detail: string
  secondaryText: string
  count?: number
  time?: string
}

interface ActionItem {
  id: string
  title: string
  context: string
  shortcutLabel?: string
  shortcutHref?: string
}

// ---------------------------------------------------------------------------
// Category style map — full static class strings for Tailwind purge safety
// ---------------------------------------------------------------------------

const CATEGORY_STYLES: Record<ScheduleCategory, { dot: string; icon: string; bg: string }> = {
  purchasing: {
    dot: 'bg-schedule-purchasing',
    icon: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  sales: {
    dot: 'bg-schedule-sales',
    icon: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  accounts: {
    dot: 'bg-schedule-accounts',
    icon: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  inventory: {
    dot: 'bg-schedule-inventory',
    icon: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
  production: {
    dot: 'bg-schedule-production',
    icon: 'text-violet-500 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
}

// ---------------------------------------------------------------------------
// Data constants
// ---------------------------------------------------------------------------

const todaysSchedule: ScheduleItem[] = [
  { id: 's1', priority: 1, icon: TruckIcon, category: 'purchasing', title: '3 purchase orders arriving', detail: 'PO 4821, 4823, 4825', secondaryText: 'Boral, AUS-TIM', count: 3 },
  { id: 's2', priority: 2, icon: ArchiveBoxIcon, category: 'sales', title: '12 orders awaiting pick', detail: '8 delivery, 4 counter collect', secondaryText: '', count: 12 },
  { id: 's3', priority: 3, icon: ClockIcon, category: 'sales', title: '5 deliveries due by 2pm', detail: 'Dispatches scheduled today', secondaryText: '', time: 'by 2:00 PM' },
  { id: 's4', priority: 4, icon: DocumentTextIcon, category: 'accounts', title: '2 quotes expiring today', detail: 'QU 1087/0, QU 1092/0', secondaryText: 'CJ Constructions, Bayside Builders', count: 2 },
  { id: 's5', priority: 5, icon: ExclamationTriangleIcon, category: 'inventory', title: '4 items below reorder point', detail: 'PLY-STR-17, CONC-RS-20KG', secondaryText: 'NAIL-BH-75, CEM025', count: 4 },
  { id: 's6', priority: 6, icon: CalendarIcon, category: 'production', title: 'Stocktake: Timber yard', detail: 'Scheduled for 3:00 PM', secondaryText: '', time: '3:00 PM' },
  { id: 's7', priority: 7, icon: ArrowTrendingDownIcon, category: 'production', title: '3 jobs behind schedule', detail: 'Production jobs 1842, 1845, 1847', secondaryText: '', count: 3 },
]

const defaultActions: ActionItem[] = [
  { id: 'action-1', title: 'Issue customer statements', context: 'End of month — 142 accounts', shortcutLabel: 'Run Statements', shortcutHref: '#' },
  { id: 'action-2', title: 'Follow up overdue payments', context: '8 accounts over 60 days, $47.2K outstanding', shortcutLabel: 'View Aged Debtors', shortcutHref: '#' },
  { id: 'action-3', title: 'Review low-margin orders', context: '3 orders with GP below 10% flagged yesterday', shortcutLabel: 'View Orders', shortcutHref: '/sales-orders' },
  { id: 'action-4', title: 'Approve purchase orders', context: '2 POs pending approval ($12.4K total)', shortcutLabel: 'View POs', shortcutHref: '#' },
  { id: 'action-5', title: 'Check morning delivery schedule', context: '5 deliveries dispatched at 7:30 AM' },
  { id: 'action-6', title: 'Review yesterday\'s sales figures', context: 'Branch 10 revenue: $18.4K' },
]

const DEFAULT_CHECKED_ACTIONS = ['action-5', 'action-6']

// localStorage keys
const SECTION_STATE_KEY = 'dashboard-section-state'
const CHECKED_ACTIONS_KEY = 'dashboard-checked-actions'

// ---------------------------------------------------------------------------
// Existing dashboard data (unchanged)
// ---------------------------------------------------------------------------

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

const salesByCategoryData = [
  { name: 'Timber', value: 84200 },
  { name: 'Hardware', value: 62100 },
  { name: 'Paint', value: 41800 },
  { name: 'Plumbing', value: 38700 },
  { name: 'Electrical', value: 32400 },
  { name: 'Other', value: 25191 },
]

const salesTotalValue = salesByCategoryData.reduce((sum, c) => sum + c.value, 0)

const periodOptions = [
  { label: 'Today', short: '1D' },
  { label: 'Last 7 Days', short: '7D' },
  { label: 'Last 30 Days', short: '30D' },
  { label: 'This Month', short: '1M' },
  { label: 'This Quarter', short: '1Q' },
  { label: 'This Year', short: '1Y' },
]

// ---------------------------------------------------------------------------
// Helper: formatted today's date
// ---------------------------------------------------------------------------

function getTodayLabel() {
  const d = new Date()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-900 dark:text-slate-100">Day {label}</p>
      <p className="text-primary-600 dark:text-primary-400">${payload[0].value.toLocaleString()}</p>
    </div>
  )
}

function ActivityList({ items, maxItems, ringColor = 'ring-white dark:ring-slate-900' }: { items: typeof recentActivity; maxItems?: number; ringColor?: string }) {
  const displayItems = maxItems ? items.slice(0, maxItems) : items
  return (
    <ul role="list" className="-mb-8">
      {displayItems.map((item, idx) => (
        <li key={item.id}>
          <div className="relative pb-8">
            {idx !== displayItems.length - 1 && (
              <span aria-hidden="true" className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-slate-700" />
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
                  `flex size-8 items-center justify-center rounded-full ring-8 ${ringColor}`,
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
                  <p className="text-sm text-gray-900 dark:text-slate-100">{item.action}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">{item.user}</p>
                </div>
                <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-slate-400">
                  {item.time}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// CollapsibleSection — custom controlled collapsible with localStorage
// ---------------------------------------------------------------------------

function CollapsibleSection({
  title,
  rightContent,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  rightContent?: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left group"
      >
        <div className="flex items-center gap-2">
          <ChevronDownIcon
            className={classNames(
              'size-4 text-gray-400 dark:text-slate-500 transition-transform duration-200',
              isOpen ? '' : '-rotate-90',
            )}
          />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
        </div>
        {rightContent && <div className="flex items-center">{rightContent}</div>}
      </button>
      <div
        className={classNames(
          'overflow-hidden transition-all duration-200',
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        {children}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ScheduleList
// ---------------------------------------------------------------------------

function ScheduleList({ items }: { items: ScheduleItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-neutral-500 dark:text-slate-400 italic">Nothing scheduled for today. Enjoy the quiet.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-slate-700/50">
      {items.map((item) => {
        const styles = CATEGORY_STYLES[item.category]
        return (
          <div
            key={item.id}
            className="flex items-start gap-2.5 py-3 px-1 hover:bg-neutral-50 dark:hover:bg-slate-800/50 cursor-pointer rounded transition-colors"
          >
            {/* Colour dot */}
            <span className={classNames('mt-1.5 size-1.5 rounded-full shrink-0', styles.dot)} />
            {/* Icon */}
            <item.icon className={classNames('size-4 shrink-0 mt-0.5', styles.icon)} />
            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100 truncate">{item.title}</p>
              <p className="text-xs text-neutral-500 dark:text-slate-400 truncate">
                {item.detail}{item.secondaryText ? ` — ${item.secondaryText}` : ''}
              </p>
            </div>
            {/* Right: count badge or time */}
            {item.count != null && (
              <span className="shrink-0 mt-0.5 bg-neutral-100 dark:bg-slate-700 text-neutral-700 dark:text-slate-300 text-xs font-medium px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
            {item.time && !item.count && (
              <span className="shrink-0 mt-0.5 text-xs text-neutral-500 dark:text-slate-400 whitespace-nowrap">
                {item.time}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ActionsList
// ---------------------------------------------------------------------------

function ActionsList({
  items,
  checkedIds,
  onToggle,
}: {
  items: ActionItem[]
  checkedIds: Set<string>
  onToggle: (id: string) => void
}) {
  // Sort: unchecked first, then checked
  const sorted = [...items].sort((a, b) => {
    const aChecked = checkedIds.has(a.id) ? 1 : 0
    const bChecked = checkedIds.has(b.id) ? 1 : 0
    return aChecked - bChecked
  })

  const allDone = items.every((i) => checkedIds.has(i.id))

  if (allDone) {
    return (
      <div className="py-6 text-center">
        <CheckCircleIcon className="mx-auto size-6 text-emerald-500 dark:text-emerald-400 mb-1" />
        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">All caught up for today.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-neutral-100 dark:divide-slate-700/50">
      {sorted.map((item) => {
        const checked = checkedIds.has(item.id)
        return (
          <div key={item.id} className="flex items-start gap-3 py-3 px-1 transition-all duration-200">
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(item.id)}
              className="mt-0.5 size-4 rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 text-emerald-500 focus:ring-emerald-500 dark:focus:ring-emerald-400 cursor-pointer"
            />
            {/* Text */}
            <div className="min-w-0 flex-1">
              <p className={classNames(
                'text-sm font-medium transition-all',
                checked
                  ? 'line-through text-neutral-400 dark:text-slate-500'
                  : 'text-gray-900 dark:text-slate-100',
              )}>
                {item.title}
              </p>
              <p className={classNames(
                'text-xs mt-0.5 transition-all',
                checked
                  ? 'text-neutral-300 dark:text-slate-600'
                  : 'text-neutral-500 dark:text-slate-400',
              )}>
                {item.context}
              </p>
            </div>
            {/* Shortcut link */}
            {!checked && item.shortcutLabel && (
              <a
                href={item.shortcutHref || '#'}
                className="shrink-0 mt-0.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium whitespace-nowrap"
              >
                {item.shortcutLabel} →
              </a>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// DashboardPage
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const { userName } = useAppShell()
  const [period, setPeriod] = useState('Last 30 Days')
  const [isDark, setIsDark] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [sectionOpen, setSectionOpen] = useState<Record<string, boolean>>({
    schedule: true,
    actions: true,
    activity: true,
  })
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set(DEFAULT_CHECKED_ACTIONS))

  useEffect(() => {
    // Dark mode observer
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'))
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // Hydrate section open state from localStorage
    try {
      const storedSections = localStorage.getItem(SECTION_STATE_KEY)
      if (storedSections) {
        setSectionOpen(JSON.parse(storedSections))
      }
    } catch { /* use defaults */ }

    // Hydrate checked actions from localStorage
    try {
      const storedChecked = localStorage.getItem(CHECKED_ACTIONS_KEY)
      if (storedChecked) {
        setCheckedActions(new Set(JSON.parse(storedChecked)))
      }
    } catch { /* use defaults */ }

    return () => observer.disconnect()
  }, [])

  const toggleSection = useCallback((key: string) => {
    setSectionOpen((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(SECTION_STATE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const toggleAction = useCallback((id: string) => {
    setCheckedActions((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      localStorage.setItem(CHECKED_ACTIONS_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const pendingCount = defaultActions.filter((a) => !checkedActions.has(a.id)).length
  const colors = getChartColors(isDark)

  // ---------------------------------------------------------------------------
  // Sidebar content (shared between desktop aside and mobile inline)
  // ---------------------------------------------------------------------------

  const sidebarContent = (ringColor: string) => (
    <>
      {/* Today's Schedule */}
      <CollapsibleSection
        title="Today's Schedule"
        isOpen={sectionOpen.schedule}
        onToggle={() => toggleSection('schedule')}
        rightContent={
          <span className="text-xs text-neutral-500 dark:text-slate-400">{getTodayLabel()}</span>
        }
      >
        <ScheduleList items={todaysSchedule} />
      </CollapsibleSection>

      <div className="border-t border-gray-200 dark:border-slate-700 my-2" />

      {/* My Actions */}
      <CollapsibleSection
        title="My Actions"
        isOpen={sectionOpen.actions}
        onToggle={() => toggleSection('actions')}
        rightContent={
          pendingCount > 0 ? (
            <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          ) : (
            <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-full">
              Done
            </span>
          )
        }
      >
        <ActionsList items={defaultActions} checkedIds={checkedActions} onToggle={toggleAction} />
      </CollapsibleSection>

      <div className="border-t border-gray-200 dark:border-slate-700 my-2" />

      {/* Recent Activity */}
      <CollapsibleSection
        title="Recent Activity"
        isOpen={sectionOpen.activity}
        onToggle={() => toggleSection('activity')}
      >
        <div className="flow-root pt-2">
          <ActivityList items={recentActivity} ringColor={ringColor} />
        </div>
      </CollapsibleSection>
    </>
  )

  return (
    <>
      <div className={classNames(
        showSidebar ? 'xl:pr-96' : '',
        'transition-all duration-300'
      )}>
        <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Page heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-slate-100 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-700 dark:text-slate-300">
              Welcome back, {userName}
            </p>
          </div>

          {/* Stats section */}
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">Overview</h3>
              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-gray-100 dark:bg-slate-800 p-0.5">
                {periodOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setPeriod(opt.label)}
                    className={classNames(
                      opt.label === period
                        ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
                        : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300',
                      'rounded-md px-2 py-1.5 text-xs font-medium transition-all sm:px-2.5 sm:py-1',
                    )}
                  >
                    <span className="sm:hidden">{opt.short}</span>
                    <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {dashboardStats.map((item) => (
                <a
                  key={item.id}
                  href="#"
                  className="group relative overflow-hidden rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 pt-4 pb-4 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all sm:px-6 sm:pt-6 sm:pb-5"
                >
                  <ChevronRightIcon className="absolute top-4 right-3 size-4 text-gray-300 dark:text-slate-600 group-hover:text-primary-400 dark:group-hover:text-primary-400 transition-colors" />
                  <dt>
                    <div className="absolute rounded-md bg-secondary-100 dark:bg-secondary-900/20 p-2 sm:p-3">
                      <item.icon aria-hidden="true" className="size-5 sm:size-6 text-secondary-700 dark:text-secondary-400" />
                    </div>
                    <p className="ml-12 sm:ml-16 truncate text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400">{item.name}</p>
                  </dt>
                  <dd className="ml-12 sm:ml-16 flex items-baseline">
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-slate-100">{item.stat}</p>
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
            <div className="lg:col-span-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Revenue — Last 30 Days</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Daily revenue trend</p>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={isDark ? 0.3 : 0.2} />
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: colors.axis }}
                    tickLine={false}
                    axisLine={{ stroke: colors.axisLine }}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: colors.axis }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<ChartTooltip isDark={isDark} />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={colors.primary}
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Sales by Category Donut */}
            <div className="lg:col-span-2 rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Sales by Category</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Month to date breakdown</p>
              </div>
              <div className="relative">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={salesByCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {salesByCategoryData.map((entry, i) => (
                        <Cell key={i} fill={colors.categories[i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-slate-100">${(salesTotalValue / 1000).toFixed(0)}K</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Total</p>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {salesByCategoryData.map((cat, i) => (
                  <div key={cat.name} className="flex items-center gap-1.5 text-xs">
                    <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: colors.categories[i] }} />
                    <span className="text-gray-600 dark:text-slate-400 truncate">{cat.name}</span>
                    <span className="ml-auto text-gray-400 dark:text-slate-500">{Math.round(cat.value / salesTotalValue * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <a
                href="/financial-reports"
                className="group inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                View more reports
                <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* Quick Links section */}
          <div className="mt-10">
            <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">Quick Links</h3>
            <ul role="list" className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group flex items-center gap-x-3 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                      <link.icon aria-hidden="true" className="size-5 text-primary-500 dark:text-primary-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 group-hover:text-primary-500 dark:group-hover:text-primary-400">{link.name}</p>
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">{link.description}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sidebar content — inline on mobile/tablet where the aside is hidden */}
          <div className="mt-10 xl:hidden space-y-6">
            {/* Today's Schedule */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4">Today&apos;s Schedule</h3>
              <div className="rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                <ScheduleList items={todaysSchedule} />
              </div>
            </div>

            {/* My Actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">My Actions</h3>
                {pendingCount > 0 && (
                  <span className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full">
                    {pendingCount} pending
                  </span>
                )}
              </div>
              <div className="rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                <ActionsList items={defaultActions} checkedIds={checkedActions} onToggle={toggleAction} />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-4">Recent Activity</h3>
              <div className="rounded-lg border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
                <div className="flow-root">
                  <ActivityList items={recentActivity} maxItems={5} ringColor="ring-white dark:ring-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary column on right — desktop sidebar */}
      <aside className={classNames(
        showSidebar ? 'xl:block' : 'xl:hidden',
        'fixed top-16 bottom-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-6 sm:px-6 lg:px-8'
      )}>
        {/* Sidebar header with close button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="size-5 text-primary-500 dark:text-primary-400" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Today</h2>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
            title="Hide sidebar"
          >
            <ChevronRightIcon className="size-5" />
          </button>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
          {sidebarContent('ring-white dark:ring-slate-900')}
        </div>
      </aside>

      {/* Floating toggle button when sidebar is hidden */}
      {!showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="fixed top-20 right-4 z-10 hidden xl:flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-slate-300 shadow-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
        >
          <CalendarDaysIcon className="size-4" />
          Today
          {pendingCount > 0 && (
            <span className="size-2 rounded-full bg-red-500 animate-pulse" />
          )}
        </button>
      )}
    </>
  )
}
