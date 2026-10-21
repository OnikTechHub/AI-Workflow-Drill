import React from 'react'
import { UserSettingsForm } from '../../components/settings/UserSettingsForm'
import { ToastProvider } from '../../components/settings/ui/Toast'

export const metadata = {
  title: 'User Settings — Apex Studio',
  description: 'Manage personal profile, email communication, security alerts, and system preferences with full accessibility and strict validation.',
}

export default function SettingsPage() {
  return (
    <ToastProvider>
      <main className="min-h-screen bg-neutral-950 text-neutral-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <UserSettingsForm />
        </div>
      </main>
    </ToastProvider>
  )
}
