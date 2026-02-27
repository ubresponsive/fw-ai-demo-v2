'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import type { OCRItem, MatchedProduct, CrossSellItem, QuoteOrderLine } from '@/lib/ai/types'
import {
  OCR_ITEMS_DEFAULT,
  MATCHED_PRODUCTS_DEFAULT,
  CROSS_SELL_ITEMS_DEFAULT,
  CATALOGUE_SEARCH_STEPS,
  AGENT_MESSAGES,
  UPLOAD_KEYWORDS,
  buildOrderLinesFromProducts,
  buildOrderLinesFromCrossSells,
} from '@/lib/ai/data/quote-1098'
import { useStreaming } from '@/lib/ai/use-streaming'
import { TypingIndicator } from '../TypingIndicator'
import { RichText } from '../RichText'
import { StreamingText } from '../StreamingText'
import { QuickActions, type QuickAction } from '../QuickActions'
import { FavouritesBar } from '../FavouritesBar'
import { FileUploadZone } from './so1098/FileUploadZone'
import { OCRGrid } from './so1098/OCRGrid'
import { ProcessingChecklist } from './so1098/ProcessingChecklist'
import { MatchingGrid } from './so1098/MatchingGrid'
import { ConfirmationTable } from './so1098/ConfirmationTable'
import { CrossSellCards } from './so1098/CrossSellCards'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: number
}

interface SO1098ConversationProps {
  onAddLines: (lines: QuoteOrderLine[]) => void
  onClose?: () => void
  resetRef?: React.MutableRefObject<(() => void) | null>
}

const QUOTE_QUICK_ACTIONS: QuickAction[] = [
  { label: 'Find Products', icon: 'MagnifyingGlassIcon', category: 'Actions' },
  { label: 'Check Stock', icon: 'CubeIcon', category: 'Actions' },
  { label: 'Recent Orders', icon: 'ClockIcon', category: 'Analysis' },
  { label: 'Pricing & Discounts', icon: 'TagIcon', category: 'Analysis' },
]

