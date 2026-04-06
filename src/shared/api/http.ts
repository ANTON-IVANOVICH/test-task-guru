const API_BASE_URL = '/api'

type ApiErrorPayload = {
  message?: string
  error?: string
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

export const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
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
