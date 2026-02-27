'use client'

import {
  ArrowPathIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

export interface QuickAction {
  label: string
  icon: string
  category: string
}

const ICON_MAP: Record<string, React.ElementType> = {
  ArrowPathIcon,
  CubeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
}

const DEFAULT_ACTIONS: QuickAction[] = [
  { label: 'Reprice Order', icon: 'ArrowPathIcon', category: 'Actions' },
  { label: 'Check Stock', icon: 'CubeIcon', category: 'Actions' },
  { label: 'Margin Analysis', icon: 'ChartBarIcon', category: 'Analysis' },
  { label: 'Customer Trends', icon: 'ArrowTrendingUpIcon', category: 'Analysis' },
  { label: 'Payment Status', icon: 'CreditCardIcon', category: 'Status' },
  { label: 'Revenue by Branch', icon: 'BuildingOfficeIcon', category: 'Reports' },
]

interface QuickActionsProps {
  onSelect: (label: string) => void
  favourites: string[]
  onToggleFavourite: (label: string) => void
  actions?: QuickAction[]
}

export function QuickActions({
  onSelect,
  favourites,
  onToggleFavourite,
  actions,
}: QuickActionsProps) {
  const items = actions ?? DEFAULT_ACTIONS
  return (
    <div className="py-3 px-4 border-b border-gray-200 dark:border-slate-700">
      <div className="text-[11px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
        Quick Actions
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((a, i) => {
          const Icon = ICON_MAP[a.icon]
          const isFav = favourites.includes(a.label)
          return (
            <div key={i} className="relative">
              <button
                onClick={() => onSelect(a.label)}
                className="w-full px-3 py-2.5 rounded-lg text-[13px] font-medium border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 flex items-center gap-2 text-left transition-all hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-500/5"
              >
                {Icon && <Icon className="w-4 h-4 text-gray-400 dark:text-slate-500" />}
                {a.label}
              </button>
              <button
                onClick={() => onToggleFavourite(a.label)}
                className={`absolute top-1 right-1 text-sm px-1 py-0.5 ${
                  isFav
                    ? 'text-amber-400'
                    : 'text-gray-300 dark:text-slate-600 hover:text-amber-400'
                }`}
                title={isFav ? 'Remove from favourites' : 'Add to favourites'}
              >
                {isFav ? '★' : '☆'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
