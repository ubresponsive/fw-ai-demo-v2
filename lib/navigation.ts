import type { ElementType } from 'react'
import {
  HomeIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CubeIcon,
  ClipboardDocumentListIcon,
  TruckIcon,
  TagIcon,
  CalculatorIcon,
  BuildingStorefrontIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export type NavChild = {
  name: string
  href: string
  current?: boolean
}

export type NavItem = {
  name: string
  href?: string
  icon: ElementType
  current?: boolean
  children?: NavChild[]
}

export const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Sales',
    icon: ShoppingCartIcon,
    children: [
      { name: 'Point of Sale', href: '#' },
      { name: 'Sales Orders', href: '/sales-orders' },
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
      { name: 'Financial Reporting', href: '/financial-reports' },
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
      { name: 'Financial Reporting', href: '/financial-reports' },
      { name: 'AR Dashboard', href: '#' },
      { name: 'Documents & Reports', href: '#' },
    ],
  },
]

export const bottomNav: NavItem[] = [
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
