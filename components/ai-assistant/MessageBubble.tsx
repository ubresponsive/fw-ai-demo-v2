'use client'

import { SparklesIcon } from '@heroicons/react/24/outline'
import type { AIMessage, ActionConfig, ComponentConfig } from '@/lib/ai/types'
import { RichText } from './RichText'
import { StreamingText } from './StreamingText'
import { InsightCallout } from './InsightCallout'
import { ConfirmCard } from './ConfirmCard'
import { MarginChart } from './MarginChart'
import { StockTable } from './StockTable'
import { CustomerChart } from './CustomerChart'
import { BranchChart } from './BranchChart'
import { BranchTable } from './BranchTable'

interface MessageBubbleProps {
  message: AIMessage
  isStreaming?: boolean
  streamedText?: string
  showComponents?: boolean
  isLatest: boolean
  onAction: (action: ActionConfig) => void
  onApply?: () => void
  onCancel?: () => void
  // Data props for components
  orderData?: {
    orderLines: { lineNumber: number; productCode: string; description: string; qty: number; unitCost: number; sellPrice: number; gpPercent: number; lineTotal: number }[]
    orderNumber: string
    customer: { name: string; id: string }
  }
  stockData?: { productCode: string; description: string; onHand: number; allocated: number; available: number; status: 'In Stock' | 'Low Stock' | 'Out of Stock' }[]
  customerHistory?: { month: string; orders: number; revenue: number }[]
  branchRevenue?: { branch: string; revenue: number; orders: number; gp: number }[]
}

function renderComponent(
  comp: ComponentConfig,
  props: MessageBubbleProps
): React.ReactNode {
  switch (comp.type) {
    case 'margin-chart':
      return props.orderData ? (
        <MarginChart
          orderLines={props.orderData.orderLines}
          orderNumber={props.orderData.orderNumber}
        />
      ) : null
    case 'stock-table':
      return props.stockData ? <StockTable data={props.stockData} /> : null
    case 'customer-chart':
      return props.orderData && props.customerHistory ? (
        <CustomerChart
          data={props.customerHistory}
          customerName={props.orderData.customer.name}
        />
      ) : null
    case 'branch-chart':
      return props.branchRevenue ? (
        <BranchChart data={props.branchRevenue} />
      ) : null
    case 'branch-table':
      return props.branchRevenue ? (
        <BranchTable data={props.branchRevenue} />
      ) : null
    case 'insight':
      return <InsightCallout severity={comp.severity} text={comp.text} />
    case 'confirm-card':
      return (
        <ConfirmCard
          title={comp.title}
          fields={comp.fields}
          onApply={props.onApply}
          onCancel={props.onCancel}
        />
      )
    default:
      return null
  }
}

export function MessageBubble(props: MessageBubbleProps) {
  const {
    message,
    isStreaming: streaming,
    streamedText,
    showComponents,
    isLatest,
    onAction,
  } = props
  const isUser = message.role === 'user'
  const displayText = streaming && streamedText !== undefined ? streamedText : message.text
  const shouldShowComponents = streaming ? showComponents : true

  return (
    <div
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 max-w-full`}
    >
      {/* Assistant avatar */}
      {!isUser && (
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-[26px] h-[26px] rounded-full bg-tertiary-100 dark:bg-tertiary-500/20 flex items-center justify-center">
            <SparklesIcon className="w-3.5 h-3.5 text-tertiary-500 dark:text-tertiary-400" />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-slate-400">
            AI Assistant
          </span>
        </div>
      )}

      {/* Message text */}
      <div
        className={
          isUser
            ? 'max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm bg-primary-500 text-white text-sm leading-relaxed'
            : 'w-full pl-[34px] text-sm leading-relaxed text-gray-900 dark:text-slate-200'
        }
      >
        {streaming && streamedText !== undefined ? (
          <StreamingText text={displayText} isStreaming={!!streaming} />
        ) : (
          <RichText text={displayText} />
        )}
      </div>

      {/* Components */}
      {message.components &&
        message.components.length > 0 &&
        shouldShowComponents && (
          <div className="w-full pl-[34px] animate-fade-in">
            {message.components.map((comp, i) => (
              <div key={i}>{renderComponent(comp, props)}</div>
            ))}
          </div>
        )}

      {/* Action buttons */}
      {message.actions &&
        message.actions.length > 0 &&
        isLatest &&
        shouldShowComponents && (
          <div className="pl-[34px] flex flex-wrap gap-2 mt-2.5 animate-fade-in">
            {message.actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onAction(action)}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-all hover:-translate-y-px hover:shadow-md ${
                  action.style === 'primary'
                    ? 'bg-primary-500 hover:bg-primary-600 text-white border-none'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-500'
                }`}
              >
                {action.style === 'primary' ? '↻' : '→'} {action.label}
              </button>
            ))}
          </div>
        )}

      {/* Follow-up suggestions */}
      {message.followUps &&
        message.followUps.length > 0 &&
        isLatest &&
        shouldShowComponents && (
          <div className="pl-[34px] flex flex-wrap gap-1.5 mt-3 animate-fade-in">
            {message.followUps.map((fu, i) => (
              <button
                key={i}
                onClick={() =>
                  onAction({
                    label: fu,
                    style: 'secondary',
                    _isFollowUp: true,
                  })
                }
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                {fu}
              </button>
            ))}
          </div>
        )}
    </div>
  )
}
