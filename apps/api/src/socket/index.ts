import { Server } from 'socket.io'
import { config } from '../config'

export const createSocketServer = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
    },
  })

  return io
}

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`)

    // Join playlist room
    socket.on('join-playlist', (playlistId: string) => {
      socket.join(playlistId)
      console.log(`📋 User ${socket.id} joined playlist ${playlistId}`)
      
      // Notify others in the playlist
      socket.to(playlistId).emit('user-joined', {
        userId: socket.id,
        timestamp: new Date().toISOString()
      })
    })

    // Leave playlist room
    socket.on('leave-playlist', (playlistId: string) => {
      socket.leave(playlistId)
      console.log(`📋 User ${socket.id} left playlist ${playlistId}`)
      
      // Notify others in the playlist
      socket.to(playlistId).emit('user-left', {
        userId: socket.id,
        timestamp: new Date().toISOString()
      })
    })

    // Handle playlist updates
    socket.on('playlist-update', (data: { playlistId: string; action: string; payload: any }) => {
      socket.to(data.playlistId).emit('playlist-updated', {
        action: data.action,
        payload: data.payload,
        userId: socket.id,
        timestamp: new Date().toISOString()
      })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`)
    })
  })
}