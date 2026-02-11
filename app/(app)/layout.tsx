'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
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
} from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { navigation, bottomNav, type NavItem } from '@/lib/navigation'
import { classNames, getInitials } from '@/lib/utils'
import { AppShellContext } from '@/lib/app-shell-context'

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
  info: { icon: InformationCircleIcon, bg: 'bg-primary-50', text: 'text-primary-500' },
  warning: { icon: ExclamationTriangleIcon, bg: 'bg-amber-50', text: 'text-amber-500' },
  success: { icon: CheckIcon, bg: 'bg-emerald-50', text: 'text-emerald-500' },
  order: { icon: ShoppingCartIcon, bg: 'bg-sky-50', text: 'text-sky-500' },
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
                  ? 'bg-gray-50 text-primary-500'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500',
                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500',
                  'size-6 shrink-0',
                )}
              />
              {item.name}
            </a>
          ) : (
            <Disclosure as="div" defaultOpen={item.current}>
              <DisclosureButton
                className={classNames(
                  item.current ? 'bg-gray-50 text-primary-500' : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500',
                  'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold',
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500',
                    'size-6 shrink-0',
                  )}
                />
                {item.name}
                <ChevronRightIcon
                  aria-hidden="true"
                  className="ml-auto size-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500"
                />
              </DisclosureButton>
              <DisclosurePanel as="ul" className="mt-1 px-2">
                {item.children.map((subItem) => (
                  <li key={subItem.name}>
                    <a
                      href={subItem.href}
                      className={classNames(
                        subItem.current
                          ? 'bg-gray-50 text-primary-500 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500',
                        'block rounded-md py-2 pr-2 pl-11 text-sm/6',
                      )}
                    >
                      {subItem.name}
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

// ── Collapsed sidebar nav — icon-only with tooltips ──
function SidebarNavCollapsed({ items }: { items: NavItem[] }) {
  return (
    <ul role="list" className="flex flex-col items-center space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          <a
            href={item.href || '#'}
            title={item.name}
            className={classNames(
              item.current
                ? 'bg-gray-50 text-primary-500'
                : 'text-gray-700 hover:bg-gray-50 hover:text-primary-500',
              'group flex rounded-md p-3 text-sm/6 font-semibold',
            )}
          >
            <item.icon
              aria-hidden="true"
              className={classNames(
                item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-primary-500',
                'size-6 shrink-0',
              )}
            />
            <span className="sr-only">{item.name}</span>
          </a>
        </li>
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

  return (
    <AppShellContext.Provider value={{ userName, userEmail, sidebarCollapsed }}>
      <div>
        {/* Mobile sidebar */}
        <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />
          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                  </button>
                </div>
              </TransitionChild>

              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
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
          <div className="flex grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
            {sidebarCollapsed ? (
              <>
                <div className="flex h-16 shrink-0 items-center justify-center">
                  <img alt="Frameworks" src="/favicon.ico" className="size-8" />
                </div>
                <nav className="mt-2 flex flex-1 flex-col items-center">
                  <SidebarNavCollapsed items={navWithCurrent} />
                  <div className="mt-6 w-8 border-t border-gray-200" />
                  <div className="mt-6">
                    <SidebarNavCollapsed items={bottomNav} />
                  </div>
                  <div className="mt-auto mb-4 flex flex-col items-center gap-y-2">
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="group flex rounded-md p-3 text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                    >
                      <ArrowRightStartOnRectangleIcon aria-hidden="true" className="size-6 shrink-0 text-gray-400 group-hover:text-primary-500" />
                      <span className="sr-only">Logout</span>
                    </button>
                    <button
                      onClick={() => setSidebarCollapsed(false)}
                      title="Expand sidebar"
                      className="group flex rounded-md p-3 text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                    >
                      <ChevronDoubleRightIcon aria-hidden="true" className="size-5 text-gray-400 group-hover:text-primary-500" />
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
                    className="group rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-primary-500"
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
                      <div className="text-xs/6 font-semibold text-gray-400">System</div>
                      <div className="mt-2">
                        <SidebarNavExpanded items={bottomNav} />
                      </div>
                    </li>
                    <li className="-mx-2 mt-auto mb-4">
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
              </>
            )}
          </div>
        </div>

        {/* Mobile top bar */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
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
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
            {initials}
          </span>
        </div>

        {/* Desktop header bar */}
        <div className={`hidden lg:fixed lg:right-0 lg:top-0 lg:z-40 lg:flex lg:h-16 lg:items-center lg:border-b lg:border-gray-200 lg:bg-white lg:px-8 transition-all duration-300 ${headerLeft}`}>
          {/* Left side — search */}
          <div className="flex flex-1 items-center">
            <div className="relative flex flex-1 max-w-md">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400"
              />
              <input
                type="search"
                name="search"
                placeholder="Search..."
                className="block w-full border-0 py-1.5 pl-8 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Right side — company, branch, device, notifications, user, help */}
          <div className="flex items-center gap-x-4">
            <span className="text-sm font-semibold text-gray-900">TEST COMPANY 01</span>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <span className="text-sm text-gray-600">Branch: 10</span>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <span className="text-sm text-gray-600">Device: roam10</span>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setNotificationsOpen(true)}
              className="relative -m-1.5 p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">View notifications</span>
              {unreadCount > 0 ? (
                <BellAlertIcon aria-hidden="true" className="size-6 text-primary-500 animate-bell-ring" />
              ) : (
                <BellIcon aria-hidden="true" className="size-6" />
              )}
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <div className="flex items-center gap-x-2">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-sm font-medium text-white">
                {initials}
              </span>
              <span className="text-sm font-medium text-gray-900">{userName}</span>
            </div>
            <div className="h-5 w-px bg-gray-200" aria-hidden="true" />
            <a
              href="#"
              title="Help documentation"
              className="rounded-md p-1 text-gray-400 hover:text-primary-500 hover:bg-gray-50"
            >
              <QuestionMarkCircleIcon aria-hidden="true" className="size-6" />
              <span className="sr-only">Help documentation</span>
            </a>
          </div>
        </div>

        {/* Main content area */}
        <main className={`lg:pt-16 transition-all duration-300 ${contentPadding}`}>
          {children}
        </main>

        {/* ── Notifications Drawer ── */}
        <Dialog open={notificationsOpen} onClose={setNotificationsOpen} className="relative z-[60]">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ease-out data-closed:opacity-0 data-closed:backdrop-blur-none"
          />
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <DialogPanel
                  transition
                  className="pointer-events-auto w-screen max-w-sm transform transition-transform duration-500 ease-out data-closed:translate-x-full data-closed:duration-300"
                >
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg flex items-center justify-center bg-primary-50">
                          <BellIcon className="size-4 text-primary-500" />
                        </div>
                        <div>
                          <DialogTitle className="text-sm font-semibold text-gray-800">Notifications</DialogTitle>
                          {unreadCount > 0 && (
                            <p className="text-xs text-gray-400">{unreadCount} unread</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-50"
                          >
                            Clear all
                          </button>
                        )}
                        <button onClick={() => setNotificationsOpen(false)} className="p-1 rounded-lg hover:bg-gray-100">
                          <XMarkIcon className="size-5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Notification list */}
                    <div className="flex-1 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                          <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                            <BellIcon className="size-6 text-gray-300" />
                          </div>
                          <p className="text-sm font-medium text-gray-500">All caught up</p>
                          <p className="text-xs text-gray-400 mt-1">No notifications to show.</p>
                        </div>
                      ) : (
                        <ul role="list" className="divide-y divide-gray-100">
                          {notifications.map((n) => {
                            const { icon: NIcon, bg, text } = notificationIconMap[n.type]
                            return (
                              <li
                                key={n.id}
                                className={classNames(
                                  !n.read ? 'bg-primary-50/30' : '',
                                  'relative px-4 py-3 hover:bg-gray-50 transition-colors group',
                                )}
                              >
                                <div className="flex gap-3">
                                  <div className={classNames(bg, 'flex size-8 shrink-0 items-center justify-center rounded-full mt-0.5')}>
                                    <NIcon className={classNames(text, 'size-4')} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={classNames(!n.read ? 'font-semibold' : 'font-medium', 'text-sm text-gray-900')}>
                                        {n.title}
                                      </p>
                                      {!n.read && (
                                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary-500" />
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-[10px] text-gray-400">{n.time}</span>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!n.read && (
                                          <button
                                            onClick={() => markAsRead(n.id)}
                                            className="px-1.5 py-0.5 text-[10px] font-medium text-primary-500 hover:bg-primary-50 rounded"
                                          >
                                            Mark read
                                          </button>
                                        )}
                                        <button
                                          onClick={() => dismissNotification(n.id)}
                                          className="p-0.5 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100"
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
      </div>
    </AppShellContext.Provider>
  )
}
