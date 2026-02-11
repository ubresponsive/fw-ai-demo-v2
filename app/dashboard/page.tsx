'use client'

import { useEffect, useState, type ElementType } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  TransitionChild,
} from '@headlessui/react'
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import {
  HomeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CubeIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  BuildingStorefrontIcon,
  CalculatorIcon,
  TagIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline'

// Simplified ERP navigation derived from frameworks-menu.json
// Grouped into core functional areas with key sub-items

type NavChild = {
  name: string
  href: string
}

type NavItem = {
  name: string
  href?: string
  icon: ElementType
  current?: boolean
  children?: NavChild[]
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, current: true },
  {
    name: 'Sales',
    icon: ShoppingCartIcon,
    children: [
      { name: 'Point of Sale', href: '#' },
      { name: 'Sales Orders', href: '#' },
      { name: 'Credit Memos', href: '#' },
      { name: 'Customer Orders', href: '#' },
      { name: 'Picking Dashboard', href: '#' },
      { name: 'Projects', href: '#' },
    ],
  },
  {
    name: 'Receivables',
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Customer Dashboard', href: '#' },
      { name: 'Customer Payments', href: '#' },
      { name: 'Customer Statements', href: '#' },
      { name: 'Customer Maintenance', href: '#' },
      { name: 'AR Dashboard', href: '#' },
      { name: 'Credit Approval', href: '#' },
    ],
  },
  {
    name: 'Payables',
    icon: BanknotesIcon,
    children: [
      { name: 'Supplier Dashboard', href: '#' },
      { name: 'Expense Invoice Entry', href: '#' },
      { name: 'Invoice Maintenance', href: '#' },
      { name: 'Payment Selection', href: '#' },
      { name: 'Supplier Maintenance', href: '#' },
      { name: 'Invoice Scanning', href: '#' },
    ],
  },
  {
    name: 'Inventory',
    icon: CubeIcon,
    children: [
      { name: 'Product Dashboard', href: '#' },
      { name: 'Product Maintenance', href: '#' },
      { name: 'Inventory Adjustments', href: '#' },
      { name: 'Physical Inventory', href: '#' },
      { name: 'Price Inquiry', href: '#' },
      { name: 'Product Locations', href: '#' },
    ],
  },
  {
    name: 'Purchasing',
    icon: ClipboardDocumentListIcon,
    children: [
      { name: 'Purchase Requisitions', href: '#' },
      { name: 'Purchase Orders', href: '#' },
      { name: 'Receiving', href: '#' },
      { name: 'Quick Transfers', href: '#' },
      { name: 'Reorder Inventory', href: '#' },
    ],
  },
  {
    name: 'Dispatch',
    icon: TruckIcon,
    children: [
      { name: 'Dispatch Dashboard', href: '#' },
      { name: 'Dispatch Calendar', href: '#' },
      { name: 'Runsheet Maintenance', href: '#' },
    ],
  },
  {
    name: 'Pricing',
    icon: TagIcon,
    children: [
      { name: 'Promotions', href: '#' },
      { name: 'Contracts', href: '#' },
      { name: 'Tier Pricing Dashboard', href: '#' },
      { name: 'Customer Price Books', href: '#' },
      { name: 'Discount Maintenance', href: '#' },
    ],
  },
  {
    name: 'General Ledger',
    icon: CalculatorIcon,
    children: [
      { name: 'GL Dashboard', href: '#' },
      { name: 'Journal Entry', href: '#' },
      { name: 'Bank Reconciliation', href: '#' },
      { name: 'Chart of Accounts', href: '#' },
      { name: 'Financial Reporting', href: '#' },
    ],
  },
  {
    name: 'Production',
    icon: BuildingStorefrontIcon,
    children: [
      { name: 'Process Management', href: '#' },
      { name: 'Production Dashboard', href: '#' },
      { name: 'Work Orders', href: '#' },
      { name: 'Time Sheet Entry', href: '#' },
    ],
  },
  {
    name: 'Reports',
    icon: DocumentChartBarIcon,
    children: [
      { name: 'Financial Reporting', href: '#' },
      { name: 'AR Dashboard', href: '#' },
      { name: 'Documents & Reports', href: '#' },
    ],
  },
]

