import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import {
  FolderIcon,
  LightBulbIcon,
  MusicalNoteIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Badge, Button, Card } from 'ui'

const Home: React.FC = () => {
  console.log(supabase)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // 로그인 필요한 기능 처리
  const handleCreatePlaylist = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // TODO: 플레이리스트 생성 모달 또는 페이지로 이동
    console.log('Create playlist clicked')
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
  // Mock data for dashboard
  const stats = {
    totalPlaylists: 8,
    totalTracks: 247,
    activeCollaborations: 3,
    recentActivity: 12,
  }

  const recentPlaylists = [
    {
      id: '1',
      title: '내가 좋아하는 K-POP',
      trackCount: 42,
      lastUpdated: '2시간 전',
      collaborators: 3,
    },
    {
      id: '2',
      title: '팀 프로젝트 BGM',
      trackCount: 18,
      lastUpdated: '1일 전',
      collaborators: 5,
    },
    {
      id: '3',
      title: '운동할 때 듣는 음악',
      trackCount: 25,
      lastUpdated: '3일 전',
      collaborators: 1,
    },
  ]

  const recentActivity = [
    {
      user: 'Alice',
      action: 'added',
      track: 'Dynamite - BTS',
      playlist: 'K-POP Mix',
      time: '10분 전',
    },
    {
      user: 'Bob',
      action: 'removed',
      track: 'Shape of You',
      playlist: '팀 BGM',
      time: '30분 전',
    },
    { user: 'Charlie', action: 'created', playlist: '새 플레이리스트', time: '1시간 전' },
  ]

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
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Avatar name={activity.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span>
                    {activity.action === 'added' && ' 님이 곡을 추가했습니다'}
                    {activity.action === 'removed' && ' 님이 곡을 삭제했습니다'}
                    {activity.action === 'created' && ' 님이 플레이리스트를 만들었습니다'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.track && `"${activity.track}"`}
                    {activity.playlist && ` - ${activity.playlist}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Home
