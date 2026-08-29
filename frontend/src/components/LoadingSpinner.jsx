import React from 'react'

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 border-4 border-sky-500 rounded-full" />
        <div className="absolute inset-0 border-4 border-transparent border-t-sky-500 rounded-full animate-spin" />
      </div>
      {text && <p className="text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  )
}
