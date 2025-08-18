import React from 'react'
import { MusicalNoteIcon, UserIcon, PlayIcon, PlusIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  image_url: string | null
  preview_url: string | null
  spotify_url: string
}

interface Artist {
  id: string
  name: string
  image_url: string | null
  followers: number
  spotify_url: string
}

interface Album {
  id: string
  name: string
  artist: string
  release_date: string
  image_url: string | null
  spotify_url: string
}

interface SearchData {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
}

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
  const { tracks, artists, albums } = searchData

  const handleAddToPlaylist = (track: Track) => {
    console.log('Add to playlist:', track)
    // TODO: 실제 플레이리스트 추가 로직
  }

  const handlePlayPreview = (track: Track) => {
    console.log('Play preview:', track)
    // TODO: 미리듣기 재생 로직
  }

  return (
    <div className="space-y-8">
      {/* 상위 결과 */}
      {(tracks.length > 0 || artists.length > 0) && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">상위 결과</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 첫 번째 아티스트 (큰 카드) */}
            {artists.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                    {artists[0].image_url ? (
                      <img
                        src={artists[0].image_url}
                        alt={artists[0].name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{artists[0].name}</h4>
                    <p className="text-gray-600">아티스트</p>
                    <p className="text-sm text-gray-500">팔로워 {formatFollowers(artists[0].followers)}명</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* 첫 번째 트랙 (큰 카드) */}
            {tracks.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
                      {tracks[0].image_url ? (
                        <img
                          src={tracks[0].image_url}
                          alt={tracks[0].album}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <MusicalNoteIcon className="w-8 h-8 text-white" />
                      )}
                    </div>
                    {tracks[0].preview_url && (
                      <button
                        onClick={() => handlePlayPreview(tracks[0])}
                        className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                      >
                        <PlayIcon className="w-4 h-4 text-white ml-0.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">{tracks[0].title}</h4>
                    <p className="text-gray-600">{tracks[0].artist}</p>
                    <p className="text-sm text-gray-500">{tracks[0].album} • {tracks[0].duration}</p>
                  </div>
                  <button
                    onClick={() => handleAddToPlaylist(tracks[0])}
                    className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 노래 */}
      {tracks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">노래</h3>
            {tracks.length > 5 && (
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                모두 보기
              </button>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {tracks.slice(0, 5).map((track, index) => (
              <div
                key={track.id}
                className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
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
                  <h4 className="text-sm font-medium text-gray-900 truncate">{track.title}</h4>
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
        </section>
      )}

      {/* 아티스트 */}
      {artists.length > 1 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">아티스트</h3>
            {artists.length > 4 && (
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                모두 보기
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artists.slice(0, 4).map((artist) => (
              <div
                key={artist.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
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
                <h4 className="font-medium text-gray-900 truncate">{artist.name}</h4>
                <p className="text-sm text-gray-500">아티스트</p>
                <p className="text-xs text-gray-400 mt-1">팔로워 {formatFollowers(artist.followers)}명</p>
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
            {albums.length > 4 && (
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                모두 보기
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {albums.slice(0, 4).map((album) => (
              <div
                key={album.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
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
                <h4 className="font-medium text-gray-900 truncate">{album.name}</h4>
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