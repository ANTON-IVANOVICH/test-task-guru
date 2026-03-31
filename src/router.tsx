import { Navigate, createBrowserRouter } from 'react-router-dom'

import GuestRoute from './components/GuestRoute'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'

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
