import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from 'ui'
import { useAuth } from '@/hooks/useAuth'

const Register: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  
  const { signUp, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // 이미 로그인된 사용자는 홈으로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateNickname = (nickname: string) => {
    return nickname.length >= 2 && nickname.length <= 20
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 유효성 검사
    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    if (!validateNickname(nickname)) {
      setError('닉네임은 2-20자 사이여야 합니다.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      await signUp(email, password, nickname)
      navigate('/')
    } catch (error) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PlaylistApp</h1>
          <h2 className="text-2xl font-semibold text-gray-700">회원가입</h2>
          <p className="mt-2 text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                닉네임
              </label>
              <div className="mt-1">
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  autoComplete="nickname"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="닉네임을 입력하세요"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">2-20자 사이로 입력해주세요</p>
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">최소 6자 이상 입력해주세요</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">비밀번호가 일치하지 않습니다</p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? '가입 중...' : '계정 만들기'}
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
                  console.log('소셜 회원가입 clicked')
                }}
              >
                Google로 계속하기
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              계정을 만들면{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                이용약관
              </a>
              {' 및 '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                개인정보처리방침
              </a>
              에 동의하는 것으로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register