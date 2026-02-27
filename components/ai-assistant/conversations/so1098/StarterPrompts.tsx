'use client'

import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

interface StarterPrompt {
  label: string
  description: string
  icon: React.ElementType
  enabled: boolean
}

const PROMPTS: StarterPrompt[] = [
  {
    label: 'Help me find products',
    description: 'Search catalogue by description, list, or customer history',
    icon: MagnifyingGlassIcon,
    enabled: true,
  },
  {
    label: 'Check stock availability',
    description: 'Look up current stock levels across branches',
    icon: DocumentTextIcon,
    enabled: true,
  },
  {
    label: 'Recent orders',
    description: "View this customer's recent purchase history",
    icon: ClockIcon,
    enabled: true,
  },
  {
    label: 'Pricing & discounts',
    description: 'Check customer pricing tiers and active deals',
    icon: TagIcon,
    enabled: true,
  },
]

interface StarterPromptsProps {
  onSelect: (label: string) => void
}

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 my-3">
      {PROMPTS.map((p, i) => {
        const Icon = p.icon
        return (
          <button
            key={i}
            onClick={() => p.enabled && onSelect(p.label)}
            disabled={!p.enabled}
            className={`flex flex-col items-start gap-1.5 p-3 rounded-lg border text-left transition-all ${
              p.enabled
                ? 'border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-500/5 cursor-pointer'
                : 'border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <Icon className={`w-5 h-5 ${p.enabled ? 'text-primary-500' : 'text-gray-400 dark:text-slate-500'}`} />
            <div className="text-[13px] font-semibold text-gray-800 dark:text-slate-200">
              {p.label}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400 leading-snug">
              {p.description}
            </div>
            {!p.enabled && (
              <span className="text-[10px] text-gray-400 dark:text-slate-500 italic">Coming soon</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
