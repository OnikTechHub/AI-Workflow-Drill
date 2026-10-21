'use client'

import React, { forwardRef, useId } from 'react'
import { AlertCircle, Check } from 'lucide-react'

// ==========================================
// FormField Wrapper
// ==========================================
export interface FormFieldProps {
  id?: string
  label: string
  required?: boolean
  optional?: boolean
  description?: string
  error?: string
  className?: string
  children: (props: {
    id: string
    describedBy: string
    isInvalid: boolean
  }) => React.ReactNode
}

export function FormField({
  id: propId,
  label,
  required = false,
  optional = false,
  description,
  error,
  className = '',
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const id = propId || generatedId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const describedByParts: string[] = []
  if (description) describedByParts.push(hintId)
  if (error) describedByParts.push(errorId)
  const describedBy = describedByParts.join(' ')

  const isInvalid = Boolean(error)

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-neutral-200 flex items-center gap-1.5 cursor-pointer select-none"
        >
          <span>{label}</span>
          {required && (
            <>
              <span aria-hidden="true" className="text-rose-400 font-bold">*</span>
              <span className="sr-only">(required)</span>
            </>
          )}
          {optional && (
            <span className="text-xs text-neutral-400 font-normal">
              (optional)
            </span>
          )}
        </label>
      </div>

      {description && (
        <p id={hintId} className="text-xs text-neutral-400 leading-normal">
          {description}
        </p>
      )}

      {children({ id, describedBy, isInvalid })}

      {error && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-1.5 text-xs font-medium text-rose-400 mt-1 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// ==========================================
// Controlled TextInput
// ==========================================
export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string
  label?: string
  required?: boolean
  optional?: boolean
  description?: string
  error?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  prefixText?: string
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      id: propId,
      label,
      required,
      optional,
      description,
      error,
      leadingIcon,
      trailingIcon,
      prefixText,
      className = '',
      value,
      disabled,
      ...rest
    },
    ref
  ) => {
    const inputContent = ({
      id,
      describedBy,
      isInvalid,
    }: {
      id: string
      describedBy: string
      isInvalid: boolean
    }) => (
      <div className="relative flex items-center rounded-lg shadow-sm">
        {prefixText && (
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-neutral-700 bg-neutral-800 text-neutral-400 text-xs sm:text-sm select-none h-10">
            {prefixText}
          </span>
        )}
        {leadingIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-neutral-400">
            {leadingIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          value={value ?? ''}
          aria-invalid={isInvalid ? 'true' : 'false'}
          aria-required={required ? 'true' : 'false'}
          aria-describedby={describedBy || undefined}
          className={`w-full h-10 px-3 text-sm bg-neutral-900 border rounded-lg text-neutral-100 placeholder:text-neutral-500 transition-colors
            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950
            disabled:opacity-60 disabled:cursor-not-allowed
            ${leadingIcon ? 'pl-9' : ''}
            ${trailingIcon ? 'pr-9' : ''}
            ${prefixText ? 'rounded-l-none' : ''}
            ${
              isInvalid
                ? 'border-rose-500/80 focus-visible:ring-rose-500 text-rose-100 bg-rose-950/10'
                : 'border-neutral-700/80 hover:border-neutral-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500'
            }
            ${className}`}
          {...rest}
        />
        {trailingIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-neutral-400">
            {trailingIcon}
          </div>
        )}
      </div>
    )

    if (label) {
      return (
        <FormField
          id={propId}
          label={label}
          required={required}
          optional={optional}
          description={description}
          error={error}
        >
          {inputContent}
        </FormField>
      )
    }

    return inputContent({
      id: propId || 'input',
      describedBy: description ? `${propId}-hint` : '',
      isInvalid: Boolean(error),
    })
  }
)
TextInput.displayName = 'TextInput'

// ==========================================
// Controlled Textarea
// ==========================================
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id?: string
  label?: string
  required?: boolean
  optional?: boolean
  description?: string
  error?: string
  maxLength?: number
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      id: propId,
      label,
      required,
      optional,
      description,
      error,
      maxLength,
      className = '',
      value,
      disabled,
      ...rest
    },
    ref
  ) => {
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <FormField
        id={propId}
        label={label || ''}
        required={required}
        optional={optional}
        description={description}
        error={error}
      >
        {({ id, describedBy, isInvalid }) => (
          <div className="relative">
            <textarea
              ref={ref}
              id={id}
              disabled={disabled}
              value={value ?? ''}
              maxLength={maxLength}
              aria-invalid={isInvalid ? 'true' : 'false'}
              aria-required={required ? 'true' : 'false'}
              aria-describedby={describedBy || undefined}
              className={`w-full min-h-[96px] p-3 text-sm bg-neutral-900 border rounded-lg text-neutral-100 placeholder:text-neutral-500 transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950
                disabled:opacity-60 disabled:cursor-not-allowed resize-y
                ${
                  isInvalid
                    ? 'border-rose-500/80 focus-visible:ring-rose-500 text-rose-100 bg-rose-950/10'
                    : 'border-neutral-700/80 hover:border-neutral-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500'
                }
                ${className}`}
              {...rest}
            />
            {maxLength && (
              <div
                aria-live="polite"
                className="flex justify-end mt-1 text-[11px] text-neutral-400 select-none"
              >
                <span
                  className={
                    currentLength >= maxLength ? 'text-amber-400 font-semibold' : ''
                  }
                >
                  {currentLength} / {maxLength}
                </span>
                <span className="sr-only">characters used</span>
              </div>
            )}
          </div>
        )}
      </FormField>
    )
  }
)
Textarea.displayName = 'Textarea'

