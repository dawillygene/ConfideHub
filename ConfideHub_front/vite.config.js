import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,      // Specify port (Vite's default)
    proxy:{
      '/api': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        headers:{
          Accept: 'application/json',
          "Content-Type": 'application/json',
        }}
    }
  }
})
