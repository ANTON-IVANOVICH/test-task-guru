import { RouterProvider } from 'react-router-dom'

import AuthGate from '@/app/router/guards/AuthGate'
import { router } from '@/app/router'

const App = () => (
  <AuthGate>
    <RouterProvider router={router} />
  </AuthGate>
)

export default App
