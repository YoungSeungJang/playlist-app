import React, { ReactElement, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import { Navigate, useLocation } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()
  const { openLoginModal } = useAuthStore()
  const location = useLocation()

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  // 로그인되지 않은 경우 로그인 모달 열기 + 홈으로 리다이렉트
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal()
    }
  }, [isAuthenticated, openLoginModal, location.pathname])

  // 로그인되지 않은 경우 홈으로 리다이렉트 (로그인 모달은 useEffect에서 열림)
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return children
}

export default ProtectedRoute