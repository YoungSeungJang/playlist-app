// 공통 음악 관련 타입 정의

// 우리 앱에서 사용할 간소화된 트랙 타입
export interface SimpleTrack {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  preview_url: string | null
  image_url: string | null
  spotify_url: string
  popularity: number
}

// 우리 앱에서 사용할 간소화된 아티스트 타입
export interface SimpleArtist {
  id: string
  name: string
  image_url: string | null
  followers: number
  spotify_url: string
  popularity: number
}

// 우리 앱에서 사용할 간소화된 앨범 타입
export interface SimpleAlbum {
  id: string
  name: string
  artist: string
  release_date: string
  image_url: string | null
  spotify_url: string
}

// 상위 결과 타입
export interface TopResult {
  type: 'track' | 'artist'
  item: SimpleTrack | SimpleArtist
}

// 검색 결과 데이터 타입
export interface SearchData {
  tracks: SimpleTrack[]
  artists: SimpleArtist[]
  albums: SimpleAlbum[]
  topResult: TopResult | null
}