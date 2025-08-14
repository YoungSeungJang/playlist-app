import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Modal } from 'ui'

interface HeaderProps {
  onMenuClick: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user data - 나중에 실제 인증 시스템과 연결
  const mockUser = {
    name: 'John Doe',
    avatar: undefined, // Will show initials
  }

  const hasNotifications = true

  // Mock search results
  const mockSearchResults = [
    { type: 'playlist', title: '내가 좋아하는 K-POP', owner: 'John Doe', tracks: 42 },
    { type: 'playlist', title: '팀 프로젝트 BGM', owner: 'Alice Kim', tracks: 18 },
    { type: 'track', title: 'Dynamite', artist: 'BTS', album: 'BE' },
    { type: 'track', title: 'Next Level', artist: 'aespa', album: 'Next Level' },
  ]

  const filteredResults = searchQuery
    ? mockSearchResults.filter(
        result =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (result.type === 'track' &&
            result.artist.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : []

  // Close search modal when screen becomes desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showSearchModal) {
        setShowSearchModal(false)
        setSearchQuery('')
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [showSearchModal])

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
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="플레이리스트 또는 곡 검색..."
              className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Mobile search button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setShowSearchModal(true)}
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

      {/* Mobile Search Modal */}
      {showSearchModal && (
        <div className="md:hidden">
          <Modal
            isOpen={showSearchModal}
            onClose={() => {
              setShowSearchModal(false)
              setSearchQuery('')
            }}
            title="검색"
          >
            <div className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="플레이리스트 또는 곡 검색..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchQuery === '' ? (
                  <div className="text-center py-8">
                    <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">검색어를 입력하세요</h3>
                    <p className="mt-1 text-sm text-gray-500">플레이리스트나 곡을 검색해보세요</p>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="space-y-2">
                    {filteredResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          setShowSearchModal(false)
                          setSearchQuery('')
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            {result.type === 'playlist' ? (
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-medium">PL</span>
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white text-sm font-medium">♪</span>
                              </div>
                            )}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                              <p className="text-sm text-gray-500">
                                {result.type === 'playlist'
                                  ? `${result.owner} • ${result.tracks}곡`
                                  : `${result.artist} • ${result.album}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🔍</div>
                    <h3 className="text-sm font-medium text-gray-900">검색 결과가 없습니다</h3>
                    <p className="mt-1 text-sm text-gray-500">다른 검색어를 시도해보세요</p>
                  </div>
                )}
              </div>

              {/* Popular Searches */}
              {searchQuery === '' && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">인기 검색어</h4>
                  <div className="flex flex-wrap gap-2">
                    {['K-POP', 'BTS', '로파이', '집중음악', 'aespa'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
        </div>
      )}
    </header>
  )
}

export default Header
