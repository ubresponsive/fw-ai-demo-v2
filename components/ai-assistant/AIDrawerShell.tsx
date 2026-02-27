'use client'

import React from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { XMarkIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface AIDrawerShellProps {
  open: boolean
  onClose: () => void
  onReset?: () => void
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function AIDrawerShell({
  open,
  onClose,
  onReset,
  title = 'AI Assistant',
  subtitle,
  children,
}: AIDrawerShellProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/50 dark:bg-black/70 backdrop-blur-sm transition-all duration-500 ease-in-out data-[closed]:opacity-0 data-[closed]:backdrop-blur-none"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition-transform duration-700 ease-in-out data-[closed]:translate-x-full data-[closed]:duration-500"
            >
              <div className="flex h-full flex-col bg-white dark:bg-slate-800 shadow-2xl">
                {/* Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-xl flex items-center justify-center bg-tertiary-50 dark:bg-tertiary-500/20">
                      <SparklesIcon className="size-4 text-tertiary-500 dark:text-tertiary-400 animate-sparkle" />
                    </div>
                    <div>
                      <DialogTitle className="text-sm font-semibold text-gray-800 dark:text-slate-100">
                        {title}
                      </DialogTitle>
                      {subtitle && (
                        <p className="text-xs text-gray-400 dark:text-slate-500">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {onReset && (
                      <button
                        onClick={onReset}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        title="Start new conversation"
                      >
                        <ArrowPathIcon className="size-4 text-gray-400 dark:text-slate-500" />
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <XMarkIcon className="size-5 text-gray-400 dark:text-slate-500" />
                    </button>
                  </div>
                </div>

                {/* Content — fills remaining space */}
                {children}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
