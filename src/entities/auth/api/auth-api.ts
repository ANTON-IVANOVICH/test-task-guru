import { ApiError, request } from '@/shared/api/http'
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  StoredAuthSession,
} from '@/entities/auth/model/types'

interface RefreshResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
}

const extractToken = (response: {
  accessToken?: string
  token?: string
}): string => {
  const token = response.accessToken ?? response.token
  if (!token) {
    throw new ApiError('Сервер не вернул токен авторизации', 500)
  }

  return token
}

const mapUser = (response: LoginResponse): AuthUser => ({
  id: response.id,
  username: response.username,
  email: response.email,
  firstName: response.firstName,
  lastName: response.lastName,
  image: response.image,
})

export const login = async (
  credentials: LoginCredentials,
): Promise<StoredAuthSession> => {
  const response = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 120,
    }),
  })

  return {
    token: extractToken(response),
    refreshToken: response.refreshToken,
    user: mapUser(response),
  }
}

export const getCurrentUser = async (token: string): Promise<AuthUser> =>
  request<AuthUser>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

export const refreshAuthSession = async (
  refreshToken?: string,
): Promise<Pick<StoredAuthSession, 'token' | 'refreshToken'>> => {
  const payload: { expiresInMins: number; refreshToken?: string } = {
    expiresInMins: 120,
  }

  if (refreshToken) {
    payload.refreshToken = refreshToken
  }

  const response = await request<RefreshResponse>('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return {
    token: extractToken(response),
    refreshToken: response.refreshToken,
  }
}
