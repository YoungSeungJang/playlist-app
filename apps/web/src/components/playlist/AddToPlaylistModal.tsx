import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SimpleTrack } from 'shared'
import { Button, Modal } from 'ui'
import { usePlaylistStore } from '@/store/playlistStore'

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
  const { playlists } = usePlaylistStore()

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
          
          {playlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">플레이리스트가 없습니다.</p>
              <Button variant="primary" onClick={() => navigate('/playlists')}>
                플레이리스트 만들기
              </Button>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => onPlaylistSelect(playlist.id)}
                  disabled={isAddingTrack}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="font-medium text-gray-900">{playlist.title}</div>
                  <div className="text-sm text-gray-500">
                    초대 코드: {playlist.invite_code}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose} disabled={isAddingTrack}>
            취소
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddToPlaylistModal