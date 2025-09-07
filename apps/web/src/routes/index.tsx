import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PlaylistList from '../pages/PlaylistList'
import SharedPlaylists from '../pages/SharedPlaylists'
import PlaylistDetail from '../pages/PlaylistDetail'
import SearchPage from '../pages/SearchPage'
import TracksPage from '../pages/TracksPage'
import ArtistsPage from '../pages/ArtistsPage'
import AlbumsPage from '../pages/AlbumsPage'
import ArtistDetailPage from '../pages/ArtistDetailPage'
import AlbumDetailPage from '../pages/AlbumDetailPage'
import ProtectedRoute from '../components/auth/ProtectedRoute'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      
      {/* Public app routes - 로그인 없이 탐색 가능 */}
      <Route path="/" element={<Home />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
      
      {/* Protected routes - 로그인 필요 */}
      <Route path="/playlists" element={<ProtectedRoute><PlaylistList /></ProtectedRoute>} />
      <Route path="/shared" element={<ProtectedRoute><SharedPlaylists /></ProtectedRoute>} />
      
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