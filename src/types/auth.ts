export interface AuthUser {
  id: number
  username: string
  email: string
  firstName?: string
  lastName?: string
  image?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse extends AuthUser {
  accessToken?: string
  token?: string
  refreshToken?: string
}

export interface StoredAuthSession {
  token: string
  refreshToken?: string
  user: AuthUser
}
