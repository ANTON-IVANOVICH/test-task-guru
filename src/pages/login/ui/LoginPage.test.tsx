import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '@/shared/api/http'
import { useAuthStore } from '@/features/auth/model/auth-store'
import LoginPage from '@/pages/login/ui/LoginPage'
import { renderWithProviders } from '@/shared/test/render-with-providers'

const loginMock = vi.hoisted(() => vi.fn())

vi.mock('@/entities/auth/api/auth-api', () => ({
  login: loginMock,
}))

describe('LoginPage', () => {
  beforeEach(() => {
    loginMock.mockReset()
    useAuthStore.setState({
      token: null,
      refreshToken: null,
      user: null,
      isInitialized: true,
      isInitializing: false,
    })
  })

  it('validates required fields', async () => {
    renderWithProviders(<LoginPage />, { route: '/login' })

    fireEvent.click(screen.getByRole('button', { name: 'Войти' }))

    expect(await screen.findByText('Введите логин')).toBeInTheDocument()
    expect(await screen.findByText('Введите пароль')).toBeInTheDocument()
  })

  it('shows Invalid credentials alert for 400 response', async () => {
    loginMock.mockRejectedValueOnce(new ApiError('Bad credentials', 400))

    renderWithProviders(<LoginPage />, { route: '/login' })

    fireEvent.change(screen.getByLabelText('Логин'), {
      target: { value: 'anton' },
    })
    fireEvent.change(screen.getByLabelText('Пароль'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        username: 'anton',
        password: '123456',
      })
    })

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
    expect(screen.getByText('Ошибка авторизации')).toBeInTheDocument()
  })
})
