import type { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/store/auth-store'

const GuestRoute = ({ children }: PropsWithChildren) => {
  const token = useAuthStore((state) => state.token)

  if (token) {
    return <Navigate replace to="/products" />
  }

  return children
}

export default GuestRoute
