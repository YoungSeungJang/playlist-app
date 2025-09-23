import { updatePlaylist, type Playlist } from '@/lib/playlistApi'
import React, { useState } from 'react'
import { Button, Modal } from 'ui'

interface EditPlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  playlist: Playlist
  onPlaylistUpdated: (updatedPlaylist: Playlist) => void
}

const EditPlaylistModal: React.FC<EditPlaylistModalProps> = ({
  isOpen,
  onClose,
  playlist,
  onPlaylistUpdated,
}) => {
  const [title, setTitle] = useState(playlist.title)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('플레이리스트 제목을 입력해주세요.')
      return
    }

    try {
      setIsUpdating(true)
      setError(null)

      const updatedPlaylist = await updatePlaylist(playlist.id, { title: title.trim() })
      onPlaylistUpdated(updatedPlaylist)
      onClose()
    } catch (error) {
      console.error('Failed to update playlist:', error)
      setError(error instanceof Error ? error.message : '플레이리스트 업데이트에 실패했습니다.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    setTitle(playlist.title) // 원래 제목으로 복원
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="플레이리스트 편집">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">플레이리스트 제목</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="플레이리스트 제목을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isUpdating}
            maxLength={100}
          />
        </div>

        {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</div>}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isUpdating}>
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating || !title.trim() || title.trim() === playlist.title}
          >
            {isUpdating ? '저장 중...' : '저장'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default EditPlaylistModal
