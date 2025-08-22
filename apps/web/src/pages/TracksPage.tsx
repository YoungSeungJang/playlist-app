import { MagnifyingGlassIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SimpleTrack } from 'shared'
import SearchNavigation from '../components/search/SearchNavigation'

const TracksPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()
  const navigate = useNavigate()

  const [tracks, setTracks] = useState<SimpleTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 검색 API 호출 (트랙만, URL 쿼리로 즉시 검색)
  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 1) {
        setTracks([])
        return
      }

      setIsSearching(true)
      try {
        const apiUrl = `http://localhost:3001/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=20`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data = await response.json()
        setTracks(data.tracks || [])
      } catch (error) {
        console.error('Track search failed:', error)
        setTracks([])
      } finally {
        setIsSearching(false)
      }
    }

    performSearch()
  }, [query])

  const handleAddToPlaylist = (track: SimpleTrack) => {
    console.log('Adding track to playlist:', track.title)
    // TODO: 플레이리스트 추가 기능 구현
  }

  const handlePlayPreview = (track: SimpleTrack) => {
    if (track.preview_url) {
      console.log('Playing preview:', track.preview_url)
      // TODO: 미리듣기 기능 구현
    }
  }

  const handleArtistClick = (artistId: string) => {
    // 아티스트 ID로 직접 상세페이지 이동
    navigate(`/artist/${artistId}`)
  }

  const handleAlbumClick = (albumId: string) => {
    // 앨범 ID로 직접 상세페이지 이동
    navigate(`/album/${albumId}`)
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
            <span className="ml-3 text-gray-600">곡 검색 중...</span>
          </div>
        )}

        {/* 검색 결과가 없는 경우 */}
        {!isSearching && query && query.length >= 1 && tracks.length === 0 && (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              "{query}"에 대한 곡 검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어를 시도해보세요</p>
          </div>
        )}

        {/* 트랙 검색 결과 */}
        {!isSearching && query && query.length >= 1 && tracks.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">곡</h2>
              <p className="text-gray-500">{tracks.length}개의 결과</p>
            </div>

            <div className="space-y-2">
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  className="group flex items-center p-3 rounded-lg hover:bg-white transition-colors"
                >
                  {/* 순번 */}
                  <div className="w-8 text-center text-gray-400 group-hover:hidden">
                    {index + 1}
                  </div>

                  {/* 재생 버튼 (호버시 표시) */}
                  <div className="w-8 hidden group-hover:flex justify-center">
                    <button
                      onClick={() => handlePlayPreview(track)}
                      className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600"
                      disabled={!track.preview_url}
                      title={track.preview_url ? '미리듣기' : '미리듣기 불가'}
                    >
                      <PlayIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 앨범 이미지 */}
                  <div className="ml-4 w-12 h-12 bg-gray-200 rounded flex-shrink-0">
                    {track.image_url && (
                      <img
                        src={track.image_url}
                        alt={track.album}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>

                  {/* 트랙 정보 */}
                  <div className="flex-1 min-w-0 ml-4">
                    <h3 className="font-medium text-gray-900 truncate">{track.title}</h3>
                    <div className="text-sm text-gray-500 truncate">
                      {track.artist_names.map((artistName, index) => (
                        <span key={track.artist_ids[index]}>
                          <button
                            onClick={() => handleArtistClick(track.artist_ids[index])}
                            className="hover:text-primary-600 hover:underline cursor-pointer"
                          >
                            {artistName}
                          </button>
                          {index < track.artist_names.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 앨범 이름 */}
                  <div className="hidden md:block flex-1 min-w-0 px-4">
                    <button
                      onClick={() => handleAlbumClick(track.album_id)}
                      className="text-sm text-gray-500 truncate hover:text-primary-600 hover:underline cursor-pointer text-left"
                    >
                      {track.album}
                    </button>
                  </div>

                  {/* 인기도 */}
                  <div className="hidden lg:block w-20 text-center">
                    <div className="inline-flex items-center">
                      <div className="w-12 bg-gray-200 rounded-full h-1 mr-2">
                        <div
                          className="bg-primary-500 h-1 rounded-full transition-all"
                          style={{ width: `${track.popularity}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{track.popularity}</span>
                    </div>
                  </div>

                  {/* 재생 시간 */}
                  <div className="hidden sm:block w-16 text-right text-sm text-gray-500">
                    {track.duration}
                  </div>

                  {/* 추가 버튼 */}
                  <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleAddToPlaylist(track)}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600"
                      title="플레이리스트에 추가"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
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

export default TracksPage
