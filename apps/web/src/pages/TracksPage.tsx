import TrackItem from '@/components/track/TrackItem'
import { useAddToPlaylist } from '@/hooks/useAddToPlaylist'
import { usePlaylistStore } from '@/store/playlistStore'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SimpleTrack } from 'shared'
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal'
import SearchNavigation from '../components/search/SearchNavigation'

const TracksPage: React.FC = () => {
  const { query } = useParams<{ query: string }>()
  const navigate = useNavigate()

  const [tracks, setTracks] = useState<SimpleTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 플레이리스트 추가 훅과 store
  const {
    showPlaylistModal,
    selectedTrack,
    isAddingTrack,
    handleAddToPlaylist,
    handlePlaylistSelect,
    handleCloseModal,
  } = useAddToPlaylist()
  const { loadPlaylists } = usePlaylistStore()

  // 검색 API 호출 (트랙만, URL 쿼리로 즉시 검색)
  useEffect(() => {
    const performSearch = async () => {
      if (!query || query.length < 1) {
        setTracks([])
        return
      }

      setIsSearching(true)
      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/spotify'
        const apiUrl = `${API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=20`
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

  // 컴포넌트 마운트 시 플레이리스트 목록 로드
  useEffect(() => {
    loadPlaylists()
  }, [])

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
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  showAlbum={true}
                  showIndex={true}
                  onPlay={handlePlayPreview}
                  onAdd={handleAddToPlaylist}
                  onArtistClick={handleArtistClick}
                  onAlbumClick={handleAlbumClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 플레이리스트 선택 모달 */}
      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={handleCloseModal}
        selectedTrack={selectedTrack}
        onPlaylistSelect={handlePlaylistSelect}
        isAddingTrack={isAddingTrack}
      />
    </div>
  )
}

export default TracksPage
