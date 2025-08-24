import { useAuthStore } from '@/store/authStore'
import { User } from 'shared'

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUser,
    setLoading,
  } = useAuthStore()

  // 로그인 함수 (API 호출 포함)
  const signIn = async (email: string, _password: string) => {
    setLoading(true)
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })
      // const data = await response.json()
      // login(data.user, data.token)

      // 임시 mock 로그인
      const mockUser: User = {
        id: '1',
        email,
        nickname: email.split('@')[0],
        avatarUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      login(mockUser, 'mock-jwt-token')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 회원가입 함수
  const signUp = async (email: string, _password: string, nickname: string) => {
    setLoading(true)
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, nickname }),
      // })
      // const data = await response.json()
      // login(data.user, data.token)

      // 임시 mock 회원가입
      const mockUser: User = {
        id: '1',
        email,
        nickname,
        avatarUrl: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      login(mockUser, 'mock-jwt-token')
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃 함수
  const signOut = () => {
    logout()
  }

  // 토큰 검증 및 사용자 정보 새로고침
  const refreshAuth = async () => {
    if (!token) return

    try {
      setLoading(true)
      // TODO: 실제 토큰 검증 API 호출
      // const response = await fetch('/api/auth/me', {
      //   headers: { Authorization: `Bearer ${token}` },
      // })
      // const userData = await response.json()
      // setUser(userData)
    } catch (error) {
      console.error('Auth refresh failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    signIn,
    signUp,
    signOut,
    refreshAuth,
    setUser,
  }
}

export default useAuth