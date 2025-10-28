import { getPlaylistTrackCount } from '@/lib/playlistApi'
import { usePlaylistStore } from '@/store/playlistStore'
import {
  ClockIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card } from 'ui'

const SharedPlaylists: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [trackCounts, setTrackCounts] = useState<{ [playlistId: string]: number }>({})
  const { joinedPlaylists, loadJoinedPlaylists, loading: isLoading } = usePlaylistStore()

  useEffect(() => {
    console.log('joinedPlaylists 데이터:', joinedPlaylists)
    joinedPlaylists.forEach(playlist => {
      console.log(`플레이리스트 ${playlist.title}:`, {
        ownerName: playlist.ownerName,
        created_by: playlist.created_by,
      })
    })
  }, [joinedPlaylists])

  useEffect(() => {
    loadJoinedPlaylists()
  }, [])

  // 플레이리스트가 로드되면 각 플레이리스트의 트랙 개수 조회
  useEffect(() => {
    const loadTrackCounts = async () => {
      const counts: { [playlistId: string]: number } = {}

      for (const playlist of joinedPlaylists) {
        counts[playlist.id] = await getPlaylistTrackCount(playlist.id)
      }

      setTrackCounts(counts)
    }

    if (joinedPlaylists.length > 0) {
      loadTrackCounts()
    }
  }, [joinedPlaylists])

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

  // Transform joinedPlaylists to simplified structure
  const sharedPlaylists = joinedPlaylists.map(playlist => ({
    id: playlist.id,
    title: playlist.title,
    trackCount: trackCounts[playlist.id] || 0,
    owner: {
      name: playlist.ownerName || '알 수 없음',
      avatar: null,
    },
    joinedAt: playlist.joined_at ? getTimeAgo(playlist.joined_at) : '알 수 없음',
    permission: 'view', // Default to view permission for joined playlists
  }))

  const filteredPlaylists = sharedPlaylists.filter(
    playlist =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'admin':
        return (
          <Badge variant="primary" size="sm">
            관리자
          </Badge>
        )
      case 'edit':
        return (
          <Badge variant="success" size="sm">
            편집 가능
          </Badge>
        )
      case 'view':
        return (
          <Badge variant="default" size="sm">
            보기 전용
          </Badge>
        )
      default:
        return (
          <Badge variant="default" size="sm">
            알 수 없음
          </Badge>
        )
    }
  }

  const SharedPlaylistCard = ({ playlist }: { playlist: (typeof sharedPlaylists)[0] }) => (
    <Card variant="default" padding="lg" className="group hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <MusicalNoteIcon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link to={`/shared-playlist/${playlist.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {playlist.title}
                </h3>
              </Link>

              {/* Owner info */}
              <div className="flex items-center mt-2">
                <Avatar name={playlist.owner.name} size="xs" />
                <span className="text-sm text-gray-500 ml-2">{playlist.owner.name}</span>
              </div>
            </div>

            <div className="flex items-center">{getPermissionBadge(playlist.permission)}</div>
          </div>

          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <span>{playlist.trackCount}곡</span>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              참여: {playlist.joinedAt}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">공유받은 플레이리스트</h1>
          <p className="text-lg text-gray-600 mt-2">
            {joinedPlaylists.length}개의 플레이리스트에 참여하고 있습니다
          </p>
        </div>
      </div>

      {/* Search */}
      <Card variant="default" padding="md">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="플레이리스트 또는 작성자 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{joinedPlaylists.length}</div>
          <p className="text-sm text-gray-600">참여 중인 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sharedPlaylists.reduce((sum, playlist) => sum + playlist.trackCount, 0)}
          </div>
          <p className="text-sm text-gray-600">총 곡 수</p>
        </Card>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <Card variant="default" padding="xl" className="text-center">
            <div className="text-gray-500">플레이리스트를 불러오는 중...</div>
          </Card>
        ) : filteredPlaylists.length > 0 ? (
          filteredPlaylists.map(playlist => (
            <SharedPlaylistCard key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <Card variant="default" padding="xl" className="text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '참여 중인 플레이리스트가 없습니다'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? '다른 검색어를 사용해보세요'
                : '친구들이 공유한 플레이리스트에 참여해보세요'}
            </p>
            {!searchQuery && <Button variant="primary">플레이리스트 둘러보기</Button>}
          </Card>
        )}
      </div>
    </div>
  )
}

export default SharedPlaylists
