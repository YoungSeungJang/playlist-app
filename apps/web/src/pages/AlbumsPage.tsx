import { CalendarIcon, MagnifyingGlassIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SimpleAlbum } from 'shared'
import SearchNavigation from '../components/search/SearchNavigation'

// 디바운싱 훅
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const AlbumsPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()

  const [albums, setAlbums] = useState<SimpleAlbum[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 300ms 디바운싱
  const debouncedSearchTerm = useDebounce(query || '', 300)

  // 검색 API 호출 (앨범만)
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchTerm.length < 2) {
        setAlbums([])
        return
      }

      setIsSearching(true)
      try {
        const apiUrl = `http://localhost:3001/api/spotify/search?q=${encodeURIComponent(debouncedSearchTerm)}&type=album&limit=20`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        setAlbums(data.albums || [])
      } catch (error) {
        console.error('Album search failed:', error)
        setAlbums([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [debouncedSearchTerm])

  const handleAlbumClick = (album: SimpleAlbum) => {
    console.log('Viewing album:', album.name)
    // TODO: 앨범 상세 페이지로 이동
  }

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 검색 필터 네비게이션 */}
        {debouncedSearchTerm.length >= 2 && <SearchNavigation query={query || ''} />}

        {/* 검색 상태 */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">앨범 검색 중...</span>
          </div>
        )}

        {/* 검색 결과가 없는 경우 */}
        {!isSearching && debouncedSearchTerm.length >= 2 && albums.length === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              "{debouncedSearchTerm}"에 대한 앨범 검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* 앨범 검색 결과 */}
        {!isSearching && debouncedSearchTerm.length >= 2 && albums.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">앨범</h2>
              <p className="text-gray-500">{albums.length}개의 결과</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {albums.map(album => (
                <div
                  key={album.id}
                  onClick={() => handleAlbumClick(album)}
                  className="group cursor-pointer bg-white p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                >
                  {/* 앨범 이미지 */}
                  <div className="aspect-square mb-4 bg-gray-200 rounded-lg overflow-hidden">
                    {album.image_url ? (
                      <img
                        src={album.image_url}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MusicalNoteIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 앨범 정보 */}
                  <div>
                    <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-primary-600 transition-colors">
                      {album.name}
                    </h3>

                    {/* 아티스트 */}
                    <p className="text-sm text-gray-600 truncate mb-2">{album.artist}</p>

                    {/* 발매년도 */}
                    <div className="flex items-center text-xs text-gray-400">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <span>{formatReleaseDate(album.release_date)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlbumsPage
