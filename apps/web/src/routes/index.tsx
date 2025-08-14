import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import PlaylistList from '../pages/PlaylistList'
import SharedPlaylists from '../pages/SharedPlaylists'
import PlaylistDetail from '../pages/PlaylistDetail'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playlists" element={<PlaylistList />} />
      <Route path="/shared" element={<SharedPlaylists />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
    </Routes>
  )
}

export default AppRoutes