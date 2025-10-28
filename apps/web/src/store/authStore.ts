import { User } from 'shared'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  loginModalOpen: boolean
  registerModalOpen: boolean

  // Actions
  login: (user: User, token: string) => void
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  openLoginModal: () => void
  closeLoginModal: () => void
  openRegisterModal: () => void
  closeRegisterModal: () => void
  switchToRegister: () => void
  switchToLogin: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      loginModalOpen: false,
      registerModalOpen: false,

      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          loginModalOpen: false,
          registerModalOpen: false,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      openLoginModal: () => {
        set({ loginModalOpen: true, registerModalOpen: false })
      },

      closeLoginModal: () => {
        set({ loginModalOpen: false })
      },

      openRegisterModal: () => {
        set({ registerModalOpen: true, loginModalOpen: false })
      },

      closeRegisterModal: () => {
        set({ registerModalOpen: false })
      },

      switchToRegister: () => {
        set({ loginModalOpen: false, registerModalOpen: true })
      },

      switchToLogin: () => {
        set({ registerModalOpen: false, loginModalOpen: true })
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
