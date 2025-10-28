import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { useEffect } from 'react'
import { User } from 'shared'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setUser, setLoading } =
    useAuthStore()



  // 로그인 함수
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // 로그인 성공 시 onAuthStateChange에서 자동으로 상태 업데이트됨
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 회원가입 함수
  const signUp = async (email: string, password: string, nickname: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname,
          },
        },
      })

      if (error) {
        console.log(error)
        throw new Error(error.message)
      }

      // 회원가입 성공 시 onAuthStateChange에서 자동으로 상태 업데이트됨
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // 로그아웃 함수
  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(error.message)
      }
      // 로그아웃 성공 시 onAuthStateChange에서 자동으로 상태 초기화됨
    } catch (error) {
      console.error('Sign out failed:', error)
      // 에러가 있어도 로컬 상태는 초기화
      logout()
    } finally {
      setLoading(false)
    }
  }

  // 토큰 새로고침 (Supabase에서 자동으로 처리됨)
  const refreshAuth = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.refreshSession()
      if (error) {
        console.error('Auth refresh failed:', error)
        logout()
      }
      // 성공 시 onAuthStateChange에서 자동으로 상태 업데이트됨
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
