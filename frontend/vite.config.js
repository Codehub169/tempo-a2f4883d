import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure output directory is 'dist'
  },
  server: {
    port: 3000, // Standard port for React dev server
    proxy: {
      '/api': { // Proxy API requests to backend
        target: 'http://localhost:9000', // Backend server address
        changeOrigin: true,
      }
    }
  }
})