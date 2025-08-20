import { Badge } from '@ui/index'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface SearchNavigationProps {
  query: string
}

const SearchNavigation: React.FC<SearchNavigationProps> = ({ query }) => {
  const navigate = useNavigate()
  const location = useLocation()

  // 현재 선택된 필터 타입 파악
  const getCurrentFilterType = (): string => {
    const path = location.pathname
    if (path.endsWith('/tracks')) return 'tracks'
    if (path.endsWith('/artists')) return 'artists'
    if (path.endsWith('/albums')) return 'albums'
    return 'all'
  }

  const currentFilter = getCurrentFilterType()

  // 필터 변경 핸들러
  const handleFilterChange = (filterType: string) => {
    if (!query) return

    let newPath = `/search/${encodeURIComponent(query)}`
    if (filterType !== 'all') {
      newPath += `/${filterType}`
    }
    navigate(newPath)
  }

  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <button onClick={() => handleFilterChange('all')}>
          <Badge
            variant={currentFilter === 'all' ? 'primary' : 'default'}
            size="md"
            className="cursor-pointer hover:bg-opacity-80 transition-colors"
          >
            모두
          </Badge>
        </button>
        <button onClick={() => handleFilterChange('tracks')}>
          <Badge
            variant={currentFilter === 'tracks' ? 'primary' : 'default'}
            size="md"
            className="cursor-pointer hover:bg-opacity-80 transition-colors"
          >
            곡
          </Badge>
        </button>
        <button onClick={() => handleFilterChange('artists')}>
          <Badge
            variant={currentFilter === 'artists' ? 'primary' : 'default'}
            size="md"
            className="cursor-pointer hover:bg-opacity-80 transition-colors"
          >
            아티스트
          </Badge>
        </button>
        <button onClick={() => handleFilterChange('albums')}>
          <Badge
            variant={currentFilter === 'albums' ? 'primary' : 'default'}
            size="md"
            className="cursor-pointer hover:bg-opacity-80 transition-colors"
          >
            앨범
          </Badge>
        </button>
      </div>
    </div>
  )
}

export default SearchNavigation
