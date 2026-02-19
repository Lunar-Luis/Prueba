import { X, CheckCircle, AlertTriangle } from 'lucide-react'
import React from 'react'

interface NotificationProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose
}) => {
  const isSuccess = type === 'success'
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100'
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800'
  const Icon = isSuccess ? CheckCircle : AlertTriangle

  if (!message) return null

  return (
    <div
      className={`fixed top-5 right-5 z-50 rounded-md p-4 shadow-lg ${bgColor} animate-fade-in-down`}
    >
      <div className='flex'>
        <div className='flex-shrink-0'>
          <Icon className={`h-5 w-5 ${textColor}`} aria-hidden='true' />
        </div>
        <div className='ml-3'>
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className='ml-auto pl-3'>
          <div className='-mx-1.5 -my-1.5'>
            <button
              onClick={onClose}
              type='button'
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSuccess
                  ? 'hover:bg-green-200 focus:ring-green-600 focus:ring-offset-green-50'
                  : 'hover:bg-red-200 focus:ring-red-600 focus:ring-offset-red-50'
              } ${textColor}`}
            >
              <X className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
