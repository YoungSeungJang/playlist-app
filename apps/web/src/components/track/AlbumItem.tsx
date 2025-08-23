import { MusicalNoteIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { SimpleAlbum } from 'shared'

interface AlbumItemProps {
  album: SimpleAlbum
  showArtist?: boolean
  onClick?: (album: SimpleAlbum) => void
}

const AlbumItem: React.FC<AlbumItemProps> = ({
  album,
  showArtist = true,
  onClick,
}) => {
  const formatReleaseDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.getFullYear().toString()
  }

  const handleClick = () => {
    if (onClick) {
      onClick(album)
    }
  }

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer"
    >
      {/* 앨범 이미지 */}
      <div className="aspect-square mb-3 bg-gray-200 rounded-lg overflow-hidden">
        {album.image_url ? (
          <img
            src={album.image_url}
            alt={album.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MusicalNoteIcon className="w-12 h-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* 앨범 정보 */}
      <div>
        <h3 className="font-semibold text-gray-900 truncate mb-1 group-hover:text-primary-600 transition-colors">
          {album.name}
        </h3>
        {showArtist && album.artist && (
          <p className="text-sm text-gray-600 truncate mb-1">{album.artist}</p>
        )}
        <p className="text-sm text-gray-500 truncate">
          {formatReleaseDate(album.release_date)} • {album.album_type}
        </p>
      </div>
    </div>
  )
}

export default AlbumItem