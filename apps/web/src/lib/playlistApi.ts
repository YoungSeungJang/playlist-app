import { nanoid } from 'nanoid'
import { supabase } from './supabase'

export interface CreatePlaylistRequest {
  title: string
  description?: string
  isPublic?: boolean
}

export interface Playlist {
  id: string
  title: string
  invite_code: string
  created_by: string
  created_at: string
  updated_at: string
}

function generateInviteCode(): string {
  return nanoid()
}

// 플레이리스트 생성
export async function createPlaylist(request: CreatePlaylistRequest): Promise<Playlist> {
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    const inviteCode = generateInviteCode()

    const { data, error } = await supabase
      .from('playlists')
      .insert({
        title: request.title,
        invite_code: inviteCode,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating playlist:', error)
      throw new Error('플레이리스트 생성에 실패했습니다.')
    }

    return data
  } catch (error) {
    console.error('Create playlist error:', error)
    throw error
  }
}

// 사용자의 플레이리스트 목록 조회
export async function getUserPlaylists(): Promise<Playlist[]> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 사용자가 생성한 플레이리스트 조회
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('created_by', user.id)
      .order('updated_at', { ascending: false })
    if (error) {
      console.error('Error fetching playlists:', error)
      throw new Error('플레이리스트 조회에 실패했습니다.')
    }

    return data || []
  } catch (error) {
    console.error('Get user playlists error:', error)
    throw error
  }
}

// 특정 플레이리스트 조회
export async function getPlaylistById(id: string): Promise<Playlist | null> {
  try {
    const { data, error } = await supabase.from('playlists').select('*').eq('id', id).single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching playlist:', error)
      throw new Error('플레이리스트 조회에 실패했습니다.')
    }

    return data || null
  } catch (error) {
    console.error('Get playlist error:', error)
    throw error
  }
}

// 플레이리스트 삭제
export async function deletePlaylist(id: string): Promise<void> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 본인이 생성한 플레이리스트인지 확인
    const playlist = await getPlaylistById(id)
    if (!playlist || playlist.created_by !== user.id) {
      throw new Error('삭제 권한이 없습니다.')
    }

    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)
      .eq('created_by', user.id)

    if (error) {
      console.error('Error deleting playlist:', error)
      throw new Error('플레이리스트 삭제에 실패했습니다.')
    }
  } catch (error) {
    console.error('Delete playlist error:', error)
    throw error
  }
}
