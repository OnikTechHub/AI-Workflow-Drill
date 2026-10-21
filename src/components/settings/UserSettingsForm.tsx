'use client'

import React, { useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  User,
  Mail,
  Building,
  Briefcase,
  Globe,
  Bell,
  Palette,
  Loader2,
  AlertOctagon,
  RotateCcw,
  Save,
  CheckCircle2,
  Sliders,
} from 'lucide-react'

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
)

import {
  userSettingsSchema,
  defaultUserSettings,
  type UserSettingsFormData,
} from './schemas/userSettingsSchema'
import {
  TextInput,
  Textarea,
  SelectInput,
  SwitchToggle,
} from './ui/FormControls'
import { useToast } from './ui/Toast'

const TIMEZONE_OPTIONS = [
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada) — UTC-8' },
  { value: 'America/Denver', label: 'Mountain Time (US & Canada) — UTC-7' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada) — UTC-6' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada) — UTC-5' },
  { value: 'Europe/London', label: 'London, Dublin, Lisbon — UTC+0' },
  { value: 'Europe/Berlin', label: 'Berlin, Paris, Amsterdam — UTC+1' },
  { value: 'Asia/Dubai', label: 'Dubai, Abu Dhabi — UTC+4' },
  { value: 'Asia/Dhaka', label: 'Dhaka, Almaty — UTC+6' },
  { value: 'Asia/Singapore', label: 'Singapore, Hong Kong, Beijing — UTC+8' },
  { value: 'Asia/Tokyo', label: 'Tokyo, Seoul — UTC+9' },
  { value: 'Australia/Sydney', label: 'Sydney, Melbourne — UTC+11' },
]

const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AU', label: 'Australia' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'IN', label: 'India' },
]

interface UserSettingsFormProps {
  initialValues?: Partial<UserSettingsFormData>
  onSaveSuccess?: (data: UserSettingsFormData) => void
  className?: string
}

