import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import React, { useState } from 'react'
import { Button, Modal } from 'ui'

const RegisterModal: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const { signUp, isLoading } = useAuth()
  const { registerModalOpen, closeRegisterModal, switchToLogin } = useAuthStore()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.email || !formData.nickname || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (formData.nickname.length < 2) {
      setError('닉네임은 최소 2자 이상이어야 합니다.')
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.nickname)
      // 회원가입 성공시 Modal이 자동으로 닫힘 (authStore에서 처리)
    } catch (err) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const handleClose = () => {
    closeRegisterModal()
    setFormData({
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    })
    setError('')
  }

  const handleSwitchToLogin = () => {
    setFormData({
      email: '',
      nickname: '',
      password: '',
      confirmPassword: '',
    })
    setError('')
    switchToLogin()
  }

  return (
    <Modal isOpen={registerModalOpen} onClose={handleClose} title="회원가입" size="sm">
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
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="이메일을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
            닉네임
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="닉네임을 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="비밀번호를 입력하세요 (최소 6자)"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="비밀번호를 다시 입력하세요"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              로그인하기
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default RegisterModal
