// 공통 음악 관련 타입 정의

// 우리 앱에서 사용할 간소화된 트랙 타입
export interface SimpleTrack {
  id: string
  title: string
  artist: string // 호환성을 위해 유지 (쉼표로 구분된 문자열)
  album: string
  duration: string
  preview_url: string | null
  image_url: string | null
  spotify_url: string
  popularity: number
  // 새로 추가된 필드들
  artist_ids: string[] // 개별 아티스트 ID 배열
  artist_names: string[] // 개별 아티스트 이름 배열
  album_id: string // 앨범 ID
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
  artist: string // 호환성을 위해 유지 (쉼표로 구분된 문자열)
  release_date: string
  image_url: string | null
  spotify_url: string
  // 새로 추가된 필드들
  artist_ids: string[] // 개별 아티스트 ID 배열
  artist_names: string[] // 개별 아티스트 이름 배열
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