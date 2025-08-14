import React from 'react'
import clsx from 'clsx'

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  showOnline?: boolean
  className?: string
  onClick?: () => void
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle',
  showOnline = false,
  className,
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  }

  const onlineDotSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Generate background color based on name
  const getBackgroundColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
    ]
    
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div
        className={clsx(
          'flex items-center justify-center font-medium',
          sizeClasses[size],
          {
            'rounded-full': shape === 'circle',
            'rounded-lg': shape === 'square',
            'cursor-pointer hover:opacity-80 transition-opacity': onClick,
          },
          src ? 'overflow-hidden' : name ? getBackgroundColor(name) : 'bg-gray-300'
        )}
        onClick={onClick}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : name ? (
          <span className="text-white font-semibold">
            {getInitials(name)}
          </span>
        ) : (
          <svg
            className="w-2/3 h-2/3 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </div>
      
      {/* Online indicator */}
      {showOnline && (
        <div
          className={clsx(
            'absolute -bottom-0 -right-0 border-2 border-white rounded-full bg-green-500',
            onlineDotSizes[size]
          )}
        />
      )}
    </div>
  )
}

export default Avatar