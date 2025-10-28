import { create } from 'zustand'
import { 
  createPlaylist as apiCreatePlaylist, 
  getUserOwnedPlaylists,
  getUserJoinedPlaylists,
  deletePlaylist as apiDeletePlaylist,
  type Playlist, 
  type CreatePlaylistRequest 
} from '@/lib/playlistApi'

interface PlaylistState {
  // State
  ownedPlaylists: Playlist[]
  joinedPlaylists: Playlist[]
  loading: boolean
  error: string | null

  // Actions
  loadOwnedPlaylists: () => Promise<void>
  loadJoinedPlaylists: () => Promise<void>
  loadAllPlaylists: () => Promise<void>
  createPlaylist: (request: CreatePlaylistRequest) => Promise<Playlist>
  deletePlaylist: (id: string) => Promise<void>
  clearError: () => void
  setLoading: (loading: boolean) => void
  
  // Legacy - 호환성을 위해 유지
  playlists: Playlist[]
  loadPlaylists: () => Promise<void>
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  // Initial state
  ownedPlaylists: [],
  joinedPlaylists: [],
  loading: false,
  error: null,

  // 소유한 플레이리스트 목록 불러오기
  loadOwnedPlaylists: async () => {
    try {
      set({ loading: true, error: null })
      const ownedPlaylists = await getUserOwnedPlaylists()
      set({ ownedPlaylists, loading: false })
    } catch (error) {
      console.error('Failed to load owned playlists:', error)
      set({ 
        error: error instanceof Error ? error.message : '소유한 플레이리스트를 불러오는데 실패했습니다.',
        loading: false 
      })
    }
  },

  // 참여한 플레이리스트 목록 불러오기
  loadJoinedPlaylists: async () => {
    try {
      set({ loading: true, error: null })
      const joinedPlaylists = await getUserJoinedPlaylists()
      set({ joinedPlaylists, loading: false })
    } catch (error) {
      console.error('Failed to load joined playlists:', error)
      set({ 
        error: error instanceof Error ? error.message : '참여한 플레이리스트를 불러오는데 실패했습니다.',
        loading: false 
      })
    }
  },

  // 모든 플레이리스트 불러오기 (소유 + 참여)
  loadAllPlaylists: async () => {
    try {
      set({ loading: true, error: null })
      const [ownedPlaylists, joinedPlaylists] = await Promise.all([
        getUserOwnedPlaylists(),
        getUserJoinedPlaylists()
      ])
      set({ ownedPlaylists, joinedPlaylists, loading: false })
    } catch (error) {
      console.error('Failed to load all playlists:', error)
      set({ 
        error: error instanceof Error ? error.message : '플레이리스트를 불러오는데 실패했습니다.',
        loading: false 
      })
    }
  },

  // Legacy - 호환성을 위해 유지 (소유한 플레이리스트만)
  playlists: [],
  loadPlaylists: async () => {
    const { loadOwnedPlaylists } = get()
    await loadOwnedPlaylists()
    const { ownedPlaylists } = get()
    set({ playlists: ownedPlaylists })
  },

  // 새 플레이리스트 생성
  createPlaylist: async (request: CreatePlaylistRequest) => {
    try {
      set({ loading: true, error: null })
      const newPlaylist = await apiCreatePlaylist(request)
      
      // 새 플레이리스트를 소유한 플레이리스트 목록 맨 앞에 추가
      const { ownedPlaylists, playlists } = get()
      set({ 
        ownedPlaylists: [newPlaylist, ...ownedPlaylists],
        playlists: [newPlaylist, ...playlists], // Legacy 지원
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
      
      // 삭제된 플레이리스트를 모든 목록에서 제거
      const { ownedPlaylists, joinedPlaylists, playlists } = get()
      set({ 
        ownedPlaylists: ownedPlaylists.filter(playlist => playlist.id !== id),
        joinedPlaylists: joinedPlaylists.filter(playlist => playlist.id !== id),
        playlists: playlists.filter(playlist => playlist.id !== id), // Legacy 지원
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