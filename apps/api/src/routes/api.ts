import express, { type Router } from 'express'
import spotifyRoutes from './spotify'

const router: Router = express.Router()

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'Playlist API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      spotify: '/api/spotify',
    },
  })
})

// TODO: 나중에 실제 API 엔드포인트들 추가
// router.use('/playlists', playlistRoutes)
// router.use('/auth', authRoutes)
// router.use('/users', userRoutes)

router.use('/spotify', spotifyRoutes)

export default router
