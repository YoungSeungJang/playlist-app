import { useQuery } from '@tanstack/react-query'
import {
  getPlaylistById,
  getPlaylistMembers,
  getPlaylistTrackCount,
  getPlaylistTracks,
  getRecentTrackActivities,
  getUserJoinedPlaylists,
  getUserOwnedPlaylists,
} from '../../lib/playlistApi'

// 사용자가 소유한 플레이리스트 목록 조회
export const useUserOwnedPlaylists = () => {
  return useQuery({
    queryKey: ['playlists', 'owned'],
    queryFn: getUserOwnedPlaylists,
    staleTime: 2 * 60 * 1000, // 2분간 캐시
    cacheTime: 10 * 60 * 1000, // 10분간 보관
  })
}

// 사용자가 참여한 플레이리스트 목록 조회
export const useUserJoinedPlaylists = () => {
  return useQuery({
    queryKey: ['playlists', 'joined'],
    queryFn: getUserJoinedPlaylists,
    staleTime: 2 * 60 * 1000, // 2분간 캐시
    cacheTime: 10 * 60 * 1000, // 10분간 보관
  })
}

// 특정 플레이리스트 상세 정보 조회
export const usePlaylistById = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getPlaylistById(playlistId),
    enabled: !!playlistId, // playlistId가 있을 때만 실행
    staleTime: 1 * 60 * 1000, // 1분간 캐시 (자주 업데이트됨)
    cacheTime: 5 * 60 * 1000, // 5분간 보관
  })
}

// 플레이리스트의 곡 목록 조회
export const usePlaylistTracks = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist-tracks', playlistId],
    queryFn: () => getPlaylistTracks(playlistId),
    enabled: !!playlistId,
    staleTime: 30 * 1000, // 30초간 캐시 (실시간 협업을 위해 짧게)
    cacheTime: 5 * 60 * 1000, // 5분간 보관
    refetchInterval: 10 * 1000, // 10초마다 자동 업데이트 (실시간 협업)
  })
}

// 플레이리스트 트랙 개수 조회
export const usePlaylistTrackCount = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist-track-count', playlistId],
    queryFn: () => getPlaylistTrackCount(playlistId),
    enabled: !!playlistId,
    staleTime: 1 * 60 * 1000, // 1분간 캐시
    cacheTime: 5 * 60 * 1000, // 5분간 보관
  })
}

// 플레이리스트 멤버 목록 조회
export const usePlaylistMembers = (playlistId: string) => {
  return useQuery({
    queryKey: ['playlist-members', playlistId],
    queryFn: () => getPlaylistMembers(playlistId),
    enabled: !!playlistId,
    staleTime: 1 * 60 * 1000, // 1분간 캐시
    cacheTime: 5 * 60 * 1000, // 5분간 보관
    refetchInterval: 15 * 1000, // 15초마다 멤버 상태 업데이트
  })
}

// 최근 트랙 추가 활동 조회
export const useRecentTrackActivities = (limit: number = 10) => {
  return useQuery({
    queryKey: ['recent-activities', limit],
    queryFn: () => getRecentTrackActivities(limit),
    staleTime: 30 * 1000, // 30초간 캐시 (최신 활동을 빠르게 반영)
    cacheTime: 5 * 60 * 1000, // 5분간 보관
    refetchInterval: 30 * 1000, // 30초마다 최신 활동 업데이트
  })
}

// 사용자의 모든 플레이리스트 (소유 + 참여) 조회
export const useAllUserPlaylists = () => {
  const { data: ownedPlaylists = [], ...ownedQuery } = useUserOwnedPlaylists()
  const { data: joinedPlaylists = [], ...joinedQuery } = useUserJoinedPlaylists()

  return {
    data: {
      owned: ownedPlaylists,
      joined: joinedPlaylists,
      all: [...ownedPlaylists, ...joinedPlaylists],
    },
    isLoading: ownedQuery.isLoading || joinedQuery.isLoading,
    error: ownedQuery.error || joinedQuery.error,
    refetch: () => {
      ownedQuery.refetch()
      joinedQuery.refetch()
    },
  }
}
