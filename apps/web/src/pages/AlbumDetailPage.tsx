import {
  ArrowLeftIcon,
  CalendarIcon,
  MusicalNoteIcon,
  PlayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 앨범 상세 정보 타입 정의
interface AlbumDetailData {
  album: {
    id: string
    name: string
    artist: string
    release_date: string
    total_tracks: number
    image_url?: string
    label?: string
  }
  tracks: Array<{
    id: string
    title: string
    artist: string
    album: string
    track_number: number
    duration: string
    preview_url?: string
    explicit: boolean
  }>
}

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [albumData, setAlbumData] = useState<AlbumDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handlePlayPreview = (track: any) => {
    if (track.preview_url) {
      console.log('Playing preview:', track.preview_url)
      // TODO: 미리듣기 기능 구현
    }
  }

  const handleAddToPlaylist = (track: any) => {
    console.log('Adding to playlist:', track.title)
    // TODO: 플레이리스트 추가 기능 구현
  }

  const handleArtistClick = (artistName: string) => {
    // 아티스트 이름으로 검색하여 아티스트 검색페이지로 이동
    navigate(`/search/${encodeURIComponent(artistName)}/artists`)
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
              <button
                onClick={() => handleArtistClick(album.artist)}
                className="text-xl text-gray-700 hover:text-primary-600 hover:underline cursor-pointer mb-4"
              >
                {album.artist}
              </button>

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

            {/* 트랙 목록 헤더 */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-500">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-7 md:col-span-6">제목</div>
              <div className="hidden md:block col-span-2">아티스트</div>
              <div className="col-span-4 md:col-span-3 text-right">재생시간</div>
            </div>

            {/* 트랙 목록 */}
            <div className="space-y-1 mt-3">
              {tracks.map(track => (
                <div
                  key={track.id}
                  className="group grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors items-center"
                >
                  {/* 트랙 번호 / 재생 버튼 */}
                  <div className="col-span-1 text-center">
                    <div className="group-hover:hidden text-gray-400 text-sm">
                      {track.track_number}
                    </div>
                    <div className="hidden group-hover:flex justify-center">
                      <button
                        onClick={() => handlePlayPreview(track)}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600 hover:text-primary-600"
                        disabled={!track.preview_url}
                        title={track.preview_url ? '미리듣기' : '미리듣기 불가'}
                      >
                        <PlayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* 트랙 제목 */}
                  <div className="col-span-7 md:col-span-6 min-w-0">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900 truncate mr-2">{track.title}</h3>
                      {track.explicit && (
                        <span className="px-1 py-0.5 bg-gray-500 text-white text-xs rounded">
                          E
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleArtistClick(track.artist)}
                      className="text-sm text-gray-500 truncate md:hidden hover:text-primary-600 hover:underline cursor-pointer text-left"
                    >
                      {track.artist}
                    </button>
                  </div>

                  {/* 아티스트 (데스크탑에서만 표시) */}
                  <div className="hidden md:block col-span-2 min-w-0">
                    <button
                      onClick={() => handleArtistClick(track.artist)}
                      className="text-sm text-gray-500 truncate hover:text-primary-600 hover:underline cursor-pointer text-left"
                    >
                      {track.artist}
                    </button>
                  </div>

                  {/* 재생시간 + 추가 버튼 */}
                  <div className="col-span-4 md:col-span-3 flex items-center justify-end gap-2">
                    <div className="text-sm text-gray-500">{track.duration}</div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddToPlaylist(track)}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600 hover:text-primary-600"
                        title="플레이리스트에 추가"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbumDetailPage
