import React from 'react'
import {
  Palette,
  Sun,
  Moon,
  Laptop,
  Check,
  Type,
  LayoutGrid,
  Eye,
  Sliders
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function AppearanceTab() {
  const { settings, updateField, addToast } = useSettings()
  const { appearance } = settings

  const themeOptions = [
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'High contrast obsidian slate palette for reduced eye strain.',
      icon: Moon,
      mockClass: 'mock-dark'
    },
    {
      id: 'light',
      label: 'Light Mode',
      desc: 'Clean, radiant paper-inspired design for bright workspaces.',
      icon: Sun,
      mockClass: 'mock-light'
    },
    {
      id: 'system',
      label: 'System Preference',
      desc: 'Automatically synchronizes with your OS appearance scheme.',
      icon: Laptop,
      mockClass: 'mock-system'
    }
  ]

  const accentColors = [
    { id: 'indigo', label: 'Indigo', color: '#6366f1' },
    { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'rose', label: 'Rose', color: '#f43f5e' },
    { id: 'amber', label: 'Amber', color: '#f59e0b' }
  ]

  const densities = [
    { id: 'compact', label: 'Compact' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'spacious', label: 'Spacious' }
  ]

  return (
    <div className="settings-content-area">
      <div className="section-header">
        <h2 className="section-title">Appearance &amp; Personalization</h2>
        <p className="section-desc">
          Customize the user interface aesthetic, color themes, interface density, and display scale.
        </p>
      </div>

      {/* Theme Cards */}
      <section className="settings-card" id="card-themes">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Sun size={18} /> Interface Theme
            </h3>
            <p className="card-subtitle">
              Select your preferred canvas color scheme.
            </p>
          </div>
        </div>

        <div className="theme-picker-grid">
          {themeOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = appearance.theme === opt.id
            return (
              <div
                key={opt.id}
                id={`theme-opt-${opt.id}`}
                className={`theme-card ${isActive ? 'active' : ''}`}
                onClick={() => {
                  updateField('appearance', 'theme', opt.id)
                  addToast(`Applied ${opt.label}`, 'info')
                }}
              >
                <div className={`theme-preview-mock ${opt.mockClass}`}>
                  <div className="mock-header" />
                  <div className="mock-body">
                    <div className="mock-side" />
                    <div className="mock-content" />
                  </div>
                </div>

                <div className="theme-card-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icon size={16} />
                    <span className="theme-card-title">{opt.label}</span>
                  </div>
                  {isActive && (
                    <span className="swatch-circle" style={{ background: 'var(--accent-primary)' }}>
                      <Check size={12} />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Accent Color Palette */}
      <section className="settings-card" id="card-accents">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Palette size={18} /> Accent Color
            </h3>
            <p className="card-subtitle">
              Select the vibrant highlight color for buttons, active pills, indicators, and focus rings.
            </p>
          </div>
        </div>

        <div className="accent-swatches">
          {accentColors.map((acc) => {
            const isActive = appearance.accent === acc.id
            return (
              <button
                key={acc.id}
                type="button"
                id={`accent-opt-${acc.id}`}
                className={`accent-swatch ${isActive ? 'active' : ''}`}
                onClick={() => {
                  updateField('appearance', 'accent', acc.id)
                  addToast(`Accent changed to ${acc.label}`, 'info')
                }}
              >
                <span className="swatch-circle" style={{ background: acc.color }}>
                  {isActive && <Check size={11} />}
                </span>
                <span>{acc.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* UI Density */}
      <section className="settings-card" id="card-density">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <LayoutGrid size={18} /> UI Layout Density
            </h3>
            <p className="card-subtitle">
              Adjust spacing, card padding, and button heights for higher information density or breathing room.
            </p>
          </div>
        </div>

        <div className="segmented-control" style={{ maxWidth: '420px' }}>
          {densities.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`segment-btn ${appearance.density === d.id ? 'active' : ''}`}
              onClick={() => {
                updateField('appearance', 'density', d.id)
                addToast(`Density set to ${d.label}`, 'info')
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </section>

      {/* Font Size Scaling & Accessibility */}
      <section className="settings-card" id="card-font-scale">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Type size={18} /> Font Sizing &amp; Accessibility
            </h3>
            <p className="card-subtitle">
              Scale base typography across the workspace for optimal legibility.
            </p>
          </div>
        </div>

        <div className="form-group" style={{ maxWidth: '480px' }}>
          <div className="form-label">
            <span>Base Font Size</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{appearance.fontSize}px</span>
          </div>
          <input
            type="range"
            min="13"
            max="18"
            step="1"
            value={appearance.fontSize}
            onChange={(e) => updateField('appearance', 'fontSize', Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>13px (Compact)</span>
            <span>15px (Default)</span>
            <span>18px (Large)</span>
          </div>
        </div>

        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-muted)',
            fontSize: `${appearance.fontSize}px`,
            border: '1px solid var(--border-subtle)'
          }}
        >
          <strong>Live Preview:</strong> The quick brown fox jumps over the lazy dog. Building intelligent AI-first experiences.
        </div>

        <div className="card-divider" />

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Reduce Motion</span>
            <span className="toggle-desc">
              Minimize animations and fluid spring effects across the UI. Recommended for motion sensitivity.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-reduce-motion"
              checked={appearance.reduceMotion}
              onChange={(e) => {
                updateField('appearance', 'reduceMotion', e.target.checked)
                addToast(e.target.checked ? 'Motion animations reduced' : 'Fluid animations enabled', 'info')
              }}
            />
            <span className="switch-slider" />
          </label>
        </div>
      </section>
    </div>
  )
}
