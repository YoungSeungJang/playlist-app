import {
  ArrowLeftIcon,
  ClockIcon,
  EllipsisVerticalIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Modal } from 'ui'

const PlaylistDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock playlist data
  const playlist = {
    id: id || '1',
    title: '내가 좋아하는 K-POP',
    description:
      '최신 K-POP 히트곡들을 모아둔 플레이리스트입니다. 친구들과 함께 만들어가는 음악 여행!',
    trackCount: 42,
    duration: '2시간 45분',
    owner: {
      name: 'John Doe',
      avatar: null,
      isCurrentUser: true,
    },
    collaborators: [
      { name: 'Alice Kim', avatar: null, permission: 'edit', isOnline: true },
      { name: 'Bob Lee', avatar: null, permission: 'edit', isOnline: false },
      { name: 'Charlie Park', avatar: null, permission: 'view', isOnline: true },
    ],
    isPublic: true,
    isLiked: true,
    likes: 156,
    views: 3420,
    createdAt: '2주일 전',
    lastUpdated: '2시간 전',
    thumbnail: null,
    permission: 'admin', // admin, edit, view
  }

  // Mock tracks data
  const tracks = [
    {
      id: '1',
      title: 'Dynamite',
      artist: 'BTS',
      album: 'BE',
      duration: '3:19',
      addedBy: 'John Doe',
      addedAt: '2시간 전',
      isLiked: true,
      albumArt: null,
    },
    {
      id: '2',
      title: 'Next Level',
      artist: 'aespa',
      album: 'Next Level',
      duration: '3:30',
      addedBy: 'Alice Kim',
      addedAt: '5시간 전',
      isLiked: false,
      albumArt: null,
    },
    {
      id: '3',
      title: 'SAVAGE',
      artist: 'aespa',
      album: 'Savage',
      duration: '3:59',
      addedBy: 'Bob Lee',
      addedAt: '1일 전',
      isLiked: true,
      albumArt: null,
    },
    {
      id: '4',
      title: 'Permission to Dance',
      artist: 'BTS',
      album: 'Butter',
      duration: '3:07',
      addedBy: 'Charlie Park',
      addedAt: '2일 전',
      isLiked: false,
      albumArt: null,
    },
    {
      id: '5',
      title: 'ELEVEN',
      artist: 'IVE',
      album: 'ELEVEN',
      duration: '2:58',
      addedBy: 'John Doe',
      addedAt: '3일 전',
      isLiked: true,
      albumArt: null,
    },
  ]

  const canEdit = playlist.permission === 'admin' || playlist.permission === 'edit'

  const handlePlayPause = (trackId?: string) => {
    if (trackId) {
      setCurrentTrack(trackId)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const TrackItem = ({ track, index }: { track: (typeof tracks)[0]; index: number }) => (
    <div
      className={`group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
        currentTrack === track.id ? 'bg-primary-50' : ''
      }`}
    >
      {/* Play button / Track number */}
      <div className="w-8 text-center">
        <button
          onClick={() => handlePlayPause(track.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {currentTrack === track.id && isPlaying ? (
            <PauseIcon className="w-5 h-5 text-primary-600" />
          ) : (
            <PlayIcon className="w-5 h-5 text-gray-600 hover:text-primary-600" />
          )}
        </button>
        <span className="text-sm text-gray-500 group-hover:hidden">{index + 1}</span>
      </div>

      {/* Album art */}
      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
        <MusicalNoteIcon className="w-6 h-6 text-white" />
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-medium truncate ${currentTrack === track.id ? 'text-primary-600' : 'text-gray-900'}`}
        >
          {track.title}
        </h4>
        <p className="text-sm text-gray-600 truncate">{track.artist}</p>
      </div>

      {/* Album */}
      <div className="hidden md:block w-48">
        <p className="text-sm text-gray-600 truncate">{track.album}</p>
      </div>

      {/* Added by */}
      <div className="hidden lg:flex items-center w-32">
        <Avatar name={track.addedBy} size="xs" />
        <span className="text-sm text-gray-600 ml-2 truncate">{track.addedBy}</span>
      </div>

      {/* Duration and actions */}
      <div className="flex items-center space-x-2">
        <button
          className={`p-1 transition-colors ${track.isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        >
          {track.isLiked ? (
            <HeartSolidIcon className="w-4 h-4" />
          ) : (
            <HeartIcon className="w-4 h-4" />
          )}
        </button>
        <span className="text-sm text-gray-500 w-12 text-right">{track.duration}</span>
        {canEdit && (
          <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <EllipsisVerticalIcon className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/playlists"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        플레이리스트로 돌아가기
      </Link>

      {/* Playlist Header */}
      <Card variant="default" padding="lg">
        <div className="flex items-start space-x-6">
          {/* Playlist thumbnail */}
          <div className="w-48 h-48 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <MusicalNoteIcon className="w-16 h-16 text-white" />
          </div>

          {/* Playlist info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant={playlist.isPublic ? 'success' : 'default'} size="sm">
                {playlist.isPublic ? '공개' : '비공개'}
              </Badge>
              <span className="text-sm text-gray-500">플레이리스트</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">{playlist.title}</h1>
            <p className="text-gray-600 mb-6 max-w-2xl">{playlist.description}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <Avatar name={playlist.owner.name} size="sm" />
                <span className="ml-2 font-medium text-gray-900">{playlist.owner.name}</span>
              </div>
              <span>{playlist.trackCount}곡</span>
              <span>{playlist.duration}</span>
              <span>{playlist.views.toLocaleString()} 조회</span>
              <span>{playlist.likes} 좋아요</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="primary" size="lg" onClick={() => handlePlayPause()}>
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6 mr-2" />
                ) : (
                  <PlayIcon className="w-6 h-6 mr-2" />
                )}
                {isPlaying ? '일시정지' : '재생'}
              </Button>

              <button
                className={`p-3 rounded-full transition-colors ${
                  playlist.isLiked
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                {playlist.isLiked ? (
                  <HeartSolidIcon className="w-6 h-6" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
              </button>

              <Button variant="ghost" size="lg">
                <ShareIcon className="w-5 h-5 mr-2" />
                공유
              </Button>

              {canEdit && (
                <Button variant="ghost" size="lg">
                  <PencilIcon className="w-5 h-5 mr-2" />
                  편집
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Add track section */}
          {canEdit && (
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="곡 제목이나 아티스트를 검색해서 추가하세요..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                  />
                </div>
                <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="w-4 h-4 mr-1" />곡 추가
                </Button>
              </div>
            </Card>
          )}

          {/* Tracks list */}
          <Card variant="default" padding="none">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">곡 목록</h2>
            </div>

            {/* Table header */}
            <div className="px-6 py-2 border-b border-gray-200 text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="w-8">#</div>
                <div className="w-12"></div>
                <div className="flex-1">제목</div>
                <div className="hidden md:block w-48">앨범</div>
                <div className="hidden lg:block w-32">추가한 사람</div>
                <div className="w-16 text-right">
                  <ClockIcon className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </div>

            {/* Tracks */}
            <div className="divide-y divide-gray-100">
              {tracks.map((track, index) => (
                <TrackItem key={track.id} track={track} index={index} />
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Collaborators */}
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">참여자</h3>
              {canEdit && (
                <Button variant="ghost" size="sm">
                  <UsersIcon className="w-4 h-4 mr-1" />
                  초대
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {/* Owner */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar name={playlist.owner.name} size="sm" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{playlist.owner.name}</p>
                    <p className="text-xs text-gray-500">관리자</p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  소유자
                </Badge>
              </div>

              {/* Collaborators */}
              {playlist.collaborators.map((collaborator, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar name={collaborator.name} size="sm" />
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          collaborator.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{collaborator.name}</p>
                      <p className="text-xs text-gray-500">
                        {collaborator.permission === 'edit' ? '편집 가능' : '보기 전용'}
                      </p>
                    </div>
                  </div>
                  {collaborator.isOnline && (
                    <Badge variant="success" size="sm">
                      온라인
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card variant="default" padding="lg">
            <h3 className="font-semibold text-gray-900 mb-4">최근 활동</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Avatar name="Alice Kim" size="xs" />
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Alice Kim</span>님이 곡을 추가했습니다
                  </p>
                  <p className="text-gray-500">2시간 전</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Avatar name="Bob Lee" size="xs" />
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Bob Lee</span>님이 플레이리스트를 수정했습니다
                  </p>
                  <p className="text-gray-500">5시간 전</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Avatar name="Charlie Park" size="xs" />
                <div>
                  <p className="text-gray-900">
                    <span className="font-medium">Charlie Park</span>님이 참여했습니다
                  </p>
                  <p className="text-gray-500">1일 전</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Track Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="곡 추가하기">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">곡 검색</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="곡 제목, 아티스트, 앨범명으로 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="p-4 text-center text-gray-500">
              검색어를 입력하면 Spotify에서 곡을 찾아옵니다
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              취소
            </Button>
            <Button variant="primary">선택한 곡 추가</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PlaylistDetail
