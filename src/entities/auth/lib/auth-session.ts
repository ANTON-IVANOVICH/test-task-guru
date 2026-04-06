import type { StoredAuthSession } from '@/entities/auth/model/types'

const AUTH_STORAGE_KEY = 'tg_auth_session'

export interface LoadedStoredSession {
  session: StoredAuthSession
  rememberSession: boolean
}

const isValidSession = (session: unknown): session is StoredAuthSession => {
  if (!session || typeof session !== 'object') {
    return false
  }

  const data = session as Partial<StoredAuthSession>
  return Boolean(data.token && data.user)
}

const parseStoredSession = (rawValue: string | null): StoredAuthSession | null => {
  if (!rawValue) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(rawValue)
    return isValidSession(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const loadStoredSession = (): LoadedStoredSession | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const localSession = parseStoredSession(
    window.localStorage.getItem(AUTH_STORAGE_KEY),
  )
  if (localSession) {
    return {
      session: localSession,
      rememberSession: true,
    }
  }

  const sessionSession = parseStoredSession(
    window.sessionStorage.getItem(AUTH_STORAGE_KEY),
  )
  if (sessionSession) {
    return {
      session: sessionSession,
      rememberSession: false,
    }
  }

  return null
}

export const persistSession = (
  session: StoredAuthSession,
  rememberSession: boolean,
): void => {
  if (typeof window === 'undefined') {
    return
  }

  const serialized = JSON.stringify(session)

  if (rememberSession) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, serialized)
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(AUTH_STORAGE_KEY, serialized)
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const clearStoredSession = (): void => {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
}
