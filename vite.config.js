import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    allowedHosts: true
  },
  build: {
    manifest: true,
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000
  }
})
