import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SearchData } from 'shared'
import SearchNavigation from '../components/search/SearchNavigation'
import SearchResults from '../components/search/SearchResults'
import { useSearchMusic } from '@/hooks/queries/useMusicQueries'

const SearchPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()

  // React Query로 검색 결과 캐싱
  const { data, isLoading } = useSearchMusic(query || '')

  // SearchData 형식으로 변환 (topResult는 임시로 null)
  const searchData: SearchData = useMemo(() => ({
    tracks: data?.tracks || [],
    artists: data?.artists || [],
    albums: data?.albums || [],
    topResult: null, // 백엔드에서 topResult를 반환하지 않음
  }), [data])

  const totalResults =
    searchData.tracks.length + searchData.artists.length + searchData.albums.length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 검색 필터 네비게이션 */}
        {query && query.length >= 1 && <SearchNavigation query={query || ''} />}

        {/* 검색 상태 */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">검색 중...</span>
          </div>
        )}

        {/* 검색 결과가 없는 경우 */}
        {!isLoading && query && query.length >= 1 && totalResults === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              "{query}"에 대한 검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!isLoading && query && query.length >= 1 && totalResults > 0 && (
          <SearchResults searchData={searchData} />
        )}
      </div>
    </div>
  )
}

export default SearchPage
