export interface User {
  id: string
  email: string
  nickname: string
  avatarUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  nickname: string
  avatarUrl?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  nickname: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}