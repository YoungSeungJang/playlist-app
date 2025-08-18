import { Router } from 'express'
import { searchMusic, searchTracks, searchArtists, searchAlbums, getTrack, getTracks } from '../services/spotifyService'

const router: Router = Router()

// 통합 음악 검색
router.get('/search', async (req, res) => {
  try {
    const { q, limit, type } = req.query

    // 쿼리 파라미터 검증
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required' })
    }

    const searchLimit = limit ? parseInt(limit as string, 10) : 20
    if (isNaN(searchLimit) || searchLimit < 1 || searchLimit > 50) {
      return res.status(400).json({ error: 'Limit must be between 1 and 50' })
    }

    let result
    
    // 타입별 검색 또는 통합 검색
    switch (type) {
      case 'track':
        result = { tracks: await searchTracks(q, searchLimit), artists: [], albums: [] }
        break
      case 'artist':
        result = { tracks: [], artists: await searchArtists(q, searchLimit), albums: [] }
        break
      case 'album':
        result = { tracks: [], artists: [], albums: await searchAlbums(q, searchLimit) }
        break
      default:
        // 통합 검색 (기본값)
        result = await searchMusic(q, searchLimit)
        break
    }

    res.json(result)
  } catch (error) {
    console.error('Spotify search error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: `Search failed: ${errorMessage}` })
  }
})

// 트랙 상세 정보
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params

    // ID 파라미터 검증
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Track ID is required' })
    }

    const track = await getTrack(id)

    if (!track) {
      return res.status(404).json({ error: 'Track not found' })
    }

    res.json(track)
  } catch (error) {
    console.error('Get track error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: `Failed to get track: ${errorMessage}` })
  }
})

// 여러 트랙 일괄 조회
router.post('/tracks', async (req, res) => {
  try {
    const { ids } = req.body

    // IDs 배열 검증
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'Track IDs array is required' })
    }

    if (ids.length === 0) {
      return res.json([])
    }

    if (ids.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 track IDs allowed' })
    }

    // 모든 ID가 문자열인지 확인
    if (!ids.every(id => typeof id === 'string')) {
      return res.status(400).json({ error: 'All track IDs must be strings' })
    }

    const tracks = await getTracks(ids)
    res.json(tracks)
  } catch (error) {
    console.error('Get tracks error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: `Failed to get tracks: ${errorMessage}` })
  }
})

export default router
