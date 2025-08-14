import {
  FolderIcon,
  LightBulbIcon,
  MusicalNoteIcon,
  PlusIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card } from 'ui'

const Home: React.FC = () => {
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
        <Button variant="primary" size="lg">
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
