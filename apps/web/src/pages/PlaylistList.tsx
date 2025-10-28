import { useCreatePlaylist } from '@/hooks/mutations/usePlaylistMutations'
import { useAllUserPlaylists } from '@/hooks/queries/usePlaylistQueries'
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button, Card, Modal } from 'ui'

const PlaylistList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlaylistTitle, setNewPlaylistTitle] = useState('')

  // React Query 훅들 사용
  const { data: playlistData, isLoading, error } = useAllUserPlaylists()
  const createPlaylistMutation = useCreatePlaylist()

  // URL 쿼리 파라미터 확인하여 생성 모달 자동 열기
  useEffect(() => {
    const shouldCreatePlaylist = searchParams.get('create') === 'true'
    if (shouldCreatePlaylist) {
      setShowCreateModal(true)
      // URL에서 create 파라미터 제거
      setSearchParams({})
    }
  }, [searchParams, setSearchParams])

  // 검색된 플레이리스트 필터링 (useMemo로 최적화)
  const filteredPlaylists = useMemo(() => {
    if (!playlistData?.all) return []

    return playlistData.all.filter(playlist =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [playlistData?.all, searchQuery])

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

  const PlaylistCard = ({ playlist }: { playlist: any }) => {
    const timeAgo = getTimeAgo(playlist.updated_at)
    const trackCount = 0 // 추후 개별 쿼리로 조회

    return (
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
                <p className="text-sm text-gray-600 mt-1">초대 코드: {playlist.invite_code}</p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span>{trackCount}곡</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // 플레이리스트 생성 핸들러 (React Query mutation 사용)
  const handleCreatePlaylist = async () => {
    if (!newPlaylistTitle.trim()) return

    try {
      await createPlaylistMutation.mutateAsync({ title: newPlaylistTitle.trim() })

      // 성공 시 모달 닫기 및 폼 초기화
      setShowCreateModal(false)
      setNewPlaylistTitle('')
    } catch (error) {
      console.error('Failed to create playlist:', error)
    }
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowCreateModal(false)
    setNewPlaylistTitle('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">내 플레이리스트</h1>
          <p className="text-lg text-gray-600 mt-2">
            총 {playlistData?.all.length || 0}개의 플레이리스트를 만들었습니다
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />새 플레이리스트
        </Button>
      </div>

      {/* Search */}
      <Card variant="default" padding="md">
        <div className="flex items-center">
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
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{playlistData?.all.length || 0}</div>
          <p className="text-sm text-gray-600">총 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">0</div>
          <p className="text-sm text-gray-600">총 곡 수</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{playlistData?.owned.length || 0}</div>
          <p className="text-sm text-gray-600">개인 플레이리스트</p>
        </Card>
        <Card variant="elevated" padding="md" className="text-center">
          <div className="text-2xl font-bold text-gray-900">{playlistData?.joined.length || 0}</div>
          <p className="text-sm text-gray-600">참여 플레이리스트</p>
        </Card>
      </div>

      {/* Playlist Grid */}
      <div className="space-y-4">
        {isLoading ? (
          <Card variant="default" padding="xl" className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">플레이리스트를 불러오는 중...</p>
          </Card>
        ) : filteredPlaylists.length > 0 ? (
          filteredPlaylists.map(playlist => <PlaylistCard key={playlist.id} playlist={playlist} />)
        ) : (playlistData?.all.length || 0) === 0 ? (
          <Card variant="default" padding="xl" className="text-center">
            <MusicalNoteIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">아직 플레이리스트가 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 플레이리스트를 만들어 음악을 정리해보세요</p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <PlusIcon className="w-5 h-5 mr-2" />첫 플레이리스트 만들기
            </Button>
          </Card>
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
              value={newPlaylistTitle}
              onChange={e => setNewPlaylistTitle(e.target.value)}
              placeholder="플레이리스트 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={createPlaylistMutation.isLoading}
            />
          </div>
          {createPlaylistMutation.error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded-md">
              {(createPlaylistMutation.error as Error).message}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="ghost"
              onClick={handleCloseModal}
              disabled={createPlaylistMutation.isLoading}
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePlaylist}
              disabled={createPlaylistMutation.isLoading || !newPlaylistTitle.trim()}
            >
              {createPlaylistMutation.isLoading ? '만드는 중...' : '만들기'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PlaylistList
