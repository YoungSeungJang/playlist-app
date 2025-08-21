import { MusicalNoteIcon, PlayIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchData, SimpleAlbum, SimpleArtist, SimpleTrack } from 'shared'

// 타입 별칭 (기존 코드와의 호환성을 위해)
type Track = SimpleTrack
type Artist = SimpleArtist
type Album = SimpleAlbum

interface SearchResultsProps {
  searchData: SearchData
}

const formatFollowers = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchData }) => {
  const { tracks, artists, albums, topResult } = searchData
  const navigate = useNavigate()

  const handleAddToPlaylist = (track: Track) => {
    console.log('Add to playlist:', track)
    // TODO: 실제 플레이리스트 추가 로직
  }

  const handlePlayPreview = (track: Track) => {
    console.log('Play preview:', track)
    // TODO: 미리듣기 재생 로직
  }

  const handleArtistClick = (artist: Artist) => {
    navigate(`/artist/${artist.id}`)
  }

  const handleAlbumClick = (album: Album) => {
    navigate(`/album/${album.id}`)
  }

  const handleTopResultClick = () => {
    if (!topResult) return
    
    if (topResult.type === 'artist') {
      navigate(`/artist/${topResult.item.id}`)
    } else {
      // 트랙의 경우는 클릭하지 않도록 함 (미리듣기 버튼만)
      return
    }
  }

  return (
    <div className="space-y-8">
      {/* 상위 결과와 곡 목록을 좌우로 배치 */}
      {(topResult || tracks.length > 0) && (
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* 상위 결과 (왼쪽) */}
            {topResult && (
              <div className="xl:col-span-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">상위 결과</h3>
                <div 
                  className={`bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow h-80 flex flex-col justify-center ${
                    topResult.type === 'artist' ? 'cursor-pointer' : ''
                  }`}
                  onClick={topResult.type === 'artist' ? handleTopResultClick : undefined}
                >
                  {topResult.type === 'artist' ? (
                    <div>
                      <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
                        {topResult.item.image_url ? (
                          <img
                            src={topResult.item.image_url}
                            alt={(topResult.item as Artist).name}
                            className="w-32 h-32 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-16 h-16 text-white" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1 hover:text-primary-600 transition-colors">
                          {(topResult.item as Artist).name}
                        </h4>
                        <p className="text-gray-600 font-medium mb-1">아티스트</p>
                        <p className="text-sm text-gray-500">
                          팔로워 {formatFollowers((topResult.item as Artist).followers)}명
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="relative w-32 h-32 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center mb-4">
                        {topResult.item.image_url ? (
                          <img
                            src={topResult.item.image_url}
                            alt={(topResult.item as Track).album}
                            className="w-32 h-32 rounded-lg object-cover"
                          />
                        ) : (
                          <MusicalNoteIcon className="w-16 h-16 text-white" />
                        )}
                        {(topResult.item as Track).preview_url && (
                          <button
                            onClick={() => handlePlayPreview(topResult.item as Track)}
                            className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                          >
                            <PlayIcon className="w-6 h-6 text-white ml-0.5" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">
                          {(topResult.item as Track).title}
                        </h4>
                        <p className="text-gray-600 font-medium mb-1">
                          {(topResult.item as Track).artist}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(topResult.item as Track).album} • {(topResult.item as Track).duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 곡 목록 (오른쪽) */}
            {tracks.length > 0 && (
              <div className="xl:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">곡</h3>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-80 flex flex-col justify-center">
                  {tracks.slice(0, 4).map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0 text-gray-400 w-6 text-center text-sm">
                        {index + 1}
                      </div>

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
                            onClick={() => handlePlayPreview(track)}
                            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-md flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
                          >
                            <PlayIcon className="w-4 h-4 text-white" />
                          </button>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {track.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">{track.artist}</p>
                      </div>

                      <div className="flex-1 min-w-0 hidden md:block">
                        <p className="text-sm text-gray-600 truncate">{track.album}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                          <HeartSolidIcon className="w-4 h-4" />
                        </button>
                        <div className="text-sm text-gray-500 w-12 text-right">
                          {track.duration}
                        </div>
                        <button
                          onClick={() => handleAddToPlaylist(track)}
                          className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 아티스트 */}
      {artists.length > 1 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">아티스트</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artists.slice(0, 4).map(artist => (
              <div
                key={artist.id}
                onClick={() => handleArtistClick(artist)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow text-center cursor-pointer"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  {artist.image_url ? (
                    <img
                      src={artist.image_url}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-10 h-10 text-white" />
                  )}
                </div>
                <h4 className="font-medium text-gray-900 truncate hover:text-primary-600 transition-colors">{artist.name}</h4>
                <p className="text-sm text-gray-500">아티스트</p>
                <p className="text-xs text-gray-400 mt-1">
                  팔로워 {formatFollowers(artist.followers)}명
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 앨범 */}
      {albums.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">앨범</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {albums.slice(0, 4).map(album => (
              <div
                key={album.id}
                onClick={() => handleAlbumClick(album)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="w-full aspect-square bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                  {album.image_url ? (
                    <img
                      src={album.image_url}
                      alt={album.name}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <MusicalNoteIcon className="w-12 h-12 text-white" />
                  )}
                </div>
                <h4 className="font-medium text-gray-900 truncate hover:text-primary-600 transition-colors">{album.name}</h4>
                <p className="text-sm text-gray-600 truncate">{album.artist}</p>
                <p className="text-xs text-gray-400">{album.release_date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default SearchResults
