'use client'

import { RichText } from './RichText'

const severityStyles = {
  error: {
    container:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300',
    icon: '⚠',
  },
  warning: {
    container:
      'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300',
    icon: '⚠',
  },
  success: {
    container:
      'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300',
    icon: '✓',
  },
  info: {
    container:
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-300',
    icon: 'ℹ',
  },
}

interface InsightCalloutProps {
  severity: 'error' | 'warning' | 'success' | 'info'
  text: string
}

export function InsightCallout({ severity, text }: InsightCalloutProps) {
  const s = severityStyles[severity] || severityStyles.info
  return (
    <div
      className={`rounded-lg border px-3.5 py-2.5 my-2 text-[13px] leading-relaxed ${s.container}`}
    >
      <span className="mr-1.5">{s.icon}</span>
      <RichText text={text} />
    </div>
  )
}
