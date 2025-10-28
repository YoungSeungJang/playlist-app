import React from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  searchMusic,
  searchByType,
  getTrackById,
  getTracksByIds,
  getAlbumDetail,
  getArtistDetail,
  type SearchResult,
  type SpotifyTrack,
  type AlbumDetail,
  type ArtistDetail,
} from '../../lib/musicApi'

// 통합 음악 검색 (tracks, artists, albums 모두)
export const useSearchMusic = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['music-search', query, limit],
    queryFn: () => searchMusic(query, limit),
    enabled: !!query && query.trim().length > 0, // 검색어가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 (검색 결과는 비교적 오래 유지)
    cacheTime: 30 * 60 * 1000, // 30분간 보관
    // 검색어가 바뀌면 이전 데이터를 보여주지 않음
    keepPreviousData: false,
  })
}

// 타입별 음악 검색
export const useSearchByType = (
  query: string,
  type: 'track' | 'artist' | 'album',
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['music-search', type, query, limit],
    queryFn: () => searchByType(query, type, limit),
    enabled: !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    cacheTime: 30 * 60 * 1000, // 30분간 보관
    keepPreviousData: false,
  })
}

// 트랙만 검색
export const useSearchTracks = (query: string, limit: number = 20) => {
  return useSearchByType(query, 'track', limit)
}

// 아티스트만 검색
export const useSearchArtists = (query: string, limit: number = 20) => {
  return useSearchByType(query, 'artist', limit)
}

// 앨범만 검색
export const useSearchAlbums = (query: string, limit: number = 20) => {
  return useSearchByType(query, 'album', limit)
}

// 특정 트랙 상세 정보 조회
export const useTrackDetail = (trackId: string) => {
  return useQuery({
    queryKey: ['track', trackId],
    queryFn: () => getTrackById(trackId),
    enabled: !!trackId,
    staleTime: 30 * 60 * 1000, // 30분간 캐시 (트랙 메타데이터는 자주 안바뀜)
    cacheTime: 60 * 60 * 1000, // 1시간 보관
  })
}

// 여러 트랙 일괄 조회
export const useTracksByIds = (trackIds: string[]) => {
  return useQuery({
    queryKey: ['tracks', trackIds.sort()], // 정렬해서 일관된 키 생성
    queryFn: () => getTracksByIds(trackIds),
    enabled: trackIds.length > 0,
    staleTime: 30 * 60 * 1000, // 30분간 캐시
    cacheTime: 60 * 60 * 1000, // 1시간 보관
  })
}

// 앨범 상세 정보 (수록곡 포함)
export const useAlbumDetail = (albumId: string) => {
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: () => getAlbumDetail(albumId),
    enabled: !!albumId,
    staleTime: 30 * 60 * 1000, // 30분간 캐시
    cacheTime: 60 * 60 * 1000, // 1시간 보관
  })
}

// 아티스트 상세 정보 (인기곡, 앨범 포함)
export const useArtistDetail = (artistId: string) => {
  return useQuery({
    queryKey: ['artist', artistId],
    queryFn: () => getArtistDetail(artistId),
    enabled: !!artistId,
    staleTime: 30 * 60 * 1000, // 30분간 캐시
    cacheTime: 60 * 60 * 1000, // 1시간 보관
  })
}

// 디바운스된 검색 훅 (실시간 검색용)
export const useDebouncedSearch = (
  query: string,
  delay: number = 500,
  limit: number = 20
) => {
  // 간단한 디바운스 로직
  const [debouncedQuery, setDebouncedQuery] = React.useState('')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay])

  return useSearchMusic(debouncedQuery, limit)
}

