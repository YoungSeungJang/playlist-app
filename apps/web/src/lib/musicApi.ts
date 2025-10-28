// Spotify 관련 API 타입 정의
export interface SpotifyTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: {
    id: string
    name: string
    images: { url: string; height: number; width: number }[]
    release_date: string
  }
  duration_ms: number
  preview_url: string | null
  external_urls: { spotify: string }
  popularity: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images: { url: string; height: number; width: number }[]
  followers: { total: number }
  genres: string[]
  popularity: number
  external_urls: { spotify: string }
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: { id: string; name: string }[]
  images: { url: string; height: number; width: number }[]
  release_date: string
  total_tracks: number
  external_urls: { spotify: string }
}

export interface SearchResult {
  tracks: SpotifyTrack[]
  artists: SpotifyArtist[]
  albums: SpotifyAlbum[]
}

export interface AlbumDetail {
  id: string
  name: string
  artists: { id: string; name: string }[]
  images: { url: string; height: number; width: number }[]
  release_date: string
  total_tracks: number
  tracks: SpotifyTrack[]
}

export interface ArtistDetail {
  id: string
  name: string
  images: { url: string; height: number; width: number }[]
  followers: { total: number }
  genres: string[]
  popularity: number
  top_tracks: SpotifyTrack[]
  albums: SpotifyAlbum[]
}

const API_BASE_URL = 'http://localhost:3001/api/spotify'

// 통합 음악 검색
export async function searchMusic(
  query: string,
  limit: number = 20
): Promise<SearchResult> {
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
export async function getTrackById(trackId: string): Promise<SpotifyTrack> {
  const response = await fetch(`${API_BASE_URL}/track/${trackId}`)

  if (!response.ok) {
    throw new Error(`Failed to get track: ${response.statusText}`)
  }

  return response.json()
}

// 여러 트랙 일괄 조회
export async function getTracksByIds(trackIds: string[]): Promise<SpotifyTrack[]> {
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