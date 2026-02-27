'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useConversation } from '@/lib/ai/use-conversation'
import type { ActionConfig } from '@/lib/ai/types'
import {
  SO_436_SCRIPT_NODES,
  SO_436_INITIAL_MESSAGE,
  ORDER_436_DATA,
  ORDER_436_LINES,
  STOCK_DATA_436,
  CUSTOMER_HISTORY_436,
  BRANCH_REVENUE_436,
} from '@/lib/ai/scripts/sales-order-436'
import { TypingIndicator } from '../TypingIndicator'
import { MessageBubble } from '../MessageBubble'
import { QuickActions } from '../QuickActions'
import { FavouritesBar } from '../FavouritesBar'

interface SO436ConversationProps {
  resetRef?: React.MutableRefObject<(() => void) | null>
}

export function SO436Conversation({ resetRef }: SO436ConversationProps) {
  const {
    messages,
    isTyping,
    isStreaming,
    streamedText,
    streamingMsgIndex,
    showComponents,
    sendMessage,
    sendAction,
    handleApply,
    handleCancel,
    reset,
  } = useConversation({
    scriptNodes: SO_436_SCRIPT_NODES,
    initialMessage: SO_436_INITIAL_MESSAGE,
    storageKey: 'fw-ai-436',
  })

  const [input, setInput] = useState('')
  // Expose reset to parent
  const handleReset = useCallback(() => {
    reset()
    setInput('')
  }, [reset])

  useEffect(() => {
    if (resetRef) resetRef.current = handleReset
  }, [resetRef, handleReset])
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fw-ai-436-favourites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamedText, isTyping, showComponents])

  // Persist favourites
  useEffect(() => {
    try {
      localStorage.setItem('fw-ai-436-favourites', JSON.stringify(favourites))
    } catch {}
  }, [favourites])

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return
      await sendMessage(text)
    },
    [sendMessage]
  )

  const handleAction = useCallback(
    (action: ActionConfig) => {
      sendAction(action)
    },
    [sendAction]
  )

  const handleQuickAction = useCallback(
    (label: string) => {
      sendMessage(label)
    },
    [sendMessage]
  )

  const toggleFavourite = useCallback((label: string) => {
    setFavourites((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    )
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
      setInput('')
    }
  }

  // Data props for message bubbles
  const dataProps = {
    orderData: {
      orderLines: ORDER_436_LINES,
      orderNumber: ORDER_436_DATA.orderNumber,
      customer: ORDER_436_DATA.customer,
    },
    stockData: STOCK_DATA_436,
    customerHistory: CUSTOMER_HISTORY_436,
    branchRevenue: BRANCH_REVENUE_436,
  }

  return (
    <>
      {/* Favourites Bar */}
      <FavouritesBar
        favourites={favourites}
        onSelect={handleQuickAction}
        onRemove={(label) =>
          setFavourites((prev) => prev.filter((f) => f !== label))
        }
      />

      {/* Quick Actions — always visible as persistent header */}
      <QuickActions
        onSelect={handleQuickAction}
        favourites={favourites}
        onToggleFavourite={toggleFavourite}
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => {
          const isStreamingThis = i === streamingMsgIndex
          const isLast = i === messages.length - 1 && !isStreaming && !isTyping

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isStreaming={isStreamingThis}
              streamedText={isStreamingThis ? streamedText : undefined}
              showComponents={isStreamingThis ? showComponents : true}
              isLatest={isLast}
              onAction={handleAction}
              onApply={() => handleApply('reprice-applied')}
              onCancel={handleCancel}
              {...dataProps}
            />
          )
        })}

        {/* Streaming message (before it's added to messages) */}
        {streamingMsgIndex >= messages.length && isStreaming && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              text: streamedText,
              timestamp: Date.now(),
            }}
            isStreaming={true}
            streamedText={streamedText}
            showComponents={false}
            isLatest={false}
            onAction={handleAction}
            {...dataProps}
          />
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2 mb-4">
            <div className="w-[26px] h-[26px] rounded-full bg-tertiary-100 dark:bg-tertiary-500/20 flex items-center justify-center shrink-0">
              <svg
                className="w-3.5 h-3.5 text-tertiary-500 dark:text-tertiary-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z"
                />
              </svg>
            </div>
            <TypingIndicator />
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-slate-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about this order..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
          />
          <button
            onClick={() => {
              handleSend(input)
              setInput('')
            }}
            disabled={!input.trim() || isStreaming || isTyping}
            className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            <PaperAirplaneIcon className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}
