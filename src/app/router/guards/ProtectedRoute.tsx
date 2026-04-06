import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/features/auth/model/auth-store'

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  if (!token) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return children
}

export default ProtectedRoute
