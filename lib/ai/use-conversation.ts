'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { AIMessage, ActionConfig, ScriptNodes } from './types'
import { useStreaming } from './use-streaming'
import { findBestMatch } from './use-fuzzy-match'

interface UseConversationConfig {
  scriptNodes: ScriptNodes
  initialMessage: AIMessage
  storageKey?: string
}

export function useConversation(config: UseConversationConfig) {
  const { scriptNodes, initialMessage, storageKey } = config

  // Load messages from localStorage or use initial
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      } catch {}
    }
    return [initialMessage]
  })

  const [isTyping, setIsTyping] = useState(false)
  const { streamedText, isStreaming, stream } = useStreaming()
  const [streamingMsgIndex, setStreamingMsgIndex] = useState(-1)
  const [showComponents, setShowComponents] = useState(false)
  const [pendingComponents, setPendingComponents] = useState<AIMessage['components'] | null>(null)
  const [pendingActions, setPendingActions] = useState<AIMessage['actions'] | null>(null)
  const [pendingFollowUps, setPendingFollowUps] = useState<AIMessage['followUps'] | null>(null)
  const [demoStep, setDemoStep] = useState(() => {
    if (storageKey) {
      try {
        const stored = localStorage.getItem(`${storageKey}-step`)
        return stored ? parseInt(stored, 10) : 0
      } catch {}
    }
    return 0
  })

  // Persist messages to localStorage
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages))
      } catch {}
    }
  }, [storageKey, messages])

  // Persist demo step
  useEffect(() => {
    if (storageKey) {
      try {
        localStorage.setItem(`${storageKey}-step`, String(demoStep))
      } catch {}
    }
  }, [storageKey, demoStep])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      const userMsg: AIMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsTyping(true)

      // Simulate processing delay
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 800))

      const match = findBestMatch(text, scriptNodes)
      setIsTyping(false)

      if (match) {
        const node = scriptNodes[match.nodeId]
        const response = node.response
        setStreamingMsgIndex(messages.length + 1)
        setPendingComponents(response.components || null)
        setPendingActions(response.actions || null)
        setPendingFollowUps(response.followUps || null)
        setShowComponents(false)

        await stream(response.text)

        setShowComponents(true)
        const assistantMsg: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: response.text,
          components: response.components,
          actions: response.actions,
          followUps: response.followUps,
          timestamp: Date.now(),
          metadata: {
            nodeId: match.nodeId,
            confidence: match.confidence,
            source: 'script',
          },
        }
        setMessages((prev) => [...prev, assistantMsg])
        setStreamingMsgIndex(-1)
        setPendingComponents(null)
        setPendingActions(null)
        setPendingFollowUps(null)

        // Advance demo progress
        if (match.nodeId === 'margin-breakdown' && demoStep < 2) setDemoStep(1)
        if (match.nodeId.startsWith('reprice') && demoStep < 3) setDemoStep(2)
        if (match.nodeId === 'stock-check' && demoStep < 4) setDemoStep(3)
        if (match.nodeId === 'customer-history' && demoStep < 5) setDemoStep(4)
      } else {
        // Fallback response
        const fallback: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'I can help with that. Try asking about **margin analysis**, **stock availability**, **customer history**, **payment status**, or **revenue by branch** for this order.',
          components: [],
          actions: [],
          followUps: [
            'Show margin breakdown',
            'Check stock for all items',
            'Customer order history',
          ],
          timestamp: Date.now(),
          metadata: { source: 'fallback' },
        }
        setStreamingMsgIndex(messages.length + 1)
        await stream(fallback.text)
        setMessages((prev) => [...prev, fallback])
        setStreamingMsgIndex(-1)
      }
    },
    [messages, stream, scriptNodes, demoStep]
  )

  const sendAction = useCallback(
    (action: ActionConfig) => {
      sendMessage(action.label)
    },
    [sendMessage]
  )

  const handleApply = useCallback(
    async (nodeId: string) => {
      setIsTyping(true)
      await new Promise((r) => setTimeout(r, 800))
      setIsTyping(false)

      const node = scriptNodes[nodeId]
      if (!node) return

      setStreamingMsgIndex(messages.length)
      await stream(node.response.text)

      const msg: AIMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        text: node.response.text,
        components: node.response.components,
        actions: node.response.actions,
        followUps: node.response.followUps,
        timestamp: Date.now(),
        metadata: { nodeId, source: 'script' },
      }
      setMessages((prev) => [...prev, msg])
      setStreamingMsgIndex(-1)
      if (demoStep < 3) setDemoStep(2)
    },
    [messages, stream, scriptNodes, demoStep]
  )

  const handleCancel = useCallback(() => {
    const msg: AIMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      text: 'Price change cancelled. The order remains unchanged.',
      components: [],
      actions: [],
      followUps: [
        'Show margin breakdown',
        'Check stock for all items',
        'Try a different price',
      ],
      timestamp: Date.now(),
      metadata: { source: 'script' },
    }
    setMessages((prev) => [...prev, msg])
  }, [])

  const reset = useCallback(() => {
    setMessages([initialMessage])
    setDemoStep(0)
    setStreamingMsgIndex(-1)
    setPendingComponents(null)
    setPendingActions(null)
    setPendingFollowUps(null)
    setShowComponents(false)
  }, [initialMessage])

  return {
    messages,
    isTyping,
    isStreaming,
    streamedText,
    streamingMsgIndex,
    showComponents,
    pendingComponents,
    pendingActions,
    pendingFollowUps,
    demoStep,
    sendMessage,
    sendAction,
    handleApply,
    handleCancel,
    reset,
  }
}
