import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "아티스트, 곡, 앨범 검색...", 
  className = "",
  size = 'md',
  autoFocus = false
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [searchTerm, setSearchTerm] = useState('')

  // URL에서 검색어 추출 (검색 페이지인 경우)
  useEffect(() => {
    if (location.pathname.startsWith('/search/')) {
      const urlQuery = decodeURIComponent(location.pathname.replace('/search/', ''))
      setSearchTerm(urlQuery || '')
    } else {
      setSearchTerm('')
    }
  }, [location.pathname])

  // 실시간 URL 업데이트
  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    
    if (value.trim()) {
      navigate(`/search/${encodeURIComponent(value)}`, { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }

  // Enter 키 처리 (이미 URL이 업데이트되어 있으므로 검색 페이지로 이동만)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`)
    }
  }

  // 크기별 스타일
  const sizeClasses = {
    sm: 'h-8 text-sm pl-8 pr-3',
    md: 'h-10 text-base pl-10 pr-3',
    lg: 'h-12 text-lg pl-12 pr-4'
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  }

  const iconPositions = {
    sm: 'left-2',
    md: 'left-3',
    lg: 'left-4'
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`absolute inset-y-0 ${iconPositions[size]} flex items-center pointer-events-none`}>
        <MagnifyingGlassIcon className={`${iconSizes[size]} text-gray-400`} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyPress={handleKeyPress}
        autoFocus={autoFocus}
        className={`
          block w-full ${sizeClasses[size]} 
          border border-gray-300 rounded-lg leading-5 bg-white 
          placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 
          focus:ring-1 focus:ring-primary-500 focus:border-primary-500
          transition-colors
        `}
      />
    </div>
  )
}

export default SearchBar