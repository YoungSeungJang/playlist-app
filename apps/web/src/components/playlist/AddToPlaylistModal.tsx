import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SimpleTrack } from 'shared'
import { Button, Modal } from 'ui'
import { usePlaylistStore } from '@/store/playlistStore'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

interface AddToPlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTrack: SimpleTrack | null
  onPlaylistSelect: (playlistId: string) => void
  isAddingTrack: boolean
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  selectedTrack,
  onPlaylistSelect,
  isAddingTrack,
}) => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { openLoginModal } = useAuthStore()
  const { ownedPlaylists, joinedPlaylists } = usePlaylistStore()
  
  // 모든 플레이리스트 합치기 (소유한 것 + 공유받은 것)
  const allPlaylists = [
    ...ownedPlaylists.map(playlist => ({ ...playlist, isOwned: true })),
    ...joinedPlaylists.map(playlist => ({ ...playlist, isOwned: false }))
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="플레이리스트 선택">
      <div className="space-y-4">
        {selectedTrack && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-1">추가할 곡</h4>
            <p className="text-sm text-gray-600">
              {selectedTrack.title} - {selectedTrack.artist_names.join(', ')}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">플레이리스트를 선택하세요:</p>
          
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">플레이리스트에 곡을 추가하려면 로그인이 필요합니다.</p>
              <div className="flex justify-center space-x-3">
                <Button variant="outline" onClick={onClose}>
                  취소
                </Button>
                <Button variant="primary" onClick={() => { onClose(); openLoginModal(); }}>
                  로그인
                </Button>
              </div>
            </div>
          ) : allPlaylists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">플레이리스트가 없습니다.</p>
              <Button variant="primary" onClick={() => navigate('/playlists')}>
                플레이리스트 만들기
              </Button>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {allPlaylists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => onPlaylistSelect(playlist.id)}
                  disabled={isAddingTrack}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">{playlist.title}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      {playlist.isOwned ? '소유' : '참여'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {playlist.isOwned ? `초대 코드: ${playlist.invite_code}` : `소유자: ${playlist.ownerName || '알 수 없음'}`}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={onClose} disabled={isAddingTrack}>
              취소
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AddToPlaylistModal