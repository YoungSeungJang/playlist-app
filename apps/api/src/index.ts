import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api', (req, res) => {
  res.json({ message: 'Playlist API Server' })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join-playlist', (playlistId: string) => {
    socket.join(playlistId)
    console.log(`User ${socket.id} joined playlist ${playlistId}`)
  })

  socket.on('leave-playlist', (playlistId: string) => {
    socket.leave(playlistId)
    console.log(`User ${socket.id} left playlist ${playlistId}`)
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`)
})