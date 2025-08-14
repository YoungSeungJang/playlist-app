import {
  ClockIcon,
  EyeIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PlayIcon,
  ShareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card } from 'ui'

const SharedPlaylists: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState('all')

  // Mock data for shared playlists
  const sharedPlaylists = [
    {
      id: 'shared-1',
      title: '친구들과 함께하는 K-POP',
      description: '우리가 함께 만들어가는 최고의 K-POP 플레이리스트',
      trackCount: 67,
      duration: '4시간 12분',
      owner: {
        name: 'Alice Kim',
        avatar: null,
      },
      collaborators: [
        { name: 'Bob Lee', avatar: null },
        { name: 'Charlie Park', avatar: null },
        { name: 'Dana Choi', avatar: null },
      ],
      isLiked: true,
      likes: 24,
      views: 1250,
      lastUpdated: '30분 전',
      joinedAt: '2주일 전',
      permission: 'edit', // view, edit, admin
      isOnline: true,
      thumbnail: null,
    },
    {
      id: 'shared-2',
      title: '팀 작업용 집중 음악',
      description: '집중력 향상을 위한 백색소음과 로파이 힙합',
      trackCount: 45,
      duration: '3시간 21분',
      owner: {
        name: 'Project Manager',
        avatar: null,
      },
      collaborators: [
        { name: '김개발', avatar: null },
        { name: '이디자인', avatar: null },
        { name: '박기획', avatar: null },
        { name: '최마케팅', avatar: null },
      ],
      isLiked: false,
      likes: 12,
      views: 890,
      lastUpdated: '2시간 전',
      joinedAt: '1개월 전',
      permission: 'edit',
      isOnline: false,
      thumbnail: null,
    },
    {
      id: 'shared-3',
      title: '운동 동호회 워크아웃 뮤직',
      description: '고강도 운동을 위한 에너지 넘치는 음악들',
      trackCount: 38,
      duration: '2시간 45분',
      owner: {
        name: '헬스왕',
        avatar: null,
      },
      collaborators: [
        { name: '근육맨', avatar: null },
        { name: '러닝걸', avatar: null },
      ],
      isLiked: true,
      likes: 156,
      views: 3420,
      lastUpdated: '1일 전',
      joinedAt: '3주일 전',
      permission: 'view',
      isOnline: true,
      thumbnail: null,
    },
    {
      id: 'shared-4',
      title: '스터디 카페 BGM',
      description: '공부할 때 듣기 좋은 잔잔한 인스트루멘탈',
      trackCount: 89,
      duration: '5시간 30분',
      owner: {
        name: '공부벌레',
        avatar: null,
      },
      collaborators: [
        { name: '수험생A', avatar: null },
        { name: '취준생B', avatar: null },
        { name: '대학생C', avatar: null },
      ],
      isLiked: false,
      likes: 78,
      views: 2100,
      lastUpdated: '3일 전',
      joinedAt: '1주일 전',
      permission: 'edit',
      isOnline: false,
      thumbnail: null,
    },
  ]

  const filteredPlaylists = sharedPlaylists.filter(playlist => {
    const matchesSearch =
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.owner.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filter === 'all' ||
      (filter === 'liked' && playlist.isLiked) ||
      (filter === 'editable' && playlist.permission === 'edit') ||
      (filter === 'recent' && playlist.lastUpdated.includes('시간'))

    return matchesSearch && matchesFilter
  })

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
        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 relative">
          <MusicalNoteIcon className="w-8 h-8 text-white" />
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${playlist.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link to={`/playlist/${playlist.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {playlist.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{playlist.description}</p>

              {/* Owner info */}
              <div className="flex items-center mt-2">
                <Avatar name={playlist.owner.name} size="xs" />
                <span className="text-sm text-gray-500 ml-2">{playlist.owner.name}</span>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2">
              {getPermissionBadge(playlist.permission)}
              <button
                className={`p-1 transition-colors ${playlist.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
              >
                {playlist.isLiked ? (
                  <HeartSolidIcon className="w-5 h-5" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <span>{playlist.trackCount}곡</span>
            <span>{playlist.duration}</span>
            <div className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              {playlist.views.toLocaleString()}
            </div>
            <div className="flex items-center">
              <HeartIcon className="w-4 h-4 mr-1" />
              {playlist.likes}
            </div>
          </div>

          {/* Collaborators */}
          <div className="flex items-center mt-3">
            <div className="flex -space-x-2">
              {playlist.collaborators.slice(0, 4).map((collaborator, index) => (
                <Avatar
                  key={index}
                  name={collaborator.name}
                  size="xs"
                  className="border-2 border-white"
                />
              ))}
              {playlist.collaborators.length > 4 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
                  +{playlist.collaborators.length - 4}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500 ml-3">
              {playlist.collaborators.length + 1}명이 참여 중
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" />
                {playlist.lastUpdated}
              </div>
              <span>참여: {playlist.joinedAt}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <ShareIcon className="w-4 h-4 mr-1" />
                공유
              </Button>
              <Button variant="ghost" size="sm">
                <PlayIcon className="w-4 h-4 mr-1" />
                재생
              </Button>
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
            {sharedPlaylists.length}개의 플레이리스트에 참여하고 있습니다
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card variant="default" padding="md">
        <div className="flex items-center space-x-4">
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
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">모든 플레이리스트</option>
            <option value="liked">좋아요 한 플레이리스트</option>
            <option value="editable">편집 가능한 플레이리스트</option>
            <option value="recent">최근 활동</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="updated">최근 업데이트순</option>
            <option value="joined">참여일순</option>
            <option value="popular">인기순</option>
            <option value="name">이름순</option>
          </select>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{sharedPlaylists.length}</div>
          <p className="text-sm text-gray-600">참여 중인 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sharedPlaylists.filter(p => p.permission === 'edit').length}
          </div>
          <p className="text-sm text-gray-600">편집 가능</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sharedPlaylists.filter(p => p.isLiked).length}
          </div>
          <p className="text-sm text-gray-600">좋아요 한 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {sharedPlaylists.filter(p => p.isOnline).length}
          </div>
          <p className="text-sm text-gray-600">실시간 협업</p>
        </Card>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map(playlist => (
            <SharedPlaylistCard key={playlist.id} playlist={playlist} />
          ))
        ) : (
          <Card variant="default" padding="xl" className="text-center">
            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || filter !== 'all'
                ? '검색 결과가 없습니다'
                : '참여 중인 플레이리스트가 없습니다'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filter !== 'all'
                ? '다른 검색어를 사용하거나 필터를 변경해보세요'
                : '친구들이 공유한 플레이리스트에 참여해보세요'}
            </p>
            {!searchQuery && filter === 'all' && (
              <Button variant="primary">플레이리스트 둘러보기</Button>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default SharedPlaylists
