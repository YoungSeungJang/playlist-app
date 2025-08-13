import { PlaylistTrack, PlaylistMember } from './playlist'

// Socket.io event types
export interface SocketEvents {
  // Client to Server
  'join-playlist': (playlistId: string) => void
  'leave-playlist': (playlistId: string) => void
  'track-added': (data: { playlistId: string; track: PlaylistTrack }) => void
  'track-removed': (data: { playlistId: string; trackId: string }) => void
  'track-position-changed': (data: { playlistId: string; trackId: string; oldPosition: number; newPosition: number }) => void
  'playlist-title-changed': (data: { playlistId: string; title: string }) => void
  'user-activity': (data: { playlistId: string; userId: string; action: string; details?: any }) => void

  // Server to Client
  'playlist-updated': (data: { playlistId: string; type: 'track-added' | 'track-removed' | 'track-moved' | 'title-changed'; payload: any }) => void
  'member-online': (data: { playlistId: string; member: PlaylistMember }) => void
  'member-offline': (data: { playlistId: string; userId: string }) => void
  'activity-feed': (data: ActivityFeedItem) => void
}

export interface ActivityFeedItem {
  id: string
  playlistId: string
  userId: string
  user: {
    nickname: string
    avatarUrl?: string
  }
  action: 'added-track' | 'removed-track' | 'moved-track' | 'changed-title' | 'joined-playlist'
  details: {
    trackTitle?: string
    trackArtist?: string
    oldTitle?: string
    newTitle?: string
    fromPosition?: number
    toPosition?: number
  }
  timestamp: Date
}