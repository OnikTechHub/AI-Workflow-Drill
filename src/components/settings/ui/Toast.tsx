'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  toasts: ToastItem[]
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void
  removeToast: (id: string) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      const newToast: ToastItem = { id, type, title, message, duration }
      setToasts((prev) => [...prev, newToast])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  const success = useCallback(
    (title: string, message?: string) => showToast('success', title, message),
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string) => showToast('error', title, message, 6000),
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string) => showToast('info', title, message),
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string) => showToast('warning', title, message),
    [showToast]
  )

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, removeToast, success, error, info, warning }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}) {
  return (
    <aside
      aria-label="Notification alerts"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onRemove(toast.id)} />
      ))}
    </aside>
  )
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: ToastItem
  onDismiss: () => void
}) {
  const isError = toast.type === 'error'

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />,
  }

  const borderMap = {
    success: 'border-emerald-500/30 bg-neutral-900/95 text-neutral-100 shadow-emerald-950/20',
    error: 'border-rose-500/40 bg-neutral-900/95 text-neutral-100 shadow-rose-950/30',
    warning: 'border-amber-500/30 bg-neutral-900/95 text-neutral-100 shadow-amber-950/20',
    info: 'border-sky-500/30 bg-neutral-900/95 text-neutral-100 shadow-sky-950/20',
  }

  return (
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderMap[toast.type]}`}
    >
      {iconMap[toast.type]}
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-sm font-semibold tracking-tight text-white leading-tight">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-xs text-neutral-300 mt-1 leading-relaxed break-words">
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Dismiss notification: ${toast.title}`}
        className="shrink-0 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  )
}
