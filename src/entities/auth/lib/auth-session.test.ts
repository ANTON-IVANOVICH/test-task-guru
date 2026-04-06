import { beforeEach, describe, expect, it } from 'vitest'

import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '@/entities/auth/lib/auth-session'
import type { StoredAuthSession } from '@/entities/auth/model/types'

const AUTH_STORAGE_KEY = 'tg_auth_session'

const session: StoredAuthSession = {
  token: 'token-1',
  refreshToken: 'refresh-1',
  user: {
    id: 1,
    username: 'emilys',
    email: 'emily.johnson@x.dummyjson.com',
  },
}

describe('auth-session storage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.sessionStorage.clear()
  })

  it('persists remember=true into localStorage only', () => {
    persistSession(session, true)

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy()
    expect(window.sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('persists remember=false into sessionStorage only', () => {
    persistSession(session, false)

    expect(window.sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeTruthy()
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('loads local session with higher priority than sessionStorage', () => {
    persistSession(session, false)
    persistSession({ ...session, token: 'token-2' }, true)

    const loaded = loadStoredSession()

    expect(loaded?.rememberSession).toBe(true)
    expect(loaded?.session.token).toBe('token-2')
  })

  it('returns null for invalid json payload', () => {
    window.localStorage.setItem(AUTH_STORAGE_KEY, '{bad json}')

    expect(loadStoredSession()).toBeNull()
  })

  it('clears both storages', () => {
    persistSession(session, true)
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))

    clearStoredSession()

    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
    expect(window.sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})
