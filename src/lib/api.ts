import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  StoredAuthSession,
} from '@/types/auth'
import type { Product, ProductCollectionResponse } from '@/types/product'

const API_BASE_URL = '/api'
const PRODUCTS_BATCH_LIMIT = 100

type ApiErrorPayload = {
  message?: string
  error?: string
}

interface RefreshResponse {
  accessToken?: string
  token?: string
  refreshToken?: string
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const resolveApiErrorMessage = (payload: unknown, status: number): string => {
  if (payload && typeof payload === 'object') {
    const data = payload as ApiErrorPayload
    if (typeof data.message === 'string' && data.message.length > 0) {
      return data.message
    }

    if (typeof data.error === 'string' && data.error.length > 0) {
      return data.error
    }
  }

  return `Ошибка запроса (${status})`
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers)

  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...init,
    headers,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? ((await response.json()) as unknown) : undefined

  if (!response.ok) {
    const message = resolveApiErrorMessage(payload, response.status)
    throw new ApiError(message, response.status)
  }

  return payload as T
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

const buildProductsPath = (search: string, limit: number, skip: number): string => {
  const searchValue = search.trim()
  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  if (searchValue.length > 0) {
    searchParams.set('q', searchValue)
    return `/products/search?${searchParams.toString()}`
  }

  return `/products?${searchParams.toString()}`
}

export const fetchProducts = async (search: string): Promise<Product[]> => {
  const products: Product[] = []
  let total = 1
  let skip = 0

  while (products.length < total) {
    const path = buildProductsPath(search, PRODUCTS_BATCH_LIMIT, skip)
    const response = await request<ProductCollectionResponse>(path)

    products.push(...response.products)
    total = response.total
    skip += response.limit

    if (response.limit === 0) {
      break
    }
  }

  return products
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
