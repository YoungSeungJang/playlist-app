import { MusicalNoteIcon, PlayIcon, UserIcon, PlusIcon } from '@heroicons/react/24/outline'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchData, SimpleAlbum, SimpleArtist, SimpleTrack } from 'shared'
import TrackItem from '../track/TrackItem'
import AlbumItem from '../track/AlbumItem'
import AddToPlaylistModal from '../playlist/AddToPlaylistModal'
import { useAddToPlaylist } from '@/hooks/useAddToPlaylist'
import { usePlaylistStore } from '@/store/playlistStore'

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

  // 플레이리스트 추가 훅과 store
  const {
    showPlaylistModal,
    selectedTrack,
    isAddingTrack,
    handleAddToPlaylist,
    handlePlaylistSelect,
    handleCloseModal,
  } = useAddToPlaylist()
  const { loadAllPlaylists } = usePlaylistStore()

  // 컴포넌트 마운트 시 플레이리스트 목록 로드 (소유+공유 모두)
  useEffect(() => {
    loadAllPlaylists()
  }, [])

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
                        {/* + 버튼을 우측 상단으로 이동 */}
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            handleAddToPlaylist(topResult.item as Track)
                          }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-white hover:bg-gray-50 rounded-full flex items-center justify-center shadow-lg transition-colors border border-gray-200"
                          title="플레이리스트에 추가"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                        </button>
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
                        <div className="text-gray-600 font-medium mb-1">
                          {(topResult.item as Track).artist_names.map((artistName, index) => (
                            <span key={(topResult.item as Track).artist_ids[index]}>
                              <button
                                onClick={e => {
                                  e.stopPropagation()
                                  handleArtistClick({
                                    id: (topResult.item as Track).artist_ids[index],
                                  } as Artist)
                                }}
                                className="hover:text-primary-600 hover:underline cursor-pointer"
                              >
                                {artistName}
                              </button>
                              {index < (topResult.item as Track).artist_names.length - 1 && ', '}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          <button
                            onClick={e => {
                              e.stopPropagation()
                              handleAlbumClick({ id: (topResult.item as Track).album_id } as Album)
                            }}
                            className="hover:text-primary-600 hover:underline cursor-pointer"
                          >
                            {(topResult.item as Track).album}
                          </button>
                          {' • '}
                          {(topResult.item as Track).duration}
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
                    <TrackItem
                      key={track.id}
                      track={track}
                      index={index}
                      showAlbum={true}
                      showIndex={true}
                      onPlay={handlePlayPreview}
                      onAdd={handleAddToPlaylist}
                      onArtistClick={(artistId) => handleArtistClick({ id: artistId } as Artist)}
                      onAlbumClick={(albumId) => handleAlbumClick({ id: albumId } as Album)}
                    />
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
              <div key={album.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <AlbumItem
                  album={album}
                  showArtist={true}
                  onClick={handleAlbumClick}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 플레이리스트 선택 모달 */}
      <AddToPlaylistModal
        isOpen={showPlaylistModal}
        onClose={handleCloseModal}
        selectedTrack={selectedTrack}
        onPlaylistSelect={handlePlaylistSelect}
        isAddingTrack={isAddingTrack}
      />
    </div>
  )
}

export default SearchResults