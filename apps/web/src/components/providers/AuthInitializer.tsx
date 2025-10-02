import { supabase } from '@/lib/supabase'
import useAuthStore from '@/store/authStore'
import type { User } from '@shared/index'
import { useEffect } from 'react'

interface AuthInitailizerProps {
  children: React.ReactNode
}

const AuthInitailizer: React.FC<AuthInitailizerProps> = ({ children }) => {
  const { login, logout } = useAuthStore()

  // Supabase Auth 상태 변경 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // 로그인 시 사용자 정보 업데이트
        const supabaseUser = session.user
        const appUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          nickname: supabaseUser.user_metadata?.nickname || supabaseUser.email?.split('@')[0] || '',
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
        }
        login(appUser, session.access_token)
      } else if (event === 'SIGNED_OUT') {
        // 로그아웃 시 상태 초기화
        logout()
      }
    })
    // 초기 세션 확인
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const supabaseUser = session.user
        const appUser: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          nickname: supabaseUser.user_metadata?.nickname || supabaseUser.email?.split('@')[0] || '',
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          createdAt: new Date(supabaseUser.created_at),
          updatedAt: new Date(supabaseUser.updated_at || supabaseUser.created_at),
        }
        login(appUser, session.access_token)
      }
    }

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [])
  return <>{children}</>
}

export default AuthInitailizer
