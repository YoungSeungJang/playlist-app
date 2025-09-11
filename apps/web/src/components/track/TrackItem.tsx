import { MusicalNoteIcon, PlayIcon, PlusIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { SimpleTrack } from 'shared'

interface TrackItemProps {
  track: SimpleTrack
  index?: number
  showAlbum?: boolean
  showIndex?: boolean
  showPopularity?: boolean
  showPlayButton?: boolean
  onPlay?: (track: SimpleTrack) => void
  onAdd?: (track: SimpleTrack) => void
  onRemove?: (track: SimpleTrack) => void
  onArtistClick?: (artistId: string) => void
  onAlbumClick?: (albumId: string) => void
  addedAt?: string
  showRemove?: boolean
}

const TrackItem: React.FC<TrackItemProps> = ({
  track,
  index = 0,
  showAlbum = true,
  showIndex = true,
  showPopularity = false,
  showPlayButton = false,
  onPlay,
  onAdd,
  onRemove,
  onArtistClick,
  onAlbumClick,
  addedAt,
  showRemove = false,
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

  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(track)
    }
  }

  // 시간 차이 계산 함수
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}일 전`
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`
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
    <div className={`group flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors ${showPlayButton ? 'hover:bg-white rounded-lg' : 'border-b border-gray-100 last:border-b-0'}`}>
      {/* 순번/재생 버튼 */}
      {showIndex && (
        <>
          {/* 기본 순번 (항상 표시되거나 호버 시 숨김) */}
          <div className={`flex-shrink-0 text-gray-400 w-6 text-center text-sm ${showPlayButton ? 'group-hover:hidden' : ''}`}>
            {index + 1}
          </div>
          
          {/* 재생 버튼 (TracksPage용 - 호버 시만 표시) */}
          {showPlayButton && (
            <div className="w-6 hidden group-hover:flex justify-center">
              <button
                onClick={handlePlayClick}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600"
                disabled={!track.preview_url}
                title={track.preview_url ? '미리듣기' : '미리듣기 불가'}
              >
                <PlayIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
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

      {/* 앨범 이름 또는 추가된 시간 */}
      {(showAlbum || addedAt) && (
        <div className="flex-1 min-w-0 hidden md:block">
          {addedAt ? (
            <span className="text-sm text-gray-600 truncate">
              {getTimeAgo(addedAt)}
            </span>
          ) : (
            <button
              onClick={handleAlbumClick}
              className="w-full text-sm text-gray-600 truncate hover:text-primary-600 hover:underline cursor-pointer text-left block"
            >
              {track.album}
            </button>
          )}
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex items-center space-x-2">
        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
          <HeartSolidIcon className="w-4 h-4" />
        </button>
        
        {/* 인기도 (TracksPage용) */}
        {showPopularity && (
          <div className="hidden lg:block w-20 text-center">
            <div className="inline-flex items-center">
              <div className="w-12 bg-gray-200 rounded-full h-1 mr-2">
                <div
                  className="bg-primary-500 h-1 rounded-full transition-all"
                  style={{ width: `${track.popularity}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{track.popularity}</span>
            </div>
          </div>
        )}
        
        <div className={`text-sm text-gray-500 text-right ${showPopularity ? 'hidden sm:block w-16' : 'w-12'}`}>
          {track.duration}
        </div>
        {onAdd && (
          <div className={showPlayButton ? 'opacity-0 group-hover:opacity-100 transition-opacity' : ''}>
            <button
              onClick={handleAddClick}
              className={`p-1 text-gray-400 hover:text-primary-500 transition-colors ${showPlayButton ? 'p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-primary-600' : ''}`}
              title="플레이리스트에 추가"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        {showRemove && onRemove && (
          <button
            onClick={handleRemoveClick}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="플레이리스트에서 제거"
          >
            <EllipsisVerticalIcon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default TrackItem
