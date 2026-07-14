import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['six-crabs-hang.loca.lt', 'hot-parents-love.loca.lt', 'true-peas-sleep.loca.lt', 'delightfulphhotel.loca.lt'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
