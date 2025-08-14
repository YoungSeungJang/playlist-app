import express, { type Router } from 'express'

const router: Router = express.Router()

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  })
})

export default router
