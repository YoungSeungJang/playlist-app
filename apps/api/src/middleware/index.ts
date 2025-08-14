import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { config } from '../config'

export const setupMiddleware = (app: express.Application) => {
  // Security middleware
  app.use(helmet())
  
  // CORS middleware
  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    })
  )
  
  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }))
  app.use(express.urlencoded({ extended: true }))
}

// Error handling middleware
export const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('Error:', error)
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.isDevelopment ? error.message : 'Something went wrong',
  })
}

// 404 handler
export const notFoundHandler = (req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not Found' })
}