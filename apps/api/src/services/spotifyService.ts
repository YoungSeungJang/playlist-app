import { spotifyConfig } from '@/config/spotify'
import axios from 'axios'
import {
  SimpleTrack,
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

    return {
      tracks:
        response.data.tracks?.items
          ?.sort((a: SpotifyTrack, b: SpotifyTrack) => b.popularity - a.popularity)
          .map(convertToSimpleTrack) || [],
      artists:
        response.data.artists?.items
          ?.sort((a: SpotifyTrack, b: SpotifyTrack) => b.popularity - a.popularity)
          .map(convertToSimpleArtist) || [],
      albums: response.data.albums?.items?.map(convertToSimpleAlbum) || [],
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

// Spotify 데이터를 우리 형식으로 변환
export const convertToSimpleTrack = (spotifyTrack: SpotifyTrack): SimpleTrack => {
  // 재생시간을 분:초 형식으로 변환 (예: 217346ms → "3:37")
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // 앨범 이미지 중 가장 작은 것 선택 (보통 64x64)
  const getAlbumImage = (): string | null => {
    if (!spotifyTrack.album.images || spotifyTrack.album.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 가장 작은 것 선택
    const sortedImages = [...spotifyTrack.album.images].sort((a, b) => a.width - b.width)
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map(artist => artist.name).join(', '),
    album: spotifyTrack.album.name,
    duration: formatDuration(spotifyTrack.duration_ms),
    preview_url: spotifyTrack.preview_url,
    image_url: getAlbumImage(),
    spotify_url: spotifyTrack.external_urls.spotify,
  }
}

export const convertToSimpleArtist = (spotifyArtist: SpotifyArtist): any => {
  const getArtistImage = (): string | null => {
    if (!spotifyArtist.images || spotifyArtist.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 가장 작은 것 선택
    const sortedImages = [...spotifyArtist.images].sort((a, b) => a.width - b.width)
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyArtist.id,
    name: spotifyArtist.name,
    image_url: getArtistImage(),
    followers: spotifyArtist.followers?.total || 0,
    spotify_url: spotifyArtist.external_urls.spotify,
  }
}

export const convertToSimpleAlbum = (spotifyAlbum: SpotifyAlbum): any => {
  const getAlbumImage = (): string | null => {
    if (!spotifyAlbum.images || spotifyAlbum.images.length === 0) {
      return null
    }
    // 이미지를 크기순으로 정렬해서 가장 작은 것 선택
    const sortedImages = [...spotifyAlbum.images].sort((a, b) => a.width - b.width)
    return sortedImages[0]?.url || null
  }

  return {
    id: spotifyAlbum.id,
    name: spotifyAlbum.name,
    artist: spotifyAlbum.artists.map(artist => artist.name).join(', '),
    release_date: spotifyAlbum.release_date.split('-')[0], // 년도만 추출
    image_url: getAlbumImage(),
    spotify_url: spotifyAlbum.external_urls.spotify,
  }
}
