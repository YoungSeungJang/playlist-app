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
  // Additional fields for joined playlists
  ownerName?: string
  joined_at?: string
}

export interface PlaylistTrack {
  id: string
  playlist_id: string
  spotify_track_id: string
  title: string
  artist: string
  album: string
  album_id: string
  artist_id: string
  cover_url: string | null
  duration_ms: number
  preview_url: string | null
  position: number
  added_by: string
  added_at: string
}

export interface AddTrackRequest {
  playlistId: string
  spotifyTrackId: string
  title: string
  artist: string
  album: string
  albumId: string
  artistIds: string[]
  coverUrl?: string
  durationMs: number
  previewUrl?: string
}

export interface PlaylistMember {
  playlist_id: string
  user_id: string
  joined_at: string
  is_online: boolean
  last_seen: string
}

export interface JoinPlaylistRequest {
  inviteCode: string
}

function generateInviteCode(): string {
  return nanoid(8)
}

// 플레이리스트 접근 권한 확인 (소유자 또는 멤버)
async function checkPlaylistAccess(playlistId: string, userId: string): Promise<boolean> {
  try {
    // 1. 소유자인지 확인
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('created_by')
      .eq('id', playlistId)
      .single()

    if (playlistError) {
      console.error('Error checking playlist ownership:', playlistError)
      return false
    }

    // 소유자면 접근 허용
    if (playlist && playlist.created_by === userId) {
      return true
    }

    // 2. 멤버인지 확인
    const { data: membership, error: memberError } = await supabase
      .from('playlist_members')
      .select('user_id')
      .eq('playlist_id', playlistId)
      .eq('user_id', userId)
      .single()

    if (memberError && memberError.code !== 'PGRST116') {
      console.error('Error checking playlist membership:', memberError)
      return false
    }

    // 멤버면 접근 허용
    return !!membership
  } catch (error) {
    console.error('Check playlist access error:', error)
    return false
  }
}

// 플레이리스트 곡 순서 재정렬 (제거 후)
async function reorderPlaylistTracks(playlistId: string, removedPosition: number): Promise<void> {
  try {
    // 제거된 position 이후의 모든 곡들 조회
    const { data: tracks, error } = await supabase
      .from('playlist_tracks')
      .select('id, position')
      .eq('playlist_id', playlistId)
      .gt('position', removedPosition)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching tracks for reordering:', error)
      return
    }

    // 각 곡의 position을 1씩 줄임
    for (const track of tracks || []) {
      const { error: updateError } = await supabase
        .from('playlist_tracks')
        .update({ position: track.position - 1 })
        .eq('id', track.id)

      if (updateError) {
        console.error('Error updating track position:', updateError)
      }
    }
  } catch (error) {
    console.error('Reorder tracks error:', error)
  }
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

// 사용자가 소유한 플레이리스트 목록 조회
export async function getUserOwnedPlaylists(): Promise<Playlist[]> {
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
      console.error('Error fetching owned playlists:', error)
      throw new Error('소유한 플레이리스트 조회에 실패했습니다.')
    }

    return data || []
  } catch (error) {
    console.error('Get user owned playlists error:', error)
    throw error
  }
}

// 사용자가 참여한 플레이리스트 목록 조회 (소유자가 아닌 것들)
export async function getUserJoinedPlaylists(): Promise<Playlist[]> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 참여한 플레이리스트 조회 (멤버로 등록된 것 중 소유자가 아닌 것)
    const { data, error } = await supabase
      .from('playlist_members')
      .select(
        `
        playlists!inner (
          id,
          title,
          invite_code,
          created_by,
          created_at,
          updated_at
        ),
        joined_at
      `
      )
      .eq('user_id', user.id)
      .neq('playlists.created_by', user.id) // 소유자가 아닌 것만

    if (error) {
      console.error('Error fetching joined playlists:', error)
      throw new Error('참여한 플레이리스트 조회에 실패했습니다.')
    }

    // playlists 객체 추출 및 소유자 정보 추가
    const joinedPlaylistsWithOwner = await Promise.all(
      (data || [])
        .filter(item => item.playlists)
        .map(async item => {
          const playlist = item.playlists! as unknown as Playlist

          // 소유자 정보 조회 (profiles 테이블에서)
          const { data: ownerData } = await supabase
            .from('profiles')
            .select('nickname')
            .eq('id', playlist.created_by)
            .single()

          const result: Playlist = {
            ...playlist,
            ownerName: ownerData?.nickname || '알 수 없음',
            joined_at: item.joined_at,
          }
          return result
        })
    )

    const joinedPlaylists = joinedPlaylistsWithOwner.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )

    return joinedPlaylists
  } catch (error) {
    console.error('Get user joined playlists error:', error)
    throw error
  }
}

