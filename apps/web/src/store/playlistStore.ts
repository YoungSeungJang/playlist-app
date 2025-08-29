import { create } from 'zustand'
import { 
  createPlaylist as apiCreatePlaylist, 
  getUserPlaylists, 
  deletePlaylist as apiDeletePlaylist,
  type Playlist, 
  type CreatePlaylistRequest 
} from '@/lib/playlistApi'

interface PlaylistState {
  // State
  playlists: Playlist[]
  loading: boolean
  error: string | null

  // Actions
  loadPlaylists: () => Promise<void>
  createPlaylist: (request: CreatePlaylistRequest) => Promise<Playlist>
  deletePlaylist: (id: string) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  // Initial state
  playlists: [],
  loading: false,
  error: null,

  // 플레이리스트 목록 불러오기
  loadPlaylists: async () => {
    try {
      set({ loading: true, error: null })
      const playlists = await getUserPlaylists()
      set({ playlists, loading: false })
    } catch (error) {
      console.error('Failed to load playlists:', error)
      set({ 
        error: error instanceof Error ? error.message : '플레이리스트를 불러오는데 실패했습니다.',
        loading: false 
      })
    }
  },

  // 새 플레이리스트 생성
  createPlaylist: async (request: CreatePlaylistRequest) => {
    try {
      set({ loading: true, error: null })
      const newPlaylist = await apiCreatePlaylist(request)
      
      // 새 플레이리스트를 기존 목록 맨 앞에 추가
      const currentPlaylists = get().playlists
      set({ 
        playlists: [newPlaylist, ...currentPlaylists],
        loading: false 
      })
      
      return newPlaylist
    } catch (error) {
      console.error('Failed to create playlist:', error)
      set({ 
        error: error instanceof Error ? error.message : '플레이리스트 생성에 실패했습니다.',
        loading: false 
      })
      throw error
    }
  },

  // 플레이리스트 삭제
  deletePlaylist: async (id: string) => {
    try {
      set({ loading: true, error: null })
      await apiDeletePlaylist(id)
      
      // 삭제된 플레이리스트를 목록에서 제거
      const currentPlaylists = get().playlists
      set({ 
        playlists: currentPlaylists.filter(playlist => playlist.id !== id),
        loading: false 
      })
    } catch (error) {
      console.error('Failed to delete playlist:', error)
      set({ 
        error: error instanceof Error ? error.message : '플레이리스트 삭제에 실패했습니다.',
        loading: false 
      })
      throw error
    }
  },

  // 에러 초기화
  clearError: () => {
    set({ error: null })
  },

  // 로딩 상태 설정
  setLoading: (loading: boolean) => {
    set({ loading })
  },
}))

export default usePlaylistStore