import React, { useState } from 'react'
import {
  Shield,
  KeyRound,
  QrCode,
  Smartphone,
  Laptop,
  Monitor,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Copy,
  LogOut,
  Trash2
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

export default function SecurityTab() {
  const { settings, updateField, updateSection, addToast } = useSettings()
  const { security } = settings

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  // 2FA Modal states
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false)
  const [totpCode, setTotpCode] = useState('')
  const [backupCodesModalOpen, setBackupCodesModalOpen] = useState(false)

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  // Calculate password strength
  const hasLength = newPassword.length >= 8
  const hasUpper = /[A-Z]/.test(newPassword)
  const hasLower = /[a-z]/.test(newPassword)
  const hasNumber = /[0-9]/.test(newPassword)
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword)

  const rulesPassed = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length

  let strengthLabel = 'Too Weak'
  let strengthClass = 'active-weak'
  if (rulesPassed === 0) {
    strengthLabel = 'None'
    strengthClass = ''
  } else if (rulesPassed <= 2) {
    strengthLabel = 'Weak'
    strengthClass = 'active-weak'
  } else if (rulesPassed === 3) {
    strengthLabel = 'Fair'
    strengthClass = 'active-fair'
  } else if (rulesPassed === 4) {
    strengthLabel = 'Good'
    strengthClass = 'active-good'
  } else if (rulesPassed === 5) {
    strengthLabel = 'Strong'
    strengthClass = 'active-strong'
  }

  const handleUpdatePassword = (e) => {
    e.preventDefault()
    if (!currentPassword) {
      addToast('Please enter your current password.', 'error')
      return
    }
    if (newPassword.length < 8) {
      addToast('New password must be at least 8 characters.', 'error')
      return
    }
    if (newPassword !== confirmPassword) {
      addToast('Passwords do not match.', 'error')
      return
    }
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    updateField('security', 'lastPasswordChange', 'Just now')
    addToast('Password successfully changed!', 'success')
  }

  const handleToggle2FA = () => {
    if (security.twoFactorEnabled) {
      updateField('security', 'twoFactorEnabled', false)
      addToast('Two-factor authentication disabled.', 'info')
    } else {
      setTwoFactorModalOpen(true)
    }
  }

  const handleVerify2FA = (e) => {
    e.preventDefault()
    if (totpCode.trim().length !== 6) {
      addToast('Enter a valid 6-digit verification code.', 'error')
      return
    }
    updateField('security', 'twoFactorEnabled', true)
    setTwoFactorModalOpen(false)
    setTotpCode('')
    addToast('Two-Factor Authentication is now ENABLED!', 'success')
  }

  const handleRevokeSession = (sessionId) => {
    const updated = security.sessions.filter((s) => s.id !== sessionId)
    updateField('security', 'sessions', updated)
    addToast('Device session revoked.', 'info')
  }

  const handleRevokeAllOther = () => {
    const current = security.sessions.filter((s) => s.isCurrent)
    updateField('security', 'sessions', current)
    addToast('All other active sessions have been terminated.', 'success')
  }

  const copySecret = () => {
    navigator.clipboard.writeText('APEX-8902-WK49-92XZ')
    addToast('Secret key copied to clipboard!', 'info')
  }

  const backupCodes = [
    '4920-8192', '9301-4481', '7219-0418',
    '3391-2940', '8571-0021', '6102-9934'
  ]

  return (
    <div className="settings-content-area">
      <div className="section-header">
        <h2 className="section-title">Security &amp; Authentication</h2>
        <p className="section-desc">
          Safeguard your account credentials, manage two-factor authentication, and inspect active device sessions.
        </p>
      </div>

      {/* Change Password Card */}
      <section className="settings-card" id="card-password">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <KeyRound size={18} /> Password Credentials
            </h3>
            <p className="card-subtitle">
              Last modified: {security.lastPasswordChange}. Choose a strong, memorable passphrase.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="current-pass">
              Current Password
            </label>
            <div className="form-input-wrap">
              <input
                type={showCurrent ? 'text' : 'password'}
                id="current-pass"
                className="form-input has-icon-right"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="input-icon-right"
                onClick={() => setShowCurrent(!showCurrent)}
                aria-label="Toggle password visibility"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="new-pass">
                New Password
              </label>
              <div className="form-input-wrap">
                <input
                  type={showNew ? 'text' : 'password'}
                  id="new-pass"
                  className="form-input has-icon-right"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowNew(!showNew)}
                  aria-label="Toggle new password visibility"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-pass">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirm-pass"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
              />
            </div>
          </div>

          {/* Strength Bar & Rules */}
          {newPassword && (
            <div className="password-meter-wrap">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Password Strength:</span>
                <span style={{ fontWeight: 600 }}>{strengthLabel}</span>
              </div>
              <div className="strength-bars">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`strength-segment ${
                      rulesPassed >= (step === 1 ? 1 : step === 2 ? 3 : step === 3 ? 4 : 5)
                        ? strengthClass
                        : ''
                    }`}
                  />
                ))}
              </div>

              <div className="password-rules">
                <span className={`rule-item ${hasLength ? 'valid' : ''}`}>
                  {hasLength ? <Check size={13} /> : <X size={13} />} At least 8 characters
                </span>
                <span className={`rule-item ${hasUpper ? 'valid' : ''}`}>
                  {hasUpper ? <Check size={13} /> : <X size={13} />} Uppercase letter (A-Z)
                </span>
                <span className={`rule-item ${hasLower ? 'valid' : ''}`}>
                  {hasLower ? <Check size={13} /> : <X size={13} />} Lowercase letter (a-z)
                </span>
                <span className={`rule-item ${hasNumber ? 'valid' : ''}`}>
                  {hasNumber ? <Check size={13} /> : <X size={13} />} Numerical digit (0-9)
                </span>
                <span className={`rule-item ${hasSpecial ? 'valid' : ''}`}>
                  {hasSpecial ? <Check size={13} /> : <X size={13} />} Special character (!@#$)
                </span>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              id="btn-update-password"
              className="btn btn-primary"
              disabled={!newPassword || newPassword !== confirmPassword}
              style={{ opacity: !newPassword || newPassword !== confirmPassword ? 0.6 : 1 }}
            >
              Update Password
            </button>
          </div>
        </form>
      </section>

      {/* Two-Factor Authentication Card */}
      <section className="settings-card" id="card-2fa">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Shield size={18} /> Two-Factor Authentication (2FA)
            </h3>
            <p className="card-subtitle">
              Add a mandatory extra verification step when logging in from unrecognized devices.
            </p>
          </div>
          {security.twoFactorEnabled ? (
            <span className="nav-badge-pill success">Protected</span>
          ) : (
            <span className="nav-badge-pill warning">Not Configured</span>
          )}
        </div>

        <div className="toggle-row">
          <div className="toggle-info">
            <span className="toggle-title">Authenticator App (TOTP)</span>
            <span className="toggle-desc">
              Generate 6-digit one-time codes using Google Authenticator, 1Password, or Authy.
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              id="switch-2fa"
              checked={security.twoFactorEnabled}
              onChange={handleToggle2FA}
            />
            <span className="switch-slider" />
          </label>
        </div>

        {security.twoFactorEnabled && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setBackupCodesModalOpen(true)}
            >
              View Backup Recovery Codes
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setTwoFactorModalOpen(true)}
            >
              Reconfigure Authenticator
            </button>
          </div>
        )}
      </section>

      {/* Active Device Sessions */}
      <section className="settings-card" id="card-sessions">
        <div className="card-title-group">
          <div>
            <h3 className="card-title">
              <Monitor size={18} /> Active Device Sessions
            </h3>
            <p className="card-subtitle">
              Logged in devices currently authenticated with your workspace session token.
            </p>
          </div>
          {security.sessions.length > 1 && (
            <button
              type="button"
              id="btn-revoke-all"
              className="btn btn-sm btn-secondary"
              onClick={handleRevokeAllOther}
            >
              <LogOut size={13} />
              Revoke Others
            </button>
          )}
        </div>

        <div className="sessions-list">
          {security.sessions.map((sess) => {
            const Icon = sess.type === 'mobile' ? Smartphone : sess.type === 'laptop' ? Laptop : Monitor
            return (
              <div key={sess.id} className="session-item">
                <div className="session-left">
                  <div className="session-icon">
                    <Icon size={20} />
                  </div>
                  <div className="session-info">
                    <div className="session-title">
                      {sess.device}
                      {sess.isCurrent && <span className="current-badge">This Device</span>}
                    </div>
                    <div className="session-meta">
                      {sess.location} • {sess.ip} • <span style={{ color: sess.isCurrent ? 'var(--color-success)' : 'inherit' }}>{sess.lastActive}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleRevokeSession(sess.id)}
                    title="Terminate this session"
                  >
                    Revoke
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="settings-card danger-card" id="card-danger-zone">
        <div className="card-title-group">
          <div>
            <h3 className="card-title" style={{ color: 'var(--color-danger)' }}>
              <AlertTriangle size={18} /> Danger Zone
            </h3>
            <p className="card-subtitle">
              Irreversible account actions. Please proceed with caution.
            </p>
          </div>
        </div>

        <div className="danger-action-row">
          <div>
            <div className="toggle-title">Temporarily Deactivate Account</div>
            <div className="toggle-desc">
              Hide your profile and pause all notifications. You can reactivate anytime.
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => addToast('Deactivation instructions sent to your email.', 'info')}
          >
            Deactivate
          </button>
        </div>

        <div className="danger-action-row">
          <div>
            <div className="toggle-title" style={{ color: 'var(--color-danger)' }}>
              Permanently Delete Account
            </div>
            <div className="toggle-desc">
              Permanently remove your personal workspace data, projects, and active sessions.
            </div>
          </div>
          <button
            type="button"
            id="btn-delete-account"
            className="btn btn-sm btn-danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            <Trash2 size={13} />
            Delete Account
          </button>
        </div>
      </section>

      {/* 2FA Setup Modal */}
      {twoFactorModalOpen && (
        <div className="modal-backdrop" onClick={() => setTwoFactorModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <QrCode size={18} /> Set Up Authenticator App
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setTwoFactorModalOpen(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleVerify2FA}>
              <div className="modal-body">
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  1. Scan this QR code with Google Authenticator, 1Password, or Authy on your mobile device:
                </p>

                <div className="qr-preview-box">
                  <svg className="qr-code-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="10" y="10" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="14" y="14" width="20" height="20" rx="2" fill="white" />
                    <rect x="18" y="18" width="12" height="12" rx="1" fill="#0f172a" />

                    <rect x="62" y="10" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="66" y="14" width="20" height="20" rx="2" fill="white" />
                    <rect x="70" y="18" width="12" height="12" rx="1" fill="#0f172a" />

                    <rect x="10" y="62" width="28" height="28" rx="4" fill="#0f172a" />
                    <rect x="14" y="66" width="20" height="20" rx="2" fill="white" />
                    <rect x="18" y="70" width="12" height="12" rx="1" fill="#0f172a" />

                    {/* Data matrix dots */}
                    <rect x="44" y="14" width="6" height="6" fill="#0f172a" />
                    <rect x="52" y="24" width="6" height="6" fill="#0f172a" />
                    <rect x="46" y="34" width="8" height="8" fill="#6366f1" />
                    <rect x="14" y="44" width="6" height="6" fill="#0f172a" />
                    <rect x="26" y="48" width="6" height="6" fill="#0f172a" />
                    <rect x="36" y="44" width="8" height="8" fill="#0f172a" />
                    <rect x="48" y="48" width="6" height="6" fill="#0f172a" />
                    <rect x="60" y="44" width="8" height="8" fill="#0f172a" />
                    <rect x="74" y="48" width="6" height="6" fill="#0f172a" />
                    <rect x="44" y="64" width="6" height="6" fill="#0f172a" />
                    <rect x="54" y="70" width="8" height="8" fill="#0f172a" />
                    <rect x="68" y="64" width="6" height="6" fill="#0f172a" />
                    <rect x="80" y="74" width="8" height="8" fill="#0f172a" />
                  </svg>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Or enter secret code manually:
                </div>
                <div className="secret-key-display">
                  <span>APEX-8902-WK49-92XZ</span>
                  <button
                    type="button"
                    onClick={copySecret}
                    className="btn-ghost"
                    title="Copy Key"
                    style={{ padding: '4px' }}
                  >
                    <Copy size={14} />
                  </button>
                </div>

                <div className="form-group" style={{ marginTop: '0.5rem' }}>
                  <label className="form-label" htmlFor="totp-input">
                    2. Enter 6-digit confirmation code:
                  </label>
                  <input
                    type="text"
                    id="totp-input"
                    className="form-input"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    style={{ textAlign: 'center', fontSize: '1.25rem', letterSpacing: '6px' }}
                    autoFocus
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setTwoFactorModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Verify &amp; Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backup Codes Modal */}
      {backupCodesModalOpen && (
        <div className="modal-backdrop" onClick={() => setBackupCodesModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                <Shield size={18} /> Two-Factor Backup Codes
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setBackupCodesModalOpen(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Keep these one-time recovery codes in a secure password manager. Each code can only be used once if you lose access to your authenticator app.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  background: 'var(--bg-muted)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem'
                }}
              >
                {backupCodes.map((code, idx) => (
                  <div key={idx} style={{ color: 'var(--text-primary)', padding: '4px 0' }}>
                    {idx + 1}. {code}
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join('\n'))
                  addToast('Backup codes copied!', 'info')
                }}
              >
                <Copy size={14} /> Copy All
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setBackupCodesModalOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-backdrop" onClick={() => setDeleteModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: 'var(--color-danger)' }}>
                <AlertTriangle size={18} /> Delete Account Permanently
              </h3>
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setDeleteModalOpen(false)}
                style={{ padding: '4px' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                This action is irreversible. All of your personal workspace tokens, project data, and preferences will be permanently wiped.
              </p>
              <div className="form-group">
                <label className="form-label" htmlFor="delete-confirm-input">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  id="delete-confirm-input"
                  className="form-input"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  autoFocus
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={deleteConfirmText !== 'DELETE'}
                style={{ opacity: deleteConfirmText === 'DELETE' ? 1 : 0.5 }}
                onClick={() => {
                  setDeleteModalOpen(false)
                  addToast('Account scheduled for immediate deletion.', 'error')
                }}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
