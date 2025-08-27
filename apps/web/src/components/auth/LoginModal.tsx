import React, { useState } from 'react'
import { Button, Modal } from 'ui'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'

const LoginModal: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, isLoading } = useAuth()
  const { loginModalOpen, closeLoginModal, switchToRegister } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      await signIn(email, password)
      // 로그인 성공시 Modal이 자동으로 닫힘 (authStore에서 처리)
    } catch (err) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleClose = () => {
    closeLoginModal()
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleSwitchToRegister = () => {
    setEmail('')
    setPassword('')
    setError('')
    switchToRegister()
  }

  return (
    <Modal 
      isOpen={loginModalOpen} 
      onClose={handleClose}
      title="로그인"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="이메일을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="비밀번호를 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <button
              type="button"
              onClick={handleSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              회원가입하기
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default LoginModal