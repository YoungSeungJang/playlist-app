# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A music playlist management app built with a modern full-stack architecture using React, Express.js, Supabase, and AWS services.

## Development Commands

This is a Turborepo monorepo using pnpm. Common commands:

```bash
# Install dependencies
pnpm install

# Start development servers (frontend + backend)
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm type-check

# Start Storybook (component documentation)
pnpm storybook
```

## Tech Stack

### Frontend
- **React 18** with **TypeScript** and **Vite**
- **Tailwind CSS** + **Headless UI** for styling
- **Zustand** for client state management
- **React Query (TanStack Query)** for server state
- **React Router v6** for routing
- **Framer Motion** for animations (optional)

### Backend
- **Express.js** with **TypeScript**
- **Socket.io** for real-time communication
- **Spotify Web API** integration
- **Multer** + **Sharp** for file uploads

### Database & Auth
- **Supabase PostgreSQL** with **Prisma ORM**
- **Supabase Auth** for authentication
- **Supabase Real-time** for live updates

### Infrastructure
- **AWS S3** for file storage
- **AWS CloudFront** for CDN
- **AWS EC2** for backend hosting

### Development
- **Turborepo** monorepo with **pnpm**
- **Jest** + **React Testing Library** for unit tests
- **Playwright** for E2E testing
- **ESLint** + **Prettier** + **Husky** for code quality
- **Storybook** for component documentation

## Architecture

### Monorepo Structure
```
apps/
  frontend/          # React app (Vite)
  backend/           # Express.js API server
packages/
  shared/            # Shared types and utilities
  ui/                # Reusable UI components
```

### Key Features
- Real-time playlist collaboration via Socket.io
- Spotify API integration for music search and metadata
- Image upload and processing for album covers
- Real-time database subscriptions via Supabase

### State Management
- **Zustand** for local UI state
- **React Query** for server data caching and synchronization
- **Supabase Real-time** for live database updates

## Development Notes

- Use TypeScript throughout the codebase
- Follow React best practices and hooks patterns
- Implement proper error boundaries and loading states
- Use Prisma for all database operations
- Test components with React Testing Library
- Document UI components in Storybook
- Ensure responsive design with Tailwind CSS breakpoints

## 🚀 Implementation Progress & Roadmap

### ✅ Phase 1: Project Foundation (COMPLETED)

#### What's Done:
1. **Turborepo monorepo structure** - Complete setup with pnpm workspaces
2. **React + Vite frontend** (apps/web) - TypeScript, Tailwind CSS, React Router
3. **Express + Socket.io backend** (apps/api) - TypeScript, CORS, Helmet security
4. **Shared packages** - Type definitions and UI components
5. **Development tools** - ESLint, Prettier, VSCode settings
6. **Database schema** - Prisma ORM with PostgreSQL models
7. **Development servers** - Both frontend (3000) and backend (3001) running

#### Current Status:
- ✅ All dependencies installed (`pnpm install` completed)
- ✅ Development servers running (`pnpm dev` active)
- ✅ Prisma client generated
- ✅ TypeScript compilation working across all packages
- 🌐 Frontend: http://localhost:3000
- 🌐 Backend: http://localhost:3001

### 🔄 Phase 2: User Authentication System (NEXT)

**Priority: High** - Foundation for all other features

#### Tasks to Implement:
1. **Supabase Project Setup**
   - Create Supabase project at https://supabase.com
   - Configure environment variables (.env file)
   - Set up authentication policies

2. **Backend Auth Integration**
   - Install and configure Supabase client in backend
   - Create auth middleware for protected routes
   - Implement JWT token verification
   - Create user profile endpoints

3. **Frontend Auth Components**
   - Login/Register forms using shared UI components
   - Auth context/store with Zustand
   - Protected routes with React Router
   - Profile management UI

4. **Database User Management**
   - Sync Supabase users with Prisma User model
   - Handle user creation and profile updates
   - Avatar upload integration (optional)

#### Files to Create/Modify:
- `apps/api/src/middleware/auth.ts` - Auth middleware
- `apps/api/src/routes/auth.ts` - Auth endpoints
- `apps/web/src/components/auth/` - Login/Register components
- `apps/web/src/store/authStore.ts` - Zustand auth state
- `apps/web/src/hooks/useAuth.ts` - Auth custom hook

### 🎵 Phase 3: Playlist CRUD Operations (AFTER AUTH)

**Priority: High** - Core business logic

#### Tasks to Implement:
1. **Playlist Management API**
   - Create playlist endpoints (CRUD)
   - Invite code generation and validation
   - Playlist member management
   - Playlist permissions and ownership

2. **Frontend Playlist Components**
   - Playlist creation modal
   - Playlist list/grid view
   - Invite code sharing UI
   - Join playlist by code

