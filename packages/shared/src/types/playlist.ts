import { UserProfile } from './user'

export interface Playlist {
  id: string
  title: string
  inviteCode: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
  members: PlaylistMember[]
  tracks: PlaylistTrack[]
  totalTracks: number
  totalDuration: number // in milliseconds
}

export interface PlaylistMember {
  playlistId: string
  userId: string
  user: UserProfile
  joinedAt: Date
  isOnline: boolean
}

export interface PlaylistTrack {
  id: string
  playlistId: string
  spotifyTrackId: string
  position: number
  addedBy: string
  addedByUser: UserProfile
  addedAt: Date
  track: SpotifyTrack
}

export interface SpotifyTrack {
  spotifyId: string
  title: string
  artist: string
  album: string
  coverUrl?: string
  durationMs: number
  previewUrl?: string
}

export interface CreatePlaylistRequest {
  title: string
}

export interface UpdatePlaylistRequest {
  title?: string
}

export interface JoinPlaylistRequest {
  inviteCode: string
}

export interface AddTrackRequest {
  spotifyTrackId: string
  position?: number
}

export interface UpdateTrackPositionRequest {
  trackId: string
  newPosition: number
}

export interface SpotifySearchResult {
  tracks: SpotifyTrack[]
  total: number
  hasMore: boolean
}