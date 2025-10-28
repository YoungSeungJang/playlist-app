import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import AlbumDetailPage from '../pages/AlbumDetailPage'
import AlbumsPage from '../pages/AlbumsPage'
import ArtistDetailPage from '../pages/ArtistDetailPage'
import ArtistsPage from '../pages/ArtistsPage'
import Home from '../pages/Home'
import PlaylistDetail from '../pages/PlaylistDetail'
import PlaylistList from '../pages/PlaylistList'
import SearchPage from '../pages/SearchPage'
import SharedPlaylistDetail from '../pages/SharedPlaylistDetail'
import SharedPlaylists from '../pages/SharedPlaylists'
import TracksPage from '../pages/TracksPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public app routes - 로그인 없이 탐색 가능 */}
      <Route path="/" element={<Home />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
      <Route
        path="/shared-playlist/:id"
        element={
          <ProtectedRoute>
            <SharedPlaylistDetail />
          </ProtectedRoute>
        }
      />

      {/* Protected routes - 로그인 필요 */}
      <Route
        path="/playlists"
        element={
          <ProtectedRoute>
            <PlaylistList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shared"
        element={
          <ProtectedRoute>
            <SharedPlaylists />
          </ProtectedRoute>
        }
      />

      {/* Search routes - 로그인 없이도 접근 가능 */}
      <Route path="/search/:query" element={<SearchPage />} />
      <Route path="/search/:query/tracks" element={<TracksPage />} />
      <Route path="/search/:query/artists" element={<ArtistsPage />} />
      <Route path="/search/:query/albums" element={<AlbumsPage />} />
      <Route path="/artist/:id" element={<ArtistDetailPage />} />
      <Route path="/album/:id" element={<AlbumDetailPage />} />
    </Routes>
  )
}

export default AppRoutes
