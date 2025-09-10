import React, { useState } from 'react'
import { Modal, Button } from 'ui'
import { UserPlusIcon } from '@heroicons/react/24/outline'
import { joinPlaylistByCode } from '@/lib/playlistApi'

interface JoinPlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onJoin?: (playlistTitle: string) => void
}

const JoinPlaylistModal: React.FC<JoinPlaylistModalProps> = ({
  isOpen,
  onClose,
  onJoin
}) => {
  const [inviteCode, setInviteCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 초대 코드 형식 검증 (8자리 영숫자)
  const isValidCode = (code: string): boolean => {
    return /^[A-Za-z0-9]{8}$/.test(code)
  }

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^A-Za-z0-9]/g, '').slice(0, 8)
    setInviteCode(value)
    setError(null)
  }

  // 플레이리스트 참여 핸들러
  const handleJoin = async () => {
    if (!isValidCode(inviteCode)) {
      setError('올바른 8자리 초대 코드를 입력해주세요.')
      return
    }

    try {
      setIsJoining(true)
      setError(null)
      
      // API 호출로 실제 참여 로직 구현
      const playlist = await joinPlaylistByCode(inviteCode)
      
      // 성공 시 콜백 호출
      if (onJoin) {
        onJoin(playlist.title)
      }
      
      // 상태 초기화
      setInviteCode('')
    } catch (error) {
      console.error('Failed to join playlist:', error)
      const errorMessage = error instanceof Error ? error.message : '플레이리스트 참여에 실패했습니다.'
      setError(errorMessage)
    } finally {
      setIsJoining(false)
    }
  }

  // 모달 닫기 시 상태 초기화
  const handleClose = () => {
    setInviteCode('')
    setError(null)
    setIsJoining(false)
    onClose()
  }

  // Enter 키로 참여
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidCode(inviteCode) && !isJoining) {
      handleJoin()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="플레이리스트 참여">
      <div className="space-y-6">
        {/* 설명 */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlusIcon className="w-8 h-8 text-primary-600" />
          </div>
          <p className="text-gray-600">
            초대받은 8자리 코드를 입력하여<br />
            플레이리스트에 참여하세요!
          </p>
        </div>

        {/* 초대 코드 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            초대 코드
          </label>
          <input
            type="text"
            value={inviteCode}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="예: 737CiOap"
            className={`w-full px-4 py-3 text-center text-xl font-mono tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            maxLength={8}
            disabled={isJoining}
            autoFocus
          />
          
          {/* 입력 도움말 */}
          <div className="mt-2 flex justify-between items-center text-sm">
            <span className="text-gray-500">
              {inviteCode.length}/8
            </span>
            {isValidCode(inviteCode) && (
              <span className="text-green-600 font-medium">✓ 유효한 형식</span>
            )}
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* 예시 설명 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            💡 초대 코드는 어디서 받나요?
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 플레이리스트 소유자가 공유한 8자리 코드</li>
            <li>• 영문자와 숫자 조합 (예: 737CiOap, aB3x9Km2)</li>
            <li>• 대소문자는 구분하지 않습니다</li>
          </ul>
        </div>

        {/* 액션 버튼 */}
        <div className="flex space-x-3 pt-4">
          <Button 
            variant="ghost" 
            className="flex-1"
            onClick={handleClose}
            disabled={isJoining}
          >
            취소
          </Button>
          <Button 
            variant="primary" 
            className="flex-1"
            onClick={handleJoin}
            disabled={!isValidCode(inviteCode) || isJoining}
            loading={isJoining}
          >
            {isJoining ? '참여 중...' : '참여하기'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default JoinPlaylistModal