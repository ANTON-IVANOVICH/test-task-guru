import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getRequiredUrlEnv } from './config/env'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = getRequiredUrlEnv(env, 'VITE_API_BASE_URL')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
