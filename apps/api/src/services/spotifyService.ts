import { spotifyConfig } from '@/config/spotify'
import axios from 'axios'
import { SimpleArtist, SimpleTrack, SimpleAlbum } from '@shared/types/music'
import { formatDuration } from '@shared/utils/time'
import {
  SpotifyTrack,
  type SpotifyAlbum,
  type SpotifyArtist,
  type SpotifyTokenResponse,
} from '../types/spotify'

// 토큰 관리용 변수들 (모듈 레벨)
let accessToken: string | null = null
let tokenExpiresAt: number = 0

export const getAccessToken = async (): Promise<string> => {
  // 기존 토큰이 유효하면 재사용
  if (accessToken && Date.now() < tokenExpiresAt) {
    return accessToken
  }

  // 토큰이 없거나 만료되었으면 새로 발급
  try {
    const response = await axios.post<SpotifyTokenResponse>(
      spotifyConfig.tokenUrl,
      `grant_type=client_credentials&client_id=${spotifyConfig.clientId}&client_secret=${spotifyConfig.clientSecret}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: spotifyConfig.requestTimeout,
      }
    )

    if (!response.data.access_token || !response.data.expires_in) {
      throw new Error('Invalid token response from Spotify')
    }

    // 토큰과 만료 시간 저장 (60초 여유시간 추가)
    accessToken = response.data.access_token
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000 - 60000

    return accessToken
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // API에서 에러 응답을 받은 경우
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error || 'Unknown error'}`
        )
      } else if (error.request) {
        // 네트워크 오류
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get Spotify access token: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 음악 검색 - 트랙만
export const searchTracks = async (query: string, limit: number = 20): Promise<SimpleTrack[]> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
      params: {
        q: query,
        type: 'track',
        limit: Math.min(limit, spotifyConfig.maxSearchResults),
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.tracks || !response.data.tracks.items) {
      return []
    }

    return response.data.tracks.items.map(convertToSimpleTrack)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Spotify search error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to search tracks: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 트랙 상세 정보 조회
export const getTrack = async (trackId: string): Promise<SimpleTrack | null> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/tracks/${trackId}`, {
      params: {
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data) {
      return null
    }

    return convertToSimpleTrack(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null // 트랙을 찾을 수 없음
      }
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get track: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 여러 트랙 일괄 조회 (최대 50개)
export const getTracks = async (trackIds: string[]): Promise<SimpleTrack[]> => {
  if (trackIds.length === 0) {
    return []
  }

  const token = await getAccessToken()

  try {
    // Spotify API는 최대 50개까지 한 번에 조회 가능
    const ids = trackIds.slice(0, 50).join(',')

    const response = await axios.get(`${spotifyConfig.baseUrl}/tracks`, {
      params: {
        ids: ids,
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.tracks) {
      return []
    }

    // null인 트랙들 필터링 (삭제되거나 사용할 수 없는 트랙)
    return response.data.tracks
      .filter((track: SpotifyTrack | null) => track !== null)
      .map(convertToSimpleTrack)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get tracks: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 아티스트 검색
export const searchArtists = async (query: string, limit: number = 20): Promise<any[]> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
      params: {
        q: query,
        type: 'artist',
        limit: Math.min(limit, spotifyConfig.maxSearchResults),
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.artists || !response.data.artists.items) {
      return []
    }

    return response.data.artists.items.map(convertToSimpleArtist)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Spotify search error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to search artists: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 앨범 검색
export const searchAlbums = async (query: string, limit: number = 20): Promise<any[]> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
      params: {
        q: query,
        type: 'album',
        limit: Math.min(limit, spotifyConfig.maxSearchResults),
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.albums || !response.data.albums.items) {
      return []
    }

    return response.data.albums.items.map(convertToSimpleAlbum)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Spotify search error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to search albums: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 통합 검색 (트랙, 아티스트, 앨범 모두)
export const searchMusic = async (query: string, limit: number = 20) => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/search`, {
      params: {
        q: query,
        type: 'track,artist,album',
        limit: Math.min(limit, spotifyConfig.maxSearchResults),
        market: 'KR',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      timeout: spotifyConfig.requestTimeout,
    })

    // 원본 데이터를 먼저 변환
    const allTracks = response.data.tracks?.items?.map(convertToSimpleTrack) || []
    const allArtists = response.data.artists?.items?.map(convertToSimpleArtist) || []
    const allAlbums = response.data.albums?.items?.map(convertToSimpleAlbum) || []

    // topResult 먼저 선택 (전체 데이터에서)
    const topResult = findTopResult({ _allTracks: allTracks, _allArtists: allArtists }, query)

    return {
      tracks: allTracks
        .sort((a: SimpleTrack, b: SimpleTrack) => b.popularity - a.popularity)
        .slice(0, 4), // 상위 4개만
      artists: allArtists
        .sort((a: SimpleArtist, b: SimpleArtist) => b.popularity - a.popularity)
        .slice(0, 6), // 상위 6개만
      albums: allAlbums.slice(0, 6),
      topResult,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          `Spotify search error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to search music: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 상위 결과 선택 로직
export const findTopResult = (searchData: any, query: string) => {
  const { _allTracks: allTracks, _allArtists: allArtists } = searchData

  // 1순위: artists[0]의 name에 검색어 포함 여부 체크
  if (
    allArtists &&
    allArtists.length > 0 &&
    allArtists[0].name.toLowerCase().includes(query.toLowerCase())
  ) {
    return {
      type: 'artist',
      item: allArtists[0],
    }
  }

  // 2순위: tracks[0] 선택
  if (allTracks && allTracks.length > 0) {
    return {
      type: 'track',
      item: allTracks[0],
    }
  }

  return null
}

// Spotify 데이터를 우리 형식으로 변환
export const convertToSimpleTrack = (spotifyTrack: SpotifyTrack): SimpleTrack => {
  // 앨범 이미지 중 적절한 크기 선택 (중간 크기 우선, 없으면 큰 것)
  const getAlbumImage = (): string | null => {
    if (!spotifyTrack.album.images || spotifyTrack.album.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 큰 것부터 선택
    const sortedImages = [...spotifyTrack.album.images].sort((a, b) => b.width - a.width)
    
    // 300x300 크기의 이미지를 우선적으로 찾기
    const mediumImage = sortedImages.find(img => img.width >= 250 && img.width <= 350)
    if (mediumImage) {
      return mediumImage.url
    }
    
    // 300x300이 없으면 가장 큰 이미지 선택
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map(artist => artist.name).join(', '), // 호환성을 위해 유지
    album: spotifyTrack.album.name,
    duration: formatDuration(spotifyTrack.duration_ms),
    preview_url: spotifyTrack.preview_url,
    image_url: getAlbumImage(),
    spotify_url: spotifyTrack.external_urls.spotify,
    popularity: spotifyTrack.popularity,
    // 새로 추가된 필드들
    artist_ids: spotifyTrack.artists.map(artist => artist.id),
    artist_names: spotifyTrack.artists.map(artist => artist.name),
    album_id: spotifyTrack.album.id,
  }
}

export const convertToSimpleArtist = (spotifyArtist: SpotifyArtist): SimpleArtist => {
  const getArtistImage = (): string | null => {
    if (!spotifyArtist.images || spotifyArtist.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 큰 것부터 선택
    const sortedImages = [...spotifyArtist.images].sort((a, b) => b.width - a.width)
    
    // 300x300 크기의 이미지를 우선적으로 찾기
    const mediumImage = sortedImages.find(img => img.width >= 250 && img.width <= 350)
    if (mediumImage) {
      return mediumImage.url
    }
    
    // 300x300이 없으면 가장 큰 이미지 선택
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyArtist.id,
    name: spotifyArtist.name,
    image_url: getArtistImage(),
    followers: spotifyArtist.followers?.total || 0,
    spotify_url: spotifyArtist.external_urls.spotify,
    popularity: spotifyArtist.popularity,
  }
}

export const convertToSimpleAlbum = (spotifyAlbum: SpotifyAlbum): SimpleAlbum => {
  const getAlbumImage = (): string | null => {
    if (!spotifyAlbum.images || spotifyAlbum.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 큰 것부터 선택
    const sortedImages = [...spotifyAlbum.images].sort((a, b) => b.width - a.width)
    
    // 300x300 크기의 이미지를 우선적으로 찾기
    const mediumImage = sortedImages.find(img => img.width >= 250 && img.width <= 350)
    if (mediumImage) {
      return mediumImage.url
    }
    
    // 300x300이 없으면 가장 큰 이미지 선택
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyAlbum.id,
    name: spotifyAlbum.name,
    artist: spotifyAlbum.artists.map(artist => artist.name).join(', '), // 호환성을 위해 유지
    release_date: spotifyAlbum.release_date,
    image_url: getAlbumImage(),
    spotify_url: spotifyAlbum.external_urls.spotify,
    album_type: spotifyAlbum.album_type,
    // 새로 추가된 필드들
    artist_ids: spotifyAlbum.artists.map(artist => artist.id),
    artist_names: spotifyAlbum.artists.map(artist => artist.name),
  }
}

// 앨범 수록곡 조회
export const getAlbumTracks = async (albumId: string): Promise<{ album: SimpleAlbum; tracks: SimpleTrack[] }> => {
  const token = await getAccessToken()

  try {
    // 앨범 정보와 수록곡을 병렬로 조회
    const [albumResponse, tracksResponse] = await Promise.all([
      axios.get(`${spotifyConfig.baseUrl}/albums/${albumId}`, {
        params: { market: 'KR' },
        headers: { Authorization: `Bearer ${token}` },
        timeout: spotifyConfig.requestTimeout,
      }),
      axios.get(`${spotifyConfig.baseUrl}/albums/${albumId}/tracks`, {
        params: { market: 'KR', limit: 50 },
        headers: { Authorization: `Bearer ${token}` },
        timeout: spotifyConfig.requestTimeout,
      })
    ])

    if (!albumResponse.data || !tracksResponse.data.items) {
      throw new Error('Invalid response from Spotify API')
    }

    const album = {
      ...convertToSimpleAlbum(albumResponse.data),
      total_tracks: albumResponse.data.total_tracks,
      label: albumResponse.data.label || null,
    }
    
    // 앨범 수록곡은 album 정보가 없으므로 수동으로 추가
    const tracks = tracksResponse.data.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '), // 호환성을 위해 유지
      album: album.name,
      duration: formatDuration(track.duration_ms),
      preview_url: track.preview_url,
      image_url: album.image_url, // 앨범 이미지 사용
      spotify_url: track.external_urls.spotify,
      popularity: 0, // 수록곡은 popularity 정보가 없음
      // 새로 추가된 필드들
      artist_ids: track.artists.map((artist: any) => artist.id),
      artist_names: track.artists.map((artist: any) => artist.name),
      album_id: albumId, // 요청한 앨범 ID 사용
    }))

    return { album, tracks }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Album not found')
      }
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get album tracks: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 아티스트 상세 정보 조회
export const getArtist = async (artistId: string): Promise<SimpleArtist | null> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data) {
      return null
    }

    return convertToSimpleArtist(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null
      }
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get artist: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 아티스트 인기곡 조회
export const getArtistTopTracks = async (artistId: string): Promise<SimpleTrack[]> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/artists/${artistId}/top-tracks`, {
      params: { market: 'KR' },
      headers: { Authorization: `Bearer ${token}` },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.tracks) {
      return []
    }

    return response.data.tracks.map(convertToSimpleTrack)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return []
      }
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get artist top tracks: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 아티스트 앨범 목록 조회
export const getArtistAlbums = async (artistId: string): Promise<(SimpleAlbum & { total_tracks: number })[]> => {
  const token = await getAccessToken()

  try {
    const response = await axios.get(`${spotifyConfig.baseUrl}/artists/${artistId}/albums`, {
      params: { 
        market: 'KR',
        include_groups: 'album,single',
        limit: 20
      },
      headers: { Authorization: `Bearer ${token}` },
      timeout: spotifyConfig.requestTimeout,
    })

    if (!response.data.items) {
      return []
    }

    return response.data.items.map((album: any) => ({
      ...convertToSimpleAlbum(album),
      total_tracks: album.total_tracks || 0
    }))
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return []
      }
      if (error.response) {
        throw new Error(
          `Spotify API error: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`
        )
      } else if (error.request) {
        throw new Error('Network error: Unable to connect to Spotify API')
      }
    }
    throw new Error(
      `Failed to get artist albums: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// 아티스트 상세 정보 통합 조회 (아티스트 정보 + 인기곡 + 앨범)
export const getArtistDetail = async (artistId: string) => {
  try {
    const [artist, topTracks, albums] = await Promise.all([
      getArtist(artistId),
      getArtistTopTracks(artistId),
      getArtistAlbums(artistId)
    ])

    if (!artist) {
      throw new Error('Artist not found')
    }

    return {
      artist,
      topTracks: topTracks.slice(0, 10), // 상위 10곡만
      albums: albums.slice(0, 12) // 상위 12개 앨범만
    }
  } catch (error) {
    throw new Error(
      `Failed to get artist detail: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