3. **Database Operations**
   - Implement Prisma queries for playlists
   - Handle playlist-user relationships
   - Invite code uniqueness validation

#### Files to Create/Modify:
- `apps/api/src/routes/playlists.ts` - Playlist API routes
- `apps/api/src/controllers/playlistController.ts` - Business logic
- `apps/web/src/pages/PlaylistList.tsx` - Playlist overview
- `apps/web/src/components/playlist/` - Playlist-related components

### 🔍 Phase 4: Spotify API Integration (AFTER PLAYLISTS)

**Priority: High** - Music data source

#### Tasks to Implement:
1. **Spotify API Setup**
   - Register app at https://developer.spotify.com
   - Implement client credentials flow
   - Create search endpoints with caching

2. **Music Search & Metadata**
   - Search tracks, artists, albums
   - Cache track metadata in database
   - Handle Spotify API rate limits
   - Preview URL integration

3. **Frontend Music Search**
   - Search input with debouncing
   - Search results display
   - Add to playlist functionality
   - Track metadata display

#### Files to Create/Modify:
- `apps/api/src/services/spotifyService.ts` - Spotify API client
- `apps/api/src/routes/music.ts` - Music search endpoints
- `apps/web/src/components/music/` - Music search components
- `packages/shared/src/types/spotify.ts` - Spotify-related types

### 🔄 Phase 5: Real-time Collaboration (FINAL)

**Priority: Medium** - Advanced features

#### Tasks to Implement:
1. **Socket.io Real-time Events**
   - Real-time track additions/removals
   - Live playlist title editing
   - Online member status
   - Activity feed updates

2. **Drag & Drop Reordering**
   - @dnd-kit implementation
   - Real-time position updates
   - Optimistic UI updates
   - Conflict resolution

3. **Activity Feed & Notifications**
   - Real-time activity display
   - User action tracking
   - Notification system

#### Files to Create/Modify:
- `apps/api/src/socket/playlistSocket.ts` - Socket.io handlers
- `apps/web/src/components/playlist/PlaylistEditor.tsx` - Drag & drop
- `apps/web/src/components/activity/` - Activity feed components

### 🛠 Environment Setup Required

Before continuing, set up these external services:

1. **Supabase Project**
   ```bash
   # Visit https://supabase.com
   # Create new project
   # Copy URL and keys to .env
   ```

2. **Spotify Developer App**
   ```bash
   # Visit https://developer.spotify.com
   # Create app
   # Copy Client ID and Secret to .env
   ```

3. **Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in all required values
   ```

### 📁 Current File Structure

```
playlist-app/
├── apps/
│   ├── web/                    # React frontend (Port 3000)
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Route components
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── store/          # Zustand state management
│   │   │   └── utils/          # Helper functions
│   │   ├── package.json        # Frontend dependencies
│   │   ├── vite.config.ts      # Vite configuration
│   │   └── tailwind.config.js  # Tailwind CSS config
│   └── api/                    # Express backend (Port 3001)
│       ├── src/
│       │   ├── routes/         # API endpoints
│       │   ├── controllers/    # Business logic
│       │   ├── services/       # External API clients
│       │   ├── middleware/     # Express middleware
│       │   ├── socket/         # Socket.io handlers
│       │   └── utils/          # Helper functions
│       ├── package.json        # Backend dependencies
│       └── .env.example        # Environment variables template
├── packages/
│   ├── shared/                 # Common TypeScript types & utils
│   │   └── src/
│   │       ├── types/          # Shared type definitions
│   │       └── utils/          # Shared utility functions
│   └── ui/                     # Reusable UI components
│       └── src/components/     # Button, Input, etc.
├── prisma/
│   └── schema.prisma           # Database schema & models
├── .vscode/                    # VSCode settings & extensions
├── package.json                # Monorepo configuration
├── turbo.json                  # Turborepo pipeline
├── pnpm-workspace.yaml         # pnpm workspace config
└── README.md                   # Project documentation
```

### 🎯 Key Implementation Notes

1. **Type Safety**: All packages use strict TypeScript with shared type definitions
2. **Real-time Updates**: Socket.io + Supabase Real-time for live collaboration
3. **State Management**: Zustand for local state, React Query for server state
4. **UI Consistency**: Shared UI components with Tailwind CSS
5. **Invite System**: 6-character alphanumeric codes (excluding confusing characters)
6. **Drag & Drop**: @dnd-kit for playlist track reordering
7. **Caching Strategy**: Spotify track metadata cached in PostgreSQL

### 🔄 Quick Start After Break

```bash
# 1. Start development servers
pnpm dev

# 2. Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:3001

# 3. Continue with Phase 2 (User Authentication)
# Create Supabase project and update .env file
```