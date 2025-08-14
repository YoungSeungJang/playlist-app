import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, Modal } from 'ui'

const PlaylistList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock data for playlists
  const playlists = [
    {
      id: '1',
      title: '내가 좋아하는 K-POP',
      description: '최신 K-POP 히트곡들을 모아둔 플레이리스트',
      trackCount: 42,
      duration: '2시간 45분',
      collaborators: 3,
      isPublic: true,
      lastUpdated: '2시간 전',
      thumbnail: null,
      isOnline: true,
    },
    {
      id: '2',
      title: '팀 프로젝트 BGM',
      description: '집중력을 높이는 배경음악 모음',
      trackCount: 18,
      duration: '1시간 12분',
      collaborators: 5,
      isPublic: false,
      lastUpdated: '1일 전',
      thumbnail: null,
      isOnline: false,
    },
    {
      id: '3',
      title: '운동할 때 듣는 음악',
      description: '에너지를 올려주는 워크아웃 플레이리스트',
      trackCount: 25,
      duration: '1시간 33분',
      collaborators: 1,
      isPublic: true,
      lastUpdated: '3일 전',
      thumbnail: null,
      isOnline: true,
    },
    {
      id: '4',
      title: '로파이 힙합 모음',
      description: '편안한 공부용 로파이 힙합',
      trackCount: 67,
      duration: '4시간 21분',
      collaborators: 2,
      isPublic: false,
      lastUpdated: '1주일 전',
      thumbnail: null,
      isOnline: false,
    },
    {
      id: '5',
      title: '드라이브 뮤직',
      description: '드라이브할 때 듣기 좋은 음악들',
      trackCount: 33,
      duration: '2시간 15분',
      collaborators: 4,
      isPublic: true,
      lastUpdated: '2주일 전',
      thumbnail: null,
      isOnline: true,
    },
  ]

  const filteredPlaylists = playlists.filter(
    playlist =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const PlaylistCard = ({ playlist }: { playlist: (typeof playlists)[0] }) => (
    <Card variant="default" padding="lg" className="group hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <MusicalNoteIcon className="w-8 h-8 text-white" />
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
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <div
                className={`w-2 h-2 rounded-full ${playlist.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
              />
              <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <span>{playlist.trackCount}곡</span>
            <span>{playlist.duration}</span>
            <span>{playlist.lastUpdated}</span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-3">
              <Badge variant={playlist.isPublic ? 'success' : 'default'} size="sm">
                {playlist.isPublic ? '공개' : '비공개'}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <UsersIcon className="w-4 h-4 mr-1" />
                {playlist.collaborators}명
              </div>
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
          <h1 className="text-3xl font-bold text-gray-900">내 플레이리스트</h1>
          <p className="text-lg text-gray-600 mt-2">
            총 {playlists.length}개의 플레이리스트를 만들었습니다
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />새 플레이리스트
        </Button>
      </div>

      {/* Search and Filter */}
      <Card variant="default" padding="md">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="플레이리스트 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="all">모든 플레이리스트</option>
            <option value="public">공개</option>
            <option value="private">비공개</option>
            <option value="collaborative">협업</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option value="updated">최근 업데이트순</option>
            <option value="created">생성일순</option>
            <option value="name">이름순</option>
            <option value="tracks">곡 수순</option>
          </select>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{playlists.length}</div>
          <p className="text-sm text-gray-600">총 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {playlists.reduce((sum, p) => sum + p.trackCount, 0)}
          </div>
          <p className="text-sm text-gray-600">총 곡 수</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {playlists.filter(p => p.isPublic).length}
          </div>
          <p className="text-sm text-gray-600">공개 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {playlists.filter(p => p.isOnline).length}
          </div>
          <p className="text-sm text-gray-600">실시간 협업</p>
        </Card>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        {filteredPlaylists.length > 0 ? (
          filteredPlaylists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)
        ) : (
          <Card variant="default" padding="xl" className="text-center">
            <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-gray-600 mb-6">
              다른 검색어를 사용하거나 새로운 플레이리스트를 만들어보세요
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />새 플레이리스트 만들기
            </Button>
          </Card>
        )}
      </div>

      {/* Create Playlist Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="새 플레이리스트 만들기"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              플레이리스트 이름
            </label>
            <input
              type="text"
              placeholder="플레이리스트 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">설명 (선택사항)</label>
            <textarea
              placeholder="플레이리스트에 대한 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              공개 플레이리스트로 만들기
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              취소
            </Button>
            <Button variant="primary">만들기</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PlaylistList
