import { MusicalNoteIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { SimpleTrack } from 'shared'

interface TrackItemProps {
  track: SimpleTrack
  index?: number
  showAlbum?: boolean
  showIndex?: boolean
  onPlay?: (track: SimpleTrack) => void
  onAdd?: (track: SimpleTrack) => void
  onArtistClick?: (artistId: string) => void
  onAlbumClick?: (albumId: string) => void
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index = 0,
  showAlbum = true,
  showIndex = true,
  onPlay,
  onAdd,
  onArtistClick,
  onAlbumClick,
}) => {
  const handlePlayClick = () => {
    if (onPlay) {
      onPlay(track)
    }
  }

  const handleAddClick = () => {
    if (onAdd) {
      onAdd(track)
    }
  }

  const handleArtistClick = (artistId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (onArtistClick) {
      onArtistClick(artistId)
    }
  }

  const handleAlbumClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onAlbumClick && track.album_id) {
      onAlbumClick(track.album_id)
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0">
      {/* 순번 */}
      {showIndex && (
        <div className="flex-shrink-0 text-gray-400 w-6 text-center text-sm">{index + 1}</div>
      )}

      {/* 앨범 이미지 */}
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-md flex items-center justify-center">
          {track.image_url ? (
            <img
              src={track.image_url}
              alt={track.album}
              className="w-12 h-12 rounded-md object-cover"
            />
          ) : (
            <MusicalNoteIcon className="w-6 h-6 text-white" />
          )}
        </div>
        {track.preview_url && (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
          >
            <PlayIcon className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* 트랙 정보 */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{track.title}</h4>
        <div className="text-sm text-gray-600 truncate">
          {track.artist_names.map((artistName, index) => (
            <span key={track.artist_ids[index]}>
              <button
                onClick={e => handleArtistClick(track.artist_ids[index], e)}
                className="hover:text-primary-600 hover:underline cursor-pointer"
              >
                {artistName}
              </button>
              {index < track.artist_names.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>

      {/* 앨범 이름 */}
      {showAlbum && (
        <div className="flex-1 min-w-0 hidden md:block">
          <button
            onClick={handleAlbumClick}
            className="w-full text-sm text-gray-600 truncate hover:text-primary-600 hover:underline cursor-pointer text-left block"
          >
            {track.album}
          </button>
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
          <HeartSolidIcon className="w-4 h-4" />
        </button>
        <div className="text-sm text-gray-500 w-12 text-right">{track.duration}</div>
        {onAdd && (
          <button
            onClick={handleAddClick}
            className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TrackItem
