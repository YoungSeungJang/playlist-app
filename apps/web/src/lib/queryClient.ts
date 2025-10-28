import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 캐시 유지
      staleTime: 5 * 60 * 1000,
      // 30분 후 가비지 컬렉션 (v4에서는 cacheTime 사용)
      cacheTime: 30 * 60 * 1000,
      // 에러 재시도 3번
      retry: 3,
      // 백그라운드에서 자동 리페칭 (탭 포커스시)
      refetchOnWindowFocus: true,
      // 네트워크 재연결시 리페칭
      refetchOnReconnect: true,
    },
    mutations: {
      // 뮤테이션 에러 재시도 1번
      retry: 1,
    },
  },
})