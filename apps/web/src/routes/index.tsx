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

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playlists" element={<PlaylistList />} />
      <Route path="/shared" element={<SharedPlaylists />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
      <Route path="/search/:query" element={<SearchPage />} />
      <Route path="/search/:query/tracks" element={<TracksPage />} />
      <Route path="/search/:query/artists" element={<ArtistsPage />} />
      <Route path="/search/:query/albums" element={<AlbumsPage />} />
    </Routes>
  )
}

export default AppRoutes