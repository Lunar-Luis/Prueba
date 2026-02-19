import React, { type InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  registration: Partial<UseFormRegisterReturn>
  error?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  registration,
  error,
  icon,
  ...props
}) => (
  <div>
    <label
      htmlFor={props.id}
      className='block text-sm font-medium text-gray-700'
    >
      {label}
    </label>
    <div className='relative mt-1'>
      {icon && (
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          {icon}
        </div>
      )}
      <input
        {...props}
        {...registration}
        className={`block h-12 w-full rounded-md border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm ${
          error ? 'border-red-500' : ''
        } ${icon ? 'pl-10' : ''}`}
      />
    </div>
    {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
  </div>
)
