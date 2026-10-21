import React, { useRef } from 'react'
import { Upload, Trash2, Camera } from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'
import { UserSettingsForm } from '../settings/UserSettingsForm'
import { ToastProvider } from '../settings/ui/Toast'

export default function ProfileTab() {
  const {
    settings,
    updateField,
    presetAvatars,
    addToast,
  } = useSettings()

  const { profile } = settings
  const fileInputRef = useRef(null)

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        addToast('File size must be under 2MB', 'error')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        updateField('profile', 'avatar', reader.result)
        addToast('Profile photo updated successfully', 'success')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResetAvatar = () => {
    updateField('profile', 'avatar', presetAvatars[0])
    addToast('Avatar reset to default preset', 'info')
  }

  // Extract pure GitHub handle if a full URL was stored
  const githubHandle = (profile.github || '')
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/\/$/, '')

  const initialFormValues = {
    fullName: profile.displayName || `${profile.firstName} ${profile.lastName}`.trim(),
    username: profile.username || 'alexchen',
    email: profile.email || 'alex.chen@apexstudio.io',
    secondaryEmail: 'alex.backup@gmail.com',
    jobTitle: profile.role || 'Principal Staff Engineer',
    organization: profile.company || 'Apex Studio AI',
    bio: profile.bio || 'Building next-generation developer tooling, multi-agent workflows, and high-performance interactive web systems.',
    timezone: profile.timezone || 'America/Los_Angeles',
    country: 'US',
    website: profile.website || 'https://alexchen.dev',
    github: githubHandle || 'alexchen-dev',
    themePreference: settings.appearance?.theme || 'dark',
    profileVisibility: 'team',
    notifications: {
      securityAlerts: true,
      mentionNotifications: true,
      productUpdates: false,
      weeklyDigest: true,
    },
    twoFactorAuth: settings.security?.twoFactorEnabled ?? true,
  }

  const handleFormSaveSuccess = (data) => {
    // Sync with global SettingsContext
    const nameParts = data.fullName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    updateField('profile', 'firstName', firstName)
    updateField('profile', 'lastName', lastName)
    updateField('profile', 'displayName', data.fullName)
    updateField('profile', 'username', data.username)
    updateField('profile', 'email', data.email)
    updateField('profile', 'role', data.jobTitle)
    updateField('profile', 'company', data.organization)
    updateField('profile', 'bio', data.bio)
    updateField('profile', 'timezone', data.timezone)
    if (data.website) updateField('profile', 'website', data.website)
    if (data.github) updateField('profile', 'github', `https://github.com/${data.github}`)
  }

  return (
    <ToastProvider>
      <div className="space-y-8 pb-12">
        {/* Avatar Uploader Card */}
        <section
          aria-labelledby="card-avatar-heading"
          className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6"
        >
          <div className="border-b border-neutral-800 pb-3 mb-6">
            <h2 id="card-avatar-heading" className="text-base font-semibold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-400" aria-hidden="true" />
              <span>Profile Photo & Avatar</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Your avatar identifies your commits, agent sessions, and team reviews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <img
                src={profile.avatar}
                alt={`${profile.displayName || 'User'}'s avatar`}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-neutral-700 shadow-md group-hover:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change profile photo"
                className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl transition-opacity text-white text-xs font-medium cursor-pointer"
              >
                <Upload className="w-5 h-5 mb-1" aria-hidden="true" />
                <span>Upload</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarFileUpload}
              accept="image/*"
              className="sr-only"
              id="avatar-file-input"
              aria-label="Upload profile photo file"
            />

            <div className="space-y-4 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  id="btn-upload-avatar"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                >
                  <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Upload Image</span>
                </button>
                <button
                  type="button"
                  id="btn-reset-avatar"
                  onClick={handleResetAvatar}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <div>
                <span className="text-xs text-neutral-400 block mb-2 font-medium">
                  Or pick an instant preset avatar:
                </span>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  {presetAvatars.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateField('profile', 'avatar', url)
                        addToast('Preset avatar selected', 'info')
                      }}
                      aria-label={`Select preset avatar ${idx + 1}`}
                      className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                        profile.avatar === url
                          ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-sm'
                          : 'border-neutral-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Preset avatar option ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Production-Ready, Accessible User Settings Form */}
        <UserSettingsForm
          initialValues={initialFormValues}
          onSaveSuccess={handleFormSaveSuccess}
        />
      </div>
    </ToastProvider>
  )
}
