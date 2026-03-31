import { RouterProvider } from 'react-router-dom'

import AuthGate from './components/AuthGate'
import { router } from './router'

const App = () => (
  <AuthGate>
    <RouterProvider router={router} />
  </AuthGate>
)

export default App
