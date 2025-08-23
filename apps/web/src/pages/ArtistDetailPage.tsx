import AlbumItem from '@/components/track/AlbumItem'
import TrackItem from '@/components/track/TrackItem'
import { ArrowLeftIcon, UserIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { SimpleTrack, SimpleAlbum } from 'shared'

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
  topTracks: SimpleTrack[]
  albums: (SimpleAlbum & {
    total_tracks: number
  })[]
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

  const handleTrackAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`)
  }

  const handleTrackArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
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
              <div className="space-y-0">
                {topTracks.map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    showAlbum={true}
                    showIndex={true}
                    onPlay={handlePlayPreview}
                    onAdd={handleAddToPlaylist}
                    onArtistClick={handleTrackArtistClick}
                    onAlbumClick={handleTrackAlbumClick}
                  />
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
                  <AlbumItem
                    key={album.id}
                    album={album}
                    showArtist={false}
                    onClick={handleAlbumClick}
                  />
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
