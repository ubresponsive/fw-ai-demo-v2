'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  BellAlertIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ShoppingCartIcon,
  CubeIcon,
  CurrencyDollarIcon,
  TrashIcon,
  ClockIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CalculatorIcon,
  BanknotesIcon,
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  ArrowsPointingOutIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  BookOpenIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline'
import { ChevronRightIcon, ChevronUpDownIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { navigation, bottomNav, type NavItem } from '@/lib/navigation'
import { classNames, getInitials } from '@/lib/utils'
import { AppShellContext } from '@/lib/app-shell-context'
import { ThemeToggle } from '@/components/theme-toggle'

// ── Notification types & sample data ──
type Notification = {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'warning' | 'success' | 'order'
  read: boolean
}

const NOTIFICATIONS_KEY = 'app-notifications'

const defaultNotifications: Notification[] = [
  { id: '1', title: 'Sales Order Approved', message: 'SO 421/0 for Acme Corp has been approved by the Sales Manager.', time: '5 min ago', type: 'success', read: false },
  { id: '2', title: 'Low Stock Alert', message: 'Timber Pine DAR 45x20 (TIM4520) stock is below reorder point. Current SOH: 12 LM.', time: '22 min ago', type: 'warning', read: false },
  { id: '3', title: 'Payment Received', message: 'Payment of $1,250.00 received for Invoice #3891 from BuildRight Pty Ltd.', time: '1 hr ago', type: 'info', read: false },
  { id: '4', title: 'New Sales Order', message: 'SO 438/0 created by Sarah Chen for customer 100234 — PrePaid Deliveries.', time: '2 hr ago', type: 'order', read: false },
  { id: '5', title: 'Price Change Pending', message: 'Supplier BORAL01 has submitted a price update for 14 products effective 01/11/2025.', time: '3 hr ago', type: 'warning', read: false },
]

const notificationIconMap = {
  info: { icon: InformationCircleIcon, bg: 'bg-primary-50 dark:bg-primary-900/20', text: 'text-primary-500 dark:text-primary-400' },
  warning: { icon: ExclamationTriangleIcon, bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-500 dark:text-amber-400' },
  success: { icon: CheckIcon, bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-500 dark:text-emerald-400' },
  order: { icon: ShoppingCartIcon, bg: 'bg-sky-50 dark:bg-sky-900/20', text: 'text-sky-500 dark:text-sky-400' },
}

// ── Search quick navigation items ──
const recentSearches = [
  'Sales Order 4521',
  'Acme Corp',
  'Timber Pine DAR',
]

const searchQuickNav = [
  { section: 'Sales', items: [
    { name: 'New Sales Order', href: '#', icon: ShoppingCartIcon },
    { name: 'Sales Orders', href: '/sales-orders', icon: ShoppingCartIcon },
    { name: 'Customer Orders', href: '#', icon: ShoppingCartIcon },
  ]},
  { section: 'Inventory', items: [
    { name: 'Product Lookup', href: '#', icon: CubeIcon },
    { name: 'Inventory Adjustments', href: '#', icon: CubeIcon },
    { name: 'Price Inquiry', href: '#', icon: TagIcon },
  ]},
  { section: 'Finance', items: [
    { name: 'Financial Reports', href: '/financial-reports', icon: ChartBarIcon },
    { name: 'Journal Entry', href: '#', icon: CalculatorIcon },
    { name: 'Bank Reconciliation', href: '#', icon: BanknotesIcon },
  ]},
  { section: 'Reports', items: [
    { name: 'AR Dashboard', href: '#', icon: CurrencyDollarIcon },
    { name: 'Documents & Reports', href: '#', icon: DocumentTextIcon },
  ]},
]

// ── Help articles & sections ──
type HelpArticle = {
  id: string
  title: string
  summary: string
  tags: string[]
  content: string[]  // paragraphs
}

const helpArticles: HelpArticle[] = [
  {
    id: 'dashboard-kpis',
    title: 'Understanding Your Dashboard KPIs',
    summary: 'Learn what each metric on your dashboard means and how to use them to monitor business performance.',
    tags: ['Getting Started', 'Dashboard'],
    content: [
      'The Dashboard provides a real-time snapshot of your business health through six key performance indicators (KPIs): Revenue (MTD), Sales Orders, Purchase Orders, Inventory Value, Outstanding AR, and Dispatches Today.',
      'Each KPI card shows the current value alongside a percentage change compared to the previous period. Green arrows indicate improvement, while red arrows highlight areas that may need attention.',
      'The Revenue chart below the KPIs visualises daily revenue trends over the last 30 days, helping you identify patterns such as weekend dips or month-end peaks. The Sales by Category donut chart breaks down your revenue mix.',
      'Click any KPI card to drill down into the detailed report for that metric.',
    ],
  },
  {
    id: 'sidebar-navigation',
    title: 'Navigating the Sidebar Menu',
    summary: 'How to use the sidebar to access all modules — collapse, expand, and find what you need quickly.',
    tags: ['Getting Started', 'Navigation'],
    content: [
      'The sidebar organises all Frameworks modules into logical groups: Sales, Receivables, Payables, Inventory, Purchasing, Dispatch, Pricing, General Ledger, Production, and Reports.',
      'Click any group heading to expand its sub-items. The sidebar remembers which groups you had open. Items with a teal dot beside them indicate pages that are currently available in this demo.',
      'Use the collapse button (double chevron) at the top-right of the sidebar to switch to icon-only mode, giving you more screen real estate for your work. Hover over any icon to see a tooltip with the module name.',
      'On mobile devices, tap the hamburger menu icon to open the sidebar as a slide-out panel.',
    ],
  },
  {
    id: 'sales-orders',
    title: 'Creating & Managing Sales Orders',
    summary: 'Step-by-step guide to creating, editing, and processing sales orders through their lifecycle.',
    tags: ['Sales'],
    content: [
      'Navigate to Sales > Sales Orders to view all orders. The listing page shows key stats at the top — total orders, pending orders, completed value, and average order value.',
      'Use the status filters (All, Draft, Confirmed, Processing, Completed, Cancelled) to narrow the list. The search bar searches across order numbers, customer names, and references.',
      'Click any order row to open the detailed order view, which includes line items, delivery information, and the AI Assistant for contextual help.',
      'The AI Assistant on the order detail page can answer questions about the order, suggest next actions, and help with common tasks like updating delivery dates or checking stock availability.',
    ],
  },
  {
    id: 'ai-assistant',
    title: 'Using the AI Assistant',
    summary: 'How to get the most out of the AI-powered features throughout Frameworks.',
    tags: ['Sales', 'Reports'],
    content: [
      'Frameworks includes AI assistants on key pages to help you work more efficiently. Look for the teal button with a sparkle icon to open the AI panel.',
      'On Sales Order detail pages, the AI Assistant can answer questions about order status, customer history, product availability, and suggest next actions based on the current context.',
      'On the Financial Reports page, the AI Report Builder lets you describe the report you need in plain language. For example: "Show me aged debtors over $10K for the Sydney branch" or "Compare revenue by branch for this quarter."',
      'The AI generates formatted results including charts, data tables, and key insights. You can export these directly or refine your request with follow-up prompts.',
    ],
  },
  {
    id: 'financial-reports',
    title: 'Running Financial Reports',
    summary: 'Access pre-built reports, use filters, and generate custom reports from the Financial Reporting dashboard.',
    tags: ['Finance', 'Reports'],
    content: [
      'Navigate to Reports > Financial Reporting (or General Ledger > Financial Reporting) to access the reporting dashboard. The page shows KPI summary cards at the top followed by your report library.',
      'Reports are organised into categories: Sales & Revenue, Profitability, Accounts Receivable, Accounts Payable, Inventory, and General Ledger. Use the category tabs or search bar to find specific reports.',
      'Star your most-used reports to add them to the Favourites section at the top for quick access. Toggle between grid and list views depending on your preference.',
      'Use the period filter and branch filter in the toolbar to set the reporting context before opening any report.',
    ],
  },
  {
    id: 'ai-report-builder',
    title: 'Working with the AI Report Builder',
    summary: 'Generate custom financial reports using natural language queries — no technical knowledge required.',
    tags: ['Finance', 'Reports'],
    content: [
      'Open the AI Report Builder from the Financial Reports page by clicking the teal "AI Report Builder" button in the toolbar.',
      'Type your report request in natural language. The AI understands business terms, date ranges, branch references, and customer/product filters. Examples: "Revenue by branch for January" or "Top 20 customers by outstanding balance."',
      'The AI generates formatted results including inline charts, data tables, and key insights. Each result includes export options (PDF, Excel) and the ability to refine your query.',
      'Use the suggested refinement chips below each result to drill deeper, such as "Break down by product category" or "Show trend over last 6 months."',
    ],
  },
  {
    id: 'notifications',
    title: 'Managing Notifications',
    summary: 'Stay on top of important updates with the notification centre — mark as read, dismiss, or clear all.',
    tags: ['Getting Started'],
    content: [
      'The notification bell in the header shows a badge count of unread items. Click it to open the notifications drawer.',
      'Notifications are colour-coded by type: green for approvals, amber for warnings (like low stock alerts), blue for information, and sky-blue for new orders.',
      'Hover over any notification to reveal quick actions — "Mark read" to acknowledge it or the trash icon to dismiss it entirely. Use "Clear all" to remove everything at once.',
      'Unread notifications have a subtle blue-tinted background and a blue dot indicator so you can quickly scan for new items.',
    ],
  },
  {
    id: 'branch-switching',
    title: 'Switching Branches',
    summary: 'Change your active branch context to view data and perform operations for different locations.',
    tags: ['Navigation'],
    content: [
      'Your current branch is displayed in the header bar (e.g. "Branch: 10"). Click the branch selector to open a dropdown with all available branches (1–10).',
      'Switching branches updates the data context for all pages — dashboard KPIs, sales orders, inventory levels, and reports will reflect the selected branch.',
      'In a production environment, your available branches would be determined by your user permissions. The demo provides all 10 branches for exploration.',
      'The branch selection persists during your session. If you need to compare data across branches, use the Financial Reports page which supports multi-branch reporting.',
    ],
  },
]

const helpTags = ['All', 'Getting Started', 'Sales', 'Finance', 'Reports', 'Navigation', 'Dashboard']

const helpSections: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard Overview',
    description: 'Your central hub for monitoring business metrics, recent activity, and quick navigation to key areas.',
  },
  '/sales-orders': {
    title: 'Sales Orders',
    description: 'View, search, and manage your sales orders. Click into any order for full details and the AI Assistant.',
  },
  '/financial-reports': {
    title: 'Financial Reporting',
    description: 'Browse pre-built reports, filter by category, and use the AI Report Builder for custom analysis.',
  },
}

const defaultHelpSection = {
  title: 'Getting Started',
  description: 'Welcome to Frameworks — a modern ERP platform. Use the sidebar to navigate between modules.',
}

// ── Help AI context — page-aware greetings & suggestions ──
const helpAiContext: Record<string, { greeting: string; suggestions: string[] }> = {
  '/dashboard': {
    greeting: 'You\'re on the Dashboard. I can help you understand your KPIs, read the revenue chart, navigate to different modules, or explain any metric you see.',
    suggestions: ['Explain my KPIs', 'Revenue chart help', 'How to use Quick Links', 'Navigate modules'],
  },
  '/sales-orders': {
    greeting: 'You\'re in the Sales Orders module. I can help you create orders, understand statuses, filter and search, or explain the AI Assistant on order detail pages.',
    suggestions: ['Create a sales order', 'Order statuses explained', 'Search & filter tips', 'AI Assistant guide'],
  },
  '/financial-reports': {
    greeting: 'You\'re on Financial Reporting. I can help you run reports, use the AI Report Builder, export data, or filter by branch and period.',
    suggestions: ['Run a report', 'Use AI Report Builder', 'Export to Excel', 'Filter by branch'],
  },
}

const defaultHelpAiContext = {
  greeting: 'Welcome to Frameworks Help! I can answer questions about any module, help you navigate the system, or explain features like the AI assistants and reporting tools.',
  suggestions: ['Getting started', 'Navigate the sidebar', 'Use AI features', 'Switch branches'],
}

// ── Expanded sidebar nav with labels and disclosure ──
function SidebarNavExpanded({ items }: { items: NavItem[] }) {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          {!item.children ? (
            <a
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400',
                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  item.current ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
                  'size-6 shrink-0',
                )}
              />
              {item.name}
              {item.href && item.href !== '#' && (
                <span className="size-1.5 rounded-full bg-tertiary-400 shrink-0" />
              )}
            </a>
          ) : (
            <Disclosure as="div" defaultOpen={item.current}>
              <DisclosureButton
                className={classNames(
                  item.current ? 'bg-gray-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400' : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400',
                  'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold',
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
                    'size-6 shrink-0',
                  )}
                />
                {item.name}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="ml-auto size-5 shrink-0 text-gray-400 dark:text-slate-500 group-data-[open]:rotate-90 group-data-[open]:text-gray-500 dark:group-data-[open]:text-slate-400"
                />
              </DisclosureButton>
              <DisclosurePanel as="ul" className="mt-1 px-2">
                {item.children.map((subItem) => (
                  <li key={subItem.name}>
                    <a
                      href={subItem.href}
                      className={classNames(
                        subItem.current
                          ? 'bg-gray-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400 font-semibold'
                          : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400',
                        'flex items-center gap-1.5 rounded-md py-2 pr-2 pl-11 text-sm/6',
                      )}
                    >
                      {subItem.name}
                      {subItem.href !== '#' && (
                        <span className="size-1.5 rounded-full bg-tertiary-400 shrink-0" />
                      )}
                    </a>
                  </li>
                ))}
              </DisclosurePanel>
            </Disclosure>
          )}
        </li>
      ))}
    </ul>
  )
}

// ── Collapsed sidebar nav — icon-only with hover flyouts for submenus ──
function CollapsedNavItem({ item }: { item: NavItem }) {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen((prev) => !prev)
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  const iconClasses = classNames(
    item.current ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400',
    'size-6 shrink-0',
  )
  const containerClasses = classNames(
    item.current
      ? 'bg-gray-50 dark:bg-slate-800 text-primary-500 dark:text-primary-400'
      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400',
    'group flex rounded-md p-3 text-sm/6 font-semibold',
  )

  // Items without children: simple direct link
  if (!item.children) {
    return (
      <li>
        <a href={item.href || '#'} title={item.name} className={containerClasses}>
          <item.icon aria-hidden="true" className={iconClasses} />
          <span className="sr-only">{item.name}</span>
        </a>
      </li>
    )
  }

  // Items with children: flyout on hover
  return (
    <li
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={containerClasses}
      >
        <item.icon aria-hidden="true" className={iconClasses} />
        <span className="sr-only">{item.name}</span>
      </button>

      {/* Flyout submenu panel */}
      <div
        className={classNames(
          isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1 pointer-events-none',
          'absolute left-full top-0 z-50 ml-2 w-56 rounded-lg bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 dark:ring-slate-700 py-1 transition-all duration-150 ease-out',
        )}
        role="menu"
        aria-label={item.name}
      >
        <div className="px-3 py-2 border-b border-gray-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
            {item.name}
          </p>
        </div>
        <div className="py-1">
          {item.children.map((child) => (
            <a
              key={child.name}
              href={child.href}
              role="menuitem"
              className={classNames(
                child.current
                  ? 'bg-gray-50 dark:bg-slate-700 text-primary-500 dark:text-primary-400 font-semibold'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-primary-500 dark:hover:text-primary-400',
                'flex items-center gap-1.5 px-3 py-2 text-sm',
              )}
            >
              {child.name}
              {child.href !== '#' && (
                <span className="size-1.5 rounded-full bg-tertiary-400 shrink-0" />
              )}
            </a>
          ))}
        </div>
      </div>
    </li>
  )
}

