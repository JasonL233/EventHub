import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const PORT = process.env.PORT || 5000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      "/api":{
        target:`http://localhost:${PORT}`,
        changeOrigin: true,
      }
    }
  }
})