import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      "/api":{
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
      }
    }
  }
})