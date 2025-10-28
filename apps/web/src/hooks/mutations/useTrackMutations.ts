import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  type AddTrackRequest,
  type PlaylistTrack,
} from '../../lib/playlistApi'

// 플레이리스트에 트랙 추가
export const useAddTrackToPlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddTrackRequest) => addTrackToPlaylist(data),
    onSuccess: (newTrack: PlaylistTrack, variables) => {
      const { playlistId } = variables

      // 해당 플레이리스트 트랙 목록 업데이트
      queryClient.invalidateQueries(['playlist-tracks', playlistId])

      // 트랙 개수 업데이트
      queryClient.invalidateQueries(['playlist-track-count', playlistId])

      // 플레이리스트 정보 업데이트 (updated_at 변경됨)
      queryClient.invalidateQueries(['playlist', playlistId])

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: error => {
      console.error('트랙 추가 실패:', error)
    },
  })
}

// 플레이리스트에서 트랙 제거
export const useRemoveTrackFromPlaylist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (trackId: string) => removeTrackFromPlaylist(trackId),
    onSuccess: (_, trackId, context: any) => {
      // context에서 playlistId를 가져와야 하므로,
      // 이 정보를 mutation 호출 시 제공해야 합니다.
      const playlistId = context?.playlistId

      if (playlistId) {
        // 해당 플레이리스트 트랙 목록 업데이트
        queryClient.invalidateQueries(['playlist-tracks', playlistId])

        // 트랙 개수 업데이트
        queryClient.invalidateQueries(['playlist-track-count', playlistId])

        // 플레이리스트 정보 업데이트
        queryClient.invalidateQueries(['playlist', playlistId])
      }

      // 최근 활동 업데이트
      queryClient.invalidateQueries(['recent-activities'])
    },
    onError: error => {
      console.error('트랙 제거 실패:', error)
    },
  })
}

// Optimistic Update를 사용한 트랙 추가
export const useOptimisticAddTrack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddTrackRequest) => addTrackToPlaylist(data),
    // 뮤테이션 실행 전 (낙관적 업데이트)
    onMutate: async variables => {
      const { playlistId } = variables

      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries(['playlist-tracks', playlistId])

      // 이전 데이터 백업
      const previousTracks = queryClient.getQueryData(['playlist-tracks', playlistId])

      // 낙관적으로 새 트랙 추가
      if (previousTracks) {
        const tempTrack: PlaylistTrack = {
          id: `temp-${Date.now()}`, // 임시 ID
          playlist_id: playlistId,
          spotify_track_id: variables.spotifyTrackId,
          title: variables.title,
          artist: variables.artist,
          album: variables.album,
          album_id: variables.albumId,
          artist_id: JSON.stringify(variables.artistIds),
          cover_url: variables.coverUrl || null,
          duration_ms: variables.durationMs,
          preview_url: variables.previewUrl || null,
          position: (previousTracks as PlaylistTrack[]).length + 1,
          added_by: 'current-user', // 현재 사용자 ID로 교체 필요
          added_at: new Date().toISOString(),
        }

        queryClient.setQueryData(
          ['playlist-tracks', playlistId],
          (old: PlaylistTrack[] | undefined) => [...(old || []), tempTrack]
        )
      }

      // 이전 데이터 반환 (실패 시 복원용)
      return { previousTracks }
    },
    // 성공 시 실제 데이터로 교체
    onSuccess: (newTrack, variables) => {
      const { playlistId } = variables

      // 실제 트랙 데이터로 업데이트
      queryClient.invalidateQueries(['playlist-tracks', playlistId])
      queryClient.invalidateQueries(['playlist-track-count', playlistId])
      queryClient.invalidateQueries(['recent-activities'])
    },
    // 실패 시 이전 상태로 복원
    onError: (error, variables, context) => {
      const { playlistId } = variables

      if (context?.previousTracks) {
        queryClient.setQueryData(['playlist-tracks', playlistId], context.previousTracks)
      }
      console.error('트랙 추가 실패:', error)
    },
    // 최종 정리
    onSettled: (_, __, variables) => {
      const { playlistId } = variables
      queryClient.invalidateQueries(['playlist-tracks', playlistId])
    },
  })
}

// Optimistic Update를 사용한 트랙 제거
export const useOptimisticRemoveTrack = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ trackId, playlistId }: { trackId: string; playlistId: string }) => {
      return removeTrackFromPlaylist(trackId)
    },
    // 뮤테이션 실행 전 (낙관적 업데이트)
    onMutate: async ({ trackId, playlistId }) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries(['playlist-tracks', playlistId])

      // 이전 데이터 백업
      const previousTracks = queryClient.getQueryData(['playlist-tracks', playlistId])

      // 낙관적으로 트랙 제거
      if (previousTracks) {
        queryClient.setQueryData(
          ['playlist-tracks', playlistId],
          (old: PlaylistTrack[] | undefined) => (old || []).filter(track => track.id !== trackId)
        )
      }

      // 이전 데이터 반환 (실패 시 복원용)
      return { previousTracks }
    },
    // 성공 시
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries(['playlist-tracks', playlistId])
      queryClient.invalidateQueries(['playlist-track-count', playlistId])
      queryClient.invalidateQueries(['recent-activities'])
    },
    // 실패 시 이전 상태로 복원
    onError: (error, { playlistId }, context) => {
      if (context?.previousTracks) {
        queryClient.setQueryData(['playlist-tracks', playlistId], context.previousTracks)
      }
      console.error('트랙 제거 실패:', error)
    },
    // 최종 정리
    onSettled: (_, __, { playlistId }) => {
      queryClient.invalidateQueries(['playlist-tracks', playlistId])
    },
  })
}
