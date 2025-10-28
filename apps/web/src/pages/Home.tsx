import { useAuth } from '@/hooks/useAuth'
import {
  useAllUserPlaylists,
  useRecentTrackActivities,
  usePlaylistTrackCount,
} from '@/hooks/queries/usePlaylistQueries'
import {
  FolderIcon,
  LightBulbIcon,
  MusicalNoteIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Badge, Button, Card } from 'ui'

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // React Query 훅들 사용
  const { data: playlistData, isLoading: playlistsLoading } = useAllUserPlaylists()
  const { data: recentActivity = [], isLoading: activityLoading } = useRecentTrackActivities(5)

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

  // 통계 데이터 계산 (useMemo로 최적화)
  const stats = useMemo(() => {
    if (!playlistData) {
      return {
        totalPlaylists: 0,
        totalTracks: 0,
        activeCollaborations: 0,
        recentActivity: 0,
      }
    }

    return {
      totalPlaylists: playlistData.all.length,
      totalTracks: 0, // 추후 개별 쿼리로 계산
      activeCollaborations: playlistData.joined.length,
      recentActivity: recentActivity.length,
    }
  }, [playlistData, recentActivity])

  // 최근 플레이리스트 계산 (useMemo로 최적화)
  const recentPlaylists = useMemo(() => {
    if (!playlistData?.all) return []

    return playlistData.all
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 3)
      .map(playlist => ({
        id: playlist.id,
        title: playlist.title,
        trackCount: 0, // 추후 개별 쿼리로 조회
        lastUpdated: getTimeAgo(playlist.updated_at),
        collaborators: playlistData.owned.find(p => p.id === playlist.id) ? 1 : 2,
      }))
  }, [playlistData])

  // 로딩 상태
  const isLoading = playlistsLoading || activityLoading

  // 로그인 필요한 기능 처리
  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate('/playlists?create=true')
  }

  // 비로그인 사용자를 위한 랜딩 페이지
  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MusicalNoteIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            나만의 플레이리스트를 만들어보세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            좋아하는 음악을 모아서 플레이리스트를 만들고, 친구들과 함께 공유해보세요. 실시간으로
            협업하며 함께 음악을 즐길 수 있습니다.
          </p>

          {/* 기능 소개 */}
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">플레이리스트 생성</h3>
              <p className="text-gray-600">
                원하는 음악을 검색하고 나만의 플레이리스트를 만들어보세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">실시간 협업</h3>
              <p className="text-gray-600">
                친구들을 초대해서 함께 플레이리스트를 만들고 편집하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShareIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">쉬운 공유</h3>
              <p className="text-gray-600">
                만든 플레이리스트를 링크로 공유하고 다른 사람들과 음악을 나누세요
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 로그인 사용자를 위한 대시보드

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">안녕하세요! 👋</h1>
        <p className="text-lg text-gray-600 mb-6">
          친구들과 함께 플레이리스트를 만들고 관리해보세요
        </p>
        <Button variant="primary" size="lg" onClick={handleCreatePlaylist}>
          <PlusIcon className="w-5 h-5 mr-2" />새 플레이리스트 만들기
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
            <FolderIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalPlaylists}</h3>
          <p className="text-sm text-gray-600">총 플레이리스트</p>
        </Card>

        <Card variant="elevated" padding="md" className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
            <MusicalNoteIcon className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalTracks}</h3>
          <p className="text-sm text-gray-600">총 곡 수</p>
        </Card>

        <Card variant="elevated" padding="md" className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
            <UsersIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.activeCollaborations}</h3>
          <p className="text-sm text-gray-600">실시간 협업</p>
        </Card>

        <Card variant="elevated" padding="md" className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-3">
            <LightBulbIcon className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{stats.recentActivity}</h3>
          <p className="text-sm text-gray-600">최근 활동</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Playlists */}
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">최근 플레이리스트</h2>
            <Link
              to="/playlists"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              모두 보기 →
            </Link>
          </div>
          <div className="space-y-4">
            {recentPlaylists.map(playlist => (
              <div
                key={playlist.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{playlist.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{playlist.trackCount}곡</span>
                    <span>{playlist.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" size="sm">
                    {playlist.collaborators}명
                  </Badge>
                  <Link to={`/playlist/${playlist.id}`}>
                    <Button variant="ghost" size="sm">
                      열기
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card variant="default" padding="lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">최근 활동</h2>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-start space-x-3">
                  <Avatar name={activity.profiles?.nickname || '익명'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.profiles?.nickname || '익명'}</span>
                      {' 님이 곡을 추가했습니다'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      "{activity.title}" - {activity.artist}
                    </p>
                    <p className="text-sm text-gray-600">
                      플레이리스트: {activity.playlists?.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{getTimeAgo(activity.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">아직 활동 내역이 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">플레이리스트에 곡을 추가해보세요!</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Home
