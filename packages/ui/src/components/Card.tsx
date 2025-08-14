import clsx from 'clsx'
import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, children, variant = 'default', padding = 'md', hoverable = false, ...props },
    ref
  ) => {
    return (
      <div
        className={clsx(
          'rounded-lg',
          {
            // Variant styles
            'bg-white border border-gray-200': variant === 'default',
            'bg-white border-2 border-gray-300': variant === 'outlined',
            'bg-white shadow-md border border-gray-100': variant === 'elevated',

            // Padding styles
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
            'p-8': padding === 'xl',

            // Hoverable
            'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer':
              hoverable,
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
