import { useAuth } from '@/hooks/useAuth'
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from 'ui'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { signIn, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    try {
      await signIn(email, password)
      navigate('/')
    } catch (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                  onClick={e => {
                    e.preventDefault()
                    // TODO: 비밀번호 재설정 기능
                    console.log('비밀번호 재설정 clicked')
                  }}
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => {
                  // TODO: 소셜 로그인 기능
                  console.log('소셜 로그인 clicked')
                }}
              >
                Google로 계속하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
