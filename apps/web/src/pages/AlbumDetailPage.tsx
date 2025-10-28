import { ArrowLeftIcon, CalendarIcon, MusicalNoteIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SimpleAlbum, SimpleTrack } from 'shared'
import TrackItem from '../components/track/TrackItem'
import AddToPlaylistModal from '../components/playlist/AddToPlaylistModal'
import { useAddToPlaylist } from '@/hooks/useAddToPlaylist'
import { usePlaylistStore } from '@/store/playlistStore'

// 앨범 상세 정보 타입 정의
interface AlbumDetailData {
  album: SimpleAlbum & {
    total_tracks: number
    label?: string | null
  }
  tracks: Array<
    SimpleTrack & {
      track_number: number
      explicit: boolean
    }
  >
}

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [albumData, setAlbumData] = useState<AlbumDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  // 앨범 상세 정보 API 호출
  useEffect(() => {
    const fetchAlbumDetail = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const apiUrl = `http://localhost:3001/api/spotify/album/${id}/tracks`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data: AlbumDetailData = await response.json()
        setAlbumData(data)
      } catch (error) {
        console.error('Album detail fetch failed:', error)
        setError(error instanceof Error ? error.message : 'Failed to load album')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlbumDetail()
  }, [id])

  // 컴포넌트 마운트 시 플레이리스트 목록 로드
  useEffect(() => {
    loadPlaylists()
  }, [])

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">앨범 정보를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            뒤로가기
          </button>
        </div>
      </div>
    )
  }

  if (!albumData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">앨범을 찾을 수 없습니다</h3>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            뒤로가기
          </button>
        </div>
      </div>
    )
  }

  const { album, tracks } = albumData

  // 총 재생 시간 계산
  const totalDuration = tracks.reduce((acc, track) => {
    const [minutes, seconds] = track.duration.split(':').map(Number)
    return acc + (minutes * 60 + seconds)
  }, 0)

  const formatTotalDuration = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          뒤로가기
        </button>

        {/* 앨범 헤더 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 앨범 커버 */}
            <div className="w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex-shrink-0 flex items-center justify-center">
              {album.image_url ? (
                <img
                  src={album.image_url}
                  alt={album.name}
                  className="w-64 h-64 rounded-lg object-cover shadow-lg"
                />
              ) : (
                <MusicalNoteIcon className="w-32 h-32 text-white" />
              )}
            </div>

            {/* 앨범 정보 */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{album.name}</h1>
              <div className="text-xl text-gray-700 mb-4">
                {album.artist_names.map((artistName, index) => (
                  <span key={album.artist_ids[index]}>
                    <button
                      onClick={() => handleArtistClick(album.artist_ids[index])}
                      className="hover:text-primary-600 hover:underline cursor-pointer"
                    >
                      {artistName}
                    </button>
                    {index < album.artist_names.length - 1 && ', '}
                  </span>
                ))}
              </div>

              <div className="space-y-2 text-gray-600">
                <div className="flex items-center justify-center md:justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <span>{formatReleaseDate(album.release_date)}</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span>{album.total_tracks}곡</span>
                  <span className="hidden md:block">•</span>
                  <span>{formatTotalDuration(totalDuration)}</span>
                </div>

                {album.label && <p className="text-sm text-gray-500 mt-2">레이블: {album.label}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* 트랙 목록 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">수록곡</h2>
            <div className="space-y-0">
              {tracks.map((track, index) => (
                <TrackItem
                  key={track.id}
                  track={track}
                  index={index}
                  showAlbum={false}
                  showIndex={true}
                  onPlay={handlePlayPreview}
                  onAdd={handleAddToPlaylist}
                  onArtistClick={handleArtistClick}
                />
              ))}
            </div>
          </div>
        </div>
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

export default AlbumDetailPage
