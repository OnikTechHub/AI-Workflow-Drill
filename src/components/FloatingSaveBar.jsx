import React from 'react'
import { Save, RotateCcw, AlertCircle } from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function FloatingSaveBar() {
  const { hasUnsavedChanges, saveSettings, discardChanges } = useSettings()

  return (
    <div
      id="floating-save-bar"
      className={`floating-save-bar ${hasUnsavedChanges ? 'visible' : ''}`}
      role="region"
      aria-label="Pending changes action bar"
    >
      <div className="save-bar-info">
        <span className="save-bar-dot" />
        <span>You have unsaved changes</span>
      </div>

      <div className="save-bar-actions">
        <button
          type="button"
          id="btn-discard-changes"
          className="btn btn-sm btn-secondary"
          onClick={discardChanges}
        >
          <RotateCcw size={13} />
          Discard
        </button>
        <button
          type="button"
          id="btn-save-changes"
          className="btn btn-sm btn-primary"
          onClick={saveSettings}
        >
          <Save size={13} />
          Save Changes
        </button>
      </div>
    </div>
  )
}
