'use client'

import { useState, useCallback } from 'react'
import { ArrowUpTrayIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface FileUploadZoneProps {
  onUploadComplete: () => void
}

export function FileUploadZone({ onUploadComplete }: FileUploadZoneProps) {
  const [state, setState] = useState<'idle' | 'uploading' | 'done'>('idle')
  const [progress, setProgress] = useState(0)

  const simulateUpload = useCallback(() => {
    setState('uploading')
    setProgress(0)
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5
      if (p >= 100) {
        p = 100
        clearInterval(interval)
        setProgress(100)
        setState('done')
        setTimeout(() => onUploadComplete(), 600)
      } else {
        setProgress(Math.round(p))
      }
    }, 120)
  }, [onUploadComplete])

  if (state === 'done') {
    return (
      <div className="my-3 flex items-center gap-3 p-3 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 animate-fade-in">
        <div className="w-12 h-12 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
          <DocumentTextIcon className="w-6 h-6 text-gray-500 dark:text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-gray-800 dark:text-slate-200 truncate">
            customer-list.jpg
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Uploaded successfully</div>
        </div>
        <span className="text-emerald-500 text-lg">&#10003;</span>
      </div>
    )
  }

  if (state === 'uploading') {
    return (
      <div className="my-3 p-4 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <DocumentTextIcon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-gray-800 dark:text-slate-200">
              customer-list.jpg
            </div>
            <div className="text-[11px] text-gray-500 dark:text-slate-400">
              Uploading... {progress}%
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary-500 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={simulateUpload}
      className="my-3 w-full p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-800/50 hover:border-tertiary-400 dark:hover:border-tertiary-500 hover:bg-tertiary-500/5 transition-colors cursor-pointer flex flex-col items-center gap-2"
    >
      <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 dark:text-slate-500" />
      <div className="text-[13px] font-medium text-gray-600 dark:text-slate-300">
        Click to upload a photo or document
      </div>
      <div className="text-[11px] text-gray-400 dark:text-slate-500">
        JPG, PNG, PDF supported
      </div>
    </button>
  )
}
