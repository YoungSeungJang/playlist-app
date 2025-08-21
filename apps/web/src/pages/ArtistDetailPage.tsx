import { ArrowLeftIcon, PlayIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// 아티스트 상세 정보 타입 정의
interface ArtistDetailData {
  artist: {
    id: string
    name: string
    image_url?: string
    followers: number
    popularity: number
    genres: string[]
  }
  topTracks: Array<{
    id: string
    title: string
    artist: string
    album: string
    duration: string
    popularity: number
    preview_url?: string
    image_url?: string
  }>
  albums: Array<{
    id: string
    name: string
    artist: string
    release_date: string
    image_url?: string
    total_tracks: number
    album_type: string
  }>
}

const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [artistData, setArtistData] = useState<ArtistDetailData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 아티스트 상세 정보 API 호출
  useEffect(() => {
    const fetchArtistDetail = async () => {
      if (!id) return

      setIsLoading(true)
      setError(null)

      try {
        const apiUrl = `http://localhost:3001/api/spotify/artist/${id}`
        const response = await fetch(apiUrl)

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const data: ArtistDetailData = await response.json()
        setArtistData(data)
      } catch (error) {
        console.error('Artist detail fetch failed:', error)
        setError(error instanceof Error ? error.message : 'Failed to load artist')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtistDetail()
  }, [id])

  const formatFollowers = (followers: number): string => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`
    }
    return followers.toString()
  }

  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getFullYear().toString()
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

  const handleAlbumClick = (album: any) => {
    navigate(`/album/${album.id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">아티스트 정보를 불러오는 중...</span>
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

  if (!artistData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">아티스트를 찾을 수 없습니다</h3>
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

  const { artist, topTracks, albums } = artistData

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

        {/* 아티스트 헤더 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 아티스트 이미지 */}
            <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex-shrink-0 flex items-center justify-center">
              {artist.image_url ? (
                <img
                  src={artist.image_url}
                  alt={artist.name}
                  className="w-48 h-48 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-24 h-24 text-white" />
              )}
            </div>

            {/* 아티스트 정보 */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm mb-2">아티스트</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{artist.name}</h1>

              <div className="flex flex-col md:flex-row md:items-center gap-4 text-gray-600">
                <span>팔로워 {formatFollowers(artist.followers)}명</span>
                <span className="hidden md:block">•</span>
                <span>인기도 {artist.popularity}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 인기 곡 */}
        {topTracks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">인기 곡</h2>
              <div className="space-y-2">
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="group flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {/* 순번 */}
                    <div className="w-8 text-center text-gray-400 group-hover:hidden">
                      {index + 1}
                    </div>

                    {/* 재생 버튼 */}
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
                      <p className="text-sm text-gray-500 truncate">{track.album}</p>
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
          </div>
        )}

        {/* 앨범 */}
        {albums.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">앨범</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {albums.map(album => (
                  <div
                    key={album.id}
                    onClick={() => handleAlbumClick(album)}
                    className="group cursor-pointer"
                  >
                    {/* 앨범 이미지 */}
                    <div className="aspect-square mb-3 bg-gray-200 rounded-lg overflow-hidden">
                      {album.image_url ? (
                        <img
                          src={album.image_url}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* 앨범 정보 */}
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-primary-600 transition-colors">
                        {album.name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {formatReleaseDate(album.release_date)} • {album.album_type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArtistDetailPage
