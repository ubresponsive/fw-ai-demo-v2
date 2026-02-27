'use client'

import { useState, useCallback, useRef } from 'react'

export function useStreaming() {
  const [streamedText, setStreamedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const cancelRef = useRef(false)

  const stream = useCallback((text: string, delay: number = 18): Promise<void> => {
    return new Promise((resolve) => {
      cancelRef.current = false
      setIsStreaming(true)
      setStreamedText('')
      let i = 0
      const tick = () => {
        if (cancelRef.current) {
          setIsStreaming(false)
          resolve()
          return
        }
        if (i < text.length) {
          // Stream word by word for speed
          const nextSpace = text.indexOf(' ', i + 1)
          const end = nextSpace === -1 ? text.length : nextSpace + 1
          setStreamedText(text.slice(0, end))
          i = end
          setTimeout(tick, delay)
        } else {
          setStreamedText(text)
          setIsStreaming(false)
          resolve()
        }
      }
      tick()
    })
  }, [])

  const cancel = useCallback(() => {
    cancelRef.current = true
  }, [])

  return { streamedText, isStreaming, stream, cancel }
}