export function UserSettingsForm({
  initialValues,
  onSaveSuccess,
  className = '',
}: UserSettingsFormProps) {
  const toast = useToast()
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'preferences'>('profile')
  const [simulateServerFailure, setSimulateServerFailure] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // React Hook Form with strict Zod validation
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserSettingsFormData>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      ...defaultUserSettings,
      ...initialValues,
    },
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true, // Automatically moves keyboard focus to the first invalid field
  })

  // Watch username for live preview in description
  const watchedUsername = watch('username')

  // Simulated Production API call handling edge cases like network failure & email conflicts
  const onSubmit = async (data: UserSettingsFormData) => {
    setSubmissionError(null)

    try {
      // Simulate network round-trip latency
      await new Promise((resolve) => setTimeout(resolve, 1100))

      // Edge case simulation: user toggled "Simulate Server Failure"
      if (simulateServerFailure) {
        throw new Error(
          'HTTP 500: Database transaction failed while persisting user configuration. Please retry.'
        )
      }

      // Edge case simulation: conflict check on reserved domains/usernames
      if (data.email.toLowerCase().includes('duplicate') || data.email.toLowerCase().includes('conflict')) {
        setError('email', {
          type: 'server',
          message: 'This email address is already associated with another active workspace organization.',
        })
        throw new Error('Email conflict detected.')
      }

      // Reset form dirty state with new saved data
      reset(data)

      // Notify user via accessible toast
      toast.success(
        'Settings Saved Successfully',
        'Your profile details and workspace preferences have been updated.'
      )

      onSaveSuccess?.(data)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unexpected error occurred during submission.'

      setSubmissionError(errorMessage)

      // Dispatch high-visibility error toast
      toast.error('Failed to Save Settings', errorMessage)
    }
  }

  const handleResetForm = () => {
    startTransition(() => {
      reset(defaultUserSettings)
      setSubmissionError(null)
      clearErrors()
      toast.info('Form Reset', 'All settings have been reverted to default values.')
    })
  }

  const isLoading = isSubmitting || isPending

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Top Controls / Section Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-indigo-400" aria-hidden="true" />
            <span>Account & Workspace Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your personal identity, contact endpoints, notification rules, and accessibility preferences.
          </p>
        </div>

        {/* Edge Case Testing Switch */}
        <div className="flex items-center gap-3 bg-neutral-900/90 border border-neutral-800 px-3.5 py-2 rounded-xl shrink-0">
          <label
            htmlFor="simulate-failure-toggle"
            className="text-xs text-neutral-300 font-medium cursor-pointer select-none"
          >
            Simulate Server Error
          </label>
          <input
            id="simulate-failure-toggle"
            type="checkbox"
            checked={simulateServerFailure}
            onChange={(e) => setSimulateServerFailure(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-700 text-rose-500 focus:ring-rose-500 focus:ring-offset-neutral-900 cursor-pointer"
            aria-label="Toggle submission failure simulation"
          />
        </div>
      </div>

      {/* Accessible Navigation Tabs */}
      <nav
        aria-label="Settings Sections"
        className="flex items-center gap-2 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto"
      >
        <button
          type="button"
          onClick={() => setActiveSection('profile')}
          aria-selected={activeSection === 'profile'}
          role="tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSection === 'profile'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          <span>Profile & Identity</span>
          {Boolean(
            errors.fullName ||
              errors.username ||
              errors.email ||
              errors.secondaryEmail ||
              errors.jobTitle ||
              errors.organization ||
              errors.bio
          ) && (
            <span
              className="w-2 h-2 rounded-full bg-rose-400"
              title="Section contains errors"
              aria-label="Has validation errors"
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('notifications')}
          aria-selected={activeSection === 'notifications'}
          role="tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSection === 'notifications'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span>Notifications & Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('preferences')}
          aria-selected={activeSection === 'preferences'}
          role="tab"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            activeSection === 'preferences'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
          }`}
        >
          <Palette className="w-4 h-4" aria-hidden="true" />
          <span>Theme & Privacy</span>
        </button>
      </nav>

      {/* Submission Failure Alert Banner (Screen reader & visual) */}
      {submissionError && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 rounded-xl border border-rose-500/50 bg-rose-950/30 text-rose-200 flex items-start gap-3.5 animate-in fade-in slide-in-from-top-1"
        >
          <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1 text-sm">
            <h2 className="font-semibold text-rose-100">Submission Failure</h2>
            <p className="mt-0.5 text-xs text-rose-300 leading-relaxed">
              {submissionError}
            </p>
            <p className="mt-2 text-xs text-rose-400">
              Please review any highlighted fields or toggle off "Simulate Server Error" before retrying.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionError(null)}
            className="text-xs text-rose-400 hover:text-rose-200 underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Controlled Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="User Settings Configuration Form"
        className="space-y-8"
      >
        {/* ========================================================================= */}
        {/* SECTION 1: Profile & Identity */}
        {/* ========================================================================= */}
        {activeSection === 'profile' && (
          <div className="space-y-6">
            <section
              aria-labelledby="section-personal-details"
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6"
            >
              <div className="border-b border-neutral-800 pb-3">
                <h2 id="section-personal-details" className="text-base font-semibold text-white">
                  Personal Details
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Your core identity visible to teammates across workspaces and project boards.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-fullName"
                      label="Full Name"
                      required
                      placeholder="e.g. Alex Chen"
                      autoComplete="name"
                      error={errors.fullName?.message}
                      leadingIcon={<User className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />

                {/* Username */}
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-username"
                      label="Username"
                      required
                      placeholder="handle"
                      autoComplete="username"
                      prefixText="apex.io/@"
                      description={
                        watchedUsername
                          ? `Public profile URL: apex.io/@${watchedUsername}`
                          : 'Lowercase letters, numbers, hyphens, and underscores only'
                      }
                      error={errors.username?.message}
                    />
                  )}
                />
              </div>

              {/* Bio */}
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="field-bio"
                    label="Professional Bio"
                    required
                    maxLength={240}
                    placeholder="Brief description of your expertise, current projects, and focus areas..."
                    description="Keep it between 10 and 240 characters."
                    error={errors.bio?.message}
                  />
                )}
              />
            </section>

            {/* Email & Contact Endpoints */}
            <section
              aria-labelledby="section-contact-info"
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6"
            >
              <div className="border-b border-neutral-800 pb-3">
                <h2 id="section-contact-info" className="text-base font-semibold text-white">
                  Contact & Communication
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Primary and secondary email addresses for alerts, account recovery, and verification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Primary Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-email"
                      type="email"
                      label="Primary Work Email"
                      required
                      placeholder="alex.chen@company.com"
                      autoComplete="email"
                      description="Used for security notices and primary workspace login"
                      error={errors.email?.message}
                      leadingIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />

                {/* Secondary Email */}
                <Controller
                  name="secondaryEmail"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-secondaryEmail"
                      type="email"
                      label="Backup Recovery Email"
                      optional
                      placeholder="personal@domain.com"
                      description="Must be different from your primary work email"
                      error={errors.secondaryEmail?.message}
                      leadingIcon={<Mail className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Job Title */}
                <Controller
                  name="jobTitle"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-jobTitle"
                      label="Job Title / Role"
                      required
                      placeholder="e.g. Principal Staff Engineer"
                      error={errors.jobTitle?.message}
                      leadingIcon={<Briefcase className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />

                {/* Organization */}
                <Controller
                  name="organization"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-organization"
                      label="Organization / Company"
                      required
                      placeholder="e.g. Apex Studio"
                      error={errors.organization?.message}
                      leadingIcon={<Building className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />
              </div>
            </section>

            {/* Regional & Social Links */}
            <section
              aria-labelledby="section-regional"
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6"
            >
              <div className="border-b border-neutral-800 pb-3">
                <h2 id="section-regional" className="text-base font-semibold text-white">
                  Regional & Web Presence
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Helps coordinate meetings with teammates across global timezones.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Controller
                  name="timezone"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      id="field-timezone"
                      label="Active Timezone"
                      required
                      options={TIMEZONE_OPTIONS}
                      error={errors.timezone?.message}
                    />
                  )}
                />

                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      id="field-country"
                      label="Country / Region"
                      required
                      options={COUNTRY_OPTIONS}
                      error={errors.country?.message}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Controller
                  name="website"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-website"
                      type="url"
                      label="Personal Website"
                      optional
                      placeholder="https://yourdomain.com"
                      error={errors.website?.message}
                      leadingIcon={<Globe className="w-4 h-4" aria-hidden="true" />}
                    />
                  )}
                />

                <Controller
                  name="github"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="field-github"
                      label="GitHub Handle"
                      optional
                      placeholder="username"
                      prefixText="github.com/"
                      error={errors.github?.message}
                      leadingIcon={<GithubIcon className="w-4 h-4" />}
                    />
                  )}
                />
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: Notifications & Alerts */}
        {/* ========================================================================= */}
        {activeSection === 'notifications' && (
          <section
            aria-labelledby="section-notifications-title"
            className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-6"
          >
            <div className="border-b border-neutral-800 pb-3">
              <h2 id="section-notifications-title" className="text-base font-semibold text-white">
                Notification Cadence & Alert Delivery
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Choose how and when you receive activity alerts and security notices.
              </p>
            </div>

            <fieldset className="space-y-4">
              <legend className="sr-only">Notification Channel Preferences</legend>

              {/* Security Alerts (Mandatory) */}
              <Controller
                name="notifications.securityAlerts"
                control={control}
                render={({ field }) => (
                  <SwitchToggle
                    id="notif-security"
                    label="Security & Authentication Alerts"
                    badge="Mandatory"
                    description="Instant alerts for password changes, new device logins, and API token generation. This cannot be disabled for workspace security."
                    checked={field.value}
                    onChange={field.onChange}
                    disabled={true}
                    error={errors.notifications?.securityAlerts?.message}
                  />
                )}
              />

              {/* Team Mentions */}
              <Controller
                name="notifications.mentionNotifications"
                control={control}
                render={({ field }) => (
                  <SwitchToggle
                    id="notif-mentions"
                    label="Team Mentions & Direct Replies"
                    description="Receive desktop and email notifications whenever you are directly @tagged in pull requests or threads."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Weekly Digest */}
              <Controller
                name="notifications.weeklyDigest"
                control={control}
                render={({ field }) => (
                  <SwitchToggle
                    id="notif-digest"
                    label="Weekly Workspace Analytics Digest"
                    description="Receive a consolidated summary of repository activity, code reviews, and agent metrics every Monday morning."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {/* Product Updates */}
              <Controller
                name="notifications.productUpdates"
                control={control}
                render={({ field }) => (
                  <SwitchToggle
                    id="notif-product"
                    label="Product Feature Changelogs"
                    description="Get notified when new agent tools and workflow capabilities are launched in Apex Studio."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </fieldset>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: Theme, Security & Privacy */}
        {/* ========================================================================= */}
        {activeSection === 'preferences' && (
          <div className="space-y-6">
            {/* Theme Preference */}
            <section
              aria-labelledby="section-theme-title"
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="border-b border-neutral-800 pb-3">
                <h2 id="section-theme-title" className="text-base font-semibold text-white">
                  Interface Appearance
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Select your default interface display mode.
                </p>
              </div>

              <Controller
                name="themePreference"
                control={control}
                render={({ field }) => (
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium text-neutral-300">
                      Theme Mode
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        { id: 'dark', label: 'Dark Mode (Obsidian)', desc: 'High contrast for developer focus' },
                        { id: 'light', label: 'Light Mode (Clean)', desc: 'Bright background for daytime work' },
                        { id: 'system', label: 'System Auto', desc: 'Syncs with your operating system' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                            field.value === item.id
                              ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500'
                              : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-100">
                              {item.label}
                            </span>
                            <input
                              type="radio"
                              name="themePreference"
                              value={item.id}
                              checked={field.value === item.id}
                              onChange={() => field.onChange(item.id)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <span className="text-xs text-neutral-400 mt-1">
                            {item.desc}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              />
            </section>

            {/* Profile Visibility */}
            <section
              aria-labelledby="section-visibility-title"
              className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-5"
            >
              <div className="border-b border-neutral-800 pb-3">
                <h2 id="section-visibility-title" className="text-base font-semibold text-white">
                  Privacy & Data Exposure
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Control who can discover your profile and view your assigned workflows.
                </p>
              </div>

              <Controller
                name="profileVisibility"
                control={control}
                render={({ field }) => (
                  <fieldset className="space-y-2">
                    <legend className="text-xs font-medium text-neutral-300">
                      Profile Discoverability Level
                    </legend>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {[
                        { id: 'public', label: 'Public', desc: 'Visible to anyone on the web' },
                        { id: 'team', label: 'Team Only', desc: 'Visible only to confirmed workspace members' },
                        { id: 'private', label: 'Private', desc: 'Hidden from public team directory' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex flex-col p-3.5 rounded-xl border cursor-pointer transition-all ${
                            field.value === item.id
                              ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500'
                              : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-neutral-100">
                              {item.label}
                            </span>
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={item.id}
                              checked={field.value === item.id}
                              onChange={() => field.onChange(item.id)}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <span className="text-xs text-neutral-400 mt-1">
                            {item.desc}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              />

              {/* Two Factor Authentication */}
              <Controller
                name="twoFactorAuth"
                control={control}
                render={({ field }) => (
                  <SwitchToggle
                    id="pref-2fa"
                    label="Enforce Two-Factor Authentication (2FA)"
                    description="Require a TOTP verification code on all new browser sessions and device sign-ins."
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Sticky Form Action Footer */}
        {/* ========================================================================= */}
        <div className="sticky bottom-4 z-40 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/60 px-3 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Unsaved changes pending
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                All changes saved
              </span>
            )}

            {Object.keys(errors).length > 0 && (
              <span
                role="status"
                className="text-xs font-semibold text-rose-400 bg-rose-950/50 border border-rose-800/50 px-2.5 py-1 rounded-full"
              >
                {Object.keys(errors).length} invalid {Object.keys(errors).length === 1 ? 'field' : 'fields'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Reset / Discard Button */}
            <button
              type="button"
              onClick={handleResetForm}
              disabled={isLoading || !isDirty}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700/80 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Discard Changes</span>
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-950/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>Saving Preferences...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" aria-hidden="true" />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
