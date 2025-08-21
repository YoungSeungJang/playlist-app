import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Avatar, Button } from 'ui'
import SearchBar from '../search/SearchBar'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  // Mock user data - 나중에 실제 인증 시스템과 연결
  const mockUser = {
    name: 'John Doe',
    avatar: undefined, // Will show initials
  }

  const hasNotifications = true

  // Close mobile search when screen becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showMobileSearch) {
        setShowMobileSearch(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showMobileSearch])

  // Handle ESC key to close mobile search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMobileSearch) {
        setShowMobileSearch(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showMobileSearch])

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search bar */}
          <div className="hidden md:block">
            <SearchBar placeholder="플레이리스트 또는 곡 검색..." className="w-96" size="md" />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <BellIcon className="h-6 w-6" />
              {hasNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{mockUser.name}</p>
              <p className="text-xs text-gray-500">온라인</p>
            </div>
            <Avatar
              name={mockUser.name}
              src={mockUser.avatar}
              size="md"
              showOnline={true}
              onClick={() => console.log('User menu clicked')}
            />
          </div>

          {/* Create playlist button */}
          <Button variant="primary" size="sm">
            새 플레이리스트
          </Button>
        </div>
      </div>

      {/* Mobile Search Slide */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showMobileSearch ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 bg-white">
          <div className="px-4 py-4">
            <SearchBar
              placeholder="아티스트, 곡, 앨범 검색..."
              size="lg"
              autoFocus={showMobileSearch}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