const bottomNav: NavItem[] = [
  {
    name: 'Administration',
    icon: Cog6ToothIcon,
    children: [
      { name: 'System Setup', href: '#' },
      { name: 'Users & Security', href: '#' },
      { name: 'Task Scheduler', href: '#' },
      { name: 'Audit Inquiry', href: '#' },
      { name: 'Licencing', href: '#' },
    ],
  },
  {
    name: 'My Settings',
    icon: UserIcon,
    children: [
      { name: 'My Printer Configuration', href: '#' },
      { name: 'Change Password/PIN', href: '#' },
      { name: 'Reset your MFA', href: '#' },
      { name: 'Tasks', href: '#' },
    ],
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function SidebarNav({
  items,
  onLogout,
  userName,
  initials,
  showLogout = false,
}: {
  items: NavItem[]
  onLogout?: () => void
  userName?: string
  initials?: string
  showLogout?: boolean
}) {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {items.map((item) => (
        <li key={item.name}>
          {!item.children ? (
            <a
              href={item.href}
              className={classNames(
                item.current
                  ? 'bg-gray-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
              )}
            >
              <item.icon
                aria-hidden="true"
                className={classNames(
                  item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                  'size-6 shrink-0',
                )}
              />
              {item.name}
            </a>
          ) : (
            <Disclosure as="div">
              <DisclosureButton
                className={classNames(
                  item.current ? 'bg-gray-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600',
                  'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm/6 font-semibold',
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
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
                      className="block rounded-md py-2 pr-2 pl-11 text-sm/6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
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

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    setUserName(sessionStorage.getItem('userName') || '')
    setUserEmail(sessionStorage.getItem('userEmail') || '')
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.push('/login')
  }

  const initials = getInitials(userName)

  const sidebarContent = (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <img
          alt="FW ERP"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-auto"
        />
        <span className="ml-3 text-lg font-semibold text-gray-900">Frameworks</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main navigation */}
          <li>
            <SidebarNav items={navigation} />
          </li>

          {/* Admin & Settings section */}
          <li>
            <div className="text-xs/6 font-semibold text-gray-400">System</div>
            <div className="mt-2">
              <SidebarNav items={bottomNav} />
            </div>
          </li>

          {/* Logout */}
          <li className="-mx-2">
            <button
              onClick={handleLogout}
              className="group flex w-full gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              <ArrowRightStartOnRectangleIcon
                aria-hidden="true"
                className="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
              />
              Logout
            </button>
          </li>

          {/* User profile at bottom */}
          <li className="-mx-6 mt-auto">
            <div className="flex items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-gray-900">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                {initials}
              </span>
              <span className="flex flex-col">
                <span aria-hidden="true">{userName}</span>
                <span className="text-xs font-normal text-gray-500">{userEmail}</span>
              </span>
            </div>
          </li>
        </ul>
      </nav>
    </>
  )

  return (
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
              {sidebarContent}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          {sidebarContent}
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
        <div className="flex-1 text-sm/6 font-semibold text-gray-900">Frameworks</div>
        <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
          <span className="sr-only">View notifications</span>
          <BellIcon aria-hidden="true" className="size-6" />
        </button>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
          {initials}
        </span>
      </div>

      {/* Desktop header bar */}
      <div className="hidden lg:fixed lg:left-72 lg:right-0 lg:top-0 lg:z-40 lg:flex lg:h-16 lg:items-center lg:gap-x-4 lg:border-b lg:border-gray-200 lg:bg-white lg:px-8">
        {/* Search */}
        <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
          <div className="relative flex flex-1">
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

        {/* Right side icons */}
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* User avatar */}
          <div className="flex items-center gap-x-3 -m-1.5 p-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
              {initials}
            </span>
            <span className="hidden lg:flex lg:flex-col lg:items-start">
              <span className="text-sm/6 font-semibold text-gray-900">{userName}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <main className="lg:pl-72 lg:pt-16">
        <div className="xl:pr-96">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <div className="mb-8">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-700">
                Welcome back, {userName}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Total Orders</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Active Projects</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Pending Tasks</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
              </div>
              <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">Revenue</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">$0</dd>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Secondary column on right */}
      <aside className="fixed inset-y-0 right-0 hidden w-96 overflow-y-auto border-l border-gray-200 px-4 py-6 sm:px-6 lg:px-8 xl:block">
        <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
        <p className="mt-2 text-sm text-gray-500">No recent activity to display.</p>
      </aside>
    </div>
  )
}