function SidebarNavCollapsed({ items }: { items: NavItem[] }) {
  return (
    <ul role="list" className="flex flex-col items-center space-y-1">
      {items.map((item) => (
        <CollapsedNavItem key={item.name} item={item} />
      ))}
    </ul>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selectedBranch, setSelectedBranch] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [helpTag, setHelpTag] = useState('All')
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [helpTab, setHelpTab] = useState<'articles' | 'ai'>('articles')
  const [helpAiInput, setHelpAiInput] = useState('')
  const [mobileContextOpen, setMobileContextOpen] = useState(false)

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setUserName(sessionStorage.getItem('userName') || '')
    setUserEmail(sessionStorage.getItem('userEmail') || '')

    // Load notifications from localStorage or use defaults
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY)
      if (stored) {
        setNotifications(JSON.parse(stored))
      } else {
        setNotifications(defaultNotifications)
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications))
      }
    } catch {
      setNotifications(defaultNotifications)
    }
  }, [router])

  const unreadCount = notifications.filter((n) => !n.read).length

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id)
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const next = prev.map((n) => n.id === id ? { ...n, read: true } : n)
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]))
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    router.push('/login')
  }

  // Compute active nav state from current pathname
  const navWithCurrent = useMemo(() => {
    return navigation.map((item) => {
      const childMatch = item.children?.some((child) => child.href === pathname)
      return {
        ...item,
        current: item.href === pathname || !!childMatch,
        children: item.children?.map((child) => ({
          ...child,
          current: child.href === pathname,
        })),
      }
    })
  }, [pathname])

  const initials = getInitials(userName)
  const sidebarWidth = sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
  const contentPadding = sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
  const headerLeft = sidebarCollapsed ? 'lg:left-20' : 'lg:left-72'

  // Search filtering
  const filteredQuickNav = searchQuery.trim()
    ? searchQuickNav.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.items.length > 0)
    : searchQuickNav

  // Help context
  const currentHelpSection = helpSections[pathname] || defaultHelpSection
  const currentAiContext = helpAiContext[pathname] || defaultHelpAiContext
  const filteredArticles = helpTag === 'All'
    ? helpArticles
    : helpArticles.filter(a => a.tags.includes(helpTag))

  return (
    <AppShellContext.Provider value={{ userName, userEmail, sidebarCollapsed }}>
      <div>
        {/* Mobile sidebar */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 dark:bg-black/90 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:hover:text-slate-300" />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-slate-900 px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <img alt="Frameworks" src="/frameworks-logo.svg" className="h-8 w-auto" />
                </div>
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <SidebarNavExpanded items={navWithCurrent} />
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-gray-400">System</div>
                      <div className="mt-2">
                        <SidebarNavExpanded items={bottomNav} />
                      </div>
                    </li>
                    <li className="-mx-2 mt-auto">
                      <button
                        onClick={handleLogout}
                        className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                      >
                        <ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 shrink-0 text-gray-400 group-hover:text-primary-500" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Desktop sidebar */}
        <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${sidebarWidth}`}>
          <div className={classNames(
            'flex grow flex-col border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900',
            sidebarCollapsed ? 'overflow-visible' : 'overflow-y-auto',
          )}>
            {sidebarCollapsed ? (
              <>
                <div className="flex h-16 shrink-0 items-center justify-center">
                  <img alt="Frameworks" src="/favicon.ico" className="size-8" />
                </div>
                <nav className="mt-2 flex flex-1 flex-col items-center">
                  <SidebarNavCollapsed items={navWithCurrent} />
                  <div className="mt-6 w-8 border-t border-gray-200 dark:border-slate-700" />
                  <div className="mt-6">
                    <SidebarNavCollapsed items={bottomNav} />
                  </div>
                  <div className="mt-auto mb-4 flex flex-col items-center gap-y-2">
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="group flex rounded-md p-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400"
                    >
                      <ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 shrink-0 text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                      <span className="sr-only">Logout</span>
                    </button>
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      title="Expand sidebar"
                      className="group flex rounded-md p-3 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400"
                    >
                      <ChevronDoubleRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                      <span className="sr-only">Expand sidebar</span>
                    </button>
                  </div>
                </nav>
              </>
            ) : (
              <>
                <div className="flex h-16 shrink-0 items-center justify-between px-6">
                  <img alt="Frameworks" src="/frameworks-logo.svg" className="h-8 w-auto" />
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    title="Collapse sidebar"
                    className="group rounded-md p-1 text-gray-400 dark:text-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400"
                  >
                    <ChevronDoubleLeftIcon aria-hidden="true" className="size-5" />
                    <span className="sr-only">Collapse sidebar</span>
                  </button>
                </div>
                <nav className="flex flex-1 flex-col px-6">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <SidebarNavExpanded items={navWithCurrent} />
                    </li>
                    <li>
                      <div className="text-xs/6 font-semibold text-gray-400 dark:text-slate-500">System</div>
                      <div className="mt-2">
                        <SidebarNavExpanded items={bottomNav} />
                      </div>
                    </li>
                    <li className="-mx-2 mt-auto mb-4">
                      <button
                        onClick={handleLogout}
                        className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary-500 dark:hover:text-primary-400"
                      >
                        <ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 shrink-0 text-gray-400 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>

        {/* Mobile top bar + context strip wrapper */}
        <div className="sticky top-0 z-40 lg:hidden shadow-sm">
        <div className="flex items-center gap-x-6 bg-white dark:bg-slate-900 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div className="flex-1">
            <img alt="Frameworks" src="/frameworks-logo.svg" className="h-6 w-auto" />
          </div>
          <button
            type="button"
            onClick={() => setNotificationsOpen(true)}
            className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            {unreadCount > 0 ? (
              <BellAlertIcon aria-hidden="true" className="size-6 text-primary-500 animate-bell-ring" />
            ) : (
              <BellIcon aria-hidden="true" className="size-6" />
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileContextOpen(!mobileContextOpen)}
            className="flex items-center gap-1 -m-1 p-1 rounded-full"
            aria-expanded={mobileContextOpen}
            aria-label="Toggle context info"
          >
            <span className={classNames(
              'flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white transition-shadow',
              mobileContextOpen ? 'ring-2 ring-primary-300 dark:ring-primary-400' : '',
            )}>
              {initials}
            </span>
            <ChevronDownIcon className={classNames(
              'size-4 text-gray-400 transition-transform duration-200',
              mobileContextOpen ? 'rotate-180' : '',
            )} />
          </button>
        </div>

        {/* Mobile context strip */}
        <div className={classNames(
          'overflow-hidden transition-all duration-300 ease-in-out',
          mobileContextOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0',
        )}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 px-4 py-2.5 text-sm">
            <span className="font-semibold text-gray-900 dark:text-slate-100 text-xs">TEST COMPANY 01</span>
            <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">&middot;</span>
            <Listbox value={selectedBranch} onChange={setSelectedBranch}>
              <div className="relative">
                <ListboxButton className="flex items-center gap-0.5 text-xs text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 cursor-pointer rounded px-1 py-0.5 -mx-1 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                  Branch: {selectedBranch}
                  <ChevronUpDownIcon className="size-3.5 text-gray-400 dark:text-slate-500" />
                </ListboxButton>
                <ListboxOptions
                  transition
                  className="absolute top-full left-0 z-50 mt-1 max-h-60 w-36 overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-sm transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((branch) => (
                    <ListboxOption
                      key={branch}
                      value={branch}
                      className="relative cursor-pointer select-none px-3 py-1.5 text-gray-700 dark:text-slate-300 data-[focus]:bg-primary-50 dark:data-[focus]:bg-slate-700 data-[focus]:text-primary-700 dark:data-[focus]:text-primary-300 data-[selected]:font-semibold"
                    >
                      Branch {branch}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">&middot;</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">Device: roam10</span>
            <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">&middot;</span>
            <ThemeToggle />
            <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">&middot;</span>
            <button
              onClick={() => { setHelpOpen(true); setSelectedArticle(null); setHelpTag('All'); setHelpTab('articles') }}
              title="Help"
              className="rounded p-0.5 text-gray-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400"
            >
              <QuestionMarkCircleIcon aria-hidden="true" className="size-5" />
              <span className="sr-only">Help</span>
            </button>
          </div>
        </div>
        </div>

        {/* Desktop header bar */}
        <div className={`hidden lg:fixed lg:right-0 lg:top-0 lg:z-40 lg:flex lg:h-16 lg:items-center lg:border-b lg:border-gray-200 dark:border-slate-700 lg:bg-white dark:bg-slate-900 lg:px-8 transition-all duration-300 ${headerLeft}`}>
          {/* Left side — search */}
          <div className="flex flex-1 items-center mr-4">
            <div className="relative flex flex-1 max-w-md">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-2 z-10 h-full w-5 text-gray-400 dark:text-slate-500"
              />
              <input
                type="text"
                name="search"
                placeholder="Search..."
                autoComplete="off"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 bg-gray-50 dark:bg-slate-800 focus:ring-1 focus:ring-primary-500/30 focus:outline-none sm:text-sm/6"
              />
              {/* Search floating panel */}
              {searchOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => { setSearchOpen(false); setSearchQuery('') }} />
                  <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black/5 p-1.5">
                    {/* Recent Searches */}
                    {!searchQuery && (
                      <div className="mb-1">
                        <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">Recent</p>
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100"
                            onClick={() => setSearchOpen(false)}
                          >
                            <ClockIcon className="size-4 text-gray-400 dark:text-slate-500" />
                            {term}
                          </button>
                        ))}
                      </div>
                    )}
                    {/* Quick Navigation */}
                    <div>
                      <p className="px-2.5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        {searchQuery ? 'Results' : 'Quick Navigation'}
                      </p>
                      {filteredQuickNav.length === 0 ? (
                        <p className="px-2.5 py-3 text-xs text-gray-400 dark:text-slate-500">No results found</p>
                      ) : (
                        filteredQuickNav.map((group) => (
                          <div key={group.section} className="mb-1">
                            <p className="px-2.5 py-1 text-[10px] font-medium text-gray-300 dark:text-slate-600">{group.section}</p>
                            {group.items.map((item) => (
                              <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100"
                                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                              >
                                <item.icon className="size-4 text-gray-400 dark:text-slate-500" />
                                {item.name}
                              </a>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                    {/* Footer */}
                    <div className="border-t border-gray-100 dark:border-slate-700 mt-1 pt-2 px-2.5 pb-1.5 flex items-center justify-between">
                      <p className="text-xs text-gray-400 dark:text-slate-500">
                        {searchQuery ? (
                          <span>Search all for &ldquo;<span className="text-primary-500 dark:text-primary-400">{searchQuery}</span>&rdquo;</span>
                        ) : (
                          'Type to search...'
                        )}
                      </p>
                      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-slate-500">
                        ⌘K
                      </kbd>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right side — company, branch, device, notifications, user, help */}
          <div className="flex items-center gap-x-4">
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">TEST COMPANY 01</span>
            <div className="h-5 w-px bg-gray-200 dark:border-slate-700" aria-hidden="true" />
            <Listbox value={selectedBranch} onChange={setSelectedBranch}>
              <div className="relative">
                <ListboxButton className="flex items-center gap-1 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 cursor-pointer rounded-md px-1.5 py-0.5 -mx-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  Branch: {selectedBranch}
                  <ChevronUpDownIcon className="size-4 text-gray-400 dark:text-slate-500" />
                </ListboxButton>
                <ListboxOptions
                  transition
                  className="absolute top-full right-0 z-50 mt-1 max-h-60 w-36 overflow-auto rounded-lg bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none text-sm transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((branch) => (
                    <ListboxOption
                      key={branch}
                      value={branch}
                      className="relative cursor-pointer select-none px-3 py-1.5 text-gray-700 dark:text-slate-300 data-[focus]:bg-primary-50 dark:data-[focus]:bg-slate-700 data-[focus]:text-primary-700 dark:data-[focus]:text-primary-300 data-[selected]:font-semibold"
                    >
                      Branch {branch}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </div>
            </Listbox>
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-slate-400">Device: roam10</span>
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
            <ThemeToggle />
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative -m-1.5 p-1.5 rounded-md text-gray-400 dark:text-slate-500 hover:text-gray-500 dark:hover:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <span className="sr-only">View notifications</span>
              {unreadCount > 0 ? (
                <BellAlertIcon aria-hidden="true" className="size-6 text-primary-500 dark:text-primary-400 animate-bell-ring" />
              ) : (
                <BellIcon aria-hidden="true" className="size-6" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
            <div className="flex items-center gap-x-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                {initials}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{userName}</span>
            </div>
            <div className="h-5 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true" />
            <button
              onClick={() => { setHelpOpen(true); setSelectedArticle(null); setHelpTag('All'); setHelpTab('articles') }}
              title="Help documentation"
              className="rounded-md p-1 text-gray-400 dark:text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
              <span className="sr-only">Help documentation</span>
            </button>
          </div>
        </div>

        {/* Main content area */}
        <main className={`lg:pt-16 min-h-screen bg-white dark:bg-slate-900 transition-all duration-300 ${contentPadding}`}>
          {children}
        </main>

        {/* ── Notifications Drawer ── */}
        <Dialog open={notificationsOpen} onClose={setNotificationsOpen} className="relative z-[60]">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-all duration-500 ease-in-out data-[closed]:opacity-0 data-[closed]:backdrop-blur-none"
          />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-sm transform transition-transform duration-700 ease-in-out data-[closed]:translate-x-full data-[closed]:duration-500"
                >
                  <div className="flex h-full flex-col bg-white dark:bg-slate-800 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg flex items-center justify-center bg-primary-50 dark:bg-primary-900/20">
                          <BellIcon className="size-4 text-primary-500 dark:text-primary-400" />
                        </div>
                        <div>
                          <DialogTitle className="text-sm font-semibold text-gray-800 dark:text-slate-100">Notifications</DialogTitle>
                          {unreadCount > 0 && (
                            <p className="text-xs text-gray-400 dark:text-slate-500">{unreadCount} unread</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="px-2 py-1 text-xs text-gray-500 dark:text-slate-400 hover:text-red-500 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            Clear all
                          </button>
                        )}
                        <button onClick={() => setNotificationsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                          <XMarkIcon className="size-5 text-gray-400 dark:text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                          <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <BellIcon className="size-6 text-gray-300 dark:text-slate-600" />
                          </div>
                          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">All caught up</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">No notifications to show.</p>
                        </div>
                      ) : (
                        <ul role="list" className="divide-y divide-gray-100 dark:divide-slate-700">
                          {notifications.map((n) => {
                            const { icon: NIcon, bg, text } = notificationIconMap[n.type]
                            return (
                              <li
                                key={n.id}
                                className={classNames(
                                  !n.read ? 'bg-primary-50/30 dark:bg-slate-700/50' : '',
                                  'relative px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors group',
                                )}
                              >
                                <div className="flex gap-3">
                                  <div className={classNames(bg, 'flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5')}>
                                    <NIcon className={classNames(text, 'size-4')} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={classNames(!n.read ? 'font-semibold' : 'font-medium', 'text-sm text-gray-900 dark:text-slate-100')}>
                                        {n.title}
                                      </p>
                                      {!n.read && (
                                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-500" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-[10px] text-gray-400 dark:text-slate-500">{n.time}</span>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!n.read && (
                                          <button
                                            onClick={() => markAsRead(n.id)}
                                            className="px-1.5 py-0.5 text-[10px] font-medium text-primary-500 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded"
                                          >
                                            Mark read
                                          </button>
                                        )}
                                        <button
                                          onClick={() => dismissNotification(n.id)}
                                          className="p-0.5 text-gray-400 dark:text-slate-500 hover:text-red-500 rounded hover:bg-gray-100 dark:hover:bg-slate-600"
                                          title="Dismiss"
                                        >
                                          <TrashIcon className="size-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>

        {/* ── Help Drawer ── */}
        <Dialog open={helpOpen} onClose={setHelpOpen} className="relative z-[60]">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-all duration-500 ease-in-out data-[closed]:opacity-0 data-[closed]:backdrop-blur-none"
          />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-sm transform transition-transform duration-700 ease-in-out data-[closed]:translate-x-full data-[closed]:duration-500"
                >
                  <div className="flex h-full flex-col bg-white dark:bg-slate-800 shadow-2xl">
                    {/* Header */}
                    <div className="shrink-0">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2">
                          {helpTab === 'articles' && selectedArticle ? (
                            <button
                              onClick={() => setSelectedArticle(null)}
                              className="p-1 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                            >
                              <ArrowLeftIcon className="size-4 text-gray-500 dark:text-slate-400" />
                            </button>
                          ) : helpTab === 'ai' ? (
                            <div className="size-7 rounded-lg flex items-center justify-center bg-tertiary-50 dark:bg-tertiary-500/20">
                              <SparklesIcon className="size-4 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                            </div>
                          ) : (
                            <div className="size-7 rounded-lg flex items-center justify-center bg-primary-50 dark:bg-primary-900/20">
                              <BookOpenIcon className="size-4 text-primary-500 dark:text-primary-400" />
                            </div>
                          )}
                          <div>
                            <DialogTitle className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                              {helpTab === 'articles' && selectedArticle ? selectedArticle.title : helpTab === 'ai' ? 'AI Assistant' : 'Help'}
                            </DialogTitle>
                            {helpTab === 'articles' && !selectedArticle && (
                              <p className="text-xs text-gray-500 dark:text-slate-400">{currentHelpSection.title}</p>
                            )}
                            {helpTab === 'ai' && (
                              <p className="text-xs text-gray-500 dark:text-slate-400">Ask me anything</p>
                            )}
                          </div>
                        </div>
                        <button onClick={() => setHelpOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
                          <XMarkIcon className="size-5 text-gray-400 dark:text-slate-500" />
                        </button>
                      </div>
                      {/* Tab bar */}
                      <div className="flex border-b border-gray-200 dark:border-slate-700">
                        <button
                          onClick={() => setHelpTab('articles')}
                          className={classNames(
                            helpTab === 'articles'
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-500',
                            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors',
                          )}
                        >
                          <BookOpenIcon className="size-4" />
                          Articles
                        </button>
                        <button
                          onClick={() => setHelpTab('ai')}
                          className={classNames(
                            helpTab === 'ai'
                              ? 'border-tertiary-500 text-tertiary-600 dark:text-tertiary-400'
                              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-500',
                            'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors',
                          )}
                        >
                          <SparklesIcon className={classNames(helpTab === 'ai' ? 'animate-sparkle' : '', 'size-4')} />
                          AI Assistant
                        </button>
                      </div>
                    </div>

                    {/* ── Articles Tab ── */}
                    {helpTab === 'articles' && (
                      <>
                        {selectedArticle ? (
                          /* ── Article Detail View ── */
                          <div className="flex-1 overflow-y-auto">
                            <div className="px-4 py-4 space-y-3">
                              {/* Tags */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {selectedArticle.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {/* Summary */}
                              <p className="text-xs font-medium text-gray-600 dark:text-slate-400 leading-relaxed">{selectedArticle.summary}</p>
                              {/* Content paragraphs */}
                              <div className="border-t border-gray-200 dark:border-slate-700 pt-3 space-y-3">
                                {selectedArticle.content.map((paragraph, i) => (
                                  <p key={i} className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed">{paragraph}</p>
                                ))}
                              </div>
                            </div>
                            {/* Bottom action bar */}
                            <div className="sticky bottom-0 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 flex items-center gap-2">
                              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <ArrowsPointingOutIcon className="size-3.5" />
                                Full Screen
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-slate-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                <ArrowTopRightOnSquareIcon className="size-3.5" />
                                Pop Out
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Article List View ── */
                          <div className="flex-1 overflow-y-auto">
                            {/* Context section */}
                            <div className="px-4 pt-4 pb-3">
                              <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{currentHelpSection.title}</h3>
                              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">{currentHelpSection.description}</p>
                            </div>

                            {/* Category tags */}
                            <div className="px-4 pb-3 flex items-center gap-1.5 flex-wrap">
                              {helpTags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={() => setHelpTag(tag)}
                                  className={classNames(
                                    tag === helpTag
                                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-1 ring-primary-200 dark:ring-primary-700'
                                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600',
                                    'px-2.5 py-1 text-[10px] font-medium rounded-full transition-colors',
                                  )}
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>

                            {/* Article list */}
                            <div className="px-4 pb-4 space-y-2">
                              {filteredArticles.length === 0 ? (
                                <p className="py-6 text-center text-xs text-gray-400 dark:text-slate-500">No articles match this filter.</p>
                              ) : (
                                filteredArticles.map((article) => (
                                  <button
                                    key={article.id}
                                    onClick={() => setSelectedArticle(article)}
                                    className="w-full text-left p-3 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:shadow-sm cursor-pointer transition-all"
                                  >
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-slate-100">{article.title}</h4>
                                    <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">{article.summary}</p>
                                    <div className="flex items-center gap-1.5 mt-2">
                                      {article.tags.map((tag) => (
                                        <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* ── AI Assistant Tab ── */}
                    {helpTab === 'ai' && (
                      <div className="flex flex-1 flex-col overflow-hidden">
                        {/* Quick Suggestions */}
                        <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-700 shrink-0">
                          <p className="text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Suggestions</p>
                          <div className="grid grid-cols-2 gap-1.5">
                            {currentAiContext.suggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 dark:border-slate-700 hover:border-gray-200 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-left"
                              >
                                <LightBulbIcon className="size-4 shrink-0 text-tertiary-500 dark:text-tertiary-400" />
                                <span className="text-xs text-gray-600 dark:text-slate-300">{suggestion}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
                          {/* AI Welcome */}
                          <div className="flex gap-2.5">
                            <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50 dark:bg-tertiary-500/20">
                              <SparklesIcon className="size-3.5 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 dark:text-slate-300 leading-relaxed">
                                <p>{currentAiContext.greeting}</p>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {['How do I create a sales order?', 'Explain the AI features', 'Help with reports'].map((s) => (
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
                              How do I create a sales order?
                            </div>
                          </div>

                          {/* AI Response */}
                          <div className="flex gap-2.5">
                            <div className="size-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-tertiary-50 dark:bg-tertiary-500/20">
                              <SparklesIcon className="size-3.5 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl rounded-tl-sm px-3 py-2.5 text-xs text-gray-700 dark:text-slate-300 leading-relaxed space-y-2">
                                <p>Here&apos;s how to create a sales order in Frameworks:</p>
                                <ol className="list-decimal list-inside space-y-1.5 text-xs">
                                  <li>Navigate to <strong>Sales &gt; Sales Orders</strong> from the sidebar</li>
                                  <li>Click the <strong>&quot;New Sales Order&quot;</strong> button in the toolbar</li>
                                  <li>Select a <strong>customer</strong> from the dropdown or search by name/code</li>
                                  <li>Add <strong>line items</strong> by searching for products — quantities and pricing auto-populate</li>
                                  <li>Review totals and click <strong>&quot;Save&quot;</strong> to create as Draft, or <strong>&quot;Confirm&quot;</strong> to submit</li>
                                </ol>
                                <div className="mt-2 p-2 rounded-lg bg-tertiary-50 dark:bg-tertiary-500/10 border border-tertiary-100 dark:border-tertiary-500/20">
                                  <p className="flex items-center gap-1 text-tertiary-700 dark:text-tertiary-400 font-medium">
                                    <LightBulbIcon className="size-3.5" />
                                    Tip
                                  </p>
                                  <p className="mt-1 text-tertiary-600 dark:text-tertiary-400/80">Use the <strong>AI Assistant</strong> on the order detail page to reprice lines, check stock, or analyse margins.</p>
                                </div>
                                <button
                                  onClick={() => { setHelpTab('articles'); setSelectedArticle(helpArticles.find(a => a.id === 'sales-orders') || null) }}
                                  className="mt-1 inline-flex items-center gap-1 text-primary-500 dark:text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 text-xs font-medium"
                                >
                                  <BookOpenIcon className="size-3.5" />
                                  Read full article: Creating & Managing Sales Orders
                                </button>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {['Tell me about order statuses', 'How do I add line items?', 'What about credit memos?'].map((s) => (
                                  <button key={s} className="px-2.5 py-1 text-xs rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 transition-colors">
                                    {s}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-gray-100 dark:border-slate-700 shrink-0">
                          <div className="flex items-stretch gap-2">
                            <div className="flex-1 relative">
                              <textarea
                                value={helpAiInput}
                                onChange={(e) => setHelpAiInput(e.target.value)}
                                placeholder="Ask a question..."
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
                            AI responses are generated — always verify important information
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </AppShellContext.Provider>
  )
}
