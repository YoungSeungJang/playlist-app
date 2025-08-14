import express from 'express'
import healthRoutes from './health'
import apiRoutes from './api'

export const setupRoutes = (app: express.Application) => {
  // Health check routes
  app.use('/health', healthRoutes)
  
  // API routes
  app.use('/api', apiRoutes)
}