// 호환성을 위한 기존 함수 (소유한 플레이리스트만 반환)
export async function getUserPlaylists(): Promise<Playlist[]> {
  return getUserOwnedPlaylists()
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

// 플레이리스트에 곡 추가
export async function addTrackToPlaylist(request: AddTrackRequest): Promise<PlaylistTrack> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 플레이리스트 권한 확인 (편집 권한은 소유자만)
    const playlist = await getPlaylistById(request.playlistId)
    if (!playlist) {
      throw new Error('플레이리스트를 찾을 수 없습니다.')
    }

    // 곡 추가는 소유자 또는 멤버만 가능
    const hasAccess = await checkPlaylistAccess(request.playlistId, user.id)
    if (!hasAccess) {
      throw new Error('플레이리스트에 곡을 추가할 권한이 없습니다.')
    }

    // 현재 플레이리스트의 마지막 position 조회
    const { data: lastTrack } = await supabase
      .from('playlist_tracks')
      .select('position')
      .eq('playlist_id', request.playlistId)
      .order('position', { ascending: false })
      .limit(1)
      .single()
    const nextPosition = lastTrack ? lastTrack.position + 1 : 1

    // 곡 추가
    const { data, error } = await supabase
      .from('playlist_tracks')
      .insert({
        playlist_id: request.playlistId,
        spotify_track_id: request.spotifyTrackId,
        title: request.title,
        artist: request.artist,
        album: request.album,
        album_id: request.albumId,
        artist_id: JSON.stringify(request.artistIds),
        cover_url: request.coverUrl || null,
        duration_ms: request.durationMs,
        preview_url: request.previewUrl || null,
        position: nextPosition,
        added_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding track to playlist:', error)
      throw new Error('곡 추가에 실패했습니다.')
    }

    return data
  } catch (error) {
    console.error('Add track to playlist error:', error)
    throw error
  }
}

// 플레이리스트의 곡 목록 조회
export async function getPlaylistTracks(playlistId: string): Promise<PlaylistTrack[]> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 플레이리스트 권한 확인 (소유자 또는 멤버)
    const playlist = await getPlaylistById(playlistId)
    if (!playlist) {
      throw new Error('플레이리스트를 찾을 수 없습니다.')
    }

    const hasAccess = await checkPlaylistAccess(playlistId, user.id)
    if (!hasAccess) {
      throw new Error('플레이리스트에 접근할 권한이 없습니다.')
    }

    // 곡 목록 조회
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching playlist tracks:', error)
      throw new Error('곡 목록 조회에 실패했습니다.')
    }

    return data || []
  } catch (error) {
    console.error('Get playlist tracks error:', error)
    throw error
  }
}

// 플레이리스트 트랙 개수 조회
export async function getPlaylistTrackCount(playlistId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('playlist_tracks')
      .select('*', { count: 'exact', head: true })
      .eq('playlist_id', playlistId)

    if (error) {
      console.error('Error fetching playlist track count:', error)
      return 0
    }

    return count || 0
  } catch (error) {
    console.error('Get playlist track count error:', error)
    return 0
  }
}

// 플레이리스트에서 곡 제거
export async function removeTrackFromPlaylist(trackId: string): Promise<void> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 곡 정보와 플레이리스트 권한 확인
    const { data: track, error: trackError } = await supabase
      .from('playlist_tracks')
      .select('*, playlists!inner(created_by)')
      .eq('id', trackId)
      .single()

    if (trackError || !track) {
      throw new Error('곡을 찾을 수 없습니다.')
    }

    // @ts-ignore - Supabase 타입 이슈로 임시 처리
    if (track.playlists.created_by !== user.id) {
      throw new Error('곡을 제거할 권한이 없습니다.')
    }

    // 곡 제거
    const { error } = await supabase.from('playlist_tracks').delete().eq('id', trackId)

    if (error) {
      console.error('Error removing track from playlist:', error)
      throw new Error('곡 제거에 실패했습니다.')
    }

    // position 재정렬 (제거된 곡 이후의 곡들을 하나씩 앞으로 이동)
    await reorderPlaylistTracks(track.playlist_id, track.position)
  } catch (error) {
    console.error('Remove track from playlist error:', error)
    throw error
  }
}

