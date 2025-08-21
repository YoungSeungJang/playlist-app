import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSmartDebounce } from '../../hooks/useDebounce'

interface SearchBarProps {
  placeholder?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  autoFocus?: boolean
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '아티스트, 곡, 앨범 검색...',
  className = '',
  size = 'md',
  autoFocus = false,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [searchTerm, setSearchTerm] = useState('')

  // 스마트 디바운싱 적용 (1글자: 800ms, 2글자+: 500ms)
  const debouncedSearchTerm = useSmartDebounce(searchTerm)

  // URL에서 검색어 추출하여 input과 동기화
  useEffect(() => {
    if (location.pathname.startsWith('/search/')) {
      const pathParts = location.pathname.split('/')
      if (pathParts.length >= 3 && pathParts[2]) {
        const urlQuery = decodeURIComponent(pathParts[2])
        setSearchTerm(urlQuery || '')
      } else {
        setSearchTerm('')
      }
      if (!pathParts[2]) {
        setSearchTerm('')
        navigate('/')
      }
    }
  }, [location.pathname])

  // 디바운싱된 검색어로 네비게이션
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(debouncedSearchTerm)}`)
    }
  }, [debouncedSearchTerm])

  // 입력 변화 처리
  const handleInputChange = (value: string) => {
    setSearchTerm(value)
  }

  // Enter 키로 즉시 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`)
    }
  }

  // 크기별 스타일
  const sizeClasses = {
    sm: 'h-8 text-sm pl-8 pr-3',
    md: 'h-10 text-base pl-10 pr-3',
    lg: 'h-12 text-lg pl-12 pr-4',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const iconPositions = {
    sm: 'left-2',
    md: 'left-3',
    lg: 'left-4',
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-y-0 ${iconPositions[size]} flex items-center pointer-events-none`}
      >
        <MagnifyingGlassIcon className={`${iconSizes[size]} text-gray-400`} />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={e => handleInputChange(e.target.value)}
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
