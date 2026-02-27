'use client'

import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { RichText } from './RichText'

const severityStyles = {
  error: {
    container:
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-300',
    iconColor: 'text-red-500 dark:text-red-400',
    Icon: ExclamationTriangleIcon,
  },
  warning: {
    container:
      'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-300',
    iconColor: 'text-amber-500 dark:text-amber-400',
    Icon: ExclamationTriangleIcon,
  },
  success: {
    container:
      'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
    Icon: CheckCircleIcon,
  },
  info: {
    container:
      'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-500/10 dark:border-blue-500/30 dark:text-blue-300',
    iconColor: 'text-blue-500 dark:text-blue-400',
    Icon: InformationCircleIcon,
  },
}

interface InsightCalloutProps {
  severity: 'error' | 'warning' | 'success' | 'info'
  text: string
}

export function InsightCallout({ severity, text }: InsightCalloutProps) {
  const s = severityStyles[severity] || severityStyles.info
  const IconComp = s.Icon
  return (
    <div
      className={`rounded-lg border px-3.5 py-2.5 my-2 text-[13px] leading-relaxed flex items-start gap-2 ${s.container}`}
    >
      <IconComp className={`size-4 shrink-0 mt-0.5 ${s.iconColor}`} />
      <RichText text={text} />
    </div>
  )
}