export function SO1098Conversation({ onAddLines, onClose, resetRef }: SO1098ConversationProps) {
  const [step, setStep] = useState(1)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [ocrItems, setOcrItems] = useState<OCRItem[]>(OCR_ITEMS_DEFAULT)
  const [matchedProducts, setMatchedProducts] = useState<MatchedProduct[]>(MATCHED_PRODUCTS_DEFAULT)
  const [crossSellItems, setCrossSellItems] = useState<CrossSellItem[]>(CROSS_SELL_ITEMS_DEFAULT)
  const [showProcessing, setShowProcessing] = useState(false)
  const [processingItems, setProcessingItems] = useState<string[]>([])
  const [productLinesAdded, setProductLinesAdded] = useState(false)
  // Quick actions always visible as persistent header
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('fw-ai-1098-favourites')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const { streamedText, isStreaming, stream } = useStreaming()
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Persist favourites
  useEffect(() => {
    try {
      localStorage.setItem('fw-ai-1098-favourites', JSON.stringify(favourites))
    } catch {}
  }, [favourites])

  const toggleFavourite = useCallback((label: string) => {
    setFavourites((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    )
  }, [])

  // Expose reset to parent
  const handleReset = useCallback(() => {
    setStep(1)
    setMessages([])
    setInput('')
    setIsTyping(false)
    setOcrItems(OCR_ITEMS_DEFAULT)
    setMatchedProducts(MATCHED_PRODUCTS_DEFAULT)
    setCrossSellItems(CROSS_SELL_ITEMS_DEFAULT)
    setShowProcessing(false)
    setProcessingItems([])
    setProductLinesAdded(false)
    setStreamingMsgId(null)
    // Quick actions always visible — no state to reset
  }, [])

  useEffect(() => {
    if (resetRef) resetRef.current = handleReset
  }, [resetRef, handleReset])

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamedText, isTyping, step, showProcessing])

  // Focus input when step changes to an input-enabled step
  useEffect(() => {
    if ([2, 3, 4].includes(step)) {
      inputRef.current?.focus()
    }
  }, [step])

  const addAssistantMessage = useCallback(
    async (text: string) => {
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 600))
      setIsTyping(false)

      const msgId = `msg-${Date.now()}`
      setMessages((prev) => [...prev, { id: msgId, role: 'assistant', text: '', timestamp: Date.now() }])
      setStreamingMsgId(msgId)
      await stream(text)
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, text } : m))
      )
      setStreamingMsgId(null)
    },
    [stream]
  )

  const addUserMessage = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}`, role: 'user', text, timestamp: Date.now() },
    ])
  }, [])

  // ── Quick action clicked ──
  const handleQuickAction = useCallback(
    async (label: string) => {

      addUserMessage(label)
      if (label === 'Find Products') {
        setStep(2)
        await addAssistantMessage(AGENT_MESSAGES.step2)
      } else if (label === 'Check Stock') {
        setStep(12)
        await addAssistantMessage(AGENT_MESSAGES.stockCheck)
      } else if (label === 'Recent Orders') {
        setStep(12)
        await addAssistantMessage(AGENT_MESSAGES.recentOrders)
      } else if (label === 'Pricing & Discounts') {
        setStep(12)
        await addAssistantMessage(AGENT_MESSAGES.pricingDiscounts)
      } else {
        setStep(2)
        await addAssistantMessage(AGENT_MESSAGES.step2)
      }
    },
    [addUserMessage, addAssistantMessage]
  )

  // ── Handle text input (Steps 2-4) ──
  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      addUserMessage(text)

      if (step === 2) {
        const lower = text.toLowerCase()
        const hasUploadKeyword = UPLOAD_KEYWORDS.some((kw) => lower.includes(kw))
        if (hasUploadKeyword) {
          setStep(3)
          await addAssistantMessage(AGENT_MESSAGES.step3)
        } else if (lower.includes('search') && lower.includes('description')) {
          await addAssistantMessage(AGENT_MESSAGES.searchByDescription)
        } else if (lower.includes('previous') || lower.includes('ordered before')) {
          setStep(12)
          await addAssistantMessage(AGENT_MESSAGES.recentOrders)
        } else {
          await addAssistantMessage(AGENT_MESSAGES.redirectToUpload)
        }
      } else if (step === 3 || step === 4) {
        await addAssistantMessage(AGENT_MESSAGES.redirectToUpload)
      } else {
        await addAssistantMessage(AGENT_MESSAGES.redirectToUpload)
      }
    },
    [step, addUserMessage, addAssistantMessage]
  )

  // ── Step 3→4: Upload complete ──
  const handleUploadComplete = useCallback(async () => {
    setStep(4)
    await addAssistantMessage(AGENT_MESSAGES.step4reading)
    // Simulate OCR processing
    await new Promise((r) => setTimeout(r, 1200))
    setStep(5)
    await addAssistantMessage(AGENT_MESSAGES.step5)
  }, [addAssistantMessage])

  // ── Step 5→6: Search catalogue ──
  const handleSearchCatalogue = useCallback(async () => {
    setStep(6)
    await addAssistantMessage(AGENT_MESSAGES.step6)
    setShowProcessing(true)
    setProcessingItems(CATALOGUE_SEARCH_STEPS)
  }, [addAssistantMessage])

  // ── Step 6→7: Processing complete ──
  const handleCatalogueSearchComplete = useCallback(async () => {
    setShowProcessing(false)
    setStep(7)
    await addAssistantMessage(AGENT_MESSAGES.step7)
  }, [addAssistantMessage])

  // ── Step 7→8: Add selected to quote ──
  const handleAddSelected = useCallback(async () => {
    const selected = matchedProducts.filter((p) => p.selected)
    setStep(8)
    await addAssistantMessage(AGENT_MESSAGES.step8)
    // Prepare confirmation items from selected products
  }, [addAssistantMessage, matchedProducts])

  // ── Step 8→7: Go back ──
  const handleGoBack = useCallback(() => {
    // Remove the confirmation message and go back to step 7
    setStep(7)
    setMessages((prev) => {
      // Remove last 1 assistant message (the step 8 message)
      const lastAssistantIdx = [...prev].reverse().findIndex((m) => m.role === 'assistant')
      if (lastAssistantIdx >= 0) {
        const removeIdx = prev.length - 1 - lastAssistantIdx
        return prev.slice(0, removeIdx)
      }
      return prev
    })
  }, [])

  // ── Step 8→9: Confirm products ──
  const handleConfirmProducts = useCallback(async () => {
    setStep(9)
    await addAssistantMessage(AGENT_MESSAGES.step9processing)
    setShowProcessing(true)
    setProcessingItems(
      matchedProducts
        .filter((p) => p.selected)
        .map((p) => `Adding ${p.matchedProduct}...`)
    )
  }, [addAssistantMessage, matchedProducts])

  // ── Step 9→10: Products added, show cross-sell ──
  const handleProductsProcessed = useCallback(async () => {
    setShowProcessing(false)
    setProductLinesAdded(true)

    // Build order lines from selected matched products
    const selected = matchedProducts.filter((p) => p.selected)
    const lines = buildOrderLinesFromProducts(selected)
    onAddLines(lines)

    const total = selected.reduce((sum, p) => sum + p.qty * p.price, 0)
    const totalStr = `$${total.toFixed(2)}`

    await addAssistantMessage(AGENT_MESSAGES.step9success(totalStr))
    setStep(10)
    await addAssistantMessage(AGENT_MESSAGES.step10)
  }, [addAssistantMessage, matchedProducts, onAddLines])

  // ── Step 10→11: Add cross-sell selected ──
  const handleCrossSellAdd = useCallback(async () => {
    setStep(11)
    await addAssistantMessage(AGENT_MESSAGES.step11)
  }, [addAssistantMessage])

  // ── Step 10→12: Skip cross-sell ──
  const handleCrossSellSkip = useCallback(async () => {
    setStep(12)
    const selected = matchedProducts.filter((p) => p.selected)
    const productTotal = selected.reduce((sum, p) => sum + p.qty * p.price, 0)
    const totalStr = `$${productTotal.toFixed(2)}`
    await addAssistantMessage(
      AGENT_MESSAGES.step12success(totalStr, selected.length)
    )
  }, [addAssistantMessage, matchedProducts])

  // ── Step 11→12: Confirm cross-sell ──
  const handleConfirmCrossSell = useCallback(async () => {
    setStep(12)
    await addAssistantMessage(AGENT_MESSAGES.step12processing)
    setShowProcessing(true)
    setProcessingItems(
      crossSellItems
        .filter((cs) => cs.added)
        .map((cs) => `Adding ${cs.product}...`)
    )
  }, [addAssistantMessage, crossSellItems])

  // ── Step 12: Cross-sell processed ──
  const handleCrossSellProcessed = useCallback(async () => {
    setShowProcessing(false)

    // Build cross-sell order lines
    const addedCrossSells = crossSellItems.filter((cs) => cs.added)
    const selectedProducts = matchedProducts.filter((p) => p.selected)
    const startLine = selectedProducts.length + 1
    const csLines = buildOrderLinesFromCrossSells(addedCrossSells, startLine)
    onAddLines(csLines)

    const productTotal = selectedProducts.reduce((sum, p) => sum + p.qty * p.price, 0)
    const csTotal = addedCrossSells.reduce((sum, cs) => sum + cs.price, 0)
    const grandTotal = productTotal + csTotal
    const totalStr = `$${grandTotal.toFixed(2)}`
    const lineCount = selectedProducts.length + addedCrossSells.length

    await addAssistantMessage(AGENT_MESSAGES.step12success(totalStr, lineCount))
  }, [addAssistantMessage, crossSellItems, matchedProducts, onAddLines])

  // Cross-sell toggle
  const toggleCrossSell = useCallback((id: string) => {
    setCrossSellItems((prev) =>
      prev.map((cs) => (cs.id === id ? { ...cs, added: !cs.added } : cs))
    )
  }, [])

  // Build confirmation items from matched products
  const confirmationItems = matchedProducts
    .filter((p) => p.selected)
    .map((p) => ({
      product: p.matchedProduct,
      code: p.code,
      qty: p.qty,
      uom: p.uom,
      unitPrice: p.price,
      lineTotal: p.qty * p.price,
    }))

  // Build cross-sell confirmation items
  const crossSellConfirmItems = crossSellItems
    .filter((cs) => cs.added)
    .map((cs) => ({
      product: cs.product,
      code: cs.code,
      qty: cs.qty,
      uom: cs.uom,
      unitPrice: cs.unitPrice,
      lineTotal: cs.price,
    }))

  // Handle qty change in confirmation table
  const handleProductQtyChange = useCallback(
    (index: number, qty: number) => {
      const selectedIds = matchedProducts.filter((p) => p.selected).map((p) => p.id)
      const targetId = selectedIds[index]
      if (!targetId) return
      setMatchedProducts((prev) =>
        prev.map((p) => (p.id === targetId ? { ...p, qty } : p))
      )
    },
    [matchedProducts]
  )

  const handleCrossSellQtyChange = useCallback(
    (index: number, qty: number) => {
      const addedIds = crossSellItems.filter((cs) => cs.added).map((cs) => cs.id)
      const targetId = addedIds[index]
      if (!targetId) return
      setCrossSellItems((prev) =>
        prev.map((cs) =>
          cs.id === targetId
            ? { ...cs, qty, price: qty * cs.unitPrice }
            : cs
        )
      )
    },
    [crossSellItems]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
      setInput('')
    }
  }

  const inputEnabled = [2, 3, 4].includes(step) || step >= 12

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
        actions={QUOTE_QUICK_ACTIONS}
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Messages */}
        {messages.map((msg) => {
          const isMsgStreaming = msg.id === streamingMsgId
          return (
            <div key={msg.id} className="mb-4 animate-fade-in">
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-primary-500 text-white px-3.5 py-2 rounded-2xl rounded-br-sm max-w-[85%] text-[13px] leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <div className="w-[26px] h-[26px] rounded-full bg-tertiary-100 dark:bg-tertiary-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5 text-tertiary-500 dark:text-tertiary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                    </svg>
                  </div>
                  <div className="max-w-[85%] text-[13px] text-gray-800 dark:text-slate-200 leading-relaxed">
                    {isMsgStreaming ? (
                      <StreamingText text={streamedText} isStreaming={true} />
                    ) : (
                      <RichText text={msg.text} />
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Step 2 quick actions */}
        {step === 2 && !isTyping && !isStreaming && messages.length > 0 && (
          <div className="pl-[34px] flex flex-wrap gap-2 mb-4 animate-fade-in">
            {[
              { label: 'Upload a list / photo', action: 'I have a handwritten list to upload' },
              { label: 'Search by description', action: 'Search catalogue by description' },
              { label: 'Previous orders', action: "Show what CJ Constructions has ordered before" },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => {
                  handleSend(opt.action)
                  setInput('')
                }}
                className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:border-primary-300 dark:hover:border-primary-500 hover:bg-primary-500/5 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Upload zone (Step 3) */}
        {step === 3 && <FileUploadZone onUploadComplete={handleUploadComplete} />}

        {/* OCR Grid (Step 5) */}
        {step === 5 && (
          <OCRGrid
            items={ocrItems}
            onChange={setOcrItems}
            onSearchCatalogue={handleSearchCatalogue}
          />
        )}

        {/* Processing checklist (Steps 6, 9, 12) */}
        {showProcessing && (
          <ProcessingChecklist
            items={processingItems}
            onComplete={
              step === 6
                ? handleCatalogueSearchComplete
                : step === 9
                  ? handleProductsProcessed
                  : handleCrossSellProcessed
            }
          />
        )}

        {/* Matching Grid (Step 7) */}
        {step === 7 && (
          <MatchingGrid
            products={matchedProducts}
            onChange={setMatchedProducts}
            onAddSelected={handleAddSelected}
          />
        )}

        {/* Confirmation Table — products (Step 8) */}
        {step === 8 && (
          <ConfirmationTable
            items={confirmationItems}
            onQtyChange={handleProductQtyChange}
            onConfirm={handleConfirmProducts}
            onGoBack={handleGoBack}
            mode="products"
          />
        )}

        {/* Cross-sell cards (Step 10) */}
        {step === 10 && (
          <CrossSellCards
            items={crossSellItems}
            onToggle={toggleCrossSell}
            onAddSelected={handleCrossSellAdd}
            onSkip={handleCrossSellSkip}
          />
        )}

        {/* Confirmation Table — cross-sell (Step 11) */}
        {step === 11 && (
          <ConfirmationTable
            items={crossSellConfirmItems}
            onQtyChange={handleCrossSellQtyChange}
            onConfirm={handleConfirmCrossSell}
            onGoBack={() => setStep(10)}
            mode="cross-sell"
          />
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2 mb-4">
            <div className="w-[26px] h-[26px] rounded-full bg-tertiary-100 dark:bg-tertiary-500/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-tertiary-500 dark:text-tertiary-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
              </svg>
            </div>
            <TypingIndicator />
          </div>
        )}

        {/* Follow-up suggestions at end of flow */}
        {step >= 12 && !showProcessing && !isTyping && !isStreaming && (
          <div className="my-3 animate-fade-in flex flex-wrap gap-1.5">
            {[
              'Check Stock',
              'Recent Orders',
              'Pricing & Discounts',
              'Find Products',
            ].map((label) => (
              <button
                key={label}
                onClick={() => handleQuickAction(label)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-primary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-500/5 transition-colors"
              >
                {label}
              </button>
            ))}
            {onClose && (
              <button
                onClick={onClose}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium border border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-slate-200 transition-colors ml-auto"
              >
                Close Assistant
              </button>
            )}
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
            placeholder={
              step === 1
                ? 'Select an option above to get started...'
                : step >= 12
                  ? 'Ask a follow-up question...'
                  : 'Type a message...'
            }
            rows={1}
            disabled={!inputEnabled && !isStreaming}
            className="flex-1 resize-none rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => {
              handleSend(input)
              setInput('')
            }}
            disabled={!input.trim() || isStreaming || isTyping || !inputEnabled}
            className="p-2 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
          >
            <PaperAirplaneIcon className="size-4" />
          </button>
        </div>
      </div>
    </>
  )
}