// 초대 코드로 플레이리스트 참여
export async function joinPlaylistByCode(inviteCode: string): Promise<Playlist> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 초대 코드로 플레이리스트 찾기
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('invite_code', inviteCode)
      .single()

    if (playlistError || !playlist) {
      throw new Error('유효하지 않은 초대 코드입니다.')
    }

    // 이미 참여했는지 확인
    const { data: existingMember, error: memberError } = await supabase
      .from('playlist_members')
      .select('*')
      .eq('playlist_id', playlist.id)
      .eq('user_id', user.id)
      .single()

    if (!memberError && existingMember) {
      throw new Error('이미 참여중인 플레이리스트입니다.')
    }

    // 플레이리스트에 멤버로 추가
    const { error: insertError } = await supabase.from('playlist_members').insert({
      playlist_id: playlist.id,
      user_id: user.id,
      is_online: true,
    })

    if (insertError) {
      console.error('Error joining playlist:', insertError)
      throw new Error('플레이리스트 참여에 실패했습니다.')
    }

    return playlist
  } catch (error) {
    console.error('Join playlist by code error:', error)
    throw error
  }
}

// 플레이리스트 멤버 목록 조회
export async function getPlaylistMembers(playlistId: string): Promise<PlaylistMember[]> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    const { data, error } = await supabase
      .from('playlist_members')
      .select('*')
      .eq('playlist_id', playlistId)
      .order('joined_at', { ascending: true })

    if (error) {
      console.error('Error fetching playlist members:', error)
      throw new Error('멤버 목록을 불러오는데 실패했습니다.')
    }

    return data || []
  } catch (error) {
    console.error('Get playlist members error:', error)
    throw error
  }
}

// 플레이리스트 탈퇴
export async function leavePlaylist(playlistId: string): Promise<void> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    const { error } = await supabase
      .from('playlist_members')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error leaving playlist:', error)
      throw new Error('플레이리스트 탈퇴에 실패했습니다.')
    }
  } catch (error) {
    console.error('Leave playlist error:', error)
    throw error
  }
}

// 멤버 제거 (Owner만 가능)
export async function removeMember(playlistId: string, userId: string): Promise<void> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 플레이리스트 소유자인지 확인
    const playlist = await getPlaylistById(playlistId)
    if (!playlist || playlist.created_by !== user.id) {
      throw new Error('멤버를 제거할 권한이 없습니다.')
    }

    const { error } = await supabase
      .from('playlist_members')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error removing member:', error)
      throw new Error('멤버 제거에 실패했습니다.')
    }
  } catch (error) {
    console.error('Remove member error:', error)
    throw error
  }
}

// 최근 트랙 추가 활동 조회
export async function getRecentTrackActivities(limit: number = 10): Promise<any[]> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    console.log('Current user ID:', user.id)

    // 먼저 간단한 쿼리로 테스트 - 사용자가 소유한 플레이리스트의 트랙만
    const { data, error } = await supabase
      .from('playlist_tracks')
      .select(
        `
        id,
        title,
        artist,
        created_at,
        added_by,
        playlists!inner (
          id,
          title,
          created_by
        )
      `
      )
      .eq('playlists.created_by', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    console.log('Query result:', { data, error })

    if (error) {
      console.error('Error fetching recent track activities:', error)
      throw new Error('최근 활동을 불러오는데 실패했습니다.')
    }

    // 사용자 정보를 별도로 조회
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(item => item.added_by))]
      const { data: usersData } = await supabase
        .from('profiles')
        .select('id, nickname')
        .in('id', userIds)

      // 사용자 정보를 매핑
      const result = data.map(item => ({
        ...item,
        profiles: usersData?.find(user => user.id === item.added_by) || { nickname: '알 수 없음' },
      }))

      return result
    }

    return data || []
  } catch (error) {
    console.error('Get recent track activities error:', error)
    throw error
  }
}

// 사용자가 접근 가능한 플레이리스트 ID 목록 조회 (멤버로 참여한 것들)
async function getUserAccessiblePlaylistIds(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('playlist_members')
    .select('playlist_id')
    .eq('user_id', userId)

  return data?.map(item => item.playlist_id) || []
}

// 플레이리스트 업데이트
export async function updatePlaylist(
  playlistId: string,
  updates: { title?: string }
): Promise<Playlist> {
  try {
    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      throw new Error('로그인이 필요합니다.')
    }

    // 플레이리스트 소유자인지 확인
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('created_by')
      .eq('id', playlistId)
      .single()

    if (playlistError || !playlist) {
      throw new Error('플레이리스트를 찾을 수 없습니다.')
    }

    if (playlist.created_by !== user.id) {
      throw new Error('플레이리스트를 수정할 권한이 없습니다.')
    }

    // 플레이리스트 업데이트
    const { data, error } = await supabase
      .from('playlists')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', playlistId)
      .select()
      .single()

    if (error) {
      console.error('Error updating playlist:', error)
      throw new Error('플레이리스트 업데이트에 실패했습니다.')
    }

    return data
  } catch (error) {
    console.error('Update playlist error:', error)
    throw error
  }
}
