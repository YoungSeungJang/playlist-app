import { useState } from 'react'
import { SimpleTrack } from 'shared'
import { addTrackToPlaylist } from '@/lib/playlistApi'
import { usePlaylistStore } from '@/store/playlistStore'

interface UseAddToPlaylistOptions {
  onTrackAdded?: () => void
}

export const useAddToPlaylist = (options?: UseAddToPlaylistOptions) => {
  const { loadPlaylists } = usePlaylistStore()
  const [showPlaylistModal, setShowPlaylistModal] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<SimpleTrack | null>(null)
  const [isAddingTrack, setIsAddingTrack] = useState(false)

  // duration을 "3:24" 형식에서 밀리초로 변환
  const convertDurationToMs = (duration: string): number => {
    const parts = duration.split(':')
    const minutes = parseInt(parts[0]) || 0
    const seconds = parseInt(parts[1]) || 0
    return (minutes * 60 + seconds) * 1000
  }

  const handleAddToPlaylist = (track: SimpleTrack) => {
    setSelectedTrack(track)
    setShowPlaylistModal(true)
  }

  const handlePlaylistSelect = async (playlistId: string) => {
    if (!selectedTrack) return

    try {
      setIsAddingTrack(true)
      
      // duration을 밀리초로 변환
      const durationMs = convertDurationToMs(selectedTrack.duration)
      
      await addTrackToPlaylist({
        playlistId,
        spotifyTrackId: selectedTrack.id,
        title: selectedTrack.title,
        artist: selectedTrack.artist_names.join(', '),
        album: selectedTrack.album,
        albumId: selectedTrack.album_id,
        artistIds: selectedTrack.artist_ids,
        coverUrl: selectedTrack.image_url || undefined,
        durationMs,
        previewUrl: selectedTrack.preview_url || undefined,
      })

      // 성공 시 모달 닫기
      setShowPlaylistModal(false)
      setSelectedTrack(null)
      
      // 플레이리스트 상태 새로고침
      await loadPlaylists()
      
      // 외부 callback 호출 (예: track count 업데이트)
      if (options?.onTrackAdded) {
        options.onTrackAdded()
      }
      
      // 성공 피드백
      alert(`"${selectedTrack.title}"가 플레이리스트에 추가되었습니다!`)
    } catch (error) {
      console.error('Failed to add track to playlist:', error)
      alert('곡 추가에 실패했습니다.')
    } finally {
      setIsAddingTrack(false)
    }
  }

  const handleCloseModal = () => {
    setShowPlaylistModal(false)
    setSelectedTrack(null)
  }

  return {
    showPlaylistModal,
    selectedTrack,
    isAddingTrack,
    handleAddToPlaylist,
    handlePlaylistSelect,
    handleCloseModal,
  }
}