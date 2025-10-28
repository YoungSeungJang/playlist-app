import TrackItem from '@/components/track/TrackItem'
import {
  getPlaylistById,
  getPlaylistTracks,
  leavePlaylist,
  type Playlist,
  type PlaylistTrack,
} from '@/lib/playlistApi'
import { supabase } from '@/lib/supabase'
import { ArrowLeftIcon, MusicalNoteIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SimpleTrack } from 'shared'
import { Avatar, Button, Card } from 'ui'

const SharedPlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // API 연결을 위한 상태
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [tracks, setTracks] = useState<PlaylistTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 플레이리스트 데이터 로드
  useEffect(() => {
    const loadPlaylistData = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError(null)

        // 플레이리스트 기본 정보와 트랙 목록을 병렬로 조회
        const [playlistData, tracksData] = await Promise.all([
          getPlaylistById(id),
          getPlaylistTracks(id),
        ])

        if (!playlistData) {
          setError('플레이리스트를 찾을 수 없습니다.')
          return
        }

        // 소유자 정보 조회 (profiles 테이블에서)
        const { data: ownerData } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', playlistData.created_by)
          .single()

        // 현재 사용자의 참여일 조회 (playlist_members 테이블에서)
        const {
          data: { user },
        } = await supabase.auth.getUser()
        let joinedAt = null

        if (user) {
          const { data: memberData } = await supabase
            .from('playlist_members')
            .select('joined_at')
            .eq('playlist_id', playlistData.id)
            .eq('user_id', user.id)
            .single()

          joinedAt = memberData?.joined_at || null
        }

        // 플레이리스트 데이터에 소유자 이름과 참여일 추가
        const playlistWithOwner = {
          ...playlistData,
          ownerName: ownerData?.nickname || '알 수 없음',
          joined_at: joinedAt,
        }

        setPlaylist(playlistWithOwner)
        setTracks(tracksData)
      } catch (err) {
        console.error('Failed to load playlist data:', err)
        setError(err instanceof Error ? err.message : '플레이리스트를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPlaylistData()
  }, [id])

  // 현재 사용자는 멤버이므로 편집 권한 없음 (소유자가 아니므로)

  // 총 재생시간 계산 함수
  const calculateTotalDuration = (tracks: PlaylistTrack[]): string => {
    const totalMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0)
    const totalMinutes = Math.floor(totalMs / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`
    }
    return `${minutes}분`
  }

  // ms를 "분:초" 형식으로 변환
  const formatDuration = (durationMs: number): string => {
    const minutes = Math.floor(durationMs / 60000)
    const seconds = Math.floor((durationMs % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // PlaylistTrack을 SimpleTrack으로 변환
  const convertToSimpleTrack = (playlistTrack: PlaylistTrack): SimpleTrack => {
    // artist_id JSON 문자열을 배열로 파싱
    let artistIds: string[] = []
    try {
      artistIds = JSON.parse(playlistTrack.artist_id || '[]')
    } catch (error) {
      console.warn('Failed to parse artist_id JSON:', playlistTrack.artist_id)
      artistIds = []
    }

    // 아티스트 이름을 쉼표로 분리
    const artistNames = playlistTrack.artist.split(', ').map(name => name.trim())

    // 배열 길이 안전성 확보 - artist_names와 artist_ids 길이 맞추기
    const maxLength = Math.max(artistNames.length, artistIds.length)
    while (artistNames.length < maxLength) {
      artistNames.push(artistNames[0] || 'Unknown Artist')
    }
    while (artistIds.length < maxLength) {
      artistIds.push('')
    }

    return {
      id: playlistTrack.spotify_track_id,
      title: playlistTrack.title,
      artist: playlistTrack.artist, // 쉼표로 구분된 문자열
      artist_names: artistNames, // 개별 아티스트 이름 배열
      artist_ids: artistIds, // JSON에서 파싱한 실제 ID 배열
      album: playlistTrack.album,
      album_id: playlistTrack.album_id, // 실제 앨범 ID
      duration: formatDuration(playlistTrack.duration_ms),
      image_url: playlistTrack.cover_url || null,
      preview_url: playlistTrack.preview_url || null,
      spotify_url: '', // PlaylistTrack에는 spotify_url이 없음
      popularity: 0, // PlaylistTrack에는 popularity가 없음
    }
  }

  // 시간 차이 계산 함수
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`
  }

  // 플레이리스트 나가기 기능
  const handleLeavePlaylist = async () => {
    if (!confirm('이 플레이리스트에서 나가시겠습니까? 다시 참여하려면 초대 코드가 필요합니다.')) {
      return
    }

    try {
      if (!id) return

      await leavePlaylist(id)
      alert('플레이리스트에서 나갔습니다.')
      navigate('/shared')
    } catch (error) {
      console.error('Failed to leave playlist:', error)
      alert('플레이리스트 나가기에 실패했습니다.')
    }
  }

  const handleArtistClick = (artistId: string) => {
    navigate(`/artist/${artistId}`)
  }

  const handleAlbumClick = (albumId: string) => {
    navigate(`/album/${albumId}`)
  }

  const handlePlayPreview = (track: SimpleTrack) => {
    if (track.preview_url) {
      console.log('Playing preview:', track.preview_url)
      // TODO: 미리듣기 기능 구현
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-gray-600">플레이리스트를 불러오는 중...</span>
        </div>
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link
            to="/shared"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            공유받은 플레이리스트로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  // 플레이리스트를 찾을 수 없는 경우
  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            플레이리스트를 찾을 수 없습니다
          </h3>
          <Link
            to="/shared"
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            공유받은 플레이리스트로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/shared"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        공유받은 플레이리스트로 돌아가기
      </Link>

      {/* Playlist Header */}
      <Card variant="default" padding="lg">
        <div className="flex items-start space-x-6">
          {/* Playlist thumbnail - 공유받은 플레이리스트는 다른 색상 */}
          <div className="w-48 h-48 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <MusicalNoteIcon className="w-16 h-16 text-white" />
          </div>

          {/* Playlist info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm text-green-600 font-medium">공유받은 플레이리스트</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{playlist.title}</h1>

            {/* 소유자 정보 표시 */}
            <div className="flex items-center space-x-2 mb-4">
              <Avatar name={playlist.ownerName || '알 수 없음'} size="sm" />
              <span className="text-lg text-gray-700">
                by <span className="font-semibold">{playlist.ownerName || '알 수 없음'}</span>
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <span>{tracks.length}곡</span>
              <span>{calculateTotalDuration(tracks)}</span>
              <span>
                참여일: {playlist.joined_at ? getTimeAgo(playlist.joined_at) : '알 수 없음'}
              </span>
            </div>

            {/* Action buttons - 나가기 버튼 */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={handleLeavePlaylist}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <UserMinusIcon className="w-5 h-5 mr-2" />
                플레이리스트 나가기
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Tracks list */}
          <Card variant="default" padding="none">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">곡 목록</h2>
            </div>

            {/* Tracks */}
            <div className="space-y-2 px-6 py-4 max-h-96 overflow-y-auto pr-2">
              {tracks.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    아직 추가된 곡이 없습니다
                  </h3>
                  <p className="text-gray-500 mb-4">플레이리스트가 비어있습니다.</p>
                </div>
              ) : (
                tracks.map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={convertToSimpleTrack(track)}
                    index={index}
                    showAlbum={true}
                    showIndex={true}
                    showRemove={false} // 공유받은 플레이리스트는 곡 제거 불가
                    onPlay={handlePlayPreview}
                    onArtistClick={handleArtistClick}
                    onAlbumClick={handleAlbumClick}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* 플레이리스트 정보 */}
          <Card variant="default" padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">플레이리스트 정보</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">총 곡 수</span>
                <span className="font-medium">{tracks.length}곡</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">총 재생시간</span>
                <span className="font-medium">{calculateTotalDuration(tracks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">참여일</span>
                <span className="font-medium">
                  {playlist.joined_at ? getTimeAgo(playlist.joined_at) : '알 수 없음'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">최종 업데이트</span>
                <span className="font-medium">{getTimeAgo(playlist.updated_at)}</span>
              </div>
            </div>
          </Card>

          {/* 소유자 정보 */}
          <Card variant="default" padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">소유자</h3>
            <div className="flex items-center space-x-3">
              <Avatar name={playlist.ownerName || '알 수 없음'} size="md" />
              <div>
                <p className="font-medium text-gray-900">{playlist.ownerName || '알 수 없음'}</p>
                <p className="text-sm text-gray-500">플레이리스트 관리자</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SharedPlaylistDetail
