'use client'

import { RichText } from './RichText'

interface StreamingTextProps {
  text: string
  isStreaming: boolean
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  return (
    <span>
      <RichText text={text} />
      {isStreaming && (
        <span className="inline-block w-[6px] h-[14px] ml-0.5 bg-tertiary-500 align-middle animate-blink" />
      )}
    </span>
  )
}
