import express from 'express'
import { createServer } from 'http'
import { config } from './config'
import { errorHandler, notFoundHandler, setupMiddleware } from './middleware'
import { setupRoutes } from './routes'
import { createSocketServer, setupSocketHandlers } from './socket'

// Create Express app and HTTP server
const app = express()
const server = createServer(app)

// Setup middleware
setupMiddleware(app)

// Setup routes
setupRoutes(app)

// Setup Socket.IO
const io = createSocketServer(server)
setupSocketHandlers(io)

// Setup error handling (must be after routes)
app.use(errorHandler)
app.use('*', notFoundHandler)

// Start server
server.listen(config.port, () => {
  console.log(`🚀 Server running on port ${config.port}`)
  console.log(`📱 Client URL: ${config.clientUrl}`)
  console.log(`🌍 Environment: ${config.nodeEnv}`)
})
