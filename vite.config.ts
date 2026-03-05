/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use environment variable to set base path
  // For subdirectory deployment: base: '/multi-tenancy/'
  // For domain root deployment: base: '/'
  base: process.env.VITE_BASE_PATH || '/multi-tenancy/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    exclude: ['**/node_modules/**', 'server/server.test.js', 'src/data/*.test.ts', 'src/utils/*.test.ts', 'src/tests/*.test.ts'],
  }
})
