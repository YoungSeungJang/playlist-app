import React from 'react'
import clsx from 'clsx'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  shape?: 'rounded' | 'pill'
  className?: string
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  shape = 'rounded',
  className,
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  }

  const shapeClasses = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        shapeClasses[shape],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge