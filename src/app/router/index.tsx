import { Navigate, createBrowserRouter } from 'react-router-dom'

import GuestRoute from '@/app/router/guards/GuestRoute'
import ProtectedRoute from '@/app/router/guards/ProtectedRoute'
import LoginPage from '@/pages/login/ui/LoginPage'
import ProductsPage from '@/pages/products/ui/ProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/products" />,
  },
  {
    path: '/login',
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate replace to="/products" />,
  },
])
