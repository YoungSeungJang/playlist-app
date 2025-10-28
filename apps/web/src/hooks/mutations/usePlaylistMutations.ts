import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  joinPlaylistByCode,
  leavePlaylist,
  removeMember,
  type CreatePlaylistRequest,
  type Playlist,
} from '../../lib/playlistApi'

// 플레이리스트 생성
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePlaylistRequest) => createPlaylist(data),
    onSuccess: (newPlaylist: Playlist) => {
      // 소유한 플레이리스트 목록 업데이트
      queryClient.invalidateQueries(['playlists', 'owned'])

      // 새로 생성된 플레이리스트를 캐시에 추가
      queryClient.setQueryData(['playlist', newPlaylist.id], newPlaylist)

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('플레이리스트 생성 실패:', error)
    },
  })
}

// 플레이리스트 업데이트
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, updates }: { playlistId: string; updates: { title?: string } }) =>
      updatePlaylist(playlistId, updates),
    onSuccess: (updatedPlaylist: Playlist) => {
      // 해당 플레이리스트 캐시 업데이트
      queryClient.setQueryData(['playlist', updatedPlaylist.id], updatedPlaylist)

      // 플레이리스트 목록들 업데이트
      queryClient.invalidateQueries(['playlists'])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('플레이리스트 수정 실패:', error)
    },
  })
}

// 플레이리스트 삭제
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (playlistId: string) => deletePlaylist(playlistId),
    onSuccess: (_, playlistId) => {
      // 플레이리스트 목록에서 제거
      queryClient.invalidateQueries(['playlists', 'owned'])

      // 해당 플레이리스트 관련 모든 캐시 제거
      queryClient.removeQueries(['playlist', playlistId])
      queryClient.removeQueries(['playlist-tracks', playlistId])
      queryClient.removeQueries(['playlist-members', playlistId])
      queryClient.removeQueries(['playlist-track-count', playlistId])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('플레이리스트 삭제 실패:', error)
    },
  })
}

// 초대 코드로 플레이리스트 참여
export const useJoinPlaylistByCode = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (inviteCode: string) => joinPlaylistByCode(inviteCode),
    onSuccess: (joinedPlaylist: Playlist) => {
      // 참여한 플레이리스트 목록 업데이트
      queryClient.invalidateQueries(['playlists', 'joined'])

      // 새로 참여한 플레이리스트를 캐시에 추가
      queryClient.setQueryData(['playlist', joinedPlaylist.id], joinedPlaylist)

      // 해당 플레이리스트의 멤버 목록 업데이트
      queryClient.invalidateQueries(['playlist-members', joinedPlaylist.id])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('플레이리스트 참여 실패:', error)
    },
  })
}

// 플레이리스트 탈퇴
export const useLeavePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (playlistId: string) => leavePlaylist(playlistId),
    onSuccess: (_, playlistId) => {
      // 참여한 플레이리스트 목록 업데이트
      queryClient.invalidateQueries(['playlists', 'joined'])

      // 해당 플레이리스트 관련 캐시 제거 (더 이상 접근 불가)
      queryClient.removeQueries(['playlist', playlistId])
      queryClient.removeQueries(['playlist-tracks', playlistId])
      queryClient.removeQueries(['playlist-members', playlistId])
      queryClient.removeQueries(['playlist-track-count', playlistId])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('플레이리스트 탈퇴 실패:', error)
    },
  })
}

// 멤버 제거 (소유자만 가능)
export const useRemoveMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, userId }: { playlistId: string; userId: string }) =>
      removeMember(playlistId, userId),
    onSuccess: (_, { playlistId }) => {
      // 해당 플레이리스트의 멤버 목록 업데이트
      queryClient.invalidateQueries(['playlist-members', playlistId])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: (error) => {
      console.error('멤버 제거 실패:', error)
    },
  })
}

// Optimistic Update를 사용한 플레이리스트 업데이트
export const useOptimisticUpdatePlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ playlistId, updates }: { playlistId: string; updates: { title?: string } }) =>
      updatePlaylist(playlistId, updates),
    // 뮤테이션 실행 전 (낙관적 업데이트)
    onMutate: async ({ playlistId, updates }) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries(['playlist', playlistId])

      // 이전 데이터 백업
      const previousPlaylist = queryClient.getQueryData(['playlist', playlistId])

      // 낙관적 업데이트 적용
      if (previousPlaylist) {
        queryClient.setQueryData(['playlist', playlistId], (old: any) => ({
          ...old,
          ...updates,
        }))
      }

      // 이전 데이터 반환 (실패 시 복원용)
      return { previousPlaylist }
    },
    // 실패 시 이전 상태로 복원
    onError: (err, variables, context) => {
      if (context?.previousPlaylist) {
        queryClient.setQueryData(['playlist', variables.playlistId], context.previousPlaylist)
      }
      console.error('플레이리스트 수정 실패:', err)
    },
    // 성공/실패와 관계없이 최종 정리
    onSettled: (_, __, { playlistId }) => {
      queryClient.invalidateQueries(['playlist', playlistId])
      queryClient.invalidateQueries(['playlists'])
    },
  })
}