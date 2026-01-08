// shared 패키지에서 타입 import
import type { SimpleTrack, SimpleArtist, SimpleAlbum } from 'shared'

export interface SearchResult {
  tracks: SimpleTrack[]
  artists: SimpleArtist[]
  albums: SimpleAlbum[]
}

export interface AlbumDetail {
  id: string
  name: string
  artists: { id: string; name: string }[]
  images: { url: string; height: number; width: number }[]
  release_date: string
  total_tracks: number
  tracks: SimpleTrack[]
}

export interface ArtistDetail {
  id: string
  name: string
  images: { url: string; height: number; width: number }[]
  followers: { total: number }
  genres: string[]
  popularity: number
  top_tracks: SimpleTrack[]
  albums: SimpleAlbum[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/spotify'

// 통합 음악 검색
export async function searchMusic(query: string, limit: number = 20): Promise<SearchResult> {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`)
  }

  return response.json()
}

// 타입별 음악 검색
export async function searchByType(
  query: string,
  type: 'track' | 'artist' | 'album',
  limit: number = 20
): Promise<SearchResult> {
  const response = await fetch(
    `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error(`Search failed: ${response.statusText}`)
  }

  return response.json()
}

// 트랙 상세 정보 조회
export async function getTrackById(trackId: string): Promise<SimpleTrack> {
  const response = await fetch(`${API_BASE_URL}/track/${trackId}`)

  if (!response.ok) {
    throw new Error(`Failed to get track: ${response.statusText}`)
  }

  return response.json()
}

// 여러 트랙 일괄 조회
export async function getTracksByIds(trackIds: string[]): Promise<SimpleTrack[]> {
  if (trackIds.length === 0) return []

  const response = await fetch(`${API_BASE_URL}/tracks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids: trackIds }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get tracks: ${response.statusText}`)
  }

  return response.json()
}

// 앨범 상세 정보 (수록곡 포함)
export async function getAlbumDetail(albumId: string): Promise<AlbumDetail> {
  const response = await fetch(`${API_BASE_URL}/album/${albumId}/tracks`)

  if (!response.ok) {
    throw new Error(`Failed to get album: ${response.statusText}`)
  }

  return response.json()
}

// 아티스트 상세 정보 (인기곡, 앨범 포함)
export async function getArtistDetail(artistId: string): Promise<ArtistDetail> {
  const response = await fetch(`${API_BASE_URL}/artist/${artistId}`)

  if (!response.ok) {
    throw new Error(`Failed to get artist: ${response.statusText}`)
  }

  return response.json()
}
