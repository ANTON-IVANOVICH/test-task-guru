import { create } from 'zustand'

import { ApiError, getCurrentUser, refreshAuthSession } from '@/lib/api'
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '@/lib/auth-session'
import type { AuthUser, StoredAuthSession } from '@/types/auth'

interface AuthState {
  token: string | null
  refreshToken: string | null
  user: AuthUser | null
  isInitialized: boolean
  isInitializing: boolean
  initialize: () => Promise<void>
  setSession: (session: StoredAuthSession, rememberSession: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  refreshToken: null,
  user: null,
  isInitialized: false,
  isInitializing: false,
  initialize: async () => {
    if (get().isInitialized || get().isInitializing) {
      return
    }

    set({ isInitializing: true })

    const loadedSession = loadStoredSession()
    if (!loadedSession) {
      set({
        token: null,
        refreshToken: null,
        user: null,
        isInitialized: true,
        isInitializing: false,
      })
      return
    }

    const { session, rememberSession } = loadedSession

    try {
      const user = await getCurrentUser(session.token)

      const validatedSession: StoredAuthSession = {
        token: session.token,
        refreshToken: session.refreshToken,
        user,
      }

      persistSession(validatedSession, rememberSession)
      set({
        token: validatedSession.token,
        refreshToken: validatedSession.refreshToken ?? null,
        user: validatedSession.user,
        isInitialized: true,
        isInitializing: false,
      })
      return
    } catch (error) {
      const isUnauthorized = error instanceof ApiError && error.status === 401
      if (!isUnauthorized) {
        clearStoredSession()
        set({
          token: null,
          refreshToken: null,
          user: null,
          isInitialized: true,
          isInitializing: false,
        })
        return
      }
    }

    try {
      const refreshedTokens = await refreshAuthSession(session.refreshToken)
      const user = await getCurrentUser(refreshedTokens.token)
      const refreshedSession: StoredAuthSession = {
        token: refreshedTokens.token,
        refreshToken: refreshedTokens.refreshToken ?? session.refreshToken,
        user,
      }

      persistSession(refreshedSession, rememberSession)
      set({
        token: refreshedSession.token,
        refreshToken: refreshedSession.refreshToken ?? null,
        user: refreshedSession.user,
        isInitialized: true,
        isInitializing: false,
      })
      return
    } catch {
      clearStoredSession()
    }

    set({
      token: null,
      refreshToken: null,
      user: null,
      isInitialized: true,
      isInitializing: false,
    })
  },
  setSession: (session, rememberSession) => {
    persistSession(session, rememberSession)

    set({
      token: session.token,
      refreshToken: session.refreshToken ?? null,
      user: session.user,
      isInitialized: true,
      isInitializing: false,
    })
  },
  logout: () => {
    clearStoredSession()

    set({
      token: null,
      refreshToken: null,
      user: null,
      isInitialized: true,
      isInitializing: false,
    })
  },
}))
