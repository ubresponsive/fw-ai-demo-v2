'use client'

import { useAppShell } from '@/lib/app-shell-context'
import { classNames } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid'
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

export default function DashboardPage() {
  const { userName } = useAppShell()

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
            <h3 className="text-base font-semibold text-gray-900">Overview — Last 30 days</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {dashboardStats.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow-sm sm:px-6 sm:pt-6"
                >
                  <dt>
                    <div className="absolute rounded-md bg-secondary-100 p-3">
                      <item.icon aria-hidden="true" className="size-6 text-secondary-700" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
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
                    <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                      <div className="text-sm">
                        <a href="#" className="font-medium text-primary-500 hover:text-primary-400">
                          View details<span className="sr-only"> {item.name}</span>
                        </a>
                      </div>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
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
