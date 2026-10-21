import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Toast() {
  const { toasts, removeToast } = useSettings()

  if (!toasts || toasts.length === 0) return null

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2
        let typeClass = 'toast-success'
        if (toast.type === 'error') {
          Icon = AlertCircle
          typeClass = 'toast-error'
        } else if (toast.type === 'info') {
          Icon = Info
          typeClass = 'toast-info'
        }

        return (
          <div key={toast.id} className={`toast ${typeClass}`}>
            <Icon size={16} />
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="btn-ghost"
              style={{ padding: '2px', marginLeft: '4px' }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
