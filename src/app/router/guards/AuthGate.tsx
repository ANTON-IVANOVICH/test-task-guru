import { type PropsWithChildren, useEffect } from 'react'
import { Center, Loader } from '@mantine/core'

import { useAuthStore } from '@/features/auth/model/auth-store'

const AuthGate = ({ children }: PropsWithChildren) => {
  const initialize = useAuthStore((state) => state.initialize)
  const isInitialized = useAuthStore((state) => state.isInitialized)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (!isInitialized) {
    return (
      <Center mih="100vh">
        <Loader color="blue.6" />
      </Center>
    )
  }

  return children
}

export default AuthGate
