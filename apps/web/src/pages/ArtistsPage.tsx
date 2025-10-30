import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SimpleArtist } from 'shared'
import SearchNavigation from '../components/search/SearchNavigation'


const ArtistsPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()
  const navigate = useNavigate()

  const [artists, setArtists] = useState<SimpleArtist[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 검색 API 호출 (아티스트만, URL 쿼리로 즉시 검색)
  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 1) {
        setArtists([])
        return
      }

      setIsSearching(true)
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/spotify'
        const apiUrl = `${API_BASE}/search?q=${encodeURIComponent(query)}&type=artist&limit=20`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        setArtists(data.artists || [])
      } catch (error) {
        console.error('Artist search failed:', error)
        setArtists([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [query])

  const handleArtistClick = (artist: SimpleArtist) => {
    navigate(`/artist/${artist.id}`)
  }

  const formatFollowers = (followers: number): string => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toString()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 검색 필터 네비게이션 */}
        {query && query.length >= 1 && <SearchNavigation query={query || ''} />}

        {/* 검색 상태 */}
        {isSearching && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-gray-600">아티스트 검색 중...</span>
          </div>
        )}

        {/* 검색 결과가 없는 경우 */}
        {!isSearching && query && query.length >= 1 && artists.length === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              "{query}"에 대한 아티스트 검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* 아티스트 검색 결과 */}
        {!isSearching && query && query.length >= 1 && artists.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">아티스트</h2>
              <p className="text-gray-500">{artists.length}개의 결과</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {artists.map(artist => (
                <div
                  key={artist.id}
                  onClick={() => handleArtistClick(artist)}
                  className="group cursor-pointer bg-white p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                >
                  {/* 아티스트 이미지 */}
                  <div className="aspect-square mb-4 bg-gray-200 rounded-full overflow-hidden">
                    {artist.image_url ? (
                      <img
                        src={artist.image_url}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* 아티스트 정보 */}
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-primary-600 transition-colors">
                      {artist.name}
                    </h3>

                    {/* 팔로워 수 */}
                    <div className="flex items-center justify-center text-xs text-gray-400 mb-2">
                      <UserIcon className="w-3 h-3 mr-1" />
                      <span>{formatFollowers(artist.followers)} 팔로워</span>
                    </div>

                    {/* 인기도 표시 */}
                    <div className="mt-3 flex justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-primary-500 h-1 rounded-full transition-all"
                          style={{ width: `${artist.popularity}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">인기도 {artist.popularity}</p>
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

export default ArtistsPage