// ==========================================
// Controlled Select
// ==========================================
export interface SelectOption {
  value: string
  label: string
}

export interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id?: string
  label?: string
  required?: boolean
  optional?: boolean
  description?: string
  error?: string
  options: SelectOption[]
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      id: propId,
      label,
      required,
      optional,
      description,
      error,
      options,
      className = '',
      value,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <FormField
        id={propId}
        label={label || ''}
        required={required}
        optional={optional}
        description={description}
        error={error}
      >
        {({ id, describedBy, isInvalid }) => (
          <div className="relative">
            <select
              ref={ref}
              id={id}
              disabled={disabled}
              value={value ?? ''}
              aria-invalid={isInvalid ? 'true' : 'false'}
              aria-required={required ? 'true' : 'false'}
              aria-describedby={describedBy || undefined}
              className={`w-full h-10 px-3 pr-8 text-sm bg-neutral-900 border rounded-lg text-neutral-100 appearance-none cursor-pointer transition-colors
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-neutral-950
                disabled:opacity-60 disabled:cursor-not-allowed
                ${
                  isInvalid
                    ? 'border-rose-500/80 focus-visible:ring-rose-500 text-rose-100 bg-rose-950/10'
                    : 'border-neutral-700/80 hover:border-neutral-600 focus-visible:border-indigo-500 focus-visible:ring-indigo-500'
                }
                ${className}`}
              {...rest}
            >
              {options.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-neutral-900 text-neutral-100"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-neutral-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        )}
      </FormField>
    )
  }
)
SelectInput.displayName = 'SelectInput'

// ==========================================
// Accessible Switch Toggle
// ==========================================
export interface SwitchToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  error?: string
  badge?: string
}

export function SwitchToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  error,
  badge,
}: SwitchToggleProps) {
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onChange(!checked)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor={id}
            onClick={() => !disabled && onChange(!checked)}
            className={`text-sm font-medium cursor-pointer select-none ${
              disabled ? 'text-neutral-500 cursor-not-allowed' : 'text-neutral-200'
            }`}
          >
            {label}
          </label>
          {badge && (
            <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <p id={hintId} className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
            {description}
          </p>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium"
          >
            <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        id={id}
        aria-checked={checked}
        aria-disabled={disabled}
        aria-describedby={
          [description ? hintId : '', error ? errorId : '']
            .filter(Boolean)
            .join(' ') || undefined
        }
        disabled={disabled}
        onClick={() => onChange(!checked)}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
          disabled:cursor-not-allowed disabled:opacity-50
          ${checked ? 'bg-indigo-600' : 'bg-neutral-700'}`}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}
