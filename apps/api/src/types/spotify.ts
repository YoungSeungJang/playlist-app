// Spotify API 관련 타입 정의

export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  popularity: number
}

export interface SpotifyArtist {
  id: string
  name: string
  images?: SpotifyImage[]
  followers?: {
    total: number
  }
  external_urls: {
    spotify: string
  }
  popularity: number
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: SpotifyArtist[]
  images: SpotifyImage[]
  release_date: string
  album_type: string // album, single, compilation 등
  total_tracks?: number // 앨범 수록곡 수 (선택적)
  external_urls: {
    spotify: string
  }
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifySearchResponse {
  tracks: {
    items: SpotifyTrack[]
    total: number
    limit: number
    offset: number
  }
}

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

