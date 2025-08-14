import React from 'react'
import clsx from 'clsx'

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'spinner' | 'dots' | 'bars'
  text?: string
  className?: string
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const renderSpinner = () => (
    <svg
      className={clsx('animate-spin text-primary-600', sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  const renderDots = () => (
    <div className={clsx('flex space-x-1', sizeClasses[size])}>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  )

  const renderBars = () => (
    <div className={clsx('flex items-end space-x-1', sizeClasses[size])}>
      <div className="w-1 bg-primary-600 animate-pulse" style={{ height: '60%', animationDelay: '0ms' }}></div>
      <div className="w-1 bg-primary-600 animate-pulse" style={{ height: '80%', animationDelay: '150ms' }}></div>
      <div className="w-1 bg-primary-600 animate-pulse" style={{ height: '100%', animationDelay: '300ms' }}></div>
      <div className="w-1 bg-primary-600 animate-pulse" style={{ height: '80%', animationDelay: '450ms' }}></div>
      <div className="w-1 bg-primary-600 animate-pulse" style={{ height: '60%', animationDelay: '600ms' }}></div>
    </div>
  )

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots()
      case 'bars':
        return renderBars()
      default:
        return renderSpinner()
    }
  }

  return (
    <div className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      {renderLoader()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default Loading