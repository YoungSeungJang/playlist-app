import { useEffect, useState } from 'react'

/**
 * 사용자 입력을 디바운싱하는 커스텀 훅
 * @param value 디바운싱할 값
 * @param delay 지연 시간 (밀리초), 기본값은 500ms
 * @returns 디바운싱된 값
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * 검색어 길이에 따라 적응적 지연 시간을 적용하는 디바운싱 훅
 * 1글자: 800ms, 2글자 이상: 500ms
 * @param value 디바운싱할 검색어
 * @returns 디바운싱된 검색어
 */
export const useSmartDebounce = (value: string): string => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value)

  useEffect(() => {
    // 길이별 지연시간 설정
    const delay = value.length === 1 ? 1200 : 500

    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value])

  return debouncedValue
}